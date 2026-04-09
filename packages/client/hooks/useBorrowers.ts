import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import type { Borrower, FilterCondition } from "shared";
import { searchBorrowers } from "../api";
import { UI } from "../labels";

export type BorrowerFetchState = {
  borrowers: Borrower[];
  /** True when a fetch is in-flight and has been pending longer than the delay threshold. */
  loading: boolean;
  error: string | null;
  retry: () => void;
};

const LOADING_DELAY_MS = 250;

/** Filters with empty values stripped, stable across renders when the data hasn't changed. */
function useActiveFilters(appliedFilters: FilterCondition[]): FilterCondition[] {
  const ref = useRef<FilterCondition[]>([]);
  return useMemo(() => {
    const active = appliedFilters.filter((f) => f.value !== "");
    const prev = ref.current;
    if (
      active.length === prev.length &&
      active.every((f, i) => f.field === prev[i].field && f.operator === prev[i].operator && f.value === prev[i].value)
    ) {
      return prev;
    }
    ref.current = active;
    return active;
  }, [appliedFilters]);
}

export function useBorrowers(appliedFilters: FilterCondition[]): BorrowerFetchState {
  const activeFilters = useActiveFilters(appliedFilters);
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let loadingTimer: ReturnType<typeof setTimeout> | undefined;

    // Delay the loading indicator so fast responses don't flash
    loadingTimer = setTimeout(() => setLoading(true), LOADING_DELAY_MS);
    setError(null);

    searchBorrowers(activeFilters, controller.signal)
      .then(setBorrowers)
      .catch((err) => {
        if (controller.signal.aborted) return;
        console.error("Failed to fetch borrowers:", err);
        setError(UI.errorMessage);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          clearTimeout(loadingTimer);
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
      clearTimeout(loadingTimer);
    };
  }, [activeFilters, retryCount]);

  const retry = useCallback(() => setRetryCount((c) => c + 1), []);

  return { borrowers, loading, error, retry };
}

import { useState, useEffect, useCallback } from "react";
import type { Borrower, FilterCondition } from "shared";
import { searchBorrowers } from "../api";
import { UI } from "../labels";

export type BorrowerFetchState = {
  borrowers: Borrower[];
  loading: boolean;
  error: string | null;
  retry: () => void;
};

export function useBorrowers(appliedFilters: FilterCondition[]): BorrowerFetchState {
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    searchBorrowers(appliedFilters, controller.signal)
      .then(setBorrowers)
      .catch((err) => {
        if (controller.signal.aborted) return;
        console.error("Failed to fetch borrowers:", err);
        setError(UI.errorMessage);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [appliedFilters, retryCount]);

  const retry = useCallback(() => setRetryCount((c) => c + 1), []);

  return { borrowers, loading, error, retry };
}

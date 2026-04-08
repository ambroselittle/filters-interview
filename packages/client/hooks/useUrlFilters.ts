import { useEffect } from "react";
import { deserializeFilters, serializeFilters } from "shared";
import { useFilterStore } from "../store/filterStore";

/**
 * Syncs filter state with the URL query string.
 * - On mount: reads ?filters= and applies any stored filters.
 * - On appliedFilters change: updates the URL so the state is shareable.
 */
export function useUrlFilters() {
  const { setAppliedFilters, appliedFilters } = useFilterStore();

  // Initialize from URL on first load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("filters");
    if (raw) {
      const filters = deserializeFilters(raw);
      if (filters.length > 0) setAppliedFilters(filters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep URL in sync whenever applied filters change
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (appliedFilters.length > 0) {
      params.set("filters", serializeFilters(appliedFilters));
    } else {
      params.delete("filters");
    }
    const search = params.toString();
    window.history.replaceState(null, "", search ? `?${search}` : window.location.pathname);
  }, [appliedFilters]);
}

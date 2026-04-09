import { useEffect } from "react";
import { serializeFilters } from "shared";
import { useFilterStore } from "../store/filterStore";

/** Keeps the URL query string in sync with applied filters (write-only).
 *  Initial URL → store hydration happens in the store initializer. */
export function useUrlFilters() {
  const appliedFilters = useFilterStore((s) => s.appliedFilters);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const activeFilters = appliedFilters.filter((f) => f.value !== "");
    if (activeFilters.length > 0) {
      params.set("filters", serializeFilters(activeFilters));
    } else {
      params.delete("filters");
    }
    const search = params.toString();
    window.history.replaceState(null, "", search ? `?${search}` : window.location.pathname);
  }, [appliedFilters]);
}

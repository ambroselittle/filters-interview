import { create } from "zustand";
import { deserializeFilters, type FilterCondition } from "shared";

function getInitialFilters(): FilterCondition[] {
  const raw = new URLSearchParams(window.location.search).get("filters");
  return raw ? deserializeFilters(raw) : [];
}

type FilterStore = {
  /** Filters that have been applied — synced with the URL and last server fetch. */
  appliedFilters: FilterCondition[];
  setAppliedFilters: (filters: FilterCondition[]) => void;
};

export const useFilterStore = create<FilterStore>((set) => ({
  appliedFilters: getInitialFilters(),
  setAppliedFilters: (filters) => set({ appliedFilters: filters }),
}));

import { create } from "zustand";
import type { FilterCondition } from "shared";

type FilterStore = {
  /** Filters that have been applied — synced with the URL and last server fetch. */
  appliedFilters: FilterCondition[];
  setAppliedFilters: (filters: FilterCondition[]) => void;
};

export const useFilterStore = create<FilterStore>((set) => ({
  appliedFilters: [],
  setAppliedFilters: (filters) => set({ appliedFilters: filters }),
}));

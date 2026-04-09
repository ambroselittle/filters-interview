import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Borrower } from "shared";
import { useFilterStore } from "../store/filterStore";
import { useBorrowers } from "../hooks/useBorrowers";

type BorrowerTableContextValue = {
  borrowers: Borrower[];
  loading: boolean;
  error: string | null;
  retry: () => void;
  expandedIds: Set<string>;
  toggleExpand: (id: string) => void;
  hasAppliedFilters: boolean;
  clearFilters: () => void;
};

const BorrowerTableContext = createContext<BorrowerTableContextValue | null>(null);

export function BorrowerTableProvider({ children }: { children: ReactNode }) {
  const { appliedFilters, setAppliedFilters } = useFilterStore();
  const { borrowers, loading, error, retry } = useBorrowers(appliedFilters);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const clearFilters = useCallback(() => setAppliedFilters([]), [setAppliedFilters]);

  return (
    <BorrowerTableContext.Provider
      value={{
        borrowers,
        loading,
        error,
        retry,
        expandedIds,
        toggleExpand,
        hasAppliedFilters: appliedFilters.length > 0,
        clearFilters,
      }}
    >
      {children}
    </BorrowerTableContext.Provider>
  );
}

export function useBorrowerTable(): BorrowerTableContextValue {
  const ctx = useContext(BorrowerTableContext);
  if (!ctx) throw new Error("useBorrowerTable must be used within BorrowerTableProvider");
  return ctx;
}

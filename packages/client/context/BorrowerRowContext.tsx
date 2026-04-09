import { createContext, useContext, type ReactNode } from "react";
import type { Borrower } from "shared";
import { useBorrowerTable } from "./BorrowerTableContext";

type BorrowerRowContextValue = {
  borrower: Borrower;
  isExpanded: boolean;
  toggle: () => void;
};

const BorrowerRowContext = createContext<BorrowerRowContextValue | null>(null);

export function BorrowerRowProvider({ borrower, children }: { borrower: Borrower; children: ReactNode }) {
  const { expandedIds, toggleExpand } = useBorrowerTable();

  return (
    <BorrowerRowContext.Provider
      value={{
        borrower,
        isExpanded: expandedIds.has(borrower.id),
        toggle: () => toggleExpand(borrower.id),
      }}
    >
      {children}
    </BorrowerRowContext.Provider>
  );
}

export function useBorrowerRow(): BorrowerRowContextValue {
  const ctx = useContext(BorrowerRowContext);
  if (!ctx) throw new Error("useBorrowerRow must be used within BorrowerRowProvider");
  return ctx;
}

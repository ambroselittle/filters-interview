import { summaryEntries } from "../borrowerGrid";
import { formatCell } from "../borrowerGrid";
import { BorrowerRowProvider, useBorrowerRow } from "../context/BorrowerRowContext";
import { BorrowerDetail } from "./BorrowerDetail";
import type { Borrower } from "shared";

function BorrowerRowInner({ striped }: { striped: boolean }) {
  const { borrower, isExpanded, toggle } = useBorrowerRow();
  const bgClass = striped ? "bg-gray-50" : "bg-white";

  return (
    <>
      <tr
        className={`${bgClass} hover:bg-blue-50 cursor-pointer transition-colors`}
        onClick={toggle}
      >
        {summaryEntries.map(([col, meta]) => (
          <td key={col} className="border border-gray-300 px-2 py-1 truncate">
            {formatCell(borrower[col], meta.type)}
          </td>
        ))}
      </tr>
      {isExpanded && <BorrowerDetail />}
    </>
  );
}

export function BorrowerRow({ borrower, striped }: { borrower: Borrower; striped: boolean }) {
  return (
    <BorrowerRowProvider borrower={borrower}>
      <BorrowerRowInner striped={striped} />
    </BorrowerRowProvider>
  );
}

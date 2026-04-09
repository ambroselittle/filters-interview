import { BorrowerFields, type FilterableField } from "shared";
import { formatCell, SummaryFields, summaryEntries } from "../borrowerGrid";
import { useBorrowerRow } from "../context/BorrowerRowContext";

const detailFields = (Object.keys(BorrowerFields) as FilterableField[]).filter(
  (f) => !SummaryFields.includes(f),
);

export function BorrowerDetail() {
  const { borrower } = useBorrowerRow();

  return (
    <tr>
      <td colSpan={summaryEntries.length} className="border border-gray-300 bg-gray-50 px-4 py-3">
        <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm md:grid-cols-3">
          {detailFields.map((field) => {
            const meta = BorrowerFields[field];
            return (
              <div key={field} className="flex gap-2">
                <span className="text-gray-500 shrink-0">{meta.label}:</span>
                <span className="truncate">{formatCell(borrower[field], meta.type)}</span>
              </div>
            );
          })}
        </div>
      </td>
    </tr>
  );
}

import { summaryEntries } from "../borrowerGrid";
import { useBorrowerTable } from "../context/BorrowerTableContext";
import { BorrowerRow } from "./BorrowerRow";
import { UI } from "../labels";

export function BorrowerTable() {
  const { borrowers, loading, error, retry, hasAppliedFilters, clearFilters } = useBorrowerTable();

  if (error) {
    return (
      <div className="py-16 text-center text-red-600">
        <p className="mb-2">{error}</p>
        <button type="button" onClick={retry} className="text-blue-600 hover:underline text-sm">
          {UI.retry}
        </button>
      </div>
    );
  }

  if (!loading && hasAppliedFilters && borrowers.length === 0) {
    return (
      <div className="py-16 text-center text-gray-500">
        <p className="mb-1">{UI.noResults}</p>
        <button
          type="button"
          onClick={clearFilters}
          className="text-blue-600 hover:underline text-sm"
        >
          {UI.noResultsCta}
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center
                        bg-white/60 border border-gray-200 rounded">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
        </div>
      )}
      <table className="w-full text-sm border-collapse table-fixed">
        <thead>
          <tr>
            {summaryEntries.map(([col, meta]) => (
              <th
                key={col}
                className="border border-gray-300 px-2 py-1 text-left bg-gray-50 font-medium truncate"
              >
                {meta.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {borrowers.map((borrower, i) => (
            <BorrowerRow key={borrower.id} borrower={borrower} striped={i % 2 !== 0} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

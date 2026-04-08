import { useState, useEffect } from "react";
import { BorrowerFields, parseStoredDate, type Borrower, type FieldMeta, type FilterableField, type FieldType } from "shared";
import { useFilterStore } from "./store/filterStore";
import { useUrlFilters } from "./hooks/useUrlFilters";
import { searchBorrowers } from "./api";
import { FilterBar } from "./components/FilterBar";
import { UI } from "./labels";

import "./style.css";

const numberFmt = new Intl.NumberFormat("en-US");
const dateFmt = new Intl.DateTimeFormat("en-US", { dateStyle: "short" });

function formatCell(value: string | number, type: FieldType): string {
  if (type === "number" && typeof value === "number") return numberFmt.format(value);
  if (type === "date" && typeof value === "string") {
    const date = parseStoredDate(value);
    return isNaN(date.getTime()) ? value : dateFmt.format(date);
  }
  return String(value);
}

const fieldEntries = Object.entries(BorrowerFields) as Array<[FilterableField, FieldMeta]>;

function App() {
  const { appliedFilters, setAppliedFilters } = useFilterStore();
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);

  useUrlFilters();

  useEffect(() => {
    searchBorrowers(appliedFilters).then(setBorrowers).catch(console.error);
  }, [appliedFilters]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Borrowers</h1>
      <FilterBar />
      {appliedFilters.length > 0 && borrowers.length === 0 ? (
        <div className="py-16 text-center text-gray-500">
          <p className="mb-1">{UI.noResults}</p>
          <button
            type="button"
            onClick={() => setAppliedFilters([])}
            className="text-blue-600 hover:underline text-sm"
          >
            {UI.noResultsCta}
          </button>
        </div>
      ) : (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              {fieldEntries.map(([col, meta]) => (
                <th
                  key={col}
                  className="border border-gray-300 px-2 py-1 text-left bg-gray-50 font-medium whitespace-nowrap"
                >
                  {meta.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {borrowers.map((borrower, i) => (
              <tr key={borrower.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                {fieldEntries.map(([col, meta]) => (
                  <td key={col} className="border border-gray-300 px-2 py-1 whitespace-nowrap">
                    {formatCell(borrower[col], meta.type)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;

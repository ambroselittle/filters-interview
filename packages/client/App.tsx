import { useState, useEffect } from "react";
import { BORROWER_FIELD_NAMES, BorrowerFilterFields, type Borrower, type FilterableField, type FieldType } from "shared";

const numberFmt = new Intl.NumberFormat("en-US");
const dateFmt = new Intl.DateTimeFormat("en-US", { dateStyle: "short" });

function formatCell(value: string | number, type: FieldType): string {
  if (type === "number" && typeof value === "number") return numberFmt.format(value);
  if (type === "date" && typeof value === "string") {
    // stored as M/D/YYYY — parse without timezone shift
    const [m, d, y] = value.split("/").map(Number);
    const date = new Date(y, m - 1, d);
    return isNaN(date.getTime()) ? value : dateFmt.format(date);
  }
  return String(value);
}
import { useFilterStore } from "./store/filterStore";
import { useUrlFilters } from "./hooks/useUrlFilters";
import { searchBorrowers } from "./api";
import { FilterBar } from "./components/FilterBar";

import "./style.css";

function App() {
  const { appliedFilters } = useFilterStore();
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);

  useUrlFilters();

  useEffect(() => {
    searchBorrowers(appliedFilters).then(setBorrowers).catch(console.error);
  }, [appliedFilters]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Borrowers</h1>
      <FilterBar />
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            {BORROWER_FIELD_NAMES.map((col) => (
              <th
                key={col}
                className="border border-gray-300 px-2 py-1 text-left bg-gray-50 font-medium whitespace-nowrap"
              >
                {BorrowerFilterFields[col as FilterableField]?.label ?? col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {borrowers.map((borrower, i) => (
            <tr key={borrower.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              {BORROWER_FIELD_NAMES.map((col) => {
                const meta = BorrowerFilterFields[col as FilterableField];
                return (
                  <td key={col} className="border border-gray-300 px-2 py-1 whitespace-nowrap">
                    {meta ? formatCell(borrower[col], meta.type) : borrower[col]}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

import { useUrlFilters } from "./hooks/useUrlFilters";
import { BorrowerTableProvider } from "./context/BorrowerTableContext";
import { FilterBar } from "./components/FilterBar";
import { BorrowerTable } from "./components/BorrowerTable";

import "./style.css";

function App() {
  useUrlFilters();

  return (
    <BorrowerTableProvider>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Borrowers</h1>
        <FilterBar />
        <BorrowerTable />
      </div>
    </BorrowerTableProvider>
  );
}

export default App;

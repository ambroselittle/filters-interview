import { useState, useEffect } from "react";
import axios from "axios";
import { Borrower, BORROWER_FIELD_NAMES } from "shared";

import "./style.css";

async function getBorrowers(): Promise<Borrower[]> {
  const response = await axios.get<Borrower[]>(
    "http://localhost:1337/borrowers",
  );
  return response.data;
}

function App() {
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);

  useEffect(() => {
    async function fetchBorrowers() {
      const newBorrowers = await getBorrowers();
      setBorrowers(newBorrowers);
    }
    fetchBorrowers();
  }, []);

  // TODO: Implement support for filters.

  return (
    <div>
      <h3>Borrowers</h3>

      <table>
        <thead>
          <tr>
            {BORROWER_FIELD_NAMES.map((columnKey) => (
              <th key={columnKey}>{columnKey}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {borrowers.map((borrower) => {
            return (
              <tr key={borrower.id}>
                {BORROWER_FIELD_NAMES.map((columnKey) => (
                  <td key={columnKey}>{borrower[columnKey]}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;

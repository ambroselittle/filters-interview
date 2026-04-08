import { BorrowerFilterFields, parseStoredDate, type Borrower, type FilterCondition, type FilterOperator } from "shared";

// ---------------------------------------------------------------------------
// Type-specific comparison handlers
// ---------------------------------------------------------------------------

function matchesStringCondition(fieldValue: string, operator: FilterOperator, filterValue: string): boolean {
  const a = fieldValue.toLowerCase();
  const b = filterValue.toLowerCase();
  switch (operator) {
    case "is":
      return a === b;
    case "includes":
      return a.includes(b);
    default:
      return true;
  }
}

function matchesNumberCondition(fieldValue: number, operator: FilterOperator, filterValue: string): boolean {
  const n = Number(filterValue);
  if (isNaN(n)) return true;
  switch (operator) {
    case "is":
      return fieldValue === n;
    case "lt":
      return fieldValue < n;
    case "gt":
      return fieldValue > n;
    default:
      return true;
  }
}

function matchesDateCondition(fieldValue: string, operator: FilterOperator, filterValue: string): boolean {
  const storedDate = parseStoredDate(fieldValue);
  // filterValue arrives as YYYY-MM-DD from <input type="date">
  const filterDate = new Date(filterValue + "T00:00:00");
  if (isNaN(storedDate.getTime()) || isNaN(filterDate.getTime())) return true;
  switch (operator) {
    case "is":
      return storedDate.getTime() === filterDate.getTime();
    case "lt":
      return storedDate < filterDate;
    case "gt":
      return storedDate > filterDate;
    default:
      return true;
  }
}

// ---------------------------------------------------------------------------
// Core filter logic
// ---------------------------------------------------------------------------

function matchesCondition(borrower: Borrower, { field, operator, value }: FilterCondition): boolean {
  const meta = BorrowerFilterFields[field];
  if (!meta) return true;

  const rawValue = borrower[field as keyof Borrower];

  switch (meta.type) {
    case "string":
      return matchesStringCondition(String(rawValue), operator, value);
    case "number":
      return matchesNumberCondition(Number(rawValue), operator, value);
    case "date":
      return matchesDateCondition(String(rawValue), operator, value);
  }
}

export function applyFilters(borrowers: Borrower[], conditions: FilterCondition[]): Borrower[] {
  if (conditions.length === 0) return borrowers;
  return borrowers.filter((b) => conditions.every((c) => matchesCondition(b, c)));
}

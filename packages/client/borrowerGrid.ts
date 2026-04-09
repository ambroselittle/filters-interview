import { BorrowerFields, parseStoredDate, type FieldMeta, type FilterableField, type FieldType } from "shared";

const numberFmt = new Intl.NumberFormat("en-US");
const dateFmt = new Intl.DateTimeFormat("en-US", { dateStyle: "short" });

export function formatCell(value: string | number, type: FieldType): string {
  if (type === "number" && typeof value === "number") return numberFmt.format(value);
  if (type === "date" && typeof value === "string") {
    const date = parseStoredDate(value);
    return isNaN(date.getTime()) ? value : dateFmt.format(date);
  }
  return String(value);
}

/** Fields shown in the summary grid — loan-relevant at a glance. */
export const SummaryFields: FilterableField[] = [
  "firstName",
  "lastName",
  "dateOfBirth",
  "creditScore",
  "maritalStatus",
  "w2Income",
  "employer",
  "startDate",
  "subjectPropertyAddress",
];

export const summaryEntries = SummaryFields.map(
  (f) => [f, BorrowerFields[f]] as [FilterableField, FieldMeta],
);

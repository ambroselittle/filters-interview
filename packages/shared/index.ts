import { z } from "zod";

// ---------------------------------------------------------------------------
// Existing borrower model
// ---------------------------------------------------------------------------

export const MARITAL_STATUSES = ["married", "separated", "unmarried"] as const;

export interface Borrower {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  creditScore: number;
  maritalStatus: string;
  w2Income: number;
  emailAddress: string;
  homePhone: string;
  cellPhone: string;
  currentAddress: string;
  employer: string;
  title: string;
  startDate: string;
  subjectPropertyAddress: string;
}

export const BORROWER_FIELD_NAMES = [
  "firstName",
  "lastName",
  "dateOfBirth",
  "creditScore",
  "maritalStatus",
  "w2Income",
  "emailAddress",
  "homePhone",
  "cellPhone",
  "currentAddress",
  "employer",
  "title",
  "startDate",
  "subjectPropertyAddress",
] as const;

// ---------------------------------------------------------------------------
// Filter types
// ---------------------------------------------------------------------------

export type FieldType = "string" | "number" | "date";

/** Operators available per field type:
 *  string → "is" | "includes"
 *  number → "is" | "lt" | "gt"
 *  date   → "is" | "lt" | "gt"
 */
export const FilterOperator = z.enum(["is", "includes", "lt", "gt"]);
export type FilterOperator = z.infer<typeof FilterOperator>;

export const FilterableField = z.enum([
  "firstName",
  "lastName",
  "dateOfBirth",
  "creditScore",
  "maritalStatus",
  "w2Income",
  "emailAddress",
  "homePhone",
  "cellPhone",
  "currentAddress",
  "employer",
  "title",
  "startDate",
  "subjectPropertyAddress",
]);
export type FilterableField = z.infer<typeof FilterableField>;

export const FilterConditionSchema = z.object({
  field: FilterableField,
  operator: FilterOperator,
  value: z.string(),
});
export type FilterCondition = z.infer<typeof FilterConditionSchema>;

export const SearchRequestSchema = z.object({
  filters: z.array(FilterConditionSchema),
});
export type SearchRequest = z.infer<typeof SearchRequestSchema>;

// ---------------------------------------------------------------------------
// Field metadata — drives the filter UI (labels, types, valid operators)
// ---------------------------------------------------------------------------

export type FieldMeta = {
  label: string;
  type: FieldType;
};

export const BorrowerFilterFields: Record<FilterableField, FieldMeta> = {
  firstName: { label: "First Name", type: "string" },
  lastName: { label: "Last Name", type: "string" },
  dateOfBirth: { label: "Date of Birth", type: "date" },
  creditScore: { label: "Credit Score", type: "number" },
  maritalStatus: { label: "Marital Status", type: "string" },
  w2Income: { label: "W2 Income", type: "number" },
  emailAddress: { label: "Email Address", type: "string" },
  homePhone: { label: "Home Phone", type: "string" },
  cellPhone: { label: "Cell Phone", type: "string" },
  currentAddress: { label: "Current Address", type: "string" },
  employer: { label: "Employer", type: "string" },
  title: { label: "Title", type: "string" },
  startDate: { label: "Start Date", type: "date" },
  subjectPropertyAddress: { label: "Subject Property Address", type: "string" },
};

// ---------------------------------------------------------------------------
// URL serialization utilities
// ---------------------------------------------------------------------------

/** Serialize filters to a plain JSON string for use as a URL query parameter value.
 *  URLSearchParams handles percent-encoding automatically — do not pre-encode here. */
export function serializeFilters(filters: FilterCondition[]): string {
  return JSON.stringify(filters);
}

/** Deserialize filters from a URL query parameter value.
 *  URLSearchParams.get() returns already-decoded strings — parse JSON directly. */
export function deserializeFilters(raw: string): FilterCondition[] {
  try {
    const parsed = JSON.parse(raw);
    const result = z.array(FilterConditionSchema).safeParse(parsed);
    return result.success ? result.data : [];
  } catch {
    return [];
  }
}

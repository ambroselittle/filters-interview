import type { FieldType, FilterOperator } from "shared";

/** Human-readable labels for each filter operator. */
export const OperatorLabels: Record<FilterOperator, string> = {
  is: "Is",
  includes: "Includes",
  lt: "Is less than",
  gt: "Is greater than",
};

/** Valid operators per field type — drives the operator dropdown options. */
export const OperatorsByType: Record<FieldType, FilterOperator[]> = {
  string: ["is", "includes"],
  number: ["is", "lt", "gt"],
  date: ["is", "lt", "gt"],
};

/** All static UI display strings — single place to swap for localization. */
export const UI = {
  filtersHeading: "Filters",
  addFilter: "Add Filter",
  applyFilters: "Apply Filters",
  emptyState: "Add a filter to narrow your results",
  whereLabel: "Where",
  andLabel: "AND",
  removeFilterLabel: "Remove filter",
} as const;

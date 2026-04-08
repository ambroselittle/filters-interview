import type { FilterOperator } from "shared";

/** Human-readable labels for each filter operator. */
export const OperatorLabels: Record<FilterOperator, string> = {
  is: "Is",
  includes: "Includes",
  lt: "Is less than",
  gt: "Is greater than",
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
  clearAll: "Clear All",
} as const;

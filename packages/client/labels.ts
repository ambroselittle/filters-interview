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
  noResults: "No applicants match your filters.",
  noResultsCta: "Clear filters and try again",
  loading: "Loading borrowers\u2026",
  errorMessage: "Something went wrong loading borrowers. Please try again.",
  retry: "Retry",
} as const;

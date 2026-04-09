import { describe, it, expect } from "vitest";
import { serializeFilters, deserializeFilters, validateFilterValues, type FilterCondition } from "./index.js";

const sampleFilters: FilterCondition[] = [
  { field: "firstName", operator: "is", value: "Matt" },
  { field: "creditScore", operator: "gt", value: "700" },
];

describe("serializeFilters / deserializeFilters", () => {
  it("round-trips a list of filters", () => {
    const serialized = serializeFilters(sampleFilters);
    const result = deserializeFilters(serialized);
    expect(result).toEqual(sampleFilters);
  });

  it("returns an empty array for an empty filter list", () => {
    expect(deserializeFilters(serializeFilters([]))).toEqual([]);
  });

  it("returns an empty array for malformed JSON", () => {
    expect(deserializeFilters("not-valid-json")).toEqual([]);
  });

  it("returns an empty array when the payload fails Zod validation", () => {
    const invalid = JSON.stringify([{ field: "unknown", operator: "is", value: "x" }]);
    expect(deserializeFilters(invalid)).toEqual([]);
  });

  it("returns an empty array for an empty string", () => {
    expect(deserializeFilters("")).toEqual([]);
  });

  it("preserves all filter operators", () => {
    const allOps: FilterCondition[] = [
      { field: "firstName", operator: "is", value: "a" },
      { field: "firstName", operator: "includes", value: "b" },
      { field: "creditScore", operator: "lt", value: "500" },
      { field: "creditScore", operator: "gt", value: "800" },
    ];
    expect(deserializeFilters(serializeFilters(allOps))).toEqual(allOps);
  });
});

describe("validateFilterValues", () => {
  it("returns no errors for valid filters", () => {
    const filters: FilterCondition[] = [
      { field: "firstName", operator: "is", value: "Matt" },
      { field: "creditScore", operator: "gt", value: "700" },
      { field: "dateOfBirth", operator: "is", value: "1980-10-26" },
    ];
    expect(validateFilterValues(filters)).toEqual([]);
  });

  it("rejects non-numeric value for a number field", () => {
    const errors = validateFilterValues([
      { field: "creditScore", operator: "gt", value: "ASDF" },
    ]);
    expect(errors).toHaveLength(1);
    expect(errors[0].field).toBe("creditScore");
  });

  it("rejects empty value for a number field", () => {
    const errors = validateFilterValues([
      { field: "w2Income", operator: "is", value: "" },
    ]);
    expect(errors).toHaveLength(1);
    expect(errors[0].field).toBe("w2Income");
  });

  it("rejects invalid date value for a date field", () => {
    const errors = validateFilterValues([
      { field: "dateOfBirth", operator: "gt", value: "not-a-date" },
    ]);
    expect(errors).toHaveLength(1);
    expect(errors[0].field).toBe("dateOfBirth");
  });

  it("rejects invalid allowedValues for constrained fields", () => {
    const errors = validateFilterValues([
      { field: "maritalStatus", operator: "is", value: "bogus" },
    ]);
    expect(errors).toHaveLength(1);
    expect(errors[0].field).toBe("maritalStatus");
    expect(errors[0].message).toContain("Allowed:");
  });

  it("allows valid allowedValues", () => {
    const errors = validateFilterValues([
      { field: "maritalStatus", operator: "is", value: "married" },
    ]);
    expect(errors).toEqual([]);
  });

  it("skips allowedValues check for includes operator", () => {
    const errors = validateFilterValues([
      { field: "maritalStatus", operator: "includes", value: "mar" },
    ]);
    expect(errors).toEqual([]);
  });

  it("collects multiple errors", () => {
    const errors = validateFilterValues([
      { field: "creditScore", operator: "gt", value: "abc" },
      { field: "dateOfBirth", operator: "is", value: "xyz" },
    ]);
    expect(errors).toHaveLength(2);
  });
});

import { describe, it, expect } from "vitest";
import { serializeFilters, deserializeFilters, type FilterCondition } from "./index.js";

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
    const invalid = encodeURIComponent(JSON.stringify([{ field: "unknown", operator: "is", value: "x" }]));
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

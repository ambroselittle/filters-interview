import { describe, it, expect } from "vitest";
import { applyFilters } from "./filters.js";
import type { Borrower } from "shared";

const borrowers: Borrower[] = [
  {
    id: "1",
    firstName: "Matt",
    lastName: "Spencer",
    dateOfBirth: "10/26/1980",
    creditScore: 721,
    maritalStatus: "married",
    w2Income: 61968,
    emailAddress: "Matt.Spencer@gmail.com",
    homePhone: "353-901-1738",
    cellPhone: "323.685.2462",
    currentAddress: "969 Schultz Valley",
    employer: "Gleason - Schmidt",
    title: "District Branding Coordinator",
    startDate: "4/8/2018",
    subjectPropertyAddress: "938 Jules Gateway",
  },
  {
    id: "2",
    firstName: "Matt",
    lastName: "Toy",
    dateOfBirth: "5/7/2001",
    creditScore: 567,
    maritalStatus: "unmarried",
    w2Income: 110228,
    emailAddress: "Matt_Toy90@yahoo.com",
    homePhone: "443.453.2832",
    cellPhone: "544-234-1031",
    currentAddress: "957 West Plaza",
    employer: "Emard Group",
    title: "Forward Program Supervisor",
    startDate: "6/1/2017",
    subjectPropertyAddress: "18246 Kerluke Terrace",
  },
  {
    id: "3",
    firstName: "Keanu",
    lastName: "Grant",
    dateOfBirth: "11/27/1960",
    creditScore: 657,
    maritalStatus: "separated",
    w2Income: 118632,
    emailAddress: "Keanu_Grant@yahoo.com",
    homePhone: "1-846-897-9685",
    cellPhone: "781.536.9402",
    currentAddress: "003 Keeling Field",
    employer: "Lesch Group",
    title: "Chief Data Officer",
    startDate: "6/24/2015",
    subjectPropertyAddress: "600 Pedro Pines",
  },
];

describe("applyFilters — no conditions", () => {
  it("returns all borrowers when no filters are provided", () => {
    expect(applyFilters(borrowers, [])).toHaveLength(3);
  });
});

describe("applyFilters — string: is", () => {
  it("matches exact value case-insensitively", () => {
    const result = applyFilters(borrowers, [{ field: "firstName", operator: "is", value: "matt" }]);
    expect(result).toHaveLength(2);
    expect(result.map((b) => b.id)).toEqual(["1", "2"]);
  });

  it("is case-insensitive for the stored value too", () => {
    const result = applyFilters(borrowers, [{ field: "firstName", operator: "is", value: "MATT" }]);
    expect(result).toHaveLength(2);
  });

  it("returns no results when value does not match", () => {
    const result = applyFilters(borrowers, [{ field: "firstName", operator: "is", value: "Nobody" }]);
    expect(result).toHaveLength(0);
  });

  it("does not match partial values", () => {
    const result = applyFilters(borrowers, [{ field: "firstName", operator: "is", value: "Ma" }]);
    expect(result).toHaveLength(0);
  });
});

describe("applyFilters — string: includes", () => {
  it("matches borrowers whose field contains the substring", () => {
    const result = applyFilters(borrowers, [{ field: "employer", operator: "includes", value: "group" }]);
    expect(result).toHaveLength(2);
    expect(result.map((b) => b.id)).toEqual(["2", "3"]);
  });

  it("is case-insensitive for includes", () => {
    const result = applyFilters(borrowers, [{ field: "employer", operator: "includes", value: "GROUP" }]);
    expect(result).toHaveLength(2);
  });

  it("returns no results when substring is not found", () => {
    const result = applyFilters(borrowers, [{ field: "employer", operator: "includes", value: "xyz" }]);
    expect(result).toHaveLength(0);
  });
});

describe("applyFilters — number: is / lt / gt", () => {
  it("is: matches exact numeric value", () => {
    const result = applyFilters(borrowers, [{ field: "creditScore", operator: "is", value: "657" }]);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("3");
  });

  it("lt: matches borrowers with field value less than the filter", () => {
    const result = applyFilters(borrowers, [{ field: "creditScore", operator: "lt", value: "600" }]);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("2"); // 567
  });

  it("gt: matches borrowers with field value greater than the filter", () => {
    const result = applyFilters(borrowers, [{ field: "creditScore", operator: "gt", value: "700" }]);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1"); // 721
  });

  it("returns all borrowers when boundary value matches none", () => {
    const result = applyFilters(borrowers, [{ field: "creditScore", operator: "gt", value: "900" }]);
    expect(result).toHaveLength(0);
  });

  it("ignores the condition when filter value is not a number", () => {
    const result = applyFilters(borrowers, [{ field: "creditScore", operator: "gt", value: "abc" }]);
    expect(result).toHaveLength(3);
  });

  it("works on w2Income field", () => {
    const result = applyFilters(borrowers, [{ field: "w2Income", operator: "gt", value: "100000" }]);
    expect(result).toHaveLength(2); // 110228, 118632
    expect(result.map((b) => b.id)).toEqual(["2", "3"]);
  });
});

describe("applyFilters — date: is / lt / gt", () => {
  // filterValue is YYYY-MM-DD (from <input type="date">)
  // stored dates are M/D/YYYY or MM/DD/YYYY

  it("is: matches exact date", () => {
    const result = applyFilters(borrowers, [{ field: "dateOfBirth", operator: "is", value: "1980-10-26" }]);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
  });

  it("lt: matches borrowers born before the filter date", () => {
    const result = applyFilters(borrowers, [{ field: "dateOfBirth", operator: "lt", value: "1970-01-01" }]);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("3"); // born 1960
  });

  it("gt: matches borrowers born after the filter date", () => {
    const result = applyFilters(borrowers, [{ field: "dateOfBirth", operator: "gt", value: "1970-01-01" }]);
    expect(result).toHaveLength(2); // 1980, 2001
    expect(result.map((b) => b.id)).toEqual(["1", "2"]);
  });

  it("works on startDate field", () => {
    const result = applyFilters(borrowers, [{ field: "startDate", operator: "gt", value: "2017-01-01" }]);
    expect(result).toHaveLength(2); // 4/8/2018 and 6/1/2017
    expect(result.map((b) => b.id)).toEqual(["1", "2"]);
  });

  it("ignores the condition when filter value is not a valid date", () => {
    const result = applyFilters(borrowers, [{ field: "dateOfBirth", operator: "gt", value: "not-a-date" }]);
    expect(result).toHaveLength(3);
  });
});

describe("applyFilters — multiple conditions (AND)", () => {
  it("ANDs all conditions together", () => {
    const result = applyFilters(borrowers, [
      { field: "firstName", operator: "is", value: "Matt" },
      { field: "lastName", operator: "is", value: "Toy" },
    ]);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("2");
  });

  it("returns empty when conditions are contradictory", () => {
    const result = applyFilters(borrowers, [
      { field: "firstName", operator: "is", value: "Matt" },
      { field: "firstName", operator: "is", value: "Keanu" },
    ]);
    expect(result).toHaveLength(0);
  });
});

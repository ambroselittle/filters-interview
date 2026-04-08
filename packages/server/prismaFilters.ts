import { Prisma } from "@prisma/client";
import { BorrowerFilterFields, type FilterCondition } from "shared";

export function buildPrismaWhere(filters: FilterCondition[]): Prisma.BorrowerWhereInput {
  if (filters.length === 0) return {};
  const conditions: Prisma.BorrowerWhereInput[] = filters.map(({ field, operator, value }) => {
    const meta = BorrowerFilterFields[field];
    if (!meta) return {};
    if (meta.type === "string") {
      if (operator === "is") return { [field]: { equals: value, mode: "insensitive" } };
      if (operator === "includes") return { [field]: { contains: value, mode: "insensitive" } };
    }
    if (meta.type === "number") {
      const n = Number(value);
      if (isNaN(n)) return {};
      if (operator === "is") return { [field]: { equals: n } };
      if (operator === "lt") return { [field]: { lt: n } };
      if (operator === "gt") return { [field]: { gt: n } };
    }
    if (meta.type === "date") {
      const d = new Date(value + "T00:00:00.000Z");
      if (isNaN(d.getTime())) return {};
      if (operator === "is") {
        const next = new Date(d);
        next.setUTCDate(next.getUTCDate() + 1);
        return { [field]: { gte: d, lt: next } };
      }
      if (operator === "lt") return { [field]: { lt: d } };
      if (operator === "gt") return { [field]: { gt: d } };
    }
    return {};
  });
  return { AND: conditions };
}

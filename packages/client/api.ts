import axios from "axios";
import type { Borrower, FilterCondition } from "shared";

export async function searchBorrowers(
  filters: FilterCondition[],
  signal?: AbortSignal,
): Promise<Borrower[]> {
  const { data } = await axios.post<Borrower[]>("/borrowers/search", { filters }, { signal });
  return data;
}

import axios from "axios";
import type { Borrower, FilterCondition } from "shared";

export async function searchBorrowers(filters: FilterCondition[]): Promise<Borrower[]> {
  const { data } = await axios.post<Borrower[]>("/borrowers/search", { filters });
  return data;
}

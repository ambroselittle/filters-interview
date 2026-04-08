// Code to be shared between the client and server can be added here :)

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

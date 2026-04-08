import { PrismaClient } from "@prisma/client";
import BORROWERS from "../borrowers.json" assert { type: "json" };

const prisma = new PrismaClient();

function parseDate(dateStr: string): Date {
  const parts = dateStr.split("/");
  const month = Number(parts[0]);
  const day = Number(parts[1]);
  const year = Number(parts[2]);
  return new Date(Date.UTC(year, month - 1, day));
}

async function main() {
  console.log(`Seeding ${BORROWERS.length} borrowers...`);

  for (const borrower of BORROWERS) {
    await prisma.borrower.upsert({
      where: { id: borrower.id },
      update: {
        firstName: borrower.firstName,
        lastName: borrower.lastName,
        dateOfBirth: parseDate(borrower.dateOfBirth),
        creditScore: borrower.creditScore,
        maritalStatus: borrower.maritalStatus,
        w2Income: borrower.w2Income,
        emailAddress: borrower.emailAddress,
        homePhone: borrower.homePhone,
        cellPhone: borrower.cellPhone,
        currentAddress: borrower.currentAddress,
        employer: borrower.employer,
        title: borrower.title,
        startDate: parseDate(borrower.startDate),
        subjectPropertyAddress: borrower.subjectPropertyAddress,
      },
      create: {
        id: borrower.id,
        firstName: borrower.firstName,
        lastName: borrower.lastName,
        dateOfBirth: parseDate(borrower.dateOfBirth),
        creditScore: borrower.creditScore,
        maritalStatus: borrower.maritalStatus,
        w2Income: borrower.w2Income,
        emailAddress: borrower.emailAddress,
        homePhone: borrower.homePhone,
        cellPhone: borrower.cellPhone,
        currentAddress: borrower.currentAddress,
        employer: borrower.employer,
        title: borrower.title,
        startDate: parseDate(borrower.startDate),
        subjectPropertyAddress: borrower.subjectPropertyAddress,
      },
    });
  }

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

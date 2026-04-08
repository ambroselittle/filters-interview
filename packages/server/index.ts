import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { SearchRequestSchema } from "shared";
import { PrismaClient } from "@prisma/client";
import { buildPrismaWhere } from "./prismaFilters.js";

const PORT = 1337;

const prisma = new PrismaClient();

const app = express();

// Allow cross-origin requests.
app.use(cors());

// Parse POST request body JSON.
app.use(bodyParser.json());

app.get("/borrowers", async (_req: Request, res: Response) => {
  const borrowers = await prisma.borrower.findMany();
  res.json(
    borrowers.map((b) => ({
      ...b,
      dateOfBirth: b.dateOfBirth.toISOString().split("T")[0],
      startDate: b.startDate.toISOString().split("T")[0],
    }))
  );
});

app.post("/borrowers/search", async (req: Request, res: Response) => {
  const parsed = SearchRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid filter request", details: parsed.error.flatten() });
    return;
  }
  const borrowers = await prisma.borrower.findMany({
    where: buildPrismaWhere(parsed.data.filters),
  });
  res.json(
    borrowers.map((b) => ({
      ...b,
      dateOfBirth: b.dateOfBirth.toISOString().split("T")[0],
      startDate: b.startDate.toISOString().split("T")[0],
    }))
  );
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});

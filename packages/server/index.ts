import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Borrower, BorrowerFields, SearchRequestSchema } from "shared";
import { applyFilters } from "./filters.js";

import BORROWERS from "./borrowers.json" with { type: "json" };

const PORT = 1337;

const app = express();

// Allow cross-origin requests.
app.use(cors());

// Parse POST request body JSON.
app.use(bodyParser.json());

app.get("/borrowers", (_req: Request, res: Response<Borrower[]>) => {
  res.send(BORROWERS);
});

app.post("/borrowers/search", (req: Request, res: Response) => {
  const parsed = SearchRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid filter request", details: parsed.error.flatten() });
    return;
  }
  res.json(applyFilters(BORROWERS, parsed.data.filters));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);

  // Log the field names to ensure shared package is working.
  console.log(`Field names: ${Object.keys(BorrowerFields).join(", ")}`);
});

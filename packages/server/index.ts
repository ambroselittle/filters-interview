import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Borrower, BORROWER_FIELD_NAMES } from "shared";

import BORROWERS from "./borrowers.json" with { type: "json" };

const PORT = 1337;

const app = express();

// Allow cross-origin requests.
app.use(cors());

// Parse POST request body JSON.
app.use(bodyParser.json());

app.get("/borrowers", (_req: Request, res: Response<Borrower[]>) => {
  // TODO: Implement support for filtering.

  res.send(BORROWERS);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);

  // Log the field names to ensure shared package is working.
  console.log(`Field names: ${BORROWER_FIELD_NAMES.join(", ")}`);
});

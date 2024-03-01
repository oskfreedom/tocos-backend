import express from "express";

import { middlwareAddTransaction } from "../validations";
import { getTransaction, addTransaction } from "../controllers";

export const TransactionRouter = express.Router();

TransactionRouter.get("/:id", getTransaction);
TransactionRouter.post("/", middlwareAddTransaction, addTransaction);

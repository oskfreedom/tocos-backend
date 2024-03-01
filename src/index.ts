import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./db";
import { UserRouter, TransactionRouter } from "./routers";
import * as middleware from "./utils/middleware";
import { info } from "./utils/logger";

dotenv.config();

const app = express();

connectDB(app);

if (process.env.NODE_ENV !== "test") {
  app.use(middleware.requestLogger);
}

app.use(cors());
app.use(express.json());

app.use("/health", (_req, res) => res.status(200).send("Tocos Trading Platform."));
app.use("/users", UserRouter);
app.use("/transaction", TransactionRouter);

const PORT = process.env.PORT || 8000;

export const server = app.listen(PORT, () =>
  info(`Server started on port ${PORT}`)
);

export default app;

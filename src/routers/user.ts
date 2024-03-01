import express from "express";

import { middlewareAddUser } from "../validations";
import { addUser, getUsers, getOneUser } from "../controllers";

export const UserRouter = express.Router();

UserRouter.get("/", getUsers);
UserRouter.get("/:id", getOneUser);
UserRouter.post("/", middlewareAddUser, addUser);
import { Request, Response } from "express";
import { validationResult } from "express-validator";

import { User } from "../models";

export const addUser = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
      .formatWith(({ msg }) => ({ msg }))
      .array();
    if (errors.length > 0) {
      return res.status(400).json(errors[0]);
    }
    const newUser = new User({ name: req.body.name, token: req.body.token });
    const savedUser = await newUser.save();
    return res
      .status(201)
      .json({ id: savedUser._id, createdDate: savedUser.createdDate });
  } catch {
    return res
      .status(500)
      .json({ msg: "An error occured while adding the user!" });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch {
    return res
      .status(500)
      .json({ msg: "An error occurred while getting the list of users." });
  }
};

export const getOneUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const getUser = await User.findById(id);
    if (!getUser) res.status(404).json({ msg: "User not found" });
    return res.status(200).json(getUser);
  } catch {
    return res
      .status(500)
      .json({ msg: "An error occurred while getting the user" });
  }
};

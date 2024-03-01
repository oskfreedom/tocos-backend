import { Request, Response } from "express";
import { validationResult } from "express-validator";

import { Transaction, User } from "../models";

export const addTransaction = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
      .formatWith(({ msg }) => ({ msg }))
      .array();
    if (errors.length > 0) {
      return res.status(400).json(errors[0]);
    }

    const { sender, receiver, amount } = req.body;
    const sendUser = await User.findById(sender);
    if (!sendUser)
      return res.status(404).json({ msg: "Sender does not exist." });
    const receiveUser = await User.findById(receiver);
    if (!receiveUser)
      return res.status(404).json({ msg: "Receiver does not exist." });
    if (sender == receiver)
      return res
        .status(404)
        .json({ msg: "Sender can't be same with receiver." });
    if (sendUser.token < amount)
      return res.status(400).json({ msg: "Sender hasn't got enough money." });

    await new Transaction({ sender, receiver, amount }).save();
    sendUser.token -= parseInt(amount);
    receiveUser.token += parseInt(amount);
    await sendUser.save();
    await receiveUser.save();

    return res.status(201).json({ msg: "Transaction created successfully!" });
  } catch {
    return res.status(500).json({
      msg: "An error occurred while adding the transaction.",
    });
  }
};

export const getTransaction = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const transactions = await Transaction.find({
      $or: [{ sender: id }, { receiver: id }],
    })
      .populate("sender", "name")
      .populate("receiver", "name");
    return res.status(200).json(transactions);
  } catch {
    return res.status(500).json({
      msg: "An error occurred while getting the list of transaction.",
    });
  }
};

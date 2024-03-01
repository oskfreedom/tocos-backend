import { body } from "express-validator";

export const middlewareAddUser = [
  body("name").notEmpty().withMessage("Name is required"),
  body("token")
    .notEmpty()
    .withMessage("Token is required")
    .isInt({ min: 1 })
    .withMessage("Token must be a number greater than 0"),
];

export const middlwareAddTransaction = [
  body("sender").notEmpty().withMessage("Sender is required"),
  body("receiver").notEmpty().withMessage("Sender is required"),
  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isInt({ min: 1 })
    .withMessage("Amount must be a number greater than 0"),
];

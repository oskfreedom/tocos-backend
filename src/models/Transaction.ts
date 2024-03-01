import mongoose, { Document, Schema, model } from "mongoose";

interface ITransaction extends Document {
  sender: Schema.Types.ObjectId;
  receiver: Schema.Types.ObjectId;
  amount: Number;
  createdDate: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  sender: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  amount: {
    type: Number,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

export const Transaction = model("transaction", TransactionSchema);

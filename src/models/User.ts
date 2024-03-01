import mongoose, { Document, Schema, model } from "mongoose";

interface IUser extends Document {
  name: string;
  token: number;
  createdDate: Date;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  token: {
    type: Number,
    required: true
  },
  createdDate: {
    type: Date,
    default: Date.now
  }
})

export const User = model<IUser>('user', UserSchema);
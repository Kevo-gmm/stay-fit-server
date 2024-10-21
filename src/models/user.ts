import mongoose, { Schema, Document } from "mongoose";

export interface UserData extends Document {
  username: string;

  email: string;
  password: string;
}

const userSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export default mongoose.model<UserData>("user", userSchema);

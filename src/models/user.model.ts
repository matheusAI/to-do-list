import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  nome: string;
  email: string;
  password: string;
}

const UserSchema = new Schema<IUser>({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export default mongoose.model<IUser>("User", UserSchema);

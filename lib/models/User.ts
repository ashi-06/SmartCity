import mongoose, { Schema, models } from "mongoose";

export type UserRole = "resident" | "tourist" | "superadmin";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["resident", "tourist", "superadmin"], default: "resident" },
  },
  { timestamps: true }
);

export default models.User || mongoose.model("User", UserSchema);



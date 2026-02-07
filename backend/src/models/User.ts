import { Schema, model, Types } from "mongoose";

export interface IUser {
    _id: Types.ObjectId;
    name: string;
    email: string;
    passwordHash: string;
    role: "user" | "admin";
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, index: true },
        passwordHash: { type: String, required: true },
        role: { type: String, enum: ["user", "admin"], default: "user" }
    },
    { timestamps: true }
);

userSchema.index({ email: 1 });

export const User = model<IUser>("User", userSchema);

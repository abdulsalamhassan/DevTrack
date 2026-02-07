import { Schema, model, Types } from "mongoose";
import { IUser } from "./User";

export interface IProject {
    _id: Types.ObjectId;
    name: string;
    key: string; // short unique project key, e.g. PROJ
    description?: string;
    owner: IUser["_id"];
    members: Types.ObjectId[]; // user ids
    createdAt?: Date;
    updatedAt?: Date;
}

const projectSchema = new Schema<IProject>(
    {
        name: { type: String, required: true, trim: true },
        key: { type: String, required: true, uppercase: true, trim: true, unique: true, index: true },
        description: { type: String },
        owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
        members: [{ type: Schema.Types.ObjectId, ref: "User" }]
    },
    { timestamps: true }
);

projectSchema.index({ key: 1 });
projectSchema.index({ owner: 1 });

export const Project = model<IProject>("Project", projectSchema);

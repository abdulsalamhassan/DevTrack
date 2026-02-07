import { Schema, model, Types } from "mongoose";
import { IProject } from "./Project";
import { IUser } from "./User";

export type IssueStatus = "open" | "in_progress" | "closed" | "archived";
export type IssuePriority = "low" | "medium" | "high" | "critical";

export interface IIssue {
    _id: Types.ObjectId;
    title: string;
    description?: string;
    project: IProject["_id"];
    reporter: IUser["_id"];
    assignees: Types.ObjectId[];
    status: IssueStatus;
    priority: IssuePriority;
    tags: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

const issueSchema = new Schema<IIssue>(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String },
        project: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
        reporter: { type: Schema.Types.ObjectId, ref: "User", required: true },
        assignees: [{ type: Schema.Types.ObjectId, ref: "User" }],
        status: { type: String, enum: ["open", "in_progress", "closed", "archived"], default: "open", index: true },
        priority: { type: String, enum: ["low", "medium", "high", "critical"], default: "medium" },
        tags: [{ type: String, index: true }]
    },
    { timestamps: true }
);

// Compound index to support common queries: project + status + assignee
issueSchema.index({ project: 1, status: 1 });
issueSchema.index({ assignees: 1 });

export const Issue = model<IIssue>("Issue", issueSchema);

import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { Project } from "../models/Project";
import { Issue } from "../models/Issue";

export function validateProjectIdParam(req: Request, res: Response, next: NextFunction) {
    const { projectId } = req.params;
    if (!projectId || !Types.ObjectId.isValid(projectId)) return res.status(400).json({ message: "Invalid projectId" });
    return next();
}

export function validateIssueIdParam(req: Request, res: Response, next: NextFunction) {
    const { issueId } = req.params;
    if (!issueId || !Types.ObjectId.isValid(issueId)) return res.status(400).json({ message: "Invalid issueId" });
    return next();
}

export async function ensureProjectMember(req: Request & { userId?: string }, res: Response, next: NextFunction) {
    const userId = req.userId;
    const { projectId } = req.params;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const proj = await Project.findById(projectId).select("owner members").lean();
    if (!proj) return res.status(404).json({ message: "Project not found" });
    const uid = String(userId);
    const isOwner = String(proj.owner) === uid;
    const isMember = Array.isArray(proj.members) && proj.members.map(String).includes(uid);
    if (!isOwner && !isMember) return res.status(403).json({ message: "Access denied" });
    return next();
}

export async function ensureIssueBelongsToProject(req: Request, res: Response, next: NextFunction) {
    const { projectId, issueId } = req.params;
    const issue = await Issue.findById(issueId).select("project").lean();
    if (!issue) return res.status(404).json({ message: "Issue not found" });
    if (!projectId) return res.status(400).json({ message: "Missing projectId" });
    if (String(issue.project) !== String(projectId)) return res.status(400).json({ message: "Issue does not belong to project" });
    return next();
}

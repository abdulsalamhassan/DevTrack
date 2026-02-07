import { Project } from "../models/Project";
import { Types } from "mongoose";

export interface CreatedProject {
    id: string;
    name: string;
    key: string;
    owner: string;
}

export async function createProject(ownerId: string | Types.ObjectId, name: string, key: string, description?: string) {
    const proj = await Project.create({ name, key, description, owner: ownerId, members: [] });
    return { id: String(proj._id), name: proj.name, key: proj.key, owner: String(proj.owner) } as CreatedProject;
}

export async function getProjectsForUser(userId: string | Types.ObjectId) {
    const projects = await Project.find({ $or: [{ owner: userId }, { members: userId }] }).select("name key owner members").lean();
    return projects.map((p) => ({ id: String(p._id), name: p.name, key: p.key, owner: String(p.owner) }));
}

export async function getProjectById(projectId: string | Types.ObjectId, userId?: string | Types.ObjectId) {
    const proj = await Project.findById(projectId).select("name key description owner members").lean();
    if (!proj) return null;
    // If userId provided, ensure access
    if (userId) {
        const uid = String(userId);
        const isOwner = String(proj.owner) === uid;
        const isMember = Array.isArray(proj.members) && proj.members.map(String).includes(uid);
        if (!isOwner && !isMember) return null;
    }
    return {
        id: String(proj._id),
        name: proj.name,
        key: proj.key,
        description: proj.description,
        owner: String(proj.owner),
        members: (proj.members || []).map(String)
    };
}

export async function addMemberToProject(projectId: string | Types.ObjectId, ownerId: string | Types.ObjectId, memberId: string | Types.ObjectId) {
    const proj = await Project.findById(projectId);
    if (!proj) throw new Error("NOT_FOUND");
    if (String(proj.owner) !== String(ownerId)) throw new Error("FORBIDDEN");
    const memberStr = String(memberId);
    if (proj.members.map(String).includes(memberStr)) return { id: String(proj._id), members: proj.members.map(String) };
    proj.members.push(memberId as any);
    await proj.save();
    return { id: String(proj._id), members: proj.members.map(String) };
}

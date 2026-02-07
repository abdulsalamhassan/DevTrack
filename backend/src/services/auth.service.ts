import bcrypt from "bcrypt";
import { User } from "../models/User";
import { signToken } from "../utils/jwt";
import { Types } from "mongoose";

export interface SanitizedUser {
    id: string;
    name: string;
    email: string;
    role: string;
}

export async function registerUser(name: string, email: string, password: string) {
    const existing = await User.findOne({ email }).lean();
    if (existing) throw new Error("EMAIL_EXISTS");

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash: hash });
    return sanitize(user);
}

export async function loginUser(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("INVALID_CREDENTIALS");

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new Error("INVALID_CREDENTIALS");

    const token = signToken({ sub: String(user._id) });
    return { token, user: sanitize(user) };
}

export async function getUserById(id: string | Types.ObjectId) {
    const user = await User.findById(id).lean();
    if (!user) return null;
    return sanitize(user as any);
}

function sanitize(user: any): SanitizedUser {
    return {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role || "user"
    };
}

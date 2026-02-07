import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export interface RequestWithUser extends Request {
    userId?: string;
}

export function authMiddleware(req: RequestWithUser, res: Response, next: NextFunction) {
    const cookieName = process.env.AUTH_COOKIE_NAME || "token";
    const token = (req.cookies && req.cookies[cookieName]) || null;
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    try {
        const payload = verifyToken(token);
        if (payload && typeof payload.sub === "string") {
            req.userId = payload.sub;
            return next();
        }
        if (payload && (payload.uid || payload.id)) {
            req.userId = String((payload as any).uid || (payload as any).id);
            return next();
        }
        return res.status(401).json({ error: "Invalid token payload" });
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}

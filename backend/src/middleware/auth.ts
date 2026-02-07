import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export interface AuthRequest extends Request {
    userId?: string;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const token = auth.replace(/^Bearer\s+/, "");
    try {
        const payload = verifyToken(token);
        if (payload && typeof payload.sub === "string") {
            req.userId = payload.sub;
            return next();
        }
        // support id in uid claim or id
        if (payload && (payload.uid || payload.id)) {
            req.userId = String((payload as any).uid || (payload as any).id);
            return next();
        }
        return res.status(401).json({ error: "Invalid token payload" });
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}

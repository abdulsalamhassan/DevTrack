import { NextFunction, Request, Response } from "express";
import { MongoServerError } from "mongodb";
import mongoose from "mongoose";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

function formatErrorMessage(err: unknown) {
    if (err instanceof Error) return err.message;
    return String(err);
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
    // Log server-side for diagnostics
    console.error(err instanceof Error ? err.message : err);

    // Mongoose bad ObjectId / CastError
    if (err instanceof mongoose.Error.CastError || (err && (err as any).name === "CastError")) {
        return res.status(400).json({ message: "Invalid identifier" });
    }

    // Mongo duplicate key
    if (err instanceof MongoServerError && (err as any).code === 11000) {
        return res.status(409).json({ message: "Duplicate key error" });
    }

    // JWT errors
    if (err instanceof TokenExpiredError) return res.status(401).json({ message: "Token expired" });
    if (err instanceof JsonWebTokenError) return res.status(401).json({ message: "Invalid token" });

    // Generic handled errors thrown with known codes/messages
    if (err && typeof err === "object" && (err as any).status && (err as any).message) {
        return res.status((err as any).status).json({ message: (err as any).message });
    }

    // Fallback
    return res.status(500).json({ message: formatErrorMessage(err) || "Internal Server Error" });
}

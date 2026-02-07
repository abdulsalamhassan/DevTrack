import dotenv from "dotenv";

dotenv.config();

export const NODE_ENV = process.env.NODE_ENV || "development";
export const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
export const MONGO_URI = process.env.MONGO_URI || "";
export const JWT_SECRET = process.env.JWT_SECRET || "";
export const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "token";

function assertEnv() {
    const missing: string[] = [];
    if (!MONGO_URI) missing.push("MONGO_URI");
    if (!JWT_SECRET) missing.push("JWT_SECRET");
    if (missing.length) {
        throw new Error(`Missing required env vars: ${missing.join(", ")}`);
    }
}

assertEnv();

export const COOKIE_OPTIONS = {
    httpOnly: true,
    sameSite: NODE_ENV === "production" ? "none" as const : ("lax" as const),
    secure: NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000
};

export default {
    NODE_ENV,
    PORT,
    MONGO_URI,
    JWT_SECRET,
    AUTH_COOKIE_NAME,
    COOKIE_OPTIONS
};

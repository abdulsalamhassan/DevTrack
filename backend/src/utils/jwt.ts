import jwt, { SignOptions, Secret } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment");
}

export function signToken(payload: Record<string, unknown>, expiresIn = "7d") {
    const options: SignOptions = { expiresIn } as SignOptions;
    return jwt.sign(payload, JWT_SECRET as Secret, options as SignOptions);
}

export function verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET as Secret) as Record<string, unknown>;
}

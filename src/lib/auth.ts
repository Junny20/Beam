import jwt from "jsonwebtoken";

const secret: string = process.env.JWT_SECRET!;

export type AuthPayload = {
    userId: string;
    steamId64: string;
}

export function signAuthJwt(authPayload: AuthPayload) {
    return jwt.sign(authPayload, secret, { expiresIn: "7d" });
}

export function verifyAuthJwt(token: string) {
  return jwt.verify(token, secret) as AuthPayload & { iat: number; exp: number };
}
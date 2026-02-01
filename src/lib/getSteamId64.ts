import { NextRequest } from "next/server";
import { verifyAuthJwt } from "./auth";

export function getSteamId64(req: NextRequest) {
    const token = req.cookies.get("auth")?.value;
    if (!token) {
        throw new Error("Unauthorized");
    }

    const payload = verifyAuthJwt(token);
    const steamId64 = payload.steamId64;

    return steamId64;
}
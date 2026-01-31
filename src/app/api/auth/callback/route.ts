import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const baseUrl = process.env.BASE_URL;

export async function GET(req: Request) {
    const steamVerifyUrl = "https://steamcommunity.com/openid/login";

    const { searchParams } = new URL(req.url); 
    
    const openidParams: Record<string, string> = {};
    for (const [key, value] of searchParams.entries()) {
        if (key.startsWith("openid")) {
            openidParams[key] = value;
        }
    }

    const verifyParams = new URLSearchParams();

    for (const [key, value] of Object.entries(openidParams)) {
        verifyParams.set(key, value);
    }

    verifyParams.set("openid.mode", "check_authentication");

    const res = await fetch(steamVerifyUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: verifyParams.toString(),
    })

    const text = await res.text();
    
    const isValid = text
        .split("\n")
        .some(line => line.trim() === "is_valid:true");

    if (!isValid) {
        return NextResponse.json(
            { error: "Steam OpenID verification failed" },
            { status: 401 }
        );
    } else {
        const identity = openidParams["openid.identity"];
        
        if (!identity) {
            return NextResponse.json(
                { error: "Missing OpenID identity" },
                { status: 400 }
            );
        }

        const steamId64 = identity.split("/").pop();

        if (!steamId64) {
            return NextResponse.json(
                { error: "Invalid SteamID format" },
                { status: 400 }
            );
        }

        const user = await prisma.user.upsert({
            where: { steamId64 },
            update: {},
            create: { steamId64 },
        });
        
        // const token = createJwt({ userId: user.id, steamId64 });

        // cookies().set("auth", token, {
        // httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        // sameSite: "lax",
        // path: "/",
        // });

        return NextResponse.redirect(new URL("/explore", baseUrl));

    }
}
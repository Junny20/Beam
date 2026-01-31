import { NextResponse } from "next/server";

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

        return NextResponse.json(
            {
                steamId64,
                message: "Steam OpenID verified",
            },
            { status: 200 },
        )
    }
}
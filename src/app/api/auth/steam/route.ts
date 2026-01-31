import { NextResponse } from "next/server";

const baseUrl = process.env.BASE_URL!;

export async function GET() {
    const steamOpenIdUrl = "steamcommunity.com/openid/";

    const params = new URLSearchParams({
        "openid.ns": "http://specs.openid.net/auth/2.0",
        "openid.mode": "checkid_setup",
        "openid.return_to": `${baseUrl}/api/auth/callback`,
        "openid.realm": baseUrl,
        "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
        "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
    })

    return NextResponse.redirect(`${steamOpenIdUrl}?${params.toString()}`);
}
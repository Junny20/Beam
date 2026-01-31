import { NextRequest, NextResponse } from "next/server";
import { getSteamId64 } from "@/lib/getSteamId64";

const steamApiKey = process.env.STEAM_API_KEY!;
const apiEndpoint = "http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001";

export async function GET(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  let steamId64 = null;
  try {
    steamId64 = getSteamId64(req);
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const appId = req.nextUrl.searchParams.get("gameId");

  if (!appId || isNaN(Number(appId))) {
    return NextResponse.json(
      { error: "Missing or invalid Game ID" },
      { status: 400 }
    );
  }

  const params = new URLSearchParams({
    key: steamApiKey,
    steamid: steamId64,
    appid: appId,
  });

  try {
    const res = await fetch(`${apiEndpoint}?${params.toString()}`);

    if (!res.ok) {
      return NextResponse.json({ error: "Steam API Error" }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Internal Server Error: ${pathname}` },
      { status: 500 },
    );
  }
}

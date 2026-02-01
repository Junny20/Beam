import { NextRequest, NextResponse } from "next/server";
import { getSteamId64 } from "@/lib/getSteamId64";
import { getUserStatsForGame } from "@/lib/steam/getUserStatsForGame";

const steamApiKey = process.env.STEAM_API_KEY!;

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

  try {
    const userAchievements = await getUserStatsForGame(steamId64, appId, steamApiKey);
    return NextResponse.json(userAchievements, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: `Internal Server Error: ${pathname}` }, { status: 500 });
  }
}

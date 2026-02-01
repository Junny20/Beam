import { getSteamId64 } from "@/lib/getSteamId64";
import { getOwnedGames } from "@/lib/steam/getOwnedGames";
import { NextRequest, NextResponse } from "next/server";

const steamApiKey = process.env.STEAM_API_KEY!;

export async function GET(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  let steamId64 = null;
  try {
    steamId64 = getSteamId64(req);
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const games = await getOwnedGames(steamId64, steamApiKey);
    return NextResponse.json(games, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: `Internal Server Error: ${pathname}` }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getSteamId64 } from "@/lib/getSteamId64";
import { getPlayerSummaries } from "@/lib/steam/getPlayerSummaries";

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
    const profile = await getPlayerSummaries([steamId64], steamApiKey);
    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: `Internal Server Error: ${pathname}` }, { status: 500 });
  }
}

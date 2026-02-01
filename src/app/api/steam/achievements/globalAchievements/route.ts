import { getGlobalAchievementPercentagesForApp } from "@/lib/steam/getGlobalAchievementPercentagesForApp";
import { NextRequest, NextResponse } from "next/server";

const steamApiKey = process.env.STEAM_API_KEY!;

export async function GET(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const gameId = req.nextUrl.searchParams.get("gameId");

  if (!gameId || isNaN(Number(gameId))) {
    return NextResponse.json(
      { error: "Missing or invalid Game ID" },
      { status: 400 }
    );
  }

  try {
    const globalAchievements = await getGlobalAchievementPercentagesForApp(gameId, steamApiKey);
    return NextResponse.json(globalAchievements, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: `Internal Server Error: ${pathname}` }, { status: 500 });
  }
}

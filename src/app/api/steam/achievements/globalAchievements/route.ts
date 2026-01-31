import { NextRequest, NextResponse } from "next/server";

const steamApiKey = process.env.STEAM_API_KEY!;
const apiEndpoint = "https://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v0002";

export async function GET(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const gameId = req.nextUrl.searchParams.get("gameId");

  if (!gameId || isNaN(Number(gameId))) {
    return NextResponse.json(
      { error: "Missing or invalid Game ID" },
      { status: 400 }
    );
  }

  const params = new URLSearchParams({
    key: steamApiKey,
    gameid: gameId,
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

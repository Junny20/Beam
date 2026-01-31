import { verifyAuthJwt } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const steamApiKey = process.env.STEAM_API_KEY!;
const apiEndpoint =
  "https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001";

export async function GET(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const token = req.cookies.get("auth")?.value;
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = verifyAuthJwt(token);
  const steamId64 = payload.steamId64;

  const params = new URLSearchParams({
    key: steamApiKey,
    steamid: steamId64,
    include_appinfo: "true",
    include_played_free_games: "true",
  });

  try {
    const res = await fetch(`${apiEndpoint}?${params.toString()}`);

    if (!res.ok) {
      return NextResponse.json({ error: "Steam API Error" }, { status: 502 });
    }

    const data = await res.json();
    console.log(data);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: `Internal Server Error: ${pathname}` }, { status: 500 });
  }
}

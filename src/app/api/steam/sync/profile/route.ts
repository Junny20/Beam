import { NextRequest, NextResponse } from "next/server";
import { getSteamId64 } from "@/lib/getSteamId64";
import { getPlayerSummaries } from "@/lib/steam/getPlayerSummaries";
import { prisma } from "@/lib/prisma";

const steamApiKey = process.env.STEAM_API_KEY!;

export async function POST(req: NextRequest) {
  let steamId64: string;

  try {
    steamId64 = getSteamId64(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const players = await getPlayerSummaries(steamId64, steamApiKey);

  const player = players[0];
  if (!player) {
    return NextResponse.json(
      { error: "Steam profile not available" },
      { status: 403 }
    );
  }

  await prisma.user.update({
    where: { steamId64 },
    data: {
      personaName: player.personaname,
      avatar: player.avatarfull,
      visibility: player.communityvisibilitystate,
      personaState: player.personastate,
      lastSyncAt: new Date(),
    },
  });

  return NextResponse.json({ status: "profile synced" }, { status: 200 });
}
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSteamId64 } from "@/lib/getSteamId64";
import { getFriendList } from "@/lib/steam/getFriendList";
import { getPlayerSummaries } from "@/lib/steam/getPlayerSummaries";

const steamApiKey = process.env.STEAM_API_KEY!;

export async function GET(req: NextRequest) {
  let steamId64: string;

  try {
    steamId64 = getSteamId64(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const steamFriends = await getFriendList(steamId64, steamApiKey);
  if (!steamFriends?.length) {
    return NextResponse.json([], { status: 200 });
  }

  const steamIds = steamFriends.map((f) => f.steamid);

  const existingUsers = await prisma.user.findMany({
    where: { steamId64: { in: steamIds } },
  });

  const needsUpdateIds = steamIds.filter((id) => {
    const user = existingUsers.find((u) => u.steamId64 === id);
    return !user || !user.personaName || !user.avatar;
  });

  if (needsUpdateIds.length > 0) {
    const profiles = await getPlayerSummaries(needsUpdateIds, steamApiKey);

    await prisma.$transaction(
      profiles.map((p) =>
        prisma.user.upsert({
          where: { steamId64: p.steamid },
          create: {
            steamId64: p.steamid,
            personaName: p.personaname,
            avatar: p.avatarfull,
            visibility: p.communityvisibilitystate,
            personaState: p.personastate,
            lastLogOff: p.lastlogoff,
            timeCreated: p.timecreated,
            locCountryCode: p.loccountrycode,
          },
          update: {
            personaName: p.personaname,
            avatar: p.avatarfull,
            visibility: p.communityvisibilitystate,
            personaState: p.personastate,
            lastLogOff: p.lastlogoff,
            timeCreated: p.timecreated,
            locCountryCode: p.loccountrycode,
          },
        }),
      ),
    );
  }

  const enrichedFriends = await prisma.user.findMany({
    where: { steamId64: { in: steamIds } },
    select: {
      id: true,
      steamId64: true,
      personaName: true,
      avatar: true,
    },
  });

  // console.log(enrichedFriends);

  return NextResponse.json(enrichedFriends, { status: 200 });
}

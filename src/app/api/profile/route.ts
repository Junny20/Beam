import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSteamId64 } from "@/lib/getSteamId64";

export async function GET(req: NextRequest) {
  let steamId64: string;

  try {
    steamId64 = getSteamId64(req);
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { steamId64 },
    select: {
      id: true,
      steamId64: true,
      personaName: true,
      avatar: true,
      visibility: true,
      personaState: true,
      lastLogOff: true,
      timeCreated: true,
      locCountryCode: true,
      lastSyncAt: true,
      createdAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "No user found" }, { status: 400 });
  }

  // console.log(user);
  return NextResponse.json({ user }, { status: 200 });
}

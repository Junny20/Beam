import { getSteamId64 } from "@/lib/getSteamId64";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  let steamId64: string;

  try {
    steamId64 = getSteamId64(req);
  } catch {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
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
      lastSyncAt: true,
      createdAt: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }

  return NextResponse.json(
    {
      authenticated: true,
      user,
    },
    { status: 200 }
  );
}
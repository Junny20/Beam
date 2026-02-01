import { NextRequest, NextResponse } from "next/server";
import { getSteamId64 } from "@/lib/getSteamId64";
import { prisma } from "@/lib/prisma";
import { syncOwnedGames } from "@/lib/sync/ownedGames";

export async function POST(req: NextRequest) {
  let steamId64: string;
  try {
    steamId64 = getSteamId64(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { steamId64 } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const force = searchParams.get("force") === "true";

  const existingCount = await prisma.ownedGame.count({
    where: { userId: user.id },
  });

  if (existingCount > 0 && !force) {
    return NextResponse.json({ skipped: true });
  }

  // Expensive... 
  await syncOwnedGames(user.id, steamId64);

  return NextResponse.json({ ok: true });
}
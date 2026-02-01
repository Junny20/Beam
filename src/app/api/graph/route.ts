import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSteamId64 } from "@/lib/getSteamId64";
import { buildGameGraph } from "@/lib/graph/buildGameGraph";

export async function GET(req: NextRequest) {
  let viewerSteamId64: string;

  try {
    viewerSteamId64 = getSteamId64(req);
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const targetUserId = searchParams.get("user");

  const user = targetUserId
    ? await prisma.user.findUnique({
        where: { id: targetUserId },
        select: { id: true },
      })
    : await prisma.user.findUnique({
        where: { steamId64: viewerSteamId64 },
        select: { id: true },
      });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const nodes = await buildGameGraph(user.id);

  return NextResponse.json({ nodes }, { status: 200 });
}
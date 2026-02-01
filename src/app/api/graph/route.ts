import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSteamId64 } from "@/lib/getSteamId64";
import { buildGameGraph } from "@/lib/graph/buildGameGraph";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const targetUserId = searchParams.get("user");

  let viewerSteamId64: string;

  try {
    viewerSteamId64 = getSteamId64(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const viewer = await prisma.user.findUnique({
    where: { steamId64: viewerSteamId64 },
    select: { id: true },
  });

  if (!viewer) {
    return NextResponse.json({ error: "Viewer not found" }, { status: 404 });
  }

  let targetUser = viewer;

  if (targetUserId) {
    const friend = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true },
    });

    if (!friend) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    targetUser = friend;
  }

  const nodes = await buildGameGraph(targetUser.id);

  return NextResponse.json({ nodes });
}
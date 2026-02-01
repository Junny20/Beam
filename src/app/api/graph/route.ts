import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSteamId64 } from "@/lib/getSteamId64";
import { buildGameGraph } from "@/lib/graph/buildGameGraph";

export async function GET(req: NextRequest) {
  let steamId64: string;

  try {
    steamId64 = getSteamId64(req);
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { steamId64 },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const nodes = await buildGameGraph(user.id);
  // console.log(nodes);
  
  return NextResponse.json({ nodes }, { status: 200 });
}
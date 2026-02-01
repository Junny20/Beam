import { prisma } from "@/lib/prisma";
import { GameGraphNode } from "./types";

export async function buildGameGraph(userId: string): Promise<GameGraphNode[]> {
  const games = await prisma.ownedGame.findMany({
    where: { userId },
    include: {
      achievements: true, // later
    },
  });

  return games.map((g) => ({
    id: g.appid,
    name: g.name,
    playtimeHours: g.playtimeForever / 60,
    recentHours: g.playtime2Weeks / 60,
    lastPlayedAt: g.lastPlayedAt,
    achievementUnlocked: g.achievementsUnlocked ?? 0,
    achievementTotal: g.achievementsTotal ?? 0,
    genre: g.genre,
    color: "#8B5CF6", // TEMP: static mapping
  }));
}
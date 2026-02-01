import { prisma } from "../prisma";
import { GameGraphNode } from "./types";

export async function buildGameGraph(userId: string): Promise<GameGraphNode[]> {
  const games = await prisma.ownedGame.findMany({
    where: { userId },
    orderBy: { playtimeForever: "desc" },
  });

  const maxPlaytime = Math.max(...games.map(g => g.playtimeForever), 1);

  return games.map((g) => ({
    id: g.appid,
    name: g.name,
    playtime: g.playtimeForever / 60,
    recentHours: (g.playtime2Weeks ?? 0) / 60,
    genre: g.genre ?? "Unknown",
    lastPlayed: g.lastPlayedAt
      ? g.lastPlayedAt.toISOString()
      : "Never",
    achievements: {
      unlocked: g.achievementsUnlocked ?? 0,
      total: g.achievementsTotal ?? 0,
      rarest: {
        name: "Unknown",
        percent: 0,
      },
    },
    topPercentile: Math.round(
      100 - (g.playtimeForever / maxPlaytime) * 100
    ),
    color: colorFromAppId(g.appid),
    icon: g.icon
      ? `https://media.steampowered.com/steamcommunity/public/images/apps/${g.appid}/${g.icon}.jpg`
      : "",
  }));
}

// function genreColor(genre?: string) {
//   switch (genre) {
//     case "RPG": return "#8B5CF6";
//     case "Action": return "#EF4444";
//     case "Roguelike": return "#F59E0B";
//     default: return "#6B7280";
//   }
// }

function colorFromAppId(appid: number): string {
  // deterministic hash
  let seed = appid * 9301 + 49297;
  seed = seed % 233280;
  const rand = seed / 233280;

  const hue = Math.floor(rand * 360);
  const saturation = 70 + (appid % 20);
  const lightness = 45 + (appid % 10);

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
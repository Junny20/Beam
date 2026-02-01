import { GameGraphNode } from "./types";

export function toRenderableGame(node: GameGraphNode) {
  return {
    id: node.id,
    name: node.name,
    playtime: Math.round(node.playtime),
    recentHours: Math.round(node.recentHours),
    lastPlayed: new Date(Number(node.lastPlayed) * 1000).toLocaleDateString(), // WATCH OUT...
    achievements: {
      unlocked: node.achievements.unlocked,
      total: node.achievements.total,
      rarest: { name: "Unknown", percent: 0 }, // later
    },
    genre: node.genre ?? "Unknown",
    color: node.color,
  };
}
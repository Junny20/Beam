import { GameGraphNode } from "./types";

export function calculateNodeProperties(game: GameGraphNode) {
  const playtime = game.playtime; // hours
  const recent = game.recentHours; // hours

  const size = 0.5 + Math.min(playtime / 400, 1.5);
  const glowIntensity = Math.min(recent / 20, 1);

  const orbitDistance = 3 + (1 - glowIntensity) * 4;
  console.log("orbitDistance", orbitDistance);
  return { size, glowIntensity, orbitDistance };
}

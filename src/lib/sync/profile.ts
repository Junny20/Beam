import { getPlayerSummaries } from "../steam/getPlayerSummaries";
import { prisma } from "../prisma";

const steamApiKey = process.env.STEAM_API_KEY!;

export async function syncProfile(steamId64: string) {
  const players = await getPlayerSummaries(steamId64, steamApiKey);

  const player = players[0];
  if (!player) {
    throw new Error("syncProfile failed");
  }

  await prisma.user.update({
    where: { steamId64 },
    data: {
      personaName: player.personaname,
      avatar: player.avatarfull,
      visibility: player.communityvisibilitystate,
      personaState: player.personastate,
      lastSyncAt: new Date(),
    },
  });
}

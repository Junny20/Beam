import { getOwnedGames } from "../steam/getOwnedGames";
import { prisma } from "../prisma";

const steamApiKey = process.env.STEAM_API_KEY!;

export async function syncOwnedGames(userId: string, steamId64: string) {
  const games = await getOwnedGames(steamId64, steamApiKey);
  if (!games) throw new Error("syncOwnedGames failed");

  for (const game of games) {
    await prisma.ownedGame.upsert({
      where: {
        userId_appid: {
          userId,
          appid: game.appid,
        },
      },
      create: {
        userId,
        appid: game.appid,
        name: game.name,
        icon: game.img_icon_url,
        genre: null,

        playtimeForever: game.playtime_forever,
        playtime2Weeks: game.playtime_2weeks ?? null,
        lastPlayedAt: game.rtime_last_played
          ? new Date(game.rtime_last_played * 1000)
          : null,

        achievementsUnlocked: null,
        achievementsTotal: null,
      },
      update: {
        name: game.name,
        icon: game.img_icon_url,
        playtimeForever: game.playtime_forever,
        playtime2Weeks: game.playtime_2weeks ?? null,
        lastPlayedAt: game.rtime_last_played
          ? new Date(game.rtime_last_played * 1000)
          : null,
      },
    });
  }
}

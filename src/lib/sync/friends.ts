import { getFriendList } from "../steam/getFriendList";
import { prisma } from "../prisma";

const steamApiKey = process.env.STEAM_API_KEY!;

export async function syncFriends(steamId64: string) {
  const friends = await getFriendList(steamId64, steamApiKey);

  if (!friends) {
    throw new Error("syncFriends failed");
  }

  const user = await prisma.user.findUnique({
    where: { steamId64 },
    select: { id: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  for (const f of friends) {
    const friendUser = await prisma.user.upsert({
      where: { steamId64: f.steamid },
      update: {},
      create: {
        steamId64: f.steamid,
      },
      select: { id: true },
    });

    await prisma.friend.upsert({
      where: {
        userId_friendId: {
          userId: user.id,
          friendId: friendUser.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        friendId: friendUser.id,
      },
    });
  }
}
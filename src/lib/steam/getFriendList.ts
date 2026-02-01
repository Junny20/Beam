import { SteamFriend } from "./types";

export async function getFriendList(
  steamId64: string,
  apiKey: string
): Promise<SteamFriend[]> {
    const endpoint = "https://api.steampowered.com/ISteamUser/GetFriendList/v0001";

  const params = new URLSearchParams({
    key: apiKey,
    steamid: steamId64,
  });

  const res = await fetch(`${endpoint}?${params.toString()}`);

  if (!res.ok) {
    throw new Error("Steam GetFriendList failed");
  }

  const data = await res.json();

  return data?.friendslist?.friends ?? [];
}
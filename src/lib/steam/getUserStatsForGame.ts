export async function getUserStatsForGame(
  steamId64: string,
  appId: string,
  apiKey: string,
) {
  const endpoint =
    "https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002";
  const params = new URLSearchParams({
    key: apiKey,
    steamid: steamId64,
    appid: appId,
  });

  const res = await fetch(`${endpoint}?${params.toString()}`);

  if (!res.ok) {
    throw new Error("Steam GetUserStatsForGame failed");
  }

  const data = await res.json();

  return data?.playerstats ?? [];
}

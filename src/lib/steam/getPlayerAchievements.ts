export async function getPlayerAchievements(
  steamId64: string,
  appId: string,
  apiKey: string,
) {
  const endpoint =
    "http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001";
  const params = new URLSearchParams({
    key: apiKey,
    steamid: steamId64,
    appid: appId,
  });

  const res = await fetch(`${endpoint}?${params.toString()}`);

  if (!res.ok) {
    throw new Error("Steam GetPlayerAchievements failed");
  }

  const data = await res.json();

  return data?.playerstats ?? [];
}

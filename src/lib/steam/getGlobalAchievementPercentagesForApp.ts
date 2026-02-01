export async function getGlobalAchievementPercentagesForApp(
  gameId: string,
  apiKey: string,
) {
  const endpoint =
    "https://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v0002";
  const params = new URLSearchParams({
    key: apiKey,
    gameid: gameId,
  });

  const res = await fetch(`${endpoint}?${params.toString()}`);

  if (!res.ok) {
    throw new Error("Steam GetGlobalAchievementPercentagesForApp failed");
  }

  const data = await res.json();

  return data?.achievementpercentages?.achievements ?? [];
}

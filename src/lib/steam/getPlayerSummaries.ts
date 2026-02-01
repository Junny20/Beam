export async function getPlayerSummaries(
  steamId64: string,
  apiKey: string
) {
  const endpoint =
    "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002";

  const params = new URLSearchParams({
    key: apiKey,
    steamids: steamId64,
  });

  const res = await fetch(`${endpoint}?${params.toString()}`);

  if (!res.ok) {
    throw new Error("Steam GetPlayerSummaries failed");
  }

  const data = await res.json();

  return data?.response?.players ?? [];
}
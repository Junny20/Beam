export async function getRecentlyPlayedGames(
  steamId64: string,
  apiKey: string
) {
    const endpoint =
      "https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001";
  const params = new URLSearchParams({
    key: apiKey,
    steamid: steamId64,
  });

  const res = await fetch(`${endpoint}?${params.toString()}`);

  if (!res.ok) {
    throw new Error("Steam GetRecentlyPlayedGames failed");
  }

  const data = await res.json();

  return data?.response ?? [];
}
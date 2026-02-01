export async function getOwnedGames(
  steamId64: string,
  apiKey: string
) {
  const endpoint =
    "https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001";

  const params = new URLSearchParams({
    key: apiKey,
    steamid: steamId64,
    include_appinfo: "true",
    include_played_free_games: "true",
  });

  const res = await fetch(`${endpoint}?${params.toString()}`);

  if (!res.ok) {
    throw new Error("Steam GetOwnedGames failed");
  }

  const data = await res.json();

  return data?.response?.games ?? [];
}
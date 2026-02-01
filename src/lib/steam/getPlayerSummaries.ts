import { SteamPlayerSummary } from "./types";

export async function getPlayerSummaries(
  steamIds: string[],
  apiKey: string
): Promise<SteamPlayerSummary[]> {
  if (!steamIds.length) return [];

  const endpoint =
    "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002";

  const params = new URLSearchParams({
    key: apiKey,
    steamids: steamIds.join(","), // Steam expects CSV
  });

  const res = await fetch(`${endpoint}?${params.toString()}`);

  if (!res.ok) {
    throw new Error("Steam GetPlayerSummaries failed");
  }

  const data = await res.json();

  return data?.response?.players ?? [];
}
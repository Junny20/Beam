import { NextRequest, NextResponse } from "next/server";
import { getSteamId64 } from "@/lib/getSteamId64";
import { getOwnedGames } from "@/lib/steam/getOwnedGames";
import { prisma } from "@/lib/prisma";

const steamApiKey = process.env.STEAM_API_KEY!;
const SYNC_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes
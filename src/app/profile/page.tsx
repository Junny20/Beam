"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { buildPlaytimeStats } from "@/data/mockUsers";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Backlogs from "./Backlogs";

function formatUnix(ts?: number) {
  if (!ts) return "Unknown";
  const d = new Date(ts * 1000);
  return d.toLocaleString();
}

function formatDate(ts?: number) {
  if (!ts) return "Unknown";
  const d = new Date(ts * 1000);
  return d.toLocaleDateString();
}

function personaStateLabel(state?: number) {
  switch (state) {
    case 0:
      return { label: "Offline", dot: "bg-gray-500" };
    case 1:
      return { label: "Online", dot: "bg-green-500" };
    case 2:
      return { label: "Busy", dot: "bg-red-500" };
    case 3:
      return { label: "Away", dot: "bg-yellow-500" };
    case 4:
      return { label: "Snooze", dot: "bg-yellow-400" };
    case 5:
      return { label: "Looking to Trade", dot: "bg-blue-500" };
    case 6:
      return { label: "Looking to Play", dot: "bg-purple-500" };
    default:
      return { label: "Unknown", dot: "bg-gray-500" };
  }
}

function visibilityLabel(v?: number) {
  // 1 = private, 3 = public (common values)
  if (v === 3) return "Public";
  if (v === 1) return "Private";
  return "Unknown";
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {console.log(games)}, [games]);

  useEffect(() => {
    const loadProfileAndGames = async () => {
      try {
        // Load profile
        let res = await fetch("/api/profile");

        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }

        let data = await res.json();

        if (!data.user?.personaName) {
          await fetch("/api/steam/sync/profile", { method: "POST" });
          res = await fetch("/api/profile");
          data = await res.json();
        }

        setProfile(data.user);

        // Load owned games
        const gamesRes = await fetch("/api/steam/owned_games");
        if (!gamesRes.ok) {
          throw new Error("Failed to load owned games");
        }

        const games = await gamesRes.json();
        setGames(games ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProfileAndGames();
  }, []);

  if (loading) {
    return <div>Loading</div>;
  }

  if (!profile) {
    return <div>No profile</div>;
  }

  console.log(profile);

  const status = personaStateLabel(profile.personaState);

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row gap-8 p-8 rounded-2xl bg-white/5 border border-white/10 mt-[60px]">
        <div className="shrink-0">
          <div className="relative w-[200px] h-[200px] rounded-[30px] overflow-hidden border border-white/10">
            <Image
              src={profile.avatar}
              alt="User Avatar"
              fill
              className="object-cover"
              sizes="200px"
              priority
            />
          </div>

          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/30 border border-white/10">
            <span className={`w-2.5 h-2.5 rounded-full ${status.dot}`} />
            <span className="text-sm text-white/90">{status.label}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8 w-full min-w-0">
          <div className="flex flex-col gap-1">
            <h1 className="text-5xl font-bold truncate">
              {profile.personaName}
            </h1>
            <p className="text-white/60 text-sm break-all">
              SteamID: {profile.steamId64}
            </p>
            <div className="flex flex-wrap gap-3 mt-2">
              {profile.steamId64 && (
                <a
                  href={`https://steamcommunity.com/profiles/${profile.steamId64}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-sm"
                >
                  View Steam Profile →
                </a>
              )}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InfoRow
              label="Profile Visibility"
              value={visibilityLabel(profile.visibility)}
            />
            <InfoRow
              label="Profile State"
              value={profile.personaState ? "Configured" : "Unknown"}
            />

            <InfoRow
              label="Last Online"
              value={formatUnix(profile.lastLogOff)}
            />
            <InfoRow
              label="Account Created"
              value={`${formatDate(profile.timeCreated)}`}
            />

            <InfoRow label="Location" value={profile.locCountryCode} />
          </div>
        </div>
      </div>
      <PlaytimeSection games={games} />
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 p-4 rounded-xl bg-black/20 border border-white/10">
      <p className="text-xs uppercase tracking-wide text-white/50">{label}</p>
      <p className="text-white/90 break-words text-xl text-center mt-[10px]">
        {value}
      </p>
    </div>
  );
}

function PlaytimeChart({
  top5,
}: {
  top5: { appid: number; name: string; hours: number }[];
}) {
  return (
    <div className="h-[260px] rounded-xl bg-black/20 border border-white/10 p-4">
      <p className="text-sm text-white/70 mb-3">Most played (hours)</p>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={top5}>
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="hours" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function PlaytimeSection({
  games,
}: {
  games: { appid: number; name: string; playtime_forever: number }[];
}) {
    console.log("this runs.");
  const { totalHours, top5 } = buildPlaytimeStats(games);
  console.log(totalHours);
  console.log(top5);

  return (
    <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h2 className="text-xl font-semibold">Playtime</h2>
          <p className="text-white/60 text-sm">
            Based on total minutes played across owned games
          </p>
        </div>

        <div className="text-right">
          <p className="text-white/60 text-sm">Total time played</p>
          <p className="text-3xl font-bold">
            {totalHours.toLocaleString()} hrs
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl bg-black/20 border border-white/10 p-4">
          <p className="text-sm text-white/70 mb-3">Top 5 Games</p>
          <div className="flex flex-col gap-3">
            {top5.map((g, i) => (
              <div key={g.appid} className="flex justify-between">
                <p className="truncate font-medium">
                  {i + 1}. {g.name}
                </p>
                <p>{g.hours} hrs</p>
              </div>
            ))}
          </div>
        </div>

        <PlaytimeChart top5={top5} />
      </div>
    </div>
  );
}
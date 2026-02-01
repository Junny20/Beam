"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { buildPlaytimeStats } from "@/data/mockUsers";
import { FriendsModal } from "./FriendsModal";
import {
  formatUnix,
  formatDate,
  personaStateLabel,
  visibilityLabel,
} from "./utils";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Cell } from "recharts";

export default function ProfilePage() {
  const [friendsOpen, setFriendsOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-8 h-8 border-2 border-slate-700 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
        No profile data available
      </div>
    );
  }

  const status = personaStateLabel(profile.personaState);

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      <div className="max-w-6xl mx-auto px-6 pt-24">
        {/* Profile Header */}
        <div className="relative overflow-hidden rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-sky-500/5" />
          
          <div className="relative p-8 md:p-10">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar Section */}
              <div className="shrink-0">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-b from-slate-700 to-slate-800 rounded-2xl -inset-px blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative w-40 h-40 rounded-2xl overflow-hidden border border-slate-700/50 bg-slate-800 shadow-2xl">
                    <Image
                      src={profile.avatar}
                      alt="User Avatar"
                      fill
                      className="object-cover"
                      sizes="160px"
                      priority
                    />
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50 w-fit">
                  <span className={`w-2 h-2 rounded-full ${status.dot} ring-2 ring-slate-900`} />
                  <span className="text-sm font-medium text-slate-300">
                    {status.label}
                  </span>
                </div>
              </div>

              {/* Info Section */}
              <div className="flex-1 min-w-0 space-y-6">
                {/* Header */}
                <div className="space-y-2">
                  <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white">
                    {profile.personaName}
                  </h1>
                  <div className="flex items-center gap-2 text-slate-500 font-mono text-sm">
                    <span>ID:</span>
                    <span className="text-slate-400">{profile.steamId64}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  {profile.steamId64 && (
                    <a
                      href={`https://steamcommunity.com/profiles/${profile.steamId64}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-slate-950 font-medium text-sm hover:bg-slate-200 transition-colors shadow-lg shadow-white/5"
                    >
                      View Steam Profile
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                  
                  <button
                    onClick={() => setFriendsOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-800 text-slate-200 font-medium text-sm hover:bg-slate-700 transition-colors border border-slate-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    View Friends
                  </button>

                  <a
                    href="/explore"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-800/50 text-slate-300 font-medium text-sm hover:bg-slate-800 transition-colors border border-slate-800"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                    </svg>
                    Universe Map
                  </a>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800/50">
                  <InfoItem label="Visibility" value={visibilityLabel(profile.visibility)} />
                  <InfoItem label="Last Online" value={formatUnix(profile.lastlogoff)} />
                  <InfoItem label="Member Since" value={formatDate(profile.timeCreated)} />
                  <InfoItem label="Location" value={profile.locstatecode || "Unknown"} />
                  <InfoItem label="Games Owned" value={games.length.toString()} />
                  <InfoItem label="Profile State" value={profile.personaState ? "Configured" : "Unknown"} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Playtime Section */}
        <PlaytimeSection games={games} />
      </div>

      {friendsOpen && (
        <FriendsModal onClose={() => setFriendsOpen(false)} />
      )}
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-medium text-slate-200">{value}</p>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 shadow-xl">
        <p className="text-slate-400 text-sm mb-1">{label}</p>
        <p className="text-white font-semibold text-lg">
          {payload[0].value.toLocaleString()} hrs
        </p>
      </div>
    );
  }
  return null;
};

function PlaytimeChart({
  top5,
}: {
  top5: { appid: number; name: string; hours: number }[];
}) {
  return (
    <div className="h-[300px] bg-slate-900/30 rounded-xl border border-slate-800/60 p-6">
      <h3 className="text-sm font-medium text-slate-400 mb-6">Most played (hours)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={top5} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.2)" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: "#64748b", fontSize: 11 }}
            axisLine={{ stroke: "rgba(100,116,139,0.2)" }}
            tickLine={false}
            height={50}
            tickFormatter={(value) => value.length > 12 ? value.substring(0, 12) + "..." : value}
            angle={-15}
            textAnchor="end"
          />
          <YAxis
            tick={{ fill: "#475569", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.05)" }} />
          <Bar dataKey="hours" radius={[4, 4, 0, 0]} fill="url(#barGradient)" />
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#4338ca" />
            </linearGradient>
          </defs>
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
  const { totalHours, top5 } = buildPlaytimeStats(games);

  return (
    <div className="mt-8 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-800/50">
        <div>
          <h2 className="text-2xl font-semibold text-white">Playtime Analytics</h2>
          <p className="text-slate-500 text-sm mt-1">Total gaming statistics across your library</p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-3xl font-bold text-white tabular-nums tracking-tight">
            {totalHours.toLocaleString()}
            <span className="text-lg font-medium text-slate-500 ml-1.5">hrs</span>
          </p>
          <p className="text-xs text-slate-500 uppercase tracking-wider mt-0.5">Total Time Played</p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Games List */}
        <div className="bg-slate-900/30 rounded-xl border border-slate-800/60 p-6">
          <h3 className="text-sm font-medium text-slate-400 mb-6 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            Top 5 Games
          </h3>
          
          <div className="space-y-4">
            {top5.map((game, index) => {
              const maxHours = top5[0].hours;
              const percentage = (game.hours / maxHours) * 100;
              
              return (
                <div key={game.appid} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700">
                        {index + 1}
                      </span>
                      <span className="font-medium text-slate-200 text-sm group-hover:text-white transition-colors">
                        {game.name}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-slate-300 tabular-nums">
                      {game.hours}h
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart */}
        <PlaytimeChart top5={top5} />
      </div>
    </div>
  );
}

function FriendRow({ friend }: { friend: any }) {
  return (
    <a
      href={`/explore?user=${friend.id}`}
      className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/60 border border-slate-800/50 hover:border-slate-700 transition-all group"
    >
      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-800 ring-1 ring-slate-700">
        <img
          src={friend.avatar}
          className="w-full h-full object-cover"
          alt={friend.personaName}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-200 truncate group-hover:text-white transition-colors">
          {friend.personaName}
        </p>
        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
          View profile 
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </p>
      </div>
    </a>
  );
}
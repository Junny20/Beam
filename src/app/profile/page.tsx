'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { buildPlaytimeStats } from '@/data/mockUsers';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Cell,
} from 'recharts';
import Backlogs from './Backlogs';

function formatUnix(ts?: number) {
    if (!ts) return 'Unknown';
    const d = new Date(ts * 1000);
    return d.toLocaleString();
}

function formatDate(ts?: number) {
    if (!ts) return 'Unknown';
    const d = new Date(ts * 1000);
    return d.toLocaleDateString();
}

function personaStateLabel(state?: number) {
    switch (state) {
        case 0:
            return { label: 'Offline', dot: 'bg-gray-500' };
        case 1:
            return { label: 'Online', dot: 'bg-green-500' };
        case 2:
            return { label: 'Busy', dot: 'bg-red-500' };
        case 3:
            return { label: 'Away', dot: 'bg-yellow-500' };
        case 4:
            return { label: 'Snooze', dot: 'bg-yellow-400' };
        case 5:
            return { label: 'Looking to Trade', dot: 'bg-blue-500' };
        case 6:
            return { label: 'Looking to Play', dot: 'bg-purple-500' };
        default:
            return { label: 'Unknown', dot: 'bg-gray-500' };
    }
}

function visibilityLabel(v?: number) {
    // 1 = private, 3 = public (common values)
    if (v === 3) return 'Public';
    if (v === 1) return 'Private';
    return 'Unknown';
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<any>(null);
    const [games, setGames] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log(games);
    }, [games]);

    useEffect(() => {
        const loadProfileAndGames = async () => {
            try {
                // Load profile
                let res = await fetch('/api/profile');

                if (res.status === 401) {
                    window.location.href = '/login';
                    return;
                }

                let data = await res.json();

                if (!data.user?.personaName) {
                    await fetch('/api/steam/sync/profile', { method: 'POST' });
                    res = await fetch('/api/profile');
                    data = await res.json();
                }

                setProfile(data.user);

                // Load owned games
                const gamesRes = await fetch('/api/steam/owned_games');
                if (!gamesRes.ok) {
                    throw new Error('Failed to load owned games');
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
                        <span
                            className={`w-2.5 h-2.5 rounded-full ${status.dot}`}
                        />
                        <span className="text-sm text-white/90">
                            {status.label}
                        </span>
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

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoRow
                            label="Profile Visibility"
                            value={visibilityLabel(profile.visibility)}
                        />

                        <InfoRow
                            label="Last Online"
                            value={formatUnix(profile.lastLogOff)}
                        />
                        <InfoRow
                            label="Account Created"
                            value={`${formatDate(profile.timeCreated)}`}
                        />

                        <InfoRow
                            label="Location"
                            value={profile.locCountryCode}
                        />
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
            <p className="text-xs uppercase tracking-wide text-white/50">
                {label}
            </p>
            <p className="text-white/90 break-words text-xl text-center mt-[10px]">
                {value}
            </p>
        </div>
    );
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-900/95 backdrop-blur-md border border-purple-500/30 rounded-xl p-3 shadow-glow">
                <p className="text-white font-medium text-sm mb-1">{label}</p>
                <p className="text-cyan-400 text-lg font-bold">
                    {payload[0].value} hrs
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
    const barColors = ['#8B5CF6', '#7C3AED', '#06B6D4', '#3B82F6', '#6366F1'];

    return (
        <div className="h-[260px] rounded-xl bg-black/20 border border-white/10 p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-cyan-900/10 pointer-events-none rounded-xl" />

            <p className="text-sm text-white/70 mb-3 font-medium tracking-wide">
                Most played (hours)
            </p>

            <ResponsiveContainer width="100%" height="85%">
                <BarChart
                    data={top5}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.05)"
                        vertical={false}
                    />

                    <XAxis
                        dataKey="name"
                        tick={{
                            fill: '#9CA3AF',
                            fontSize: 11,
                            fontWeight: 500,
                        }}
                        axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                        tickLine={false}
                        height={40}
                        tickFormatter={(value) =>
                            value.length > 15
                                ? value.substring(0, 15) + '...'
                                : value
                        }
                    />

                    <YAxis
                        tick={{ fill: '#6B7280', fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                    />

                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
                    />

                    <Bar
                        dataKey="hours"
                        radius={[6, 6, 0, 0]}
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth={1}
                    >
                        {top5.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={`url(#gradient-${index})`}
                                className="drop-shadow-[0_0_8px_rgba(139,92,246,0.4)]"
                            />
                        ))}
                    </Bar>

                    <defs>
                        {top5.map((_, index) => (
                            <linearGradient
                                key={`gradient-${index}`}
                                id={`gradient-${index}`}
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="0%"
                                    stopColor={barColors[index]}
                                    stopOpacity={1}
                                />
                                <stop
                                    offset="100%"
                                    stopColor={barColors[index]}
                                    stopOpacity={0.6}
                                />
                            </linearGradient>
                        ))}
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
        <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-end justify-between gap-6 mb-6">
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

            {/* TWO COLUMNS: Top 5 on left, Chart on right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* LEFT: Top 5 Games List */}
                <div className="rounded-xl bg-black/20 border border-white/10 p-4 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-blue-500" />

                    <p className="text-sm text-white/70 mb-4 font-medium tracking-wide flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                        Top 5 Games
                    </p>

                    <div className="flex flex-col gap-3">
                        {top5.map((g, i) => {
                            const maxHours = top5[0].hours;
                            const percentage = (g.hours / maxHours) * 100;
                            const rankColors = [
                                'from-yellow-400 to-orange-500',
                                'from-gray-300 to-gray-400',
                                'from-orange-700 to-orange-800',
                                'from-purple-500 to-purple-600',
                                'from-blue-500 to-cyan-500',
                            ];
                            const rankBg = [
                                'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
                                'bg-gray-400/20 text-gray-300 border-gray-400/30',
                                'bg-orange-700/20 text-orange-400 border-orange-700/30',
                                'bg-purple-500/20 text-purple-300 border-purple-500/30',
                                'bg-blue-500/20 text-blue-300 border-blue-500/30',
                            ];

                            return (
                                <div
                                    key={g.appid}
                                    className="group relative flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all duration-300"
                                >
                                    <div
                                        className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold border ${rankBg[i]}`}
                                    >
                                        {i + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <p className="truncate font-medium text-white group-hover:text-cyan-300 transition-colors">
                                                {g.name}
                                            </p>
                                            <span className="text-sm font-bold text-white/90 ml-2">
                                                {g.hours}h
                                            </span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full bg-gradient-to-r ${rankColors[i]} transition-all duration-1000 ease-out group-hover:brightness-110`}
                                                style={{
                                                    width: `${percentage}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-r from-purple-500/5 to-cyan-500/5" />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* RIGHT: Chart */}
                <PlaytimeChart top5={top5} />
            </div>
        </div>
    );
}

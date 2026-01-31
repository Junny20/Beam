'use client';

import React from 'react';
import Image from 'next/image';
import { mockUser, mockGamesOwned, buildPlaytimeStats } from '@/data/mockUsers';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import ghostPfp from '@/public/ghostpfp.jpg';
import { Play } from 'next/font/google';

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

function accountAgeYears(ts?: number) {
    if (!ts) return null;
    const created = new Date(ts * 1000).getTime();
    const now = Date.now();
    const years = (now - created) / (1000 * 60 * 60 * 24 * 365.25);
    return Math.max(0, Math.floor(years));
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

function locationString(user: any) {
    // Steam only gives codes; this keeps it honest without pretending to know the city name.
    const parts = [];
    if (user?.locstatecode && user?.loccountrycode)
        parts.push(`${user.locstatecode}, ${user.loccountrycode}`);
    else if (user?.loccountrycode) parts.push(user.loccountrycode);
    return parts.length ? parts.join(' • ') : 'Not provided';
}

export default function ProfilePage() {
    const status = personaStateLabel(mockUser.personastate);
    const years = accountAgeYears(mockUser.timecreated);

    return (
        <div className="p-6">
            {/* Top card */}
            <div className="flex flex-col md:flex-row gap-8 p-8 rounded-2xl bg-white/5 border border-white/10">
                <div className="shrink-0">
                    <div className="relative w-[200px] h-[200px] rounded-[30px] overflow-hidden border border-white/10">
                        <Image
                            src={ghostPfp || mockUser.avatarfull}
                            alt="User Avatar"
                            fill
                            className="object-cover"
                            sizes="200px"
                            priority
                        />
                    </div>

                    {/* Status badge */}
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
                            {mockUser.personaname}
                        </h1>
                        <p className="text-white/60 text-sm break-all">
                            SteamID: {mockUser.steamid}
                        </p>
                        <div className="flex flex-wrap gap-3 mt-2">
                            {mockUser.profileurl && (
                                <a
                                    href={mockUser.profileurl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-sm"
                                >
                                    View Steam Profile →
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Info grid from GetPlayerSummaries */}
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <InfoRow
                            label="Profile Visibility"
                            value={visibilityLabel(
                                mockUser.communityvisibilitystate,
                            )}
                        />
                        <InfoRow
                            label="Profile State"
                            value={
                                mockUser.profilestate ? 'Configured' : 'Unknown'
                            }
                        />

                        <InfoRow
                            label="Last Online"
                            value={formatUnix(mockUser.lastlogoff)}
                        />
                        <InfoRow
                            label="Account Created"
                            value={`${formatDate(mockUser.timecreated)}${years !== null ? ` • ~${years} years` : ''}`}
                        />

                        <InfoRow
                            label="Location"
                            value={locationString(mockUser)}
                        />
                        <InfoRow
                            label="Primary Clan ID"
                            value={mockUser.primaryclanid || 'None'}
                        />
                    </div>
                </div>
            </div>

            {/* Bottom section (future expansion) */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <PlaytimeSection games={mockGamesOwned} />
                <Panel title="Now Playing (later)">
                    <p className="text-white/60 text-sm">
                        GetPlayerSummaries doesn’t include game name. You can
                        show “In-game” based on personastateflags or integrate
                        other endpoints to display real activity.
                    </p>
                </Panel>

                <Panel title="Recent Activity (later)">
                    <p className="text-white/60 text-sm">
                        Add recent games using GetRecentlyPlayedGames
                        (IPlayerService) once you wire it up.
                    </p>
                </Panel>

                <Panel title="Friends / Social (later)">
                    <p className="text-white/60 text-sm">
                        Add friend list using GetFriendList (ISteamUser) + map
                        IDs back through GetPlayerSummaries.
                    </p>
                </Panel>
            </div>
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

function Panel({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h2 className="text-lg font-semibold">{title}</h2>
            <div className="mt-3">{children}</div>
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
    const { totalHours, top5 } = buildPlaytimeStats(games);

    const max = Math.max(...top5.map((g) => g.hours), 1);

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
                {/* Top 5 list */}
                <div className="rounded-xl bg-black/20 border border-white/10 p-4">
                    <p className="text-sm text-white/70 mb-3">Top 5 Games</p>
                    <div className="flex flex-col gap-3">
                        {top5.map((g, i) => (
                            <div
                                key={g.appid}
                                className="flex items-center justify-between gap-3"
                            >
                                <div className="min-w-0">
                                    <p className="truncate font-medium">
                                        {i + 1}. {g.name}
                                    </p>
                                    <p className="text-xs text-white/60">
                                        {g.appid}
                                    </p>
                                </div>
                                <p className="shrink-0 text-white/90">
                                    {g.hours.toLocaleString()} hrs
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <PlaytimeChart
                    top5={top5.map((g) => ({
                        appid: g.appid,
                        name: g.name ?? 'Unknown',
                        hours: g.hours,
                    }))}
                />
            </div>
        </div>
    );
}

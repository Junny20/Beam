'use client';

import { useMemo, useState } from 'react';
import type { OwnedGame } from '@/data/mockUsers';
import { formatHoursFromMinutes } from '@/lib/backlog';

type SortKey = 'most_hours' | 'least_hours' | 'name';

export default function ColdLibraryTable({ games }: { games: OwnedGame[] }) {
    const [onlyCold, setOnlyCold] = useState(true);
    const [sort, setSort] = useState<SortKey>('most_hours');

    const rows = useMemo(() => {
        const filtered = games.filter((g) => {
            const recent = g.playtime_2weeks ?? 0;
            return onlyCold ? recent === 0 : true;
        });

        const sorted = [...filtered].sort((a, b) => {
            if (sort === 'name')
                return a.name?.localeCompare(b.name ?? '') ?? 0;
            if (sort === 'least_hours')
                return (a.playtime_forever ?? 0) - (b.playtime_forever ?? 0);
            return (b.playtime_forever ?? 0) - (a.playtime_forever ?? 0);
        });

        return sorted;
    }, [games, onlyCold, sort]);

    return (
        <div className="relative overflow-hidden rounded-2xl bg-slate-900/30 border border-slate-800/60 backdrop-blur-xl flex flex-col">
            <div className="p-6 border-b border-slate-800/50">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                            Cold Library
                        </h3>
                        <p className="mt-1 text-sm text-slate-400">
                            No playtime in the last 2 weeks
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-300 cursor-pointer transition-colors">
                            <input
                                type="checkbox"
                                checked={onlyCold}
                                onChange={(e) => setOnlyCold(e.target.checked)}
                                className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-500/20"
                            />
                            Only cold
                        </label>

                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value as SortKey)}
                            className="rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm text-slate-300 outline-none focus:border-indigo-500/50 transition-colors"
                        >
                            <option value="most_hours">Most hours</option>
                            <option value="least_hours">Least hours</option>
                            <option value="name">Name</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                <div className="grid grid-cols-12 bg-slate-900/30 px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider border-b border-slate-800/50">
                    <div className="col-span-6">Game</div>
                    <div className="col-span-3">Total</div>
                    <div className="col-span-3">Status</div>
                </div>

                <div className="max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                    {rows.map((g) => {
                        const recent = g.playtime_2weeks ?? 0;
                        const isCold = recent === 0;
                        return (
                            <div
                                key={g.appid}
                                className="grid grid-cols-12 items-center px-6 py-3 text-sm border-t border-slate-800/30 hover:bg-slate-800/20 transition-colors"
                            >
                                <div className="col-span-6 truncate text-slate-300 font-medium">
                                    {g.name}
                                </div>
                                <div className="col-span-3 text-slate-400 tabular-nums">
                                    {formatHoursFromMinutes(
                                        g.playtime_forever ?? 0,
                                    )}
                                </div>
                                <div className="col-span-3">
                                    <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs border ${
                                            isCold
                                                ? 'border-slate-700 bg-slate-900/50 text-slate-400'
                                                : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                                        }`}
                                    >
                                        <span
                                            className={`mr-2 h-1.5 w-1.5 rounded-full ${isCold ? 'bg-slate-500' : 'bg-emerald-400 animate-pulse'}`}
                                        />
                                        {isCold ? 'Cold' : 'Active'}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

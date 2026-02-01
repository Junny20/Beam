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
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2 className="text-lg font-semibold">Cold Library</h2>
                    <p className="mt-1 text-sm text-white/70">
                        “Cold” ={' '}
                        <span className="text-white">
                            no playtime in the last 2 weeks
                        </span>
                        .
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm text-white/80">
                        <input
                            type="checkbox"
                            checked={onlyCold}
                            onChange={(e) => setOnlyCold(e.target.checked)}
                            className="h-4 w-4 rounded border-white/20 bg-transparent"
                        />
                        Only cold
                    </label>

                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value as SortKey)}
                        className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none"
                    >
                        <option value="most_hours">Most hours</option>
                        <option value="least_hours">Least hours</option>
                        <option value="name">Name</option>
                    </select>
                </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
                <div className="grid grid-cols-12 bg-black/20 px-4 py-2 text-xs text-white/70">
                    <div className="col-span-6">Game</div>
                    <div className="col-span-3">Total</div>
                    <div className="col-span-3">Status</div>
                </div>

                <div className="max-h-[360px] overflow-auto">
                    {rows.map((g) => {
                        const recent = g.playtime_2weeks ?? 0;
                        const isCold = recent === 0;
                        return (
                            <div
                                key={g.appid}
                                className="grid grid-cols-12 items-center px-4 py-3 text-sm border-t border-white/10"
                            >
                                <div className="col-span-6 truncate">
                                    {g.name}
                                </div>
                                <div className="col-span-3 text-white/80">
                                    {formatHoursFromMinutes(
                                        g.playtime_forever ?? 0,
                                    )}
                                </div>
                                <div className="col-span-3">
                                    <span
                                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs border ${
                                            isCold
                                                ? 'border-white/15 bg-white/10 text-white/80'
                                                : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                                        }`}
                                    >
                                        <span
                                            className={`mr-2 h-1.5 w-1.5 rounded-full ${isCold ? 'bg-white/50' : 'bg-emerald-300'}`}
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

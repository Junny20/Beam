import type { OwnedGame } from '@/data/mockUsers';
import { formatHoursFromMinutes } from '@/lib/backlog';

export default function AbandonedGamesCard({ games }: { games: OwnedGame[] }) {
    const top = games.slice(0, 10);

    return (
        <div className="relative overflow-hidden rounded-2xl bg-slate-900/30 border border-slate-800/60 backdrop-blur-xl flex flex-col h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent" />

            <div className="relative p-6 border-b border-slate-800/50 flex items-start justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        Abandoned Starts
                    </h3>
                    <p className="mt-1 text-sm text-slate-400">
                        Started but no activity in 2 weeks
                    </p>
                </div>
                <span className="rounded-full border border-slate-700 bg-slate-900/50 px-3 py-1 text-sm font-medium text-slate-400">
                    {games.length} found
                </span>
            </div>

            <div className="relative flex-1 overflow-y-auto max-h-[320px] p-6 space-y-3 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {top.length === 0 ? (
                    <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 p-4 text-sm text-slate-500 text-center">
                        No abandoned games detected, nice!
                    </div>
                ) : (
                    top.map((g) => (
                        <div
                            key={g.appid}
                            className="flex items-center justify-between rounded-xl border border-slate-800/50 bg-slate-900/30 px-4 py-3 hover:bg-slate-800/30 transition-colors group"
                        >
                            <div className="min-w-0">
                                <p className="truncate font-medium text-slate-300 group-hover:text-white transition-colors">
                                    {g.name}
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Total:{' '}
                                    <span className="text-slate-400 tabular-nums">
                                        {formatHoursFromMinutes(
                                            g.playtime_forever ?? 0,
                                        )}
                                    </span>
                                    {' • '}
                                    <span className="text-amber-500/70">
                                        No recent activity
                                    </span>
                                </p>
                            </div>
                            <button className="ml-4 rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all">
                                Revisit
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

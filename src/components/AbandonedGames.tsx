import type { OwnedGame } from '@/data/mockUsers';
import { formatHoursFromMinutes } from '@/lib/backlog';

export default function AbandonedGamesCard({ games }: { games: OwnedGame[] }) {
    const top = games.slice(0, 10);

    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-lg font-semibold">Abandoned Starts</h2>
                    <p className="mt-1 text-sm text-white/70">
                        Started (0.5–5h) but no activity in the last 2 weeks.
                    </p>
                </div>
                <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-sm text-white/80">
                    {games.length} found
                </span>
            </div>

            <div className="mt-4 space-y-2">
                {top.length === 0 ? (
                    <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
                        No abandoned games detected — nice.
                    </div>
                ) : (
                    top.map((g) => (
                        <div
                            key={g.appid}
                            className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3"
                        >
                            <div className="min-w-0">
                                <p className="truncate font-medium">{g.name}</p>
                                <p className="text-xs text-white/70">
                                    Total:{' '}
                                    {formatHoursFromMinutes(
                                        g.playtime_forever ?? 0,
                                    )}{' '}
                                    • Last 2 weeks: 0h
                                </p>
                            </div>
                            <button className="ml-4 rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-xs text-white/80 hover:bg-white/15">
                                Revisit
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

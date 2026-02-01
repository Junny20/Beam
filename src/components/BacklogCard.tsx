import type { BacklogTotals } from '@/lib/backlog';

export default function BacklogOverviewCard({
    totals,
}: {
    totals: BacklogTotals;
}) {
    const segments = [
        { label: 'Never played', pct: totals.neverPct },
        { label: '< 2h sampled', pct: totals.sampledPct },
        { label: '2–10h mid', pct: totals.midPct },
        { label: '10h+ committed', pct: totals.committedPct },
    ];

    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-start justify-between gap-6">
                <div>
                    <h2 className="text-lg font-semibold">Backlog Snapshot</h2>
                    <p className="mt-1 text-sm text-white/70">
                        You’ve meaningfully played{' '}
                        <span className="font-semibold text-white">
                            {totals.meaningfulPlayedPct.toFixed(0)}%
                        </span>{' '}
                        of your library.
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-sm text-white/70">Total hours</p>
                    <p className="text-2xl font-semibold">
                        {totals.totalHours.toFixed(0)}h
                    </p>
                    <p className="text-sm text-white/70">
                        {totals.totalGames} games
                    </p>
                </div>
            </div>

            {/* stacked bar */}
            <div className="mt-5">
                <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="flex h-full w-full">
                        {segments.map((s) => (
                            <div
                                key={s.label}
                                className="h-full bg-white/30"
                                style={{ width: `${Math.max(0, s.pct)}%` }}
                                title={`${s.label}: ${s.pct.toFixed(1)}%`}
                            />
                        ))}
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <Stat
                        label="Never played"
                        value={`${totals.never}`}
                        sub={`${totals.neverPct.toFixed(0)}%`}
                    />
                    <Stat
                        label="< 2h sampled"
                        value={`${totals.sampled}`}
                        sub={`${totals.sampledPct.toFixed(0)}%`}
                    />
                    <Stat
                        label="2–10h mid"
                        value={`${totals.mid}`}
                        sub={`${totals.midPct.toFixed(0)}%`}
                    />
                    <Stat
                        label="10h+ committed"
                        value={`${totals.committed}`}
                        sub={`${totals.committedPct.toFixed(0)}%`}
                    />
                </div>
            </div>
        </div>
    );
}

function Stat({
    label,
    value,
    sub,
}: {
    label: string;
    value: string;
    sub: string;
}) {
    return (
        <div className="rounded-xl border border-white/10 bg-black/20 p-3">
            <p className="text-xs text-white/70">{label}</p>
            <p className="mt-1 text-lg font-semibold">{value}</p>
            <p className="text-xs text-white/70">{sub}</p>
        </div>
    );
}

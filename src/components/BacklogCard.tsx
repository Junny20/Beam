import type { BacklogTotals } from '@/lib/backlog';

export default function BacklogOverviewCard({
    totals,
}: {
    totals: BacklogTotals;
}) {
    const segments = [
        {
            label: 'Never played',
            pct: totals.neverPct,
            color: 'bg-slate-600',
            textColor: 'text-slate-400',
        },
        {
            label: '< 2h sampled',
            pct: totals.sampledPct,
            color: 'bg-indigo-400',
            textColor: 'text-indigo-300',
        },
        {
            label: '2–10h mid',
            pct: totals.midPct,
            color: 'bg-indigo-500',
            textColor: 'text-indigo-400',
        },
        {
            label: '10h+ committed',
            pct: totals.committedPct,
            color: 'bg-indigo-600',
            textColor: 'text-indigo-500',
        },
    ];

    return (
        <div className="relative overflow-hidden rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-sky-500/5" />

            <div className="relative p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div>
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                            Backlog Snapshot
                        </h3>
                        <p className="mt-2 text-sm text-slate-400">
                            You’ve meaningfully played{' '}
                            <span className="font-semibold text-indigo-400">
                                {totals.meaningfulPlayedPct.toFixed(0)}%
                            </span>{' '}
                            of your library.
                        </p>
                    </div>
                </div>

                <div className="mt-6">
                    <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800/50 flex">
                        {segments.map((s) => (
                            <div
                                key={s.label}
                                className={`h-full ${s.color} transition-all duration-500`}
                                style={{ width: `${Math.max(0, s.pct)}%` }}
                                title={`${s.label}: ${s.pct.toFixed(1)}%`}
                            />
                        ))}
                    </div>

                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {segments.map((s) => (
                            <div
                                key={s.label}
                                className="rounded-xl bg-slate-900/30 border border-slate-800/50 p-4 hover:bg-slate-800/30 transition-colors"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <div
                                        className={`w-2 h-2 rounded-full ${s.color}`}
                                    />
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        {s.label}
                                    </p>
                                </div>
                                <p
                                    className={`text-2xl font-bold ${s.textColor} tabular-nums`}
                                >
                                    {
                                        totals[
                                            s.label
                                                .toLowerCase()
                                                .replace(
                                                    /[< ]/g,
                                                    '',
                                                ) as keyof BacklogTotals
                                        ] as number
                                    }
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    {s.pct.toFixed(0)}%
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

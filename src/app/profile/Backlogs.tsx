import { analyzeLibrary } from '@/lib/backlog';
import BacklogOverviewCard from '@/components/BacklogCard';
import ColdLibraryTable from '@/components/ColdLibraryTable';
import AbandonedGamesCard from '@/components/AbandonedGames';

type OwnedGame = {
    appid: number;
    name?: string;
    playtime_forever: number;
    playtime_2weeks?: number;
};

// Backlogs.tsx
export default function Backlogs({ games }: { games: OwnedGame[] }) {
    const analysis = analyzeLibrary(games);

    return (
        <div className="mt-8 space-y-6">
            <div className="flex flex-col gap-2 pb-4 border-b border-slate-800/50">
                <h2 className="text-2xl font-semibold text-white">
                    Backlog Awareness
                </h2>
                <p className="text-slate-500 text-sm">
                    Turning your library into clear, actionable categories.
                </p>
            </div>

            <BacklogOverviewCard totals={analysis.totals} />

            <div className="grid gap-6 lg:grid-cols-2">
                <AbandonedGamesCard games={analysis.abandoned} />
                <ColdLibraryTable games={games} />
            </div>
        </div>
    );
}

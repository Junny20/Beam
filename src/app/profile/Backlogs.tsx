import type { OwnedGame } from '@/data/mockUsers';
import { analyzeLibrary } from '@/lib/backlog';
import BacklogOverviewCard from '@/components/BacklogCard';
import ColdLibraryTable from '@/components/ColdLibraryTable';
import AbandonedGamesCard from '@/components/AbandonedGames';

export default function Backlogs(gamesProp?: typeof OwnedGame) {
    const analysis = analyzeLibrary(gamesProp ?? mockOwnedGames);

    return (
        <div className="min-h-screen bg-[#0B0F19] text-white">
            <div className="mx-auto max-w-6xl px-6 py-10">
                <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">
                            Backlog Awareness
                        </h1>
                        <p className="mt-1 text-sm text-white/70">
                            Turning your library into clear, actionable
                            categories.
                        </p>
                    </div>
                    <div className="text-sm text-white/70">
                        Demo data (swap to Steam later)
                    </div>
                </header>

                <div className="mt-6 grid gap-6">
                    <BacklogOverviewCard totals={analysis.totals} />

                    <div className="grid gap-6 lg:grid-cols-2">
                        <AbandonedGamesCard games={analysis.abandoned} />
                        <ColdLibraryTable games={mockOwnedGames} />
                    </div>
                </div>
            </div>
        </div>
    );
}

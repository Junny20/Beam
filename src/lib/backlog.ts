import type { OwnedGame } from '@/data/mockUsers';

const SAMPLED_MAX = 120; // < 2 hours
const ABANDONED_MIN = 30; // >= 0.5 hours
const ABANDONED_MAX = 300; // <= 5 hours
const COMMITTED_MIN = 600; // >= 10 hours

export type BacklogTotals = {
    totalGames: number;
    totalHours: number;
    never: number;
    sampled: number;
    mid: number;
    committed: number;
    neverPct: number;
    sampledPct: number;
    midPct: number;
    committedPct: number;
    meaningfulPlayedPct: number; // >= 2 hours
};

export type BacklogAnalysis = {
    totals: BacklogTotals;
    cold: OwnedGame[]; // recent=0
    abandoned: OwnedGame[]; // started 0.5–5h, recent=0
};

const pct = (n: number, d: number) => (d ? (n / d) * 100 : 0);

export function analyzeLibrary(games: OwnedGame[]): BacklogAnalysis {
    let never = 0,
        sampled = 0,
        mid = 0,
        committed = 0;
    let totalMinutes = 0;

    const cold: OwnedGame[] = [];
    const abandoned: OwnedGame[] = [];

    for (const g of games) {
        const total = g.playtime_forever ?? 0;
        const recent = g.playtime_2weeks ?? 0;
        totalMinutes += total;

        if (total === 0) never++;
        else if (total < SAMPLED_MAX) sampled++;
        else if (total >= COMMITTED_MIN) committed++;
        else mid++;

        if (recent === 0) cold.push(g);

        if (recent === 0 && total >= ABANDONED_MIN && total <= ABANDONED_MAX) {
            abandoned.push(g);
        }
    }

    cold.sort((a, b) => (b.playtime_forever ?? 0) - (a.playtime_forever ?? 0));
    abandoned.sort(
        (a, b) => (b.playtime_forever ?? 0) - (a.playtime_forever ?? 0),
    );

    const totalGames = games.length;
    const meaningfulPlayed = totalGames - never - sampled;

    return {
        totals: {
            totalGames,
            totalHours: totalMinutes / 60,
            never,
            sampled,
            mid,
            committed,
            neverPct: pct(never, totalGames),
            sampledPct: pct(sampled, totalGames),
            midPct: pct(mid, totalGames),
            committedPct: pct(committed, totalGames),
            meaningfulPlayedPct: pct(meaningfulPlayed, totalGames),
        },
        cold,
        abandoned,
    };
}

export function formatHoursFromMinutes(mins: number) {
    const hours = mins / 60;
    return hours >= 10 ? `${hours.toFixed(0)}h` : `${hours.toFixed(1)}h`;
}

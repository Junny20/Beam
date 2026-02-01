export interface User {
    steamid: string;
    communityvisibilitystate: number;
    profilestate: number;
    personaname: string;
    profileurl: string;
    avatar: string;
    avatarmedium: string;
    avatarfull: string;
    avatarhash: string;
    lastlogoff: number;
    personastate: number;
    primaryclanid: string;
    timecreated: number;
    personastateflags: number;
    loccountrycode: string;
    locstatecode: string;
    loccityid: number;
}

export type OwnedGame = {
    appid: number;
    name?: string;
    playtime_forever: number;
    playtime_2weeks?: number;
};

export function buildPlaytimeStats(
    games: { appid: number; name: string; playtime_forever: number }[],
) {
    const withHours = games.map((g) => ({
        appid: g.appid,
        name: g.name,
        hours: Math.floor(g.playtime_forever / 60),
    }));

    const totalHours = withHours.reduce((sum, g) => sum + g.hours, 0);

    const top5 = withHours
        .filter((g) => g.hours > 0)
        .sort((a, b) => b.hours - a.hours)
        .slice(0, 5);

    return { totalHours, top5 };
}

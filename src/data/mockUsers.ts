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

export const mockUser: User = {
    steamid: '76561198000000001',
    communityvisibilitystate: 3,
    profilestate: 1,
    personaname: 'ghost_runner',
    profileurl: 'https://steamcommunity.com/id/ghost_runner/',
    avatar: 'https://www.vecteezy.com/free-vector/cute-ghost',
    avatarmedium: 'https://www.vecteezy.com/free-vector/cute-ghost',
    avatarfull: '/ghostpfp.jpg',
    avatarhash: 'abc123def456',
    lastlogoff: 1706661200,
    personastate: 3,
    primaryclanid: '103582791429521412',
    timecreated: 1508451200,
    personastateflags: 0,
    loccountrycode: 'US',
    locstatecode: 'CA',
    loccityid: 3961,
};

export const mockGamesOwned = [
    { appid: 730, name: 'Counter-Strike 2', playtime_forever: 12345 },
    { appid: 570, name: 'Dota 2', playtime_forever: 8040 },
    { appid: 440, name: 'Team Fortress 2', playtime_forever: 2400 },
    { appid: 271590, name: 'GTA V', playtime_forever: 1800 },
    { appid: 1091500, name: 'Cyberpunk 2077', playtime_forever: 920 },
    { appid: 945360, name: 'Among Us', playtime_forever: 260 },
];

export type OwnedGame = {
    appid: number;
    name?: string;
    playtime_forever: number;
    playtime_2weeks?: number;
};

export function buildPlaytimeStats(games: OwnedGame[]) {
    const withHours = games.map((g) => ({
        ...g,
        hours: Math.round((g.playtime_forever / 60) * 10) / 10,
    }));

    const totalHours =
        Math.round(
            (withHours.reduce((sum, g) => sum + g.hours, 0) + Number.EPSILON) *
                10,
        ) / 10;

    const top5 = [...withHours].sort((a, b) => b.hours - a.hours).slice(0, 5);

    return { totalHours, top5 };
}

export const mockOwnedGames: OwnedGame[] = [
    {
        appid: 730,
        name: 'Counter-Strike 2',
        playtime_forever: 24000,
        playtime_2weeks: 900,
    },
    {
        appid: 1245620,
        name: 'Elden Ring',
        playtime_forever: 18720,
        playtime_2weeks: 0,
    },
    {
        appid: 1145360,
        name: 'Hades',
        playtime_forever: 5400,
        playtime_2weeks: 120,
    },
    {
        appid: 1086940,
        name: "Baldur's Gate 3",
        playtime_forever: 11184,
        playtime_2weeks: 0,
    },
    { appid: 620, name: 'Portal 2', playtime_forever: 95, playtime_2weeks: 0 }, 
    {
        appid: 252950,
        name: 'Rocket League',
        playtime_forever: 210,
        playtime_2weeks: 0,
    }, // abandoned candidate
    { appid: 570, name: 'Dota 2', playtime_forever: 0 },
    { appid: 271590, name: 'GTA V', playtime_forever: 45, playtime_2weeks: 0 }, // abandoned candidate
    {
        appid: 1091500,
        name: 'Cyberpunk 2077',
        playtime_forever: 800,
        playtime_2weeks: 0,
    },
    {
        appid: 377160,
        name: 'Fallout 4',
        playtime_forever: 1200,
        playtime_2weeks: 0,
    },
];

export interface Game {
    id: number;
    name: string;
    playtime: number;
    recentHours: number;
    genre: string;
    lastPlayed: string;
    achievements: {
        unlocked: number;
        total: number;
        rarest: {
            name: string;
            percent: number;
        };
    };
    topPercentile: number;
    color: string;
    icon: string;
}

export interface Friend {
    id: number;
    name: string;
    avatar: string;
    status: 'online' | 'offline' | 'playing';
    currentGame?: string;
    playtime?: number;
}

export interface GhostGame {
    id: number;
    name: string;
    genre: string;
    color: string;
    reason: string;
    playerCount: string;
}

// Ghost games for discovery
export const ghostGames: GhostGame[] = [
    {
        id: 101,
        name: 'Lethal Company',
        genre: 'Indie',
        color: '#84CC16',
        reason: 'Popular among your friends',
        playerCount: '89.2K',
    },
    {
        id: 102,
        name: 'Palworld',
        genre: 'Adventure',
        color: '#6366F1',
        reason: 'Trending worldwide',
        playerCount: '234.5K',
    },
    {
        id: 103,
        name: 'Helldivers 2',
        genre: 'Action',
        color: '#F59E0B',
        reason: 'Popular in your region',
        playerCount: '156.8K',
    },
    {
        id: 104,
        name: 'Slay the Spire',
        genre: 'Strategy',
        color: '#06B6D4',
        reason: 'Similar to games you play',
        playerCount: '23.4K',
    },
];

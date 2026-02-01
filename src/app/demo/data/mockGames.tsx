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

// Genre color mapping
export const genreColors: Record<string, string> = {
    RPG: '#8B5CF6',
    Roguelike: '#EF4444',
    Action: '#F59E0B',
    Metroidvania: '#3B82F6',
    Platformer: '#EC4899',
    Puzzle: '#10B981',
    Strategy: '#06B6D4',
    FPS: '#F97316',
    Indie: '#84CC16',
    Adventure: '#6366F1',
};

// Mock game data for the universe
export const gameData: Game[] = [
    {
        id: 1,
        name: "Baldur's Gate 3",
        playtime: 342,
        recentHours: 45,
        genre: 'RPG',
        lastPlayed: '2 days ago',
        achievements: {
            unlocked: 47,
            total: 54,
            rarest: { name: 'Legend of the Sword Coast', percent: 2.3 },
        },
        topPercentile: 5,
        color: '#8B5CF6',
        icon: 'BG3',
    },
    {
        id: 2,
        name: 'Hades II',
        playtime: 127,
        recentHours: 28,
        genre: 'Roguelike',
        lastPlayed: '1 day ago',
        achievements: {
            unlocked: 23,
            total: 35,
            rarest: { name: 'God Slayer', percent: 0.7 },
        },
        topPercentile: 12,
        color: '#EF4444',
        icon: 'H2',
    },
    {
        id: 3,
        name: 'Elden Ring',
        playtime: 289,
        recentHours: 5,
        genre: 'Action',
        lastPlayed: '2 weeks ago',
        achievements: {
            unlocked: 31,
            total: 42,
            rarest: { name: 'Elden Lord', percent: 5.1 },
        },
        topPercentile: 23,
        color: '#F59E0B',
        icon: 'ER',
    },
    {
        id: 4,
        name: 'Hollow Knight',
        playtime: 156,
        recentHours: 0,
        genre: 'Metroidvania',
        lastPlayed: '1 month ago',
        achievements: {
            unlocked: 52,
            total: 63,
            rarest: { name: 'Embrace the Void', percent: 1.2 },
        },
        topPercentile: 8,
        color: '#3B82F6',
        icon: 'HK',
    },
    {
        id: 5,
        name: 'Celeste',
        playtime: 43,
        recentHours: 2,
        genre: 'Platformer',
        lastPlayed: '3 weeks ago',
        achievements: {
            unlocked: 28,
            total: 30,
            rarest: { name: 'Farewell', percent: 3.8 },
        },
        topPercentile: 15,
        color: '#EC4899',
        icon: 'CL',
    },
    {
        id: 6,
        name: 'Portal 2',
        playtime: 78,
        recentHours: 0,
        genre: 'Puzzle',
        lastPlayed: '3 months ago',
        achievements: {
            unlocked: 48,
            total: 51,
            rarest: { name: 'Still Alive', percent: 8.2 },
        },
        topPercentile: 18,
        color: '#10B981',
        icon: 'P2',
    },
    {
        id: 7,
        name: 'The Witcher 3',
        playtime: 456,
        recentHours: 12,
        genre: 'RPG',
        lastPlayed: '5 days ago',
        achievements: {
            unlocked: 62,
            total: 78,
            rarest: { name: 'Collect Em All', percent: 4.5 },
        },
        topPercentile: 9,
        color: '#8B5CF6',
        icon: 'TW3',
    },
    {
        id: 8,
        name: 'Risk of Rain 2',
        playtime: 67,
        recentHours: 18,
        genre: 'Roguelike',
        lastPlayed: '3 days ago',
        achievements: {
            unlocked: 35,
            total: 47,
            rarest: { name: 'Deicide', percent: 1.8 },
        },
        topPercentile: 14,
        color: '#EF4444',
        icon: 'ROR2',
    },
    {
        id: 9,
        name: 'Counter-Strike 2',
        playtime: 492,
        recentHours: 32,
        genre: 'FPS',
        lastPlayed: '5 hours ago',
        achievements: {
            unlocked: 124,
            total: 167,
            rarest: { name: 'Global Elite', percent: 0.8 },
        },
        topPercentile: 3,
        color: '#F97316',
        icon: 'CS2',
    },
    {
        id: 10,
        name: 'Hades',
        playtime: 234,
        recentHours: 0,
        genre: 'Roguelike',
        lastPlayed: '2 months ago',
        achievements: {
            unlocked: 49,
            total: 49,
            rarest: { name: 'Platinum', percent: 2.1 },
        },
        topPercentile: 7,
        color: '#EF4444',
        icon: 'HD',
    },
    {
        id: 11,
        name: 'Stardew Valley',
        playtime: 178,
        recentHours: 8,
        genre: 'Indie',
        lastPlayed: '1 week ago',
        achievements: {
            unlocked: 38,
            total: 40,
            rarest: { name: 'Master Angler', percent: 4.2 },
        },
        topPercentile: 11,
        color: '#84CC16',
        icon: 'SDV',
    },
    {
        id: 12,
        name: 'God of War',
        playtime: 67,
        recentHours: 0,
        genre: 'Action',
        lastPlayed: '4 months ago',
        achievements: {
            unlocked: 28,
            total: 37,
            rarest: { name: 'Give Me God of War', percent: 3.5 },
        },
        topPercentile: 22,
        color: '#F59E0B',
        icon: 'GOW',
    },
];

// Mock friends data
export const friendsData: Friend[] = [
    {
        id: 1,
        name: 'CosmicExplorer',
        avatar: 'CE',
        status: 'playing',
        currentGame: "Baldur's Gate 3",
        playtime: 342,
    },
    {
        id: 2,
        name: 'SteamWizard',
        avatar: 'SW',
        status: 'online',
        currentGame: 'Hades II',
        playtime: 89,
    },
    {
        id: 3,
        name: 'GalaxyMapper',
        avatar: 'GM',
        status: 'offline',
        playtime: 156,
    },
    {
        id: 4,
        name: 'AchievementHunter',
        avatar: 'AH',
        status: 'playing',
        currentGame: 'Elden Ring',
        playtime: 289,
    },
    {
        id: 5,
        name: 'GameCollector',
        avatar: 'GC',
        status: 'online',
        playtime: 78,
    },
    {
        id: 6,
        name: 'PixelPioneer',
        avatar: 'PP',
        status: 'offline',
        playtime: 45,
    },
];

// Ghost games for discovery (games not owned but recommended)
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

// Get friends who own a specific game
export function getFriendsWhoOwnGame(_gameId: number): Friend[] {
    // Mock: return random subset of friends
    const shuffled = [...friendsData].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.floor(Math.random() * 4) + 1);
}

// Get friends who played recently
export function getFriendsWhoPlayedRecently(_gameId: number): Friend[] {
    return friendsData.filter(
        (f) => f.status === 'playing' || f.status === 'online',
    );
}

// Calculate node properties
export function calculateNodeProperties(game: Game) {
    const maxPlaytime = Math.max(...gameData.map((g) => g.playtime));
    const maxRecent = Math.max(...gameData.map((g) => g.recentHours));

    // Size based on total playtime (0.4 to 1.5)
    const size = 0.4 + (game.playtime / maxPlaytime) * 0.6;

    // Glow intensity based on recent activity (0 to 1)
    const glowIntensity = maxRecent > 0 ? game.recentHours / maxRecent : 0;

    // Orbit distance based on return frequency
    const daysSinceLastPlayed = game.lastPlayed.includes('hour')
        ? 0
        : game.lastPlayed.includes('day')
          ? parseInt(game.lastPlayed.split(' ')[0])
          : game.lastPlayed.includes('week')
            ? parseInt(game.lastPlayed.split(' ')[0]) * 7
            : game.lastPlayed.includes('month')
              ? parseInt(game.lastPlayed.split(' ')[0]) * 30
              : 90;

    const orbitDistance = 2.5 + (daysSinceLastPlayed / 90) * 5;

    return { size, glowIntensity, orbitDistance };
}

export interface GameGraphNode {
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


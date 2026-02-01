import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import type { GameGraphNode } from '@/lib/graph/types';
import { calculateNodeProperties } from '@/lib/graph/calculateNodeProperties';

import {
    Trophy,
    Clock,
    Calendar,
    Target,
    Zap,
    Star,
    TrendingUp,
    X,
} from 'lucide-react';
import { formatDate } from '@/lib/graph/formatDate';

interface GameDetailPanelProps {
    game: GameGraphNode | null;
    onClose: () => void;
}

export default function GameDetailPanel({
    game,
    onClose,
}: GameDetailPanelProps) {
    const panelRef = useRef<HTMLDivElement>(null);
    const { size, glowIntensity } = game
        ? calculateNodeProperties(game)
        : { size: 0, glowIntensity: 0 };

    useEffect(() => {
        if (game && panelRef.current) {
            gsap.fromTo(
                panelRef.current,
                { opacity: 0, scale: 0.9, y: 20 },
                {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.4,
                    ease: 'power3.out',
                },
            );
        }
    }, [game]);

    const handleClose = () => {
        if (panelRef.current) {
            gsap.to(panelRef.current, {
                opacity: 0,
                scale: 0.95,
                duration: 0.3,
                ease: 'power3.in',
                onComplete: onClose,
            });
        } else {
            onClose();
        }
    };

    if (!game) return null;

    return (
        <div className="absolute inset-0 flex justify-center overflow-y-auto bg-black/70 backdrop-blur-sm z-50 p-6">
            <div
                ref={panelRef}
                className="bg-bg-darker border border-purple-secondary/40 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col mt-12"
            >
                <div
                    className="relative p-6 pb-4"
                    style={{
                        background: `linear-gradient(135deg, ${game.color}20 0%, transparent 60%)`,
                    }}
                >
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-5">
                        <div
                            className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg"
                            style={{
                                backgroundColor: game.color,
                                color: '#fff',
                            }}
                        >
                            {game.icon ? (
                                <img
                                    src={game.icon}
                                    alt={game.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-white font-bold">
                                    {game.name[0]}
                                </span>
                            )}
                        </div>
                        <div>
                            <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
                                {game.name}
                            </h2>
                            <div className="flex items-center gap-3 mt-1">
                                <span
                                    className="px-3 py-1 rounded-full text-xs font-medium"
                                    style={{
                                        backgroundColor: `${game.color}30`,
                                        color: game.color,
                                    }}
                                >
                                    {game.genre}
                                </span>
                                {glowIntensity > 0.5 && (
                                    <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-success/20 text-success text-xs">
                                        <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                                        Recently Active
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 pt-4 space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-purple-primary/20 rounded-xl p-4 text-center">
                            <Clock className="w-6 h-6 text-purple-secondary mx-auto mb-2" />
                            <p className="text-2xl font-display font-bold text-white">
                                {game.playtime.toFixed(1)}
                            </p>
                            <p className="text-xs text-gray-400">Total Hours</p>
                        </div>
                        <div className="bg-purple-primary/20 rounded-xl p-4 text-center">
                            <Zap className="w-6 h-6 text-purple-secondary mx-auto mb-2" />
                            <p className="text-2xl font-display font-bold text-white">
                                {game.recentHours}
                            </p>
                            <p className="text-xs text-gray-400">
                                Last 2 Weeks
                            </p>
                        </div>
                        <div className="bg-purple-primary/20 rounded-xl p-4 text-center">
                            <Trophy className="w-6 h-6 text-purple-secondary mx-auto mb-2" />
                            <p className="text-2xl font-display font-bold text-white">
                                {game.achievements.unlocked}/
                                {game.achievements.total}
                            </p>
                            <p className="text-xs text-gray-400">
                                Achievements
                            </p>
                        </div>
                        <div className="bg-purple-primary/20 rounded-xl p-4 text-center">
                            <TrendingUp className="w-6 h-6 text-purple-light mx-auto mb-2" />
                            <p className="text-2xl font-display font-bold text-purple-light">
                                Top {game.topPercentile}%
                            </p>
                            <p className="text-xs text-gray-400">of Players</p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-yellow-500/20 border border-yellow-500/30 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                                <Star className="w-5 h-5 text-yellow-400" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-yellow-400">
                                    Rarest Achievement
                                </p>
                                <p className="text-lg font-display font-bold text-white">
                                    {game.achievements.rarest.name}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-400">
                                Only{' '}
                                <span className="text-yellow-400 font-semibold">
                                    {game.achievements.rarest.percent}%
                                </span>{' '}
                                of players have unlocked this
                            </span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-purple-dark/40 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Calendar className="w-4 h-4 text-purple-secondary" />
                                <span className="text-sm font-medium text-gray-300">
                                    Last Played
                                </span>
                            </div>
                            <p className="text-white font-display">
                                {formatDate(game.lastPlayed)}
                            </p>
                        </div>

                        <div className="bg-purple-dark/40 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Target className="w-4 h-4 text-purple-secondary" />
                                <span className="text-sm font-medium text-gray-300">
                                    Completion Rate
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-purple-dark rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{
                                            width: `${(game.achievements.unlocked / game.achievements.total) * 100}%`,
                                            backgroundColor: game.color,
                                        }}
                                    />
                                </div>
                                <span className="text-sm text-white">
                                    {Math.round(
                                        (game.achievements.unlocked /
                                            game.achievements.total) *
                                            100,
                                    )}
                                    %
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-purple-dark/30 rounded-xl p-4">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
                            Node Universe Properties
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span
                                className="px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5"
                                style={{
                                    backgroundColor: `${game.color}20`,
                                    color: game.color,
                                }}
                            >
                                <span
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{ backgroundColor: game.color }}
                                />
                                Size: {size.toFixed(2)}x (Playtime)
                            </span>
                            <span className="px-3 py-1.5 rounded-full bg-purple-primary/30 text-xs text-purple-light flex items-center gap-1.5">
                                <span
                                    className={`w-1.5 h-1.5 rounded-full ${glowIntensity > 0.3 ? 'bg-success animate-pulse' : 'bg-gray-500'}`}
                                />
                                Activity: {(glowIntensity * 100).toFixed(0)}%
                            </span>
                            <span
                                className="px-3 py-1.5 rounded-full text-xs font-medium"
                                style={{
                                    backgroundColor: `${game.color}20`,
                                    color: game.color,
                                }}
                            >
                                {game.genre} Cluster
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            className="flex-1 py-3 px-6 rounded-xl font-medium transition-all hover:scale-[1.02]"
                            style={{
                                backgroundColor: game.color,
                                color: '#fff',
                            }}
                        >
                            Launch Game
                        </button>
                        <button className="px-6 py-3 rounded-xl bg-purple-dark/50 text-white font-medium hover:bg-purple-dark/70 transition-colors">
                            View on Steam
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

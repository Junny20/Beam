'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Link from 'next/link';

// Types
interface ChatMessage {
    id: string;
    type: 'discovery' | 'achievement' | 'leaderboard' | 'expansion' | 'playful';
    text: string;
    timestamp: Date;
}

interface UniverseStat {
    game: string;
    hours: number;
    achievement: string;
    rarity: string;
    playstyle: string;
}

// Data
const MOCK_STATS: UniverseStat[] = [
    {
        game: 'Hades II',
        hours: 127,
        achievement: 'Trials of the Gods',
        rarity: '3.2%',
        playstyle: 'Speedrunner',
    },
    {
        game: 'Lethal Company',
        hours: 89,
        achievement: 'Employee of the Month',
        rarity: '12.5%',
        playstyle: 'Team Player',
    },
    {
        game: "Baldur's Gate 3",
        hours: 342,
        achievement: 'Underdark Explorer',
        rarity: '0.8%',
        playstyle: 'Completionist',
    },
    {
        game: 'Celeste',
        hours: 56,
        achievement: 'Farewell',
        rarity: '1.4%',
        playstyle: 'Perfectionist',
    },
];

const MOCK_MESSAGES = [
    { type: 'discovery' as const, text: 'New universe mapped in Tokyo' },
    {
        type: 'achievement' as const,
        text: "Rare achievement: 'Immortal Iron' (0.7%)",
    },
    {
        type: 'leaderboard' as const,
        text: "Leaderboard shakeup: 'NovaStar' claimed #1",
    },
    {
        type: 'expansion' as const,
        text: 'Universe expanded: +18 games catalogued',
    },
    { type: 'playful' as const, text: 'Chat: backlog check 👀' },
    {
        type: 'achievement' as const,
        text: 'Platinum trophy earned in Elden Ring',
    },
    {
        type: 'discovery' as const,
        text: 'First-time mapping detected from São Paulo',
    },
    { type: 'expansion' as const, text: '2,400 hours mapped this hour' },
];

function ParticleField() {
    const mesh = useRef<THREE.Points>(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    const particles = useMemo(() => {
        const count = 800;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const r = 30;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);

            // Deep space colors: cyan, purple, white
            const colorChoice = Math.random();
            if (colorChoice > 0.7) {
                colors[i * 3] = 0.4;
                colors[i * 3 + 1] = 0.8;
                colors[i * 3 + 2] = 1; // Cyan
            } else if (colorChoice > 0.4) {
                colors[i * 3] = 0.6;
                colors[i * 3 + 1] = 0.3;
                colors[i * 3 + 2] = 0.9; // Purple
            } else {
                colors[i * 3] = 0.9;
                colors[i * 3 + 1] = 0.9;
                colors[i * 3 + 2] = 1; // White
            }
        }
        return { positions, colors };
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useFrame((state) => {
        if (!mesh.current) return;
        mesh.current.rotation.y += 0.0005;
        mesh.current.rotation.x = mouseRef.current.y * 0.05;
        mesh.current.rotation.y += mouseRef.current.x * 0.02;
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[particles.positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-color"
                    args={[particles.colors, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.12} // Slightly larger
                vertexColors
                transparent
                opacity={0.9} // More opaque
                sizeAttenuation
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

function FloatingArtifacts() {
    const group = useRef<THREE.Group>(null);

    const artifacts = useMemo(() => {
        return Array.from({ length: 8 }, (_, i) => ({
            position: [
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 10,
            ] as [number, number, number],
            rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [
                number,
                number,
                number,
            ],
            scale: 0.5 + Math.random() * 0.5,
            type: i % 2 === 0 ? 'icosahedron' : 'octahedron',
            color:
                i % 3 === 0 ? '#06b6d4' : i % 3 === 1 ? '#8b5cf6' : '#3b82f6',
            speed: 0.2 + Math.random() * 0.3,
        }));
    }, []);

    useFrame((state) => {
        if (!group.current) return;
        const t = state.clock.elapsedTime;
        group.current.children.forEach((child, i) => {
            child.rotation.x += 0.002 * artifacts[i].speed;
            child.rotation.y += 0.003 * artifacts[i].speed;
            child.position.y =
                artifacts[i].position[1] +
                Math.sin(t * artifacts[i].speed) * 0.5;
        });
    });

    return (
        <group ref={group}>
            {artifacts.map((art, i) => (
                <mesh
                    key={i}
                    position={art.position}
                    rotation={art.rotation}
                    scale={art.scale}
                >
                    {art.type === 'icosahedron' ? (
                        <icosahedronGeometry args={[0.6, 0]} />
                    ) : (
                        <octahedronGeometry args={[0.6, 0]} />
                    )}
                    <meshStandardMaterial
                        color={art.color}
                        wireframe
                        transparent
                        opacity={0.6}
                        emissive={art.color}
                        emissiveIntensity={0.8}
                    />
                </mesh>
            ))}
        </group>
    );
}

function LiveFeed() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initial = MOCK_MESSAGES.slice(0, 4).map((msg, i) => ({
            id: `init-${i}`,
            ...msg,
            timestamp: new Date(Date.now() - (4 - i) * 8000),
        }));
        setMessages(initial);

        const interval = setInterval(() => {
            const randomMsg =
                MOCK_MESSAGES[Math.floor(Math.random() * MOCK_MESSAGES.length)];
            const newMessage: ChatMessage = {
                id: Math.random().toString(36).substr(2, 9),
                ...randomMsg,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev.slice(-15), newMessage]);
        }, 3500);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const getTypeColor = (type: ChatMessage['type']) => {
        switch (type) {
            case 'achievement':
                return 'text-amber-400 border-amber-400/20 bg-amber-400/5';
            case 'leaderboard':
                return 'text-purple-400 border-purple-400/20 bg-purple-400/5';
            case 'expansion':
                return 'text-cyan-400 border-cyan-400/20 bg-cyan-400/5';
            case 'discovery':
                return 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5';
            default:
                return 'text-white/40 border-white/10 bg-white/5';
        }
    };

    return (
        <div className="h-full flex flex-col bg-[#0c0c12] border-l border-white/5 relative">
            {/* Scanline effect */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(transparent_50%,_rgba(255,255,255,0.1)_50%)] bg-[length:100%_4px]" />

            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                    Live Feed
                </h3>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-medium text-green-500 uppercase tracking-wider">
                        Live
                    </span>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
            >
                {messages.map((msg, idx) => (
                    <div
                        key={msg.id}
                        className="flex flex-col gap-1 animate-in slide-in-from-bottom-2 fade-in duration-500"
                        style={{ animationDelay: `${idx * 50}ms` }}
                    >
                        <div className="flex items-center gap-2 text-[10px] text-white/30 uppercase tracking-wider">
                            <span>
                                {msg.timestamp.toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                })}
                            </span>
                        </div>
                        <div
                            className={`px-3 py-2 rounded border ${getTypeColor(msg.type)}`}
                        >
                            <span className="leading-relaxed text-white/70">
                                {msg.text}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-3 border-t border-white/5 text-[10px] text-white/20 uppercase tracking-wider flex justify-between items-center bg-white/[0.01]">
                <span>Stream Active</span>
                <span className="text-cyan-500/60">
                    {Math.floor(Math.random() * 50 + 120)} nodes
                </span>
            </div>
        </div>
    );
}

function HUDCard() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % MOCK_STATS.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const stat = MOCK_STATS[index];

    return (
        <div className="bg-[#0c0c12]/90 border border-white/10 backdrop-blur-md p-5 max-w-md w-full">
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                <span className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 font-semibold">
                    Now Exploring
                </span>
                <div className="flex gap-0.5">
                    {MOCK_STATS.map((_, i) => (
                        <div
                            key={i}
                            className={`w-4 h-0.5 rounded-full transition-colors duration-300 ${i === index ? 'bg-cyan-400' : 'bg-white/10'}`}
                        />
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <h4 className="text-xl font-semibold text-white mb-1 tracking-tight">
                        {stat.game}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-white/40">
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">
                            {stat.hours}h played
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">
                            {stat.playstyle}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded bg-white/[0.03] border border-white/5">
                        <div className="text-white/30 mb-1 text-[10px] uppercase tracking-wider">
                            Rarest Achievement
                        </div>
                        <div className="text-amber-400 font-medium truncate">
                            {stat.achievement}
                        </div>
                        <div className="text-white/40 text-[10px] mt-0.5">
                            {stat.rarity} global
                        </div>
                    </div>
                    <div className="p-2.5 rounded bg-white/[0.03] border border-white/5 flex flex-col justify-between">
                        <div className="text-white/30 text-[10px] uppercase tracking-wider">
                            Status
                        </div>
                        <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-medium">
                            <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                            Active
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StreamPreview() {
    return (
        // Added radial gradient background so particles are visible against dark space
        <div className="relative w-full aspect-[16/10] bg-[radial-gradient(ellipse_at_center,_#1a1a2e_0%,_#0a0a0f_50%,_#050508_100%)] overflow-hidden group">
            {/* Three.js Canvas */}
            <div className="absolute inset-0">
                <Canvas
                    camera={{ position: [0, 0, 12], fov: 60 }}
                    dpr={[1, 1.5]}
                >
                    <ambientLight intensity={0.7} color="white" />
                    <pointLight
                        position={[10, 10, 10]}
                        intensity={1.2}
                        color="white"
                    />
                    <pointLight
                        position={[-10, -10, -5]}
                        intensity={0.8}
                        color="#8b5cf6"
                    />
                    <directionalLight
                        position={[5, 10, 7]}
                        intensity={1.5}
                        color="#ffffff"
                        castShadow
                    />
                    <ParticleField />
                    <FloatingArtifacts />
                </Canvas>
            </div>

            {/* Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(5,5,8,0.8)_100%)]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent opacity-60" />

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-16 h-16 border-l border-t border-white/10 opacity-50" />
            <div className="absolute top-0 right-0 w-16 h-16 border-r border-t border-white/10 opacity-50" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-l border-b border-white/10 opacity-50" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-r border-b border-white/10 opacity-50" />

            {/* Live Badge */}
            <div className="absolute top-6 left-6 flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded text-[10px] font-bold text-red-400 uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    Live
                </div>
                <span className="text-[10px] text-white/30 uppercase tracking-widest">
                    Preview Mode
                </span>
            </div>

            {/* HUD Card */}
            <div className="absolute bottom-6 left-6">
                <HUDCard />
            </div>

            {/* Side stats */}
            <div className="absolute top-6 right-6 flex flex-col items-end gap-2">
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/20">
                    System Status
                </div>
                <div className="flex items-center gap-2 text-[10px] text-cyan-400/60 font-mono">
                    <span className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
                    ONLINE
                </div>
            </div>
        </div>
    );
}

// Main Page
export default function Home() {
    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white selection:bg-cyan-500/30 selection:text-cyan-200">
            <main className="pt-32 pb-20 px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Hero Text */}
                <div className="max-w-3xl mb-16">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 leading-[0.9]">
                        <span className="block text-white/90">Steam,</span>
                        <span className="block bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">
                            Beamed.
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-white/30 font-light leading-relaxed max-w-2xl mb-10">
                        Transform thousands of hours into a celestial body.
                        Navigate your gaming history as an interactive cosmos of
                        achievements, memories, and discoveries.
                    </p>

                    <div className="flex flex-wrap items-center gap-6 mb-16">
                        <a
                            href="/api/auth/steam"
                            className="group relative px-8 py-4 bg-white text-black font-semibold text-sm tracking-wide hover:bg-cyan-50 transition-colors overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                Start Your Journey
                                <svg
                                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                    />
                                </svg>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>

                        <a href="/demo" className="px-8 py-4 border border-white/10 text-white/60 font-medium text-sm tracking-wide hover:border-white/20 hover:text-white transition-colors">
                            View Demo Data
                        </a>
                    </div>
                </div>

                {/* Main Visualization Area - Height fix applied here */}
                <div className="grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-1 gap-1 bg-[#0c0c12] border border-white/5 p-1 overflow-hidden">
                    <div className="lg:col-span-8 h-full">
                        <StreamPreview />
                    </div>
                    <div className="lg:col-span-4 h-[400px] lg:h-[500px]">
                        <LiveFeed />
                    </div>
                </div>

                {/* Bottom text */}
                <div className="mt-6 flex justify-between items-center text-[10px] uppercase tracking-[0.2em] text-white/20 font-mono">
                    <span>Steam Universe // v0.1.0</span>
                    <span className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-green-500/50" />
                        All Systems Operational
                    </span>
                </div>
            </main>
        </div>
    );
}

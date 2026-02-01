'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

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
    { type: 'discovery' as const, text: '🔍 New universe mapped in Japan' },
    {
        type: 'achievement' as const,
        text: "🏆 Rare achievement found: 'Immortal Iron' (0.7%)",
    },
    {
        type: 'leaderboard' as const,
        text: "📈 Leaderboard shakeup: 'NovaStar' claimed #1",
    },
    {
        type: 'expansion' as const,
        text: '🌌 Universe expanded: +18 games catalogued',
    },
    { type: 'playful' as const, text: 'Chat: backlog check 👀' },
    {
        type: 'achievement' as const,
        text: '🎮 Platinum trophy earned in Elden Ring',
    },
    {
        type: 'discovery' as const,
        text: '🔍 First-time mapping detected from Brazil',
    },
    {
        type: 'expansion' as const,
        text: '🌌 2,400 hours of gameplay mapped this hour',
    },
];

function ParticleUniverse() {
    const mesh = useRef<THREE.Points>(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    const [particles] = useState(() => {
        const count = 1000;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 50;

            const colorChoice = Math.random();
            if (colorChoice > 0.7) {
                colors[i * 3] = 0.8 + Math.random() * 0.2;
                colors[i * 3 + 1] = 0.9 + Math.random() * 0.1;
                colors[i * 3 + 2] = 1;
            } else if (colorChoice > 0.4) {
                colors[i * 3] = 0.2;
                colors[i * 3 + 1] = 0.6 + Math.random() * 0.4;
                colors[i * 3 + 2] = 0.9;
            } else {
                colors[i * 3] = 0.1;
                colors[i * 3 + 1] = 0.8;
                colors[i * 3 + 2] = 0.8;
            }
        }
        return { positions, colors };
    });

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
        mesh.current.rotation.y = state.clock.elapsedTime * 0.05;
        mesh.current.rotation.x =
            Math.sin(state.clock.elapsedTime * 0.03) * 0.1;

        mesh.current.rotation.y += mouseRef.current.x * 0.001;
        mesh.current.rotation.x += mouseRef.current.y * 0.001;
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[particles.positions, 3]}
                    count={particles.positions.length / 3}
                    array={particles.positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    args={[particles.colors, 3]}
                    count={particles.colors.length / 3}
                    array={particles.colors}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.15}
                vertexColors
                transparent
                opacity={0.8}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

function PolyhedronNodes() {
    const groupRef = useRef<THREE.Group>(null);

    // Generate random polyhedron data
    const nodes = useMemo(() => {
        const geometries = [
            new THREE.IcosahedronGeometry(0.8, 0),
            new THREE.OctahedronGeometry(0.7, 0),
            new THREE.TetrahedronGeometry(0.9, 0),
            new THREE.DodecahedronGeometry(0.6, 0),
            new THREE.IcosahedronGeometry(0.5, 1),
        ];

        const colors = [
            new THREE.Color('#ff006e'),
            new THREE.Color('#fb5607'),
            new THREE.Color('#ffbe0b'),
            new THREE.Color('#8338ec'),
            new THREE.Color('#3a86ff'),
            new THREE.Color('#06ffa5'),
        ];

        return Array.from({ length: 15 }, (_, i) => ({
            id: i,
            geometry: geometries[Math.floor(Math.random() * geometries.length)],
            color: colors[Math.floor(Math.random() * colors.length)],
            position: [
                (Math.random() - 0.5) * 30,
                (Math.random() - 0.5) * 30,
                (Math.random() - 0.5) * 20 - 5, // Slightly behind center
            ] as [number, number, number],
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.01,
            },
            floatSpeed: 0.5 + Math.random() * 0.5,
            floatOffset: Math.random() * Math.PI * 2,
            scale: 0.5 + Math.random() * 0.8,
        }));
    }, []);

    useFrame((state) => {
        if (!groupRef.current) return;
        const time = state.clock.elapsedTime;

        groupRef.current.children.forEach((child, i) => {
            const node = nodes[i];
            // Rotation
            child.rotation.x += node.rotationSpeed.x;
            child.rotation.y += node.rotationSpeed.y;
            child.rotation.z += node.rotationSpeed.z;

            // Floating motion
            child.position.y =
                node.position[1] +
                Math.sin(time * node.floatSpeed + node.floatOffset) * 0.5;
        });
    });

    return (
        <group ref={groupRef}>
            {nodes.map((node) => (
                <mesh
                    key={node.id}
                    position={node.position}
                    scale={node.scale}
                    geometry={node.geometry}
                >
                    <meshStandardMaterial
                        color={node.color}
                        emissive={node.color}
                        emissiveIntensity={0.5}
                        roughness={0.2}
                        metalness={0.8}
                        transparent
                        opacity={0.9}
                        wireframe={Math.random() > 0.7} // Some are wireframe for variety
                    />
                    {/* Glow effect using a slightly larger transparent mesh */}
                    <mesh scale={1.2}>
                        <sphereGeometry args={[1, 16, 16]} />
                        <meshBasicMaterial
                            color={node.color}
                            transparent
                            opacity={0.15}
                            blending={THREE.AdditiveBlending}
                            side={THREE.BackSide}
                        />
                    </mesh>
                </mesh>
            ))}
        </group>
    );
}

function LiveFeed() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initial: ChatMessage[] = MOCK_MESSAGES.slice(0, 4).map(
            (msg, i) => ({
                id: `init-${i}`,
                ...msg,
                timestamp: new Date(Date.now() - (4 - i) * 5000),
            }),
        );
        setMessages(initial);

        const interval = setInterval(() => {
            const randomMsg =
                MOCK_MESSAGES[Math.floor(Math.random() * MOCK_MESSAGES.length)];
            const newMessage: ChatMessage = {
                id: Math.random().toString(36).substr(2, 9),
                ...randomMsg,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev.slice(-20), newMessage]);
        }, 4000);

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
                return 'text-yellow-400';
            case 'leaderboard':
                return 'text-purple-400';
            case 'expansion':
                return 'text-blue-400';
            case 'discovery':
                return 'text-green-400';
            default:
                return 'text-gray-400';
        }
    };

    return (
        <div className="h-full flex flex-col bg-gray-900/90 border-l border-gray-800">
            <div className="p-4 border-b border-gray-800 bg-gray-900/95 backdrop-blur">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
                        Live Activity
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-xs text-green-400 font-medium">
                            LIVE
                        </span>
                    </div>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className="animate-in fade-in slide-in-from-bottom-2 duration-300"
                    >
                        <div className="flex items-start gap-2">
                            <span
                                className={`text-xs font-medium ${getTypeColor(msg.type)}`}
                            >
                                {msg.type === 'playful' ? '💬' : 'SYSTEM'}
                            </span>
                            <p className="text-sm text-gray-300 leading-relaxed">
                                {msg.text}
                            </p>
                        </div>
                        <span className="text-xs text-gray-600 mt-1 block">
                            {msg.timestamp.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                            })}
                        </span>
                    </div>
                ))}
            </div>

            <div className="p-3 border-t border-gray-800 bg-gray-900/50">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span>
                        Monitoring {Math.floor(Math.random() * 50 + 100)} active
                        universes
                    </span>
                </div>
            </div>
        </div>
    );
}

// Stream Preview with enhanced universe
function StreamPreview() {
    const [currentStat, setCurrentStat] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStat((prev) => (prev + 1) % MOCK_STATS.length);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    const stat = MOCK_STATS[currentStat];

    return (
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border border-gray-800">
            {/* Three.js Canvas with enhanced scene */}
            <div className="absolute inset-0">
                <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
                    <ambientLight intensity={0.3} />
                    <pointLight
                        position={[10, 10, 10]}
                        intensity={1}
                        color="#ffffff"
                    />
                    <pointLight
                        position={[-10, -10, -5]}
                        intensity={0.5}
                        color="#3a86ff"
                    />
                    <ParticleUniverse />
                    <PolyhedronNodes />
                </Canvas>
            </div>

            {/* Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

            {/* Live Badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600/90 backdrop-blur px-3 py-1.5 rounded-full">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Live Preview
                </span>
            </div>

            {/* Rotating Info Cards */}
            <div className="absolute bottom-4 left-4 right-4">
                <div
                    key={currentStat}
                    className="bg-gray-900/90 backdrop-blur-md border border-gray-700/50 rounded-lg p-4 max-w-md animate-in slide-in-from-bottom-4 duration-500"
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-blue-400 uppercase tracking-wider">
                            Now Exploring
                        </span>
                        <span className="text-xs text-gray-500">
                            {stat.hours}h played
                        </span>
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">
                        {stat.game}
                    </h4>
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">
                                Rarest Achievement
                            </span>
                            <span className="text-yellow-400 font-medium">
                                {stat.achievement} ({stat.rarity})
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Playstyle</span>
                            <span className="text-cyan-400 font-medium">
                                {stat.playstyle}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative HUD Elements */}
            <div className="absolute top-4 right-4 flex flex-col items-end gap-2 opacity-50">
                <div className="h-px w-16 bg-gradient-to-l from-blue-500 to-transparent" />
                <div className="h-px w-12 bg-gradient-to-l from-cyan-500 to-transparent" />
            </div>
        </div>
    );
}

// Main Page Component
export default function Home() {
    return (
        <div className="min-h-screen bg-[#0a0f1c] text-white overflow-x-hidden">
            <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                        Map Your Steam Universe
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
                        Transform your gaming history into an interactive
                        cosmos. Visualize 10,000+ hours as constellations of
                        achievements, genres, and memories.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href="/api/auth/steam"
                            className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-200 transition-all transform hover:scale-105 flex items-center gap-2 cursor-pointer"
                        >
                            Start Your Journey
                            <svg
                                className="w-5 h-5"
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
                        </a>
                        <button className="border border-gray-700 bg-gray-900/50 backdrop-blur px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition-all cursor-pointer">
                            View Demo
                        </button>
                    </div>
                </div>

                {/* Twitch-Style Live Preview Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 bg-gray-900/30 rounded-2xl p-4 border border-gray-800 backdrop-blur-sm">
                    <div className="lg:col-span-2">
                        <StreamPreview />
                    </div>

                    <div className="lg:col-span-1 h-[400px] lg:h-[500px]">
                        <LiveFeed />
                    </div>
                </div>
            </main>
        </div>
    );
}

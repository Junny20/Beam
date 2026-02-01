import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { Game } from '@/data/mockGames';
import { calculateNodeProperties } from '@/data/mockGames';

interface GameNodeProps {
    game: Game;
    position: THREE.Vector3;
    onClick: () => void;
    onHover: (hovered: boolean) => void;
    isHovered: boolean;
    isSelected: boolean;
    index: number;
}

// Create a polyhedron geometry for the node
function createPolyhedronGeometry(size: number) {
    // Icosahedron for a cool geometric look
    const geometry = new THREE.IcosahedronGeometry(size, 0);
    return geometry;
}

// Create glow texture
function createGlowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.5)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}

export default function GameNode({
    game,
    position,
    onClick,
    onHover,
    isHovered,
    isSelected,
    index,
}: GameNodeProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const glowRef = useRef<THREE.Mesh>(null);
    const ringRef = useRef<THREE.Mesh>(null);
    const particlesRef = useRef<THREE.Points>(null);

    const { size, glowIntensity } = calculateNodeProperties(game);

    // Create geometries
    const geometry = useMemo(() => createPolyhedronGeometry(size), [size]);
    const glowTexture = useMemo(() => createGlowTexture(), []);

    // Particle system for high-activity games
    const particleCount = Math.floor(glowIntensity * 20);
    const particleGeometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const radius = size * 1.5 + Math.random() * 0.5;
            positions[i * 3] = Math.cos(angle) * radius;
            positions[i * 3 + 1] = Math.sin(angle) * radius;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
        }

        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        return geo;
    }, [particleCount, size]);

    const particleMaterial = useMemo(() => {
        return new THREE.PointsMaterial({
            color: game.color,
            size: 0.08,
            transparent: true,
            opacity: glowIntensity * 0.8,
            blending: THREE.AdditiveBlending,
        });
    }, [game.color, glowIntensity]);

    useFrame((state) => {
        const time = state.clock.elapsedTime;

        if (meshRef.current) {
            // Gentle floating animation
            meshRef.current.position.y =
                Math.sin(time * 0.3 + index * 0.5) * 0.15;

            // Slow rotation
            meshRef.current.rotation.x = Math.sin(time * 0.1 + index) * 0.1;
            meshRef.current.rotation.y += 0.005;

            // Scale on hover/select
            const targetScale = isSelected ? 1.8 : isHovered ? 1.3 : 1;
            meshRef.current.scale.lerp(
                new THREE.Vector3(targetScale, targetScale, targetScale),
                0.1,
            );
        }

        if (glowRef.current) {
            // Pulsing glow based on recent activity
            const pulse =
                1 +
                Math.sin(time * 2 + index) * 0.15 * (0.3 + glowIntensity * 0.7);
            glowRef.current.scale.setScalar(pulse);
            glowRef.current.rotation.z += 0.002;
        }

        if (ringRef.current && glowIntensity > 0.3) {
            // Active ring rotation
            ringRef.current.rotation.z -= 0.01;
        }

        if (particlesRef.current && particleCount > 0) {
            // Rotate particles around the node
            particlesRef.current.rotation.z += 0.02;
        }
    });

    return (
        <group position={position}>
            {/* Outer glow sprite */}
            <mesh ref={glowRef} position={[0, 0, -0.2]}>
                <planeGeometry args={[size * 4, size * 4]} />
                <meshBasicMaterial
                    map={glowTexture}
                    color={game.color}
                    transparent
                    opacity={0.4 + glowIntensity * 0.4}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Activity ring for recently played games */}
            {glowIntensity > 0.2 && (
                <mesh ref={ringRef} position={[0, 0, -0.1]}>
                    <ringGeometry args={[size * 1.4, size * 1.5, 64]} />
                    <meshBasicMaterial
                        color={game.color}
                        transparent
                        opacity={glowIntensity * 0.6}
                        side={THREE.DoubleSide}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            )}

            {/* Particle ring for high activity */}
            {particleCount > 0 && (
                <points
                    ref={particlesRef}
                    geometry={particleGeometry}
                    material={particleMaterial}
                />
            )}

            {/* Main polyhedron node */}
            <mesh
                ref={meshRef}
                geometry={geometry}
                onClick={onClick}
                onPointerOver={() => onHover(true)}
                onPointerOut={() => onHover(false)}
                receiveShadow
            >
                <meshStandardMaterial
                    color={game.color}
                    metalness={0.7}
                    roughness={0.2}
                    envMapIntensity={1}
                    emissive={game.color}
                    emissiveIntensity={0.4 + glowIntensity * 0.2}
                    transparent={true}
                    opacity={0.85}
                />
            </mesh>

            {/* Inner core glow */}
            <mesh position={[0, 0, 0]}>
                <icosahedronGeometry args={[size * 0.25, 0]} />
                <meshBasicMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.8}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </mesh>
            <pointLight
                intensity={0.5}
                distance={size * 3}
                color={game.color}
                position={[0, 0, 0]}
            />

            {/* Wireframe overlay */}
            <mesh geometry={geometry}>
                <meshBasicMaterial
                    color={game.color}
                    wireframe
                    transparent
                    opacity={0.3}
                />
            </mesh>

            {/* Tooltip on hover */}
            {isHovered && !isSelected && (
                <Html distanceFactor={8} transform={false}>
                    <div className="bg-bg-darker/95 backdrop-blur-md border border-purple-secondary/40 rounded-xl p-4 min-w-[200px] pointer-events-none shadow-glow">
                        <div className="flex items-center gap-3 mb-2">
                            <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
                                style={{
                                    backgroundColor: `${game.color}30`,
                                    color: game.color,
                                }}
                            >
                                {game.icon}
                            </div>
                            <p className="font-display font-semibold text-white text-sm">
                                {game.name}
                            </p>
                        </div>
                        <div className="space-y-1 text-xs text-gray-400">
                            <div className="flex justify-between">
                                <span>Playtime:</span>
                                <span className="text-white">
                                    {game.playtime} hrs
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Last played:</span>
                                <span className="text-white">
                                    {game.lastPlayed}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Achievements:</span>
                                <span className="text-purple-light">
                                    {game.achievements.unlocked}/
                                    {game.achievements.total}
                                </span>
                            </div>
                            {glowIntensity > 0.5 && (
                                <div className="flex items-center gap-1 text-success mt-2">
                                    <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                                    <span>Recently Active</span>
                                </div>
                            )}
                        </div>
                    </div>
                </Html>
            )}
        </group>
    );
}

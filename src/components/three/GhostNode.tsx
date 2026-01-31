import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { GhostGame } from '@/data/mockGames';

interface GhostNodeProps {
    game: GhostGame;
    position: THREE.Vector3;
    onHover: (hovered: boolean) => void;
    isHovered: boolean;
    index: number;
}

export default function GhostNode({
    game,
    position,
    onHover,
    isHovered,
    index,
}: GhostNodeProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const glowRef = useRef<THREE.Mesh>(null);
    const ringRef = useRef<THREE.Mesh>(null);

    const size = 0.5;

    useFrame((state) => {
        const time = state.clock.elapsedTime;

        if (meshRef.current) {
            // Gentle floating - slower than real nodes
            meshRef.current.position.y =
                position.y + Math.sin(time * 0.2 + index * 0.7) * 0.1;

            // Slow rotation
            meshRef.current.rotation.y += 0.003;

            // Scale on hover
            const targetScale = isHovered ? 1.2 : 1;
            meshRef.current.scale.lerp(
                new THREE.Vector3(targetScale, targetScale, targetScale),
                0.1,
            );
        }

        if (glowRef.current) {
            // Subtle pulse
            const pulse = 1 + Math.sin(time * 1.5 + index) * 0.1;
            glowRef.current.scale.setScalar(pulse);
        }

        if (ringRef.current) {
            // Rotate dashed ring
            ringRef.current.rotation.z -= 0.005;
        }
    });

    return (
        <group position={position}>
            {/* Muted glow */}
            <mesh ref={glowRef} position={[0, 0, -0.2]}>
                <planeGeometry args={[size * 3, size * 3]} />
                <meshBasicMaterial
                    color={game.color}
                    transparent
                    opacity={0.08}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Dashed ring effect - using multiple segments */}
            {[0, 1, 2, 3].map((i) => (
                <mesh
                    key={i}
                    position={[0, 0, -0.1]}
                    rotation={[0, 0, (i * Math.PI) / 2 + index]}
                >
                    <ringGeometry
                        args={[size * 1.3, size * 1.35, 16, 1, 0, Math.PI / 3]}
                    />
                    <meshBasicMaterial
                        color={game.color}
                        transparent
                        opacity={0.4}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            ))}

            {/* Main ghost node - icosahedron */}
            <mesh
                ref={meshRef}
                onPointerOver={() => onHover(true)}
                onPointerOut={() => onHover(false)}
            >
                <icosahedronGeometry args={[size, 0]} />
                <meshStandardMaterial
                    color={game.color}
                    metalness={0.3}
                    roughness={0.7}
                    transparent
                    opacity={0.4}
                />
            </mesh>

            {/* Wireframe overlay */}
            <mesh>
                <icosahedronGeometry args={[size, 0]} />
                <meshBasicMaterial
                    color={game.color}
                    wireframe
                    transparent
                    opacity={0.2}
                />
            </mesh>

            {/* Ghost indicator */}
            <mesh position={[0, 0, size * 1.2]}>
                <ringGeometry args={[0.15, 0.2, 16]} />
                <meshBasicMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.5}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Tooltip on hover */}
            {isHovered && (
                <Html distanceFactor={8} transform={false}>
                    <div className="bg-bg-darker/95 backdrop-blur-md border border-dashed border-gray-500/50 rounded-xl p-4 min-w-[200px] pointer-events-none">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs text-gray-500 uppercase tracking-wider">
                                Discovery
                            </span>
                        </div>
                        <p className="font-display font-semibold text-white text-sm mb-1">
                            {game.name}
                        </p>
                        <p className="text-xs text-gray-400 mb-2">
                            {game.genre}
                        </p>
                        <div className="space-y-1 text-xs">
                            <div className="flex items-center gap-2 text-purple-light">
                                <svg
                                    className="w-3 h-3"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                                </svg>
                                <span>{game.reason}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <svg
                                    className="w-3 h-3"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                    <path
                                        fillRule="evenodd"
                                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span>{game.playerCount} playing now</span>
                            </div>
                        </div>
                        <div className="mt-3 pt-2 border-t border-gray-700/50">
                            <p className="text-xs text-gray-500 italic">
                                Click to learn more
                            </p>
                        </div>
                    </div>
                </Html>
            )}
        </group>
    );
}

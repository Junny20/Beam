import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { GhostGame } from '@/data/mockGames';

interface GhostNodeProps {
    game: GhostGame;
    position: THREE.Vector3;
    index: number;
}

export default function GhostNode({ game, position, index }: GhostNodeProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const glowRef = useRef<THREE.Sprite>(null);
    const ringRef = useRef<THREE.Mesh>(null);

    const [isHovered, setIsHovered] = useState(false);
    const size = 0.5;

    useFrame(({ clock }) => {
        const t = clock.elapsedTime;

        if (meshRef.current) {
            meshRef.current.position.y = Math.sin(t * 0.2 + index * 0.7) * 0.1;

            meshRef.current.rotation.y += 0.003;

            const target = isHovered ? 1.3 : 1;
            meshRef.current.scale.lerp(
                new THREE.Vector3(target, target, target),
                0.1,
            );
        }

        if (glowRef.current) {
            glowRef.current.scale.setScalar(
                1 + Math.sin(t * 1.5 + index) * 0.2,
            );
        }

        ringRef.current && (ringRef.current.rotation.z -= 0.005);
    });

    return (
        <group position={position}>
            <sprite
                ref={glowRef}
                position={[0, 0, -0.2]}
                scale={[size * 4, size * 4, 1]}
            >
                <spriteMaterial
                    color={game.color}
                    transparent
                    opacity={0.15}
                    blending={THREE.AdditiveBlending}
                />
            </sprite>

            {[0, 1, 2, 3].map((i) => (
                <mesh
                    key={i}
                    ref={i === 0 ? ringRef : undefined}
                    position={[0, 0, -0.1]}
                    rotation={[0, 0, (i * Math.PI) / 2 + index]}
                >
                    <ringGeometry
                        args={[size * 1.3, size * 1.35, 16, 1, 0, Math.PI / 3]}
                    />
                    <meshBasicMaterial
                        color={game.color}
                        transparent
                        opacity={0.6}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            ))}

            <mesh
                ref={meshRef}
                onPointerOver={() => setIsHovered(true)}
                onPointerOut={() => setIsHovered(false)}
            >
                <icosahedronGeometry args={[size, 0]} />
                <meshStandardMaterial
                    color={game.color}
                    transparent
                    opacity={0.6}
                    emissive={game.color}
                    emissiveIntensity={0.2}
                    metalness={0.3}
                    roughness={0.7}
                />
            </mesh>

            <mesh>
                <icosahedronGeometry args={[size, 0]} />
                <meshBasicMaterial
                    color={game.color}
                    wireframe
                    transparent
                    opacity={0.2}
                />
            </mesh>

            {isHovered && (
                <Html distanceFactor={8}>
                    <div className="bg-bg-darker/95 backdrop-blur-md border border-dashed border-gray-500/50 rounded-xl p-4 min-w-[200px] pointer-events-none">
                        <span className="text-xs text-gray-500 uppercase tracking-wider">
                            Discovery
                        </span>
                        <p className="font-display font-semibold text-white text-sm mt-1">
                            {game.name}
                        </p>
                        <p className="text-xs text-gray-400">{game.genre}</p>
                        <p className="text-xs text-purple-light mt-2">
                            {game.reason}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            {game.playerCount} playing now
                        </p>
                    </div>
                </Html>
            )}
        </group>
    );
}

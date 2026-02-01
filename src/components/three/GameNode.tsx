'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { GameGraphNode } from '@/lib/graph/types';
import { calculateNodeProperties } from '@/lib/graph/calculateNodeProperties';
import { formatDate } from '@/lib/graph/formatDate';

const BASE_RADIUS = 0.45;
const MAX_RADIUS = 0.85;

const HOVER_SCALE = 1.12;
const SELECT_SCALE = 1.35;

const FLOAT_AMPLITUDE = 0.12;
const FLOAT_SPEED = 0.3;

function clamp(v: number, min: number, max: number) {
    return Math.min(max, Math.max(min, v));
}

function seeded01(seed: number) {
    return ((Math.sin(seed * 9999.123) * 43758.5453) % 1) + 1;
}
function seeded(seed: number) {
    return seeded01(seed) % 1;
}

interface GameNodeProps {
    game: GameGraphNode;
    position: THREE.Vector3;
    onClick: () => void;
    onHover: (hovered: boolean) => void;
    isHovered: boolean;
    isSelected: boolean;
    index: number;
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
    const glowTexture = useMemo(() => {
        if (typeof window === 'undefined') return null;

        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;

        const ctx = canvas.getContext('2d')!;
        const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);

        g.addColorStop(0, 'rgba(255,255,255,1)');
        g.addColorStop(0.35, 'rgba(255,255,255,0.35)');
        g.addColorStop(1, 'rgba(255,255,255,0)');

        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 128, 128);

        return new THREE.CanvasTexture(canvas);
    }, []);

    const rootRef = useRef<THREE.Group>(null);
    const meshRef = useRef<THREE.Mesh>(null);
    const glowRef = useRef<THREE.Mesh>(null);

    const ringHRef = useRef<THREE.Mesh>(null);
    const ringVRef = useRef<THREE.Mesh>(null);
    const ringTRef = useRef<THREE.Mesh>(null);

    const debrisRef = useRef<THREE.Mesh>(null);
    const particlesRef = useRef<THREE.Points>(null);
    const satelliteRef = useRef<THREE.Mesh>(null);

    const { size: rawSize, glowIntensity } = calculateNodeProperties(game);

    const radius = clamp(BASE_RADIUS + rawSize * 0.4, BASE_RADIUS, MAX_RADIUS);

    const features = useMemo(() => {
        const baseSeed =
            typeof game.id === 'number' ? game.id * 0.1337 : index * 0.1337;

        const r1 = seeded(baseSeed + 1);
        const r2 = seeded(baseSeed + 2);
        const r3 = seeded(baseSeed + 3);
        const r4 = seeded(baseSeed + 4);

        const ringBoost = glowIntensity * 0.25;

        const horizontalRing = r1 + ringBoost > 0.65;
        const verticalRing = r2 + ringBoost > 0.75;
        const tiltedRing = r3 + ringBoost > 0.88;

        const particleHalo = glowIntensity > 0.35;
        const debrisBelt = glowIntensity > 0.55 || r4 > 0.85;
        const satellite = r4 > 0.5 && radius < 0.9;

        const tilt = (seeded(baseSeed + 9) - 0.5) * 0.8;
        const tilt2 = (seeded(baseSeed + 10) - 0.5) * 0.8;

        return {
            horizontalRing,
            verticalRing,
            tiltedRing,
            particleHalo,
            debrisBelt,
            satellite,
            tilt,
            tilt2,
            satPhase: seeded(baseSeed + 20) * Math.PI * 2,
            ringSpeed: 0.004 + seeded(baseSeed + 30) * 0.01,
            debrisSpeed: 0.002 + seeded(baseSeed + 31) * 0.006,
        };
    }, [game.id, index, glowIntensity, radius]);

    const planetGeometry = useMemo(
        () => new THREE.SphereGeometry(radius, 32, 32),
        [radius],
    );

    const ringGeomH = useMemo(
        () => new THREE.RingGeometry(radius * 1.55, radius * 1.95, 96),
        [radius],
    );
    const ringGeomV = useMemo(
        () => new THREE.RingGeometry(radius * 1.35, radius * 1.65, 72),
        [radius],
    );
    const ringGeomT = useMemo(
        () => new THREE.RingGeometry(radius * 1.7, radius * 2.15, 84),
        [radius],
    );
    const debrisGeom = useMemo(
        () => new THREE.TorusGeometry(radius * 2.45, 0.07, 10, 64),
        [radius],
    );

    const particleCount = useMemo(() => {
        if (!features.particleHalo) return 0;
        return glowIntensity > 0.75 ? 24 : glowIntensity > 0.5 ? 16 : 10;
    }, [features.particleHalo, glowIntensity]);

    const particleGeometry = useMemo(() => {
        if (!particleCount) return null;

        const geo = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            const a = (i / particleCount) * Math.PI * 2;
            const r = radius * (2.15 + seeded(index * 10 + i) * 0.35);
            const z = (seeded(index * 20 + i) - 0.5) * 0.45;

            positions[i * 3] = Math.cos(a) * r;
            positions[i * 3 + 1] = Math.sin(a) * r;
            positions[i * 3 + 2] = z;
        }

        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        return geo;
    }, [particleCount, radius, index]);

    useFrame(({ clock }) => {
        const t = clock.elapsedTime;

        if (rootRef.current) {
            rootRef.current.position.y =
                Math.sin(t * FLOAT_SPEED + index) * FLOAT_AMPLITUDE;
        }

        if (meshRef.current) {
            meshRef.current.rotation.y += 0.003;
            meshRef.current.rotation.x = Math.sin(t * 0.15 + index) * 0.03;

            const target = isSelected
                ? SELECT_SCALE
                : isHovered
                  ? HOVER_SCALE
                  : 1;
            meshRef.current.scale.lerp(
                new THREE.Vector3(target, target, target),
                0.08,
            );
        }

        if (glowRef.current) {
            const pulse = 1 + Math.sin(t * 1.6 + index) * 0.12 * glowIntensity;
            glowRef.current.scale.setScalar(pulse);
        }

        const rs = features.ringSpeed;
        if (ringHRef.current) ringHRef.current.rotation.z -= rs;
        if (ringVRef.current) ringVRef.current.rotation.z += rs * 0.8;
        if (ringTRef.current) ringTRef.current.rotation.z -= rs * 1.1;

        if (debrisRef.current)
            debrisRef.current.rotation.z += features.debrisSpeed;

        if (particlesRef.current) {
            particlesRef.current.rotation.y += 0.012;
            particlesRef.current.rotation.x += 0.004;
        }

        if (satelliteRef.current && features.satellite) {
            const r = radius * 2.9;
            const a = t * 0.9 + features.satPhase;
            satelliteRef.current.position.set(
                Math.cos(a) * r,
                Math.sin(a * 1.3) * 0.35,
                Math.sin(a) * r,
            );
        }
    });

    return (
        <group ref={rootRef} position={position}>
            <mesh ref={glowRef} position={[0, 0, -0.35]}>
                <planeGeometry args={[radius * 5.2, radius * 5.2]} />
                {glowTexture && (
                    <meshBasicMaterial
                        map={glowTexture}
                        color={game.color}
                        transparent
                        opacity={0.33 + glowIntensity * 0.12}
                        depthWrite={false}
                        blending={THREE.AdditiveBlending}
                        side={THREE.DoubleSide}
                    />
                )}
            </mesh>

            {features.horizontalRing && (
                <mesh ref={ringHRef} rotation={[Math.PI / 2, 0, 0]}>
                    <primitive object={ringGeomH} attach="geometry" />
                    <meshBasicMaterial
                        color={game.color}
                        transparent
                        opacity={0.28}
                        blending={THREE.AdditiveBlending}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            )}

            {features.verticalRing && (
                <mesh ref={ringVRef} rotation={[0, Math.PI / 2, 0]}>
                    <primitive object={ringGeomV} attach="geometry" />
                    <meshBasicMaterial
                        color={game.color}
                        transparent
                        opacity={0.2}
                        blending={THREE.AdditiveBlending}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            )}

            {features.tiltedRing && (
                <mesh
                    ref={ringTRef}
                    rotation={[
                        Math.PI / 2 + features.tilt,
                        features.tilt2,
                        Math.PI / 6,
                    ]}
                >
                    <primitive object={ringGeomT} attach="geometry" />
                    <meshBasicMaterial
                        color={game.color}
                        transparent
                        opacity={0.16}
                        blending={THREE.AdditiveBlending}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            )}

            {features.debrisBelt && (
                <mesh ref={debrisRef} rotation={[Math.PI / 2, 0, 0]}>
                    <primitive object={debrisGeom} attach="geometry" />
                    <meshBasicMaterial
                        color="#ffffff"
                        transparent
                        opacity={0.1}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            )}

            {particleGeometry && (
                <points ref={particlesRef} geometry={particleGeometry}>
                    <pointsMaterial
                        color={game.color}
                        size={0.055}
                        transparent
                        opacity={0.55 + glowIntensity * 0.25}
                        blending={THREE.AdditiveBlending}
                    />
                </points>
            )}

            <mesh
                ref={meshRef}
                geometry={planetGeometry}
                onClick={onClick}
                onPointerOver={() => onHover(true)}
                onPointerOut={() => onHover(false)}
            >
                <meshStandardMaterial
                    color={game.color}
                    metalness={0.55}
                    roughness={0.35}
                    emissive={game.color}
                    emissiveIntensity={0.35 + glowIntensity * 0.25}
                    transparent
                    opacity={0.92}
                />
            </mesh>

            <mesh geometry={planetGeometry}>
                <meshBasicMaterial
                    wireframe
                    color={game.color}
                    transparent
                    opacity={0.18}
                />
            </mesh>

            {features.satellite && (
                <mesh ref={satelliteRef}>
                    <sphereGeometry args={[radius * 0.16, 14, 14]} />
                    <meshStandardMaterial
                        color="#e5e7eb"
                        emissive={game.color}
                        emissiveIntensity={0.35}
                        metalness={0.4}
                        roughness={0.6}
                        transparent
                        opacity={0.95}
                    />
                </mesh>
            )}

            {isHovered && !isSelected && (
                <Html distanceFactor={8} transform={false}>
                    <div className="bg-bg-darker/95 backdrop-blur-md border border-purple-secondary/40 rounded-xl p-3 min-w-[180px] pointer-events-none">
                        <div className="flex items-center gap-2 mb-2">
                            <img
                                src={game.icon}
                                alt={game.name}
                                className="w-8 h-8 rounded-md object-cover"
                            />
                            <span className="text-sm font-semibold text-white">
                                {game.name}
                            </span>
                        </div>
                        <div className="text-xs text-gray-400 space-y-0.5">
                            <div className="flex justify-between">
                                <span>Playtime</span>
                                <span className="text-white">
                                    {Math.floor(game.playtime)}h
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Last played</span>
                                <span className="text-white">
                                    {formatDate(game.lastPlayed)}
                                </span>
                            </div>
                        </div>
                    </div>
                </Html>
            )}
        </group>
    );
}

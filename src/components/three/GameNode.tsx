import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { GameGraphNode } from "@/lib/graph/types";
import { calculateNodeProperties } from "@/lib/graph/calculateNodeProperties";
import { formatDate } from "@/lib/graph/formatDate";

/* ----------------------------
   Shared resources (GLOBAL)
----------------------------- */

// Shared glow texture (created once)
const glowTexture = (() => {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;

  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.2, "rgba(255,255,255,0.5)");
  gradient.addColorStop(0.5, "rgba(255,255,255,0.1)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);

  return new THREE.CanvasTexture(canvas);
})();

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
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const { size, glowIntensity } = calculateNodeProperties(game);

  /* ----------------------------
     Geometry (single source)
  ----------------------------- */
  const geometry = useMemo(
    () => new THREE.IcosahedronGeometry(size, 0),
    [size]
  );

  /* ----------------------------
     Particle system (quantized)
  ----------------------------- */
  const particleCount = glowIntensity > 0.6 ? 20 : glowIntensity > 0.3 ? 10 : 0;

  const particleGeometry = useMemo(() => {
    if (!particleCount) return null;

    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = size * 1.5 + Math.random() * 0.4;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [particleCount, size]);

  /* ----------------------------
     Animation
  ----------------------------- */
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;

    if (meshRef.current) {
      meshRef.current.position.y =
        Math.sin(t * 0.3 + index * 0.5) * 0.15;

      meshRef.current.rotation.x = Math.sin(t * 0.1 + index) * 0.1;
      meshRef.current.rotation.y += 0.005;

      const targetScale = isSelected ? 1.4 : isHovered ? 1.1 : 1;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }

    if (glowRef.current) {
      const pulse =
        1 +
        Math.sin(t * 2 + index) * 0.15 * (0.3 + glowIntensity * 0.7);
      glowRef.current.scale.setScalar(pulse);
      glowRef.current.rotation.z += 0.002;
    }

    if (ringRef.current && glowIntensity > 0.3) {
      ringRef.current.rotation.z -= 0.01;
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.z += 0.02;
    }
  });

  return (
    <group position={position}>
      {/* Outer glow */}
      <mesh ref={glowRef} position={[0, 0, -0.2]}>
        <planeGeometry args={[size * 4, size * 4]} />
        <meshBasicMaterial
          map={glowTexture}
          color={game.color}
          transparent
          opacity={0.4 + glowIntensity * 0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Activity ring */}
      {glowIntensity > 0.2 && (
        <mesh ref={ringRef} position={[0, 0, -0.1]}>
          <ringGeometry args={[size * 1.4, size * 1.5, 64]} />
          <meshBasicMaterial
            color={game.color}
            transparent
            opacity={glowIntensity * 0.6}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Particles */}
      {particleGeometry && (
        <points ref={particlesRef} geometry={particleGeometry}>
          <pointsMaterial
            color={game.color}
            size={0.08}
            transparent
            opacity={glowIntensity * 0.8}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}

      {/* Main node */}
      <mesh
        ref={meshRef}
        geometry={geometry}
        onClick={onClick}
        onPointerOver={() => onHover(true)}
        onPointerOut={() => onHover(false)}
      >
        <meshStandardMaterial
          color={game.color}
          metalness={0.7}
          roughness={0.2}
          emissive={game.color}
          emissiveIntensity={0.4 + glowIntensity * 0.2}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Wireframe overlay */}
      <mesh geometry={geometry}>
        <meshBasicMaterial
          color={game.color}
          wireframe
          transparent
          opacity={0.25}
        />
      </mesh>

      {/* Tooltip */}
      {isHovered && !isSelected && (
        <Html distanceFactor={8}>
          <div className="bg-bg-darker/95 backdrop-blur-md border border-purple-secondary/40 rounded-xl p-4 min-w-[200px] pointer-events-none shadow-glow">
            <div className="flex items-center gap-3 mb-2">
              <img
                src={game.icon}
                alt={game.name}
                className="w-10 h-10 rounded-lg object-cover"
              />
              <p className="font-display font-semibold text-white text-sm">
                {game.name}
              </p>
            </div>

            <div className="space-y-1 text-xs text-gray-400">
              <div className="flex justify-between">
                <span>Playtime:</span>
                <span className="text-white">{Math.floor(game.playtime)} hrs</span>
              </div>
              <div className="flex justify-between">
                <span>Last played:</span>
                <span className="text-white">{formatDate(game.lastPlayed)}</span>
              </div>
              <div className="flex justify-between">
                <span>Achievements:</span>
                <span className="text-purple-light">
                  {game.achievements.unlocked}/{game.achievements.total}
                </span>
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
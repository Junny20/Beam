import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Html } from "@react-three/drei";
import * as THREE from "three";
import GameNode from "./GameNode";
import GhostNode from "./GhostNode";
import { calculateNodeProperties } from "@/lib/graph/calculateNodeProperties";
import { ghostGames } from "@/data/mockGames";
import { GameGraphNode } from "@/lib/graph/types";

const MAX_ZOOM_OUT = 50;

function CentralCore() {
  const coreRef = useRef<THREE.Mesh>(null);
  const innerGlowRef = useRef<THREE.Mesh>(null);
  const outerGlowRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;

    // Core rotation (slow + confident)
    if (coreRef.current) {
      coreRef.current.rotation.y += 0.003;
      coreRef.current.rotation.x = Math.sin(t * 0.25) * 0.12;
    }

    // Breathing glow
    const pulse = 1 + Math.sin(t * 0.9) * 0.08;

    innerGlowRef.current?.scale.setScalar(pulse);
    outerGlowRef.current?.scale.setScalar(pulse * 1.15);

    // Energy halo wobble
    if (haloRef.current) {
      haloRef.current.rotation.z -= 0.004;
      haloRef.current.rotation.x =
        Math.PI / 2 + Math.sin(t * 0.4) * 0.15;
    }
  });

  return (
    <group>
      {/* Outer atmospheric glow */}
      <mesh ref={outerGlowRef}>
        <sphereGeometry args={[2.4, 32, 32]} />
        <meshBasicMaterial
          color="#7b68ee"
          transparent
          opacity={0.06}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Inner glow shell */}
      <mesh ref={innerGlowRef}>
        <sphereGeometry args={[1.7, 32, 32]} />
        <meshBasicMaterial
          color="#a78bfa"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Energy halo ring */}
      <mesh ref={haloRef}>
        <torusGeometry args={[2.1, 0.05, 16, 120]} />
        <meshBasicMaterial
          color="#8b5cf6"
          transparent
          opacity={0.45}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Core sphere */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.7, 48, 48]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#8b5cf6"
          emissiveIntensity={0.65}
          metalness={0.85}
          roughness={0.15}
        />
      </mesh>

      {/* Core wireframe */}
      <mesh>
        <sphereGeometry args={[0.72, 24, 24]} />
        <meshBasicMaterial
          color="#c4b5fd"
          wireframe
          transparent
          opacity={0.25}
        />
      </mesh>

      {/* Label */}
      <Html center distanceFactor={7}>
        <p className="text-xs text-purple-light/70 uppercase tracking-[0.3em]">
          Your Games
        </p>
      </Html>
    </group>
  );
}

/* =======================
   Scene
======================= */
function Scene({
  nodes,
  onNodeClick,
  selectedGame,
}: {
  nodes: GameGraphNode[];
  onNodeClick: (game: GameGraphNode) => void;
  selectedGame: GameGraphNode | null;
}) {
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  const gameNodes = useMemo(
    () =>
      nodes.map((game, i) => {
        const { size } = calculateNodeProperties(game);

        const baseOrbit = 2.0;
        const spacing = 1.2;
        const orbitRadius = baseOrbit + i * spacing + size * 2;

        const angle = (i / nodes.length) * Math.PI * 2 + i * 0.35;

        const bandCount = 10; // number of Y layers
        const bandHeight = 0.9;
        const bandIndex = i % bandCount;

        const y =
          (bandIndex - (bandCount - 1) / 2) * bandHeight +
          Math.sin(angle * 1.3) * 0.3;

        return {
          game,
          position: new THREE.Vector3(
            Math.cos(angle) * orbitRadius,
            y,
            Math.sin(angle) * orbitRadius * 0.6,
          ),
        };
      }),
    [nodes],
  );

  const ghostNodes = useMemo(
    () =>
      ghostGames.map((game, i) => {
        const angle = ((i + 0.5) / ghostGames.length) * Math.PI * 2 + Math.PI;
        const d = 8 + i * 0.5;

        return {
          game,
          position: new THREE.Vector3(
            Math.cos(angle) * d,
            Math.sin(angle) * d * 0.4,
            Math.sin(angle * 2) * 1.5,
          ),
        };
      }),
    [],
  );

  const handleNodeClick = (game: GameGraphNode) => {
    onNodeClick(game);
  };

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#7b68ee" />
      <pointLight position={[-10, -10, 5]} intensity={0.3} color="#9b7eed" />

      <Stars radius={80} depth={50} count={1000} factor={4} fade speed={0.3} />

      <CentralCore />

      {gameNodes.map(({ game, position }, i) => (
        <GameNode
          key={game.id}
          game={game}
          position={position}
          onClick={() => handleNodeClick(game)}
          onHover={(h) => setHoveredNode(h ? i : null)}
          isHovered={hoveredNode === i}
          isSelected={selectedGame?.id === game.id}
          index={i}
        />
      ))}

      {ghostNodes.map(({ game, position }, i) => (
        <GhostNode key={game.id} game={game} position={position} index={i} />
      ))}

      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        minDistance={3}
        maxDistance={MAX_ZOOM_OUT} // how far we can zoom out
        autoRotate={!hoveredNode && !selectedGame}
        autoRotateSpeed={0.3}
        dampingFactor={0.02}
      />
    </>
  );
}

/* =======================
   UniverseScene
======================= */
interface UniverseSceneProps {
  nodes: GameGraphNode[];
  onNodeClick: (game: GameGraphNode) => void;
  selectedGame: GameGraphNode | null;
}

export default function UniverseScene({
  nodes,
  onNodeClick,
  selectedGame,
}: UniverseSceneProps) {
  if (!nodes.length) return null;

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 65 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
        style={{
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(135deg,#0d0618 0%,#1a0f2e 50%,#0d0618 100%)",
        }}
      >
        <Scene
          nodes={nodes}
          onNodeClick={onNodeClick}
          selectedGame={selectedGame}
        />
      </Canvas>
    </div>
  );
}

import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, Html } from "@react-three/drei";
import * as THREE from "three";
import GameNode from "./GameNode";
import GhostNode from "./GhostNode";
import { calculateNodeProperties } from "@/lib/graph/calculateNodeProperties";
import { ghostGames } from "@/data/mockGames";
import { GameGraphNode } from "@/lib/graph/types";

/* =======================
   Central Core
======================= */
function CentralCore() {
  const coreRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;

    coreRef.current?.rotation.set(
      Math.sin(t * 0.2) * 0.1,
      coreRef.current.rotation.y + 0.002,
      0,
    );

    glowRef.current?.scale.setScalar(1 + Math.sin(t * 0.8) * 0.15);

    if (ringRef.current) {
      ringRef.current.rotation.z -= 0.005;
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.3) * 0.1;
    }
  });

  return (
    <group>
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial
          color="#7b68ee"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh ref={ringRef}>
        <torusGeometry args={[2, 0.02, 16, 100]} />
        <meshBasicMaterial
          color="#7b68ee"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.3, 0.015, 16, 100]} />
        <meshBasicMaterial
          color="#9b7eed"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.6, 1]} />
        <meshStandardMaterial
          color="#fff"
          emissive="#7b68ee"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      <mesh>
        <icosahedronGeometry args={[0.6, 1]} />
        <meshBasicMaterial
          color="#7b68ee"
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>

      <Html center distanceFactor={6}>
        <p className="text-xs text-purple-light/70 uppercase tracking-widest">
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
  const { camera } = useThree();
 
  const gameNodes = useMemo(
    () =>
      nodes.map((game, i) => {
        const baseOrbit = 0.2;
        const spacing = 0.35;
        const { size } = calculateNodeProperties(game);

        const orbitDistance = baseOrbit + i * spacing + size * 10;
        const angle = (i / nodes.length) * Math.PI * 2 + i * 0.3;

        return {
          game,
          position: new THREE.Vector3(
            Math.cos(angle) * orbitDistance,
            Math.sin(angle) * orbitDistance * 0.5,
            Math.sin(angle * 1.5) * 2,
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

    const node = gameNodes.find((n) => n.game.id === game.id);
    if (!node) return;

    const target = new THREE.Vector3(
      node.position.x * 0.3,
      node.position.y * 0.3,
      6,
    );

    const animate = () => {
      camera.position.lerp(target, 0.05);
      if (camera.position.distanceTo(target) > 0.1) {
        requestAnimationFrame(animate);
      }
    };
    animate();
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
        maxDistance={20}
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
        camera={{ position: [0, 0, 12], fov: 60 }}
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

import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';
import GameNode from './GameNode';
import GhostNode from './GhostNode';
import type { Game } from '@/data/mockGames';
import { gameData, ghostGames, calculateNodeProperties } from '@/data/mockGames';

// Central star/core of the universe
function CentralCore() {
  const coreRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (coreRef.current) {
      coreRef.current.rotation.y += 0.002;
      coreRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
    }
    
    if (glowRef.current) {
      const pulse = 1 + Math.sin(time * 0.8) * 0.15;
      glowRef.current.scale.setScalar(pulse);
    }
    
    if (ringRef.current) {
      ringRef.current.rotation.z -= 0.005;
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(time * 0.3) * 0.1;
    }
  });
  
  return (
    <group>
      {/* Outer glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial
          color="#7b68ee"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Rotating ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[2, 0.02, 16, 100]} />
        <meshBasicMaterial
          color="#7b68ee"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Inner ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.3, 0.015, 16, 100]} />
        <meshBasicMaterial
          color="#9b7eed"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Main core */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.6, 1]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#7b68ee"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Core wireframe */}
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
        <div className="text-center">
          <p className="text-xs text-purple-light/70 uppercase tracking-widest">Your Games</p>
        </div>
      </Html>
    </group>
  );
}

// Main scene component
function Scene({ 
  onNodeClick,
  selectedGame,
}: { 
  onNodeClick: (game: Game) => void;
  selectedGame: Game | null;
}) {
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [hoveredGhost, setHoveredGhost] = useState<number | null>(null);
  const { camera } = useThree();
  
  // Calculate positions for real game nodes
  const gameNodes = useMemo(() => {
    return gameData.map((game, i) => {
      const { orbitDistance } = calculateNodeProperties(game);
      const angle = (i / gameData.length) * Math.PI * 2 + (i * 0.3);
      const x = Math.cos(angle) * orbitDistance;
      const y = Math.sin(angle) * orbitDistance * 0.5;
      const z = Math.sin(angle * 1.5) * 2;
      
      return { game, position: new THREE.Vector3(x, y, z) };
    });
  }, []);
  
  // Calculate positions for ghost nodes
  const ghostNodePositions = useMemo(() => {
    return ghostGames.map((game, i) => {
      const angle = ((i + 0.5) / ghostGames.length) * Math.PI * 2 + Math.PI;
      const distance = 8 + i * 0.5;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance * 0.4;
      const z = Math.sin(angle * 2) * 1.5;
      
      return { game, position: new THREE.Vector3(x, y, z) };
    });
  }, []);
  
  const handleNodeClick = (game: Game, index: number) => {
    onNodeClick(game);
    
    const node = gameNodes[index];
    const targetPos = new THREE.Vector3(
      node.position.x * 0.3,
      node.position.y * 0.3,
      6
    );
    
    const animate = () => {
      camera.position.lerp(targetPos, 0.05);
      if (camera.position.distanceTo(targetPos) > 0.1) {
        requestAnimationFrame(animate);
      }
    };
    animate();
  };
  
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#7b68ee" />
      <pointLight position={[-10, -10, 5]} intensity={0.3} color="#9b7eed" />
      
      {/* Stars */}
      <Stars
        radius={80}
        depth={50}
        count={1000}
        factor={4}
        saturation={0.5}
        fade
        speed={0.3}
      />
      
      {/* Central core */}
      <CentralCore />
      
      {/* Real game nodes */}
      {gameNodes.map(({ game, position }, i) => (
        <GameNode
          key={`game-${game.id}`}
          game={game}
          position={position}
          onClick={() => handleNodeClick(game, i)}
          onHover={(hovered) => setHoveredNode(hovered ? i : null)}
          isHovered={hoveredNode === i}
          isSelected={selectedGame?.id === game.id}
          index={i}
        />
      ))}
      
      {/* Ghost nodes for discovery */}
      {/* {ghostNodePositions.map(({ game, position }, i) => (
        <GhostNode
          key={`ghost-${game.id}`}
          game={game}
          position={position}
          onHover={(hovered) => setHoveredGhost(hovered ? i : null)}
          isHovered={hoveredGhost === i}
          index={i}
        />
      ))} */}
      
      {/* Orbit controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={20}
        autoRotate={hoveredNode === null && selectedGame === null}
        autoRotateSpeed={0.3}
        dampingFactor={0.05}
      />
    </>
  );
}

// Main component
interface UniverseSceneProps {
  onNodeClick: (game: Game) => void;
  selectedGame: Game | null;
}

export default function UniverseScene({ onNodeClick, selectedGame }: UniverseSceneProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 60 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ 
          background: 'linear-gradient(135deg, #0d0618 0%, #1a0f2e 50%, #0d0618 100%)',
          width: '100%',
          height: '100%'
        }}
        dpr={[1, 2]}
      >
        <Scene onNodeClick={onNodeClick} selectedGame={selectedGame} />
      </Canvas>
      
      {/* Instructions overlay */}
      {!selectedGame && (
        <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end pointer-events-none">
          <div className="bg-bg-darker/80 backdrop-blur-md rounded-2xl px-5 py-3 border border-purple-secondary/20">
            <p className="text-sm text-gray-400">
              <span className="text-white font-medium">Click</span> nodes to explore • 
              <span className="text-white font-medium"> Drag</span> to rotate • 
              <span className="text-white font-medium"> Scroll</span> to zoom
            </p>
          </div>
          
          <div className="bg-bg-darker/80 backdrop-blur-md rounded-2xl px-5 py-3 border border-purple-secondary/20">
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-primary" />
                <span className="text-gray-400">Your Games</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full border border-dashed border-gray-500" />
                <span className="text-gray-400">Discovery</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

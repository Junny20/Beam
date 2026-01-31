import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Mock game data for the universe
const gameData = [
  {
    id: 1,
    name: "Baldur's Gate 3",
    playtime: 342,
    recentHours: 45,
    genre: 'RPG',
    lastPlayed: '2 days ago',
    achievements: { unlocked: 47, total: 54, rarest: { name: 'Legend of the Sword Coast', percent: 2.3 } },
    topPercentile: 5,
    color: '#8B5CF6',
  },
  {
    id: 2,
    name: 'Hades II',
    playtime: 127,
    recentHours: 28,
    genre: 'Roguelike',
    lastPlayed: '1 day ago',
    achievements: { unlocked: 23, total: 35, rarest: { name: 'God Slayer', percent: 0.7 } },
    topPercentile: 12,
    color: '#EF4444',
  },
  {
    id: 3,
    name: 'Elden Ring',
    playtime: 89,
    recentHours: 5,
    genre: 'Action',
    lastPlayed: '2 weeks ago',
    achievements: { unlocked: 31, total: 42, rarest: { name: 'Elden Lord', percent: 5.1 } },
    topPercentile: 23,
    color: '#F59E0B',
  },
  {
    id: 4,
    name: 'Hollow Knight',
    playtime: 56,
    recentHours: 0,
    genre: 'Metroidvania',
    lastPlayed: '1 month ago',
    achievements: { unlocked: 52, total: 63, rarest: { name: 'Embrace the Void', percent: 1.2 } },
    topPercentile: 8,
    color: '#3B82F6',
  },
  {
    id: 5,
    name: 'Celeste',
    playtime: 43,
    recentHours: 2,
    genre: 'Platformer',
    lastPlayed: '3 weeks ago',
    achievements: { unlocked: 28, total: 30, rarest: { name: 'Farewell', percent: 3.8 } },
    topPercentile: 15,
    color: '#EC4899',
  },
  {
    id: 6,
    name: 'Portal 2',
    playtime: 38,
    recentHours: 0,
    genre: 'Puzzle',
    lastPlayed: '3 months ago',
    achievements: { unlocked: 48, total: 51, rarest: { name: 'Still Alive', percent: 8.2 } },
    topPercentile: 18,
    color: '#10B981',
  },
  {
    id: 7,
    name: 'The Witcher 3',
    playtime: 156,
    recentHours: 12,
    genre: 'RPG',
    lastPlayed: '5 days ago',
    achievements: { unlocked: 62, total: 78, rarest: { name: 'Collect Em All', percent: 4.5 } },
    topPercentile: 9,
    color: '#8B5CF6',
  },
  {
    id: 8,
    name: 'Risk of Rain 2',
    playtime: 67,
    recentHours: 18,
    genre: 'Roguelike',
    lastPlayed: '3 days ago',
    achievements: { unlocked: 35, total: 47, rarest: { name: 'Deicide', percent: 1.8 } },
    topPercentile: 14,
    color: '#EF4444',
  },
];

// Calculate node properties based on game data
function calculateNodeProperties(game: typeof gameData[0]) {
  const maxPlaytime = Math.max(...gameData.map(g => g.playtime));
  const maxRecent = Math.max(...gameData.map(g => g.recentHours));
  
  // Size based on total playtime (0.5 to 2.0)
  const size = 0.5 + (game.playtime / maxPlaytime) * 1.5;
  
  // Glow intensity based on recent activity (0 to 1)
  const glowIntensity = game.recentHours / maxRecent;
  
  // Orbit distance based on return frequency (how often you come back)
  // Games played recently get closer orbits
  const daysSinceLastPlayed = game.lastPlayed.includes('day') 
    ? parseInt(game.lastPlayed.split(' ')[0]) 
    : game.lastPlayed.includes('week') 
      ? parseInt(game.lastPlayed.split(' ')[0]) * 7 
      : game.lastPlayed.includes('month') 
        ? parseInt(game.lastPlayed.split(' ')[0]) * 30 
        : 90;
  const orbitDistance = 3 + (daysSinceLastPlayed / 90) * 4;
  
  return { size, glowIntensity, orbitDistance };
}

// Individual Game Node
function GameNode({ 
  game, 
  position, 
  onClick, 
  onHover, 
  isHovered, 
  isSelected 
}: { 
  game: typeof gameData[0];
  position: THREE.Vector3;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
  isHovered: boolean;
  isSelected: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const { size, glowIntensity } = calculateNodeProperties(game);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = position.y + Math.sin(state.clock.elapsedTime * 0.5 + game.id) * 0.1;
      
      // Scale up on hover/select
      const targetScale = isSelected ? 1.5 : isHovered ? 1.2 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
    
    if (glowRef.current) {
      // Pulsing glow based on recent activity
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2 + game.id) * 0.2 * glowIntensity;
      glowRef.current.scale.setScalar(pulse);
      
      // Rotate glow
      glowRef.current.rotation.z += 0.005;
    }
  });
  
  return (
    <group position={position}>
      {/* Glow effect */}
      <mesh ref={glowRef} position={[0, 0, -0.1]}>
        <circleGeometry args={[size * 1.5, 32]} />
        <meshBasicMaterial 
          color={game.color} 
          transparent 
          opacity={0.1 + glowIntensity * 0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Outer ring for recent activity */}
      {glowIntensity > 0.3 && (
        <mesh position={[0, 0, -0.05]}>
          <ringGeometry args={[size * 1.3, size * 1.4, 32]} />
          <meshBasicMaterial 
            color={game.color} 
            transparent 
            opacity={glowIntensity * 0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
      
      {/* Main node */}
      <mesh 
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => onHover(true)}
        onPointerOut={() => onHover(false)}
      >
        <circleGeometry args={[size, 32]} />
        <meshBasicMaterial 
          color={game.color}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Inner detail */}
      <mesh position={[0, 0, 0.01]}>
        <circleGeometry args={[size * 0.6, 32]} />
        <meshBasicMaterial 
          color="#ffffff"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Tooltip on hover */}
      {isHovered && !isSelected && (
        <Html distanceFactor={10}>
          <div className="bg-bg-darker/95 backdrop-blur-sm border border-purple-secondary/30 rounded-lg p-3 min-w-[180px] pointer-events-none">
            <p className="font-display font-semibold text-white text-sm mb-1">{game.name}</p>
            <div className="space-y-1 text-xs text-gray-400">
              <p>{game.playtime} hours played</p>
              <p>Last played: {game.lastPlayed}</p>
              <p className="text-purple-light">{game.achievements.unlocked}/{game.achievements.total} achievements</p>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

// Connection lines between nodes
function Connections({ nodes }: { nodes: { game: typeof gameData[0]; position: THREE.Vector3 }[] }) {
  const geometry = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];
    
    // Connect nodes of the same genre
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].game.genre === nodes[j].game.genre) {
          positions.push(
            nodes[i].position.x, nodes[i].position.y, nodes[i].position.z,
            nodes[j].position.x, nodes[j].position.y, nodes[j].position.z
          );
          
          const color = new THREE.Color(nodes[i].game.color);
          colors.push(color.r, color.g, color.b);
          colors.push(color.r, color.g, color.b);
        }
      }
    }
    
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    return geo;
  }, [nodes]);
  
  if (geometry.attributes.position.count === 0) return null;
  
  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial vertexColors transparent opacity={0.2} />
    </lineSegments>
  );
}

// Central hub node
function CentralHub() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.002;
    }
    if (glowRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime) * 0.1;
      glowRef.current.scale.setScalar(pulse);
    }
  });
  
  return (
    <group>
      {/* Glow */}
      <mesh ref={glowRef}>
        <circleGeometry args={[1.2, 32]} />
        <meshBasicMaterial 
          color="#7b68ee"
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Main hub */}
      <mesh ref={meshRef}>
        <circleGeometry args={[0.8, 32]} />
        <meshBasicMaterial 
          color="#ffffff"
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Inner ring */}
      <mesh>
        <ringGeometry args={[0.5, 0.6, 32]} />
        <meshBasicMaterial 
          color="#7b68ee"
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Game icon */}
      <Html center distanceFactor={5}>
        <div className="text-purple-dark">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
          </svg>
        </div>
      </Html>
    </group>
  );
}

// Game detail panel
function GameDetailPanel({ 
  game, 
  onClose 
}: { 
  game: typeof gameData[0] | null;
  onClose: () => void;
}) {
  if (!game) return null;
  
  const { size, glowIntensity } = calculateNodeProperties(game);
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
      <div className="bg-bg-darker border border-purple-secondary/30 rounded-2xl p-6 max-w-md w-full mx-4 animate-scale-in">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold"
              style={{ backgroundColor: `${game.color}30`, color: game.color }}
            >
              {game.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-white">{game.name}</h3>
              <p className="text-sm text-gray-400">{game.genre}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-purple-primary/20 rounded-xl p-4">
            <p className="text-2xl font-display font-bold text-white">{game.playtime}</p>
            <p className="text-xs text-gray-400">Total Hours</p>
          </div>
          <div className="bg-purple-primary/20 rounded-xl p-4">
            <p className="text-2xl font-display font-bold text-white">{game.recentHours}</p>
            <p className="text-xs text-gray-400">Last 2 Weeks</p>
          </div>
          <div className="bg-purple-primary/20 rounded-xl p-4">
            <p className="text-2xl font-display font-bold text-white">{game.achievements.unlocked}/{game.achievements.total}</p>
            <p className="text-xs text-gray-400">Achievements</p>
          </div>
          <div className="bg-purple-primary/20 rounded-xl p-4">
            <p className="text-2xl font-display font-bold text-purple-light">{game.topPercentile}%</p>
            <p className="text-xs text-gray-400">Top Players</p>
          </div>
        </div>
        
        {/* Rarest Achievement */}
        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            <span className="text-sm font-semibold text-yellow-400">Rarest Achievement</span>
          </div>
          <p className="text-white font-medium">{game.achievements.rarest.name}</p>
          <p className="text-xs text-gray-400">Only {game.achievements.rarest.percent}% of players have this</p>
        </div>
        
        {/* Last Played */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Last played:</span>
          <span className="text-white">{game.lastPlayed}</span>
        </div>
        
        {/* Node Properties */}
        <div className="mt-4 pt-4 border-t border-purple-secondary/20">
          <p className="text-xs text-gray-500 mb-2">Node Properties:</p>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 rounded-full bg-purple-primary/30 text-xs text-purple-light">
              Size: {size.toFixed(1)}x
            </span>
            <span className="px-2 py-1 rounded-full bg-purple-primary/30 text-xs text-purple-light">
              Activity: {(glowIntensity * 100).toFixed(0)}%
            </span>
            <span 
              className="px-2 py-1 rounded-full text-xs"
              style={{ backgroundColor: `${game.color}30`, color: game.color }}
            >
              {game.genre}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main scene component
function Scene({ onNodeClick }: { onNodeClick: (game: typeof gameData[0]) => void }) {
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const { camera } = useThree();
  
  // Calculate node positions in a spiral pattern
  const nodes = useMemo(() => {
    return gameData.map((game, i) => {
      const { orbitDistance } = calculateNodeProperties(game);
      const angle = (i / gameData.length) * Math.PI * 2;
      const x = Math.cos(angle) * orbitDistance;
      const y = Math.sin(angle) * orbitDistance * 0.6; // Flattened ellipse
      const z = Math.sin(angle * 2) * 1; // Slight depth variation
      
      return { game, position: new THREE.Vector3(x, y, z) };
    });
  }, []);
  
  const handleNodeClick = (game: typeof gameData[0], index: number) => {
    setSelectedNode(index);
    onNodeClick(game);
    
    // Smooth zoom to node
    const node = nodes[index];
    const targetPosition = new THREE.Vector3(
      node.position.x * 0.5,
      node.position.y * 0.5,
      5
    );
    
    // Animate camera (simplified - in production use GSAP or TWEEN)
    camera.position.lerp(targetPosition, 0.1);
  };
  
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      
      {/* Background stars */}
      <Stars 
        radius={50} 
        depth={50} 
        count={200} 
        factor={4} 
        saturation={0.5} 
        fade 
        speed={0.5}
      />
      
      {/* Central hub */}
      <CentralHub />
      
      {/* Connection lines */}
      <Connections nodes={nodes} />
      
      {/* Game nodes */}
      {nodes.map(({ game, position }, i) => (
        <GameNode
          key={game.id}
          game={game}
          position={position}
          onClick={() => handleNodeClick(game, i)}
          onHover={(hovered) => setHoveredNode(hovered ? i : null)}
          isHovered={hoveredNode === i}
          isSelected={selectedNode === i}
        />
      ))}
      
      {/* Orbit controls */}
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={15}
        autoRotate={hoveredNode === null && selectedNode === null}
        autoRotateSpeed={0.5}
      />
    </>
  );
}

// Main component
export default function UniverseVisualization() {
  const [selectedGame, setSelectedGame] = useState<typeof gameData[0] | null>(null);
  
  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene onNodeClick={setSelectedGame} />
      </Canvas>
      
      {/* Instructions overlay */}
      {!selectedGame && (
        <div className="absolute bottom-4 left-4 right-4 flex justify-center pointer-events-none">
          <div className="bg-bg-darker/80 backdrop-blur-sm rounded-full px-4 py-2 text-xs text-gray-400">
            Click nodes to explore • Drag to rotate • Scroll to zoom
          </div>
        </div>
      )}
      
      {/* Game detail panel */}
      <GameDetailPanel 
        game={selectedGame} 
        onClose={() => setSelectedGame(null)} 
      />
    </div>
  );
}

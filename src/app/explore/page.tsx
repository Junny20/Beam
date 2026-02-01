"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import UniverseScene from "@/components/three/UniverseScene";
import GameDetailPanel from "@/components/three/GameDetailPanel";
import { GameGraphNode } from "@/lib/graph/types";
import { Gamepad2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function ExplorePage() {
  const [nodes, setNodes] = useState<GameGraphNode[]>([]);
  const [selectedGame, setSelectedGame] = useState<GameGraphNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pageRef = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();
  const userId = searchParams.get("user");

  useEffect(() => {
    const loadGraph = async () => {
      const res = await fetch(
        userId ? `/api/graph?user=${userId}` : "/api/graph",
      );
      const data = await res.json();
      setNodes(data.nodes);
    };

    loadGraph().catch(console.error);
  }, [userId]);

  // Ensure games exist (cheap if cached)
  useEffect(() => {
    const ensureGames = async () => {
      await fetch("/api/steam/sync/owned_games", { method: "POST" });
      setIsLoading(false);
    };

    ensureGames().catch(console.error);
  }, []);

  // Entrance animation
  useEffect(() => {
    if (!isLoading && pageRef.current) {
      gsap.fromTo(
        ".explore-canvas",
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: "power3.out" },
      );
    }
  }, [isLoading]);

  // Builds the GameGraphNodes
  useEffect(() => {
    const loadGraph = async () => {
      const res = await fetch("/api/graph");
      const data = await res.json();
      setNodes(data.nodes);
    };

    loadGraph().catch(console.error);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-bg-darker flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-purple-secondary/20" />
            <div className="absolute inset-0 rounded-full border-4 border-t-purple-secondary animate-spin" />
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-purple-primary to-purple-secondary flex items-center justify-center">
              <Gamepad2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="font-display text-2xl font-bold text-white mb-2">
            Loading Universe
          </h2>
          <p className="text-gray-400">Mapping your gaming journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={pageRef} className="fixed inset-0 bg-bg-darker">
      {/* Full Screen Canvas */}
      <div className="explore-canvas absolute inset-0">
        <UniverseScene
          nodes={nodes}
          onNodeClick={setSelectedGame}
          selectedGame={selectedGame}
        />
      </div>

      {/* Game Detail Panel */}
      {selectedGame && (
        <GameDetailPanel
          game={selectedGame}
          onClose={() => setSelectedGame(null)}
        />
      )}
    </div>
  );
}

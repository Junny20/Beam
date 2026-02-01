"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { gsap } from "gsap";
import UniverseScene from "@/components/three/UniverseScene";
import GameDetailPanel from "@/components/three/GameDetailPanel";
import { GameGraphNode } from "@/lib/graph/types";
import { Gamepad2 } from "lucide-react";

export default function ExploreClient() {
  const [nodes, setNodes] = useState<GameGraphNode[]>([]);
  const [selectedGame, setSelectedGame] = useState<GameGraphNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pageRef = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();
  const userId = searchParams.get("user"); // null = your galaxy

  useEffect(() => {
    const loadGraph = async () => {
      const res = await fetch(
        userId ? `/api/graph?user=${userId}` : "/api/graph"
      );
      const data = await res.json();
      setNodes(data.nodes);
      setIsLoading(false);
    };

    loadGraph().catch(console.error);
  }, [userId]);

  useEffect(() => {
    if (!isLoading && pageRef.current) {
      gsap.fromTo(
        ".explore-canvas",
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: "power3.out" }
      );
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-bg-darker flex items-center justify-center">
        <Gamepad2 className="w-10 h-10 text-purple-400 animate-spin" />
      </div>
    );
  }

  return (
    <div ref={pageRef} className="fixed inset-0 bg-bg-darker">
      <div className="explore-canvas absolute inset-0">
        <UniverseScene
          nodes={nodes}
          onNodeClick={setSelectedGame}
          selectedGame={selectedGame}
        />
      </div>

      {selectedGame && (
        <GameDetailPanel
          game={selectedGame}
          onClose={() => setSelectedGame(null)}
        />
      )}
    </div>
  );
}
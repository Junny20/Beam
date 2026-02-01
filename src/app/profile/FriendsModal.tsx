"use client";
import { useEffect, useState } from "react";

interface Friend {
  id: string;
  steamId64: string;
  personaName: string;
  avatar: string;
}

export function FriendsModal({ onClose }: { onClose: () => void }) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/steam/friends")
      .then((r) => r.json())
      .then(setFriends)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center">
      <div className="w-full max-w-lg rounded-2xl bg-gray-900 border border-purple-500/30 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">Friends’ Galaxies</h2>

        {loading && <p className="text-white/60">Loading friends…</p>}

        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {friends.map((f) => (
            <a
              key={f.steamId64}
              href={`/explore?user=${f.id}`}
              className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-400/30 transition-all"
            >
              <img
                src={f.avatar}
                className="w-12 h-12 rounded-lg object-cover"
                alt={f.personaName}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">
                  {f.personaName}
                </p>
                <p className="text-xs text-white/50">View galaxy →</p>
              </div>
            </a>
          ))}

          {!loading && friends.length === 0 && (
            <p className="text-white/50 text-sm">No friends synced yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
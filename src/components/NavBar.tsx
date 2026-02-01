"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import profileIcon from "@/public/profileIcon.svg";

export const NavBar = () => {
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const authenticate = async () => {
      try {
        let res = await fetch("/api/steam/me");

        if (!res.ok) {
          setLoggedIn(false);
          setUsername(null);
          return;
        }

        let data = await res.json();
        setLoggedIn(true);

        if (!data.user?.personaName) {
          await fetch("/api/steam/sync/profile", { method: "POST" });

          res = await fetch("/api/steam/me");
          data = await res.json();
        }

        setUsername(data.user?.personaName ?? "Profile");
      } catch {
        setLoggedIn(false);
        setUsername(null);
      } finally {
        setLoading(false);
      }
    };

    authenticate();
  }, []);

  if (loading) {
    return null; // prevents auth flicker
  }

  const links = [
    { href: "/", label: "Home" },
    { href: "/explore", label: "Explore" },
    { href: "/leaderboard", label: "Leaderboard" },
  ];

  console.log(username);

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0a0f1c]/90 backdrop-blur-md border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Beam
          </span>

          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors ${
                  pathname === link.href
                    ? "text-white font-medium"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="relative group">
            <Link
              href={loggedIn ? "/profile" : "/api/auth/steam"}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
            >
              {loggedIn ? username : "Sign In"}
              <Image
                src={profileIcon}
                alt="profile icon"
                width={18}
                height={18}
                className="h-4 w-4 opacity-80"
              />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

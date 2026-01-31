'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const NavBar = () => {
  const [username, setUsername] = useState<string | null>(null);
  const links = [
    { href: '/', label: 'Home' },
    { href: '/explore', label: 'Explore' },
    { href: '/leaderboard', label: 'Leaderboard' },
  ];
  const pathname = usePathname();

  return (
    <div className="relative flex items-center p-[10px] bg-gray-400 w-full">
      <div className="flex flex-1 justify-center gap-[130px] items-center">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-1 whitespace-nowrap ${
              pathname === link.href
                ? 'underline underline-offset-4 font-medium'
                : 'hover:underline underline-offset-4'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="relative group text-right">
        <Link
          href={username ? '/profile' : '/login'}
          className={`px-5 py-1 whitespace-nowrap inline-block ${
            pathname === (username ? '/profile' : '/login')
              ? 'underline underline-offset-4 font-medium'
              : 'hover:underline underline-offset-4'
          }`}
        >
          {username ?? 'Sign In'}
        </Link>

        <div className="absolute right-0 top-full hidden group-hover:block group-focus-within:block w-32 bg-gray-300 text-center">
          <Link
            href="/profile"
            className="block w-full px-4 py-2 hover:bg-gray-100"
          >
            Profile
          </Link>
          <button className="block w-full px-4 py-2 hover:bg-gray-100">
            Reload
          </button>
          <button className="block w-full px-4 py-2 hover:bg-gray-100">
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

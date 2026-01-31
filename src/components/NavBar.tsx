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

    return (
        <div className="relative group flex items-center p-[15px] bg-gray-400 w-full">
            <div className="flex flex-1 justify-center gap-[130px] items-center">
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="px-3 py-1 whitespace-nowrap"
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
            <div className="text-right">
                <Link
                    href={username ? '/profile' : '/login'}
                    className="px-3 py-1 whitespace-nowrap inline-block"
                >
                    {username ?? 'Sign In'}
                </Link>

                <div className="hidden group-hover:block group-focus-within:block absolute right-0 top-full w-50 bg-gray-300">
                    <Link
                        href="/profile"
                        className=" w-full text-left block px-4 py-2 hover:bg-gray-100"
                    >
                        Profile
                    </Link>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                        Reload
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
};

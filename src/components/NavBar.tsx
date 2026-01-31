'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import profileIcon from '@/public/profileIcon.svg';

export const NavBar = () => {
    const [username, setUsername] = useState<string | null>(null);
    const links = [
        { href: '/', label: 'Home' },
        { href: '/explore', label: 'Explore' },
        { href: '/leaderboard', label: 'Leaderboard' },
    ];
    const pathname = usePathname();

    const handleReload = () => {};
    const handleLogout = () => {};

    return (
        <div className="relative flex items-center p-[10px] w-full bg-[#D9D9D9]/40 backdrop-blur-lg">
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
                    className={`px-5 py-1 whitespace-nowrap flex gap-[8px] items-center ${
                        pathname === (username ? '/profile' : '/login')
                            ? 'underline underline-offset-4 font-medium'
                            : 'hover:underline underline-offset-4'
                    }`}
                >
                    {username ?? 'Sign In'}
                    <Image
                        src={profileIcon}
                        alt="profile icon"
                        width={18}
                        height={18}
                        className="h-4 w-4 object-contain filter brightness-0 invert"
                    />
                </Link>
                <div className="absolute right-0 top-full hidden group-hover:block group-focus-within:block w-32 bg-gray-200 text-black text-center">
                    <Link
                        href="/profile"
                        className="block w-full px-4 py-2 hover:bg-gray-100"
                    >
                        Profile
                    </Link>
                    <button
                        className="block w-full px-4 py-2 hover:bg-gray-100"
                        onClick={handleReload}
                    >
                        Reload
                    </button>
                    <button
                        className="block w-full px-4 py-2 hover:bg-gray-100"
                        onClick={handleLogout}
                    >
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
};

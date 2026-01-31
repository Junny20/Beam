'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const NavBar = () => {
    const links = [
        { href: '/', label: 'Home' },
        { href: '/explore', label: 'Explore' },
        { href: '/leaderboard', label: 'Leaderboard' },
        { href: '/profile', label: 'Sign in' },
    ];

    return (
        <div className="flex justify-between p-[20px] bg-gray-500">
            <div className="flex items-center space-x-4">
                <Image
                    src="/logo.png"
                    alt="Logo"
                    width={40}
                    height={40}
                    className="rounded-full"
                />
                <span className="text-white font-bold text-lg">MyApp</span>
            </div>
            <div className="flex space-x-6">
                {links.map((link) => (
                    <Link key={link.href} href={link.href} label={link.label} />
                ))}
            </div>
        </div>
    );
};

export default NavBar;

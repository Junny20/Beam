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

    return <div className="flex justify-between p-[20px] bg-gray"></div>;
};

export default NavBar;

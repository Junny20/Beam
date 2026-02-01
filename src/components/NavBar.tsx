// 'use client';
// import React, { useState } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { usePathname } from 'next/navigation';
// import profileIcon from '@/public/profileIcon.svg';

// export const NavBar = () => {
//     const [username, setUsername] = useState<string | null>(null);
//     const links = [
//         { href: '/', label: 'Home' },
//         { href: '/explore', label: 'Explore' },
//         { href: '/leaderboard', label: 'Leaderboard' },
//     ];
//     const pathname = usePathname();

//     const handleReload = () => {};
//     const handleLogout = () => {};

//     return (
//         <div className="relative flex items-center p-[10px] w-full bg-[#D9D9D9]/40 backdrop-blur-lg">
//             <div className="flex flex-1 justify-center gap-[130px] items-center">
//                 {links.map((link) => (
//                     <Link
//                         key={link.href}
//                         href={link.href}
//                         className={`px-3 py-1 whitespace-nowrap ${
//                             pathname === link.href
//                                 ? 'underline underline-offset-4 font-medium'
//                                 : 'hover:underline underline-offset-4'
//                         }`}
//                     >
//                         {link.label}
//                     </Link>
//                 ))}
//             </div>

//             <div className="relative group text-right">
//                 <Link
//                     href={username ? '/profile' : '/api/auth/steam'}
//                     className={`px-5 py-1 whitespace-nowrap flex gap-[8px] items-center ${
//                         pathname === (username ? '/profile' : '/login')
//                             ? 'underline underline-offset-4 font-medium'
//                             : 'hover:underline underline-offset-4'
//                     }`}
//                 >
//                     {username ?? 'Sign In'}
//                     <Image
//                         src={profileIcon}
//                         alt="profile icon"
//                         width={18}
//                         height={18}
//                         className="h-4 w-4 object-contain filter brightness-0 invert"
//                     />
//                 </Link>
//                 <div className="absolute right-0 top-full hidden group-hover:block group-focus-within:block w-32 bg-gray-200 text-black text-center">
//                     <Link
//                         href="/profile"
//                         className="block w-full px-4 py-2 hover:bg-gray-100"
//                     >
//                         Profile
//                     </Link>
//                     <button
//                         className="block w-full px-4 py-2 hover:bg-gray-100"
//                         onClick={handleReload}
//                     >
//                         Reload
//                     </button>
//                     <button
//                         className="block w-full px-4 py-2 hover:bg-gray-100"
//                         onClick={handleLogout}
//                     >
//                         Log Out
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

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
        <nav className="fixed top-0 w-full z-50 bg-[#0a0f1c]/90 backdrop-blur-md border-b border-gray-800/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                            Beam
                        </span>
                    </div>

                    {/* Center Links */}
                    <div className="hidden md:flex items-center gap-8">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm transition-colors ${
                                    pathname === link.href
                                        ? 'text-white font-medium'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Auth / Profile */}
                    <div className="relative group">
                        <Link
                            href={username ? '/profile' : '/api/auth/steam'}
                            className={`flex items-center gap-2 text-sm transition-colors ${
                                pathname === '/profile]' ||
                                pathname === '/api/auth/steam'
                                    ? 'text-white font-medium'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            {username ?? 'Sign In'}
                            <Image
                                src={profileIcon}
                                alt="profile icon"
                                width={18}
                                height={18}
                                className="h-4 w-4 object-contain opacity-80"
                            />
                        </Link>

                        {/* Dropdown Menu - Dark Theme */}
                        {username && (
                            <div className="absolute right-0 top-full mt-2 w-32 bg-gray-900 border border-gray-800 rounded-lg shadow-xl overflow-hidden hidden group-hover:block group-focus-within:block">
                                <Link
                                    href="/profile"
                                    className="block w-full px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                                >
                                    Profile
                                </Link>
                                <button
                                    className="block w-full px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors text-left"
                                    onClick={handleReload}
                                >
                                    Reload
                                </button>
                                <button
                                    className="block w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-gray-800 transition-colors text-left"
                                    onClick={handleLogout}
                                >
                                    Log Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

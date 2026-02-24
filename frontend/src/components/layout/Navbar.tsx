'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Menu, X, LogIn, LogOut, ChevronDown, Shield } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface NavGroup {
    name: string;
    links: { name: string; href: string }[];
}

interface NavItem {
    name: string;
    href: string;
    external?: boolean;
}

type NavEntry = NavGroup | NavItem;

const isGroup = (entry: NavEntry): entry is NavGroup => 'links' in entry;

const navEntries: NavEntry[] = [
    {
        name: '교회소개',
        links: [
            { name: '환영인사', href: '/greetings' },
            { name: '교회연혁', href: '/history' },
            { name: '섬기는 사람들', href: '/members' },
            { name: '오시는 길', href: '/location' },
        ],
    },
    { name: '말씀/찬양', href: 'https://www.youtube.com/@행복한교회-r2k', external: true },
    {
        name: '교회소식',
        links: [
            { name: '공지사항', href: '/notices' },
            { name: '주보', href: '/bulletins' },
            { name: '앨범', href: '/galleries' },
        ],
    },
];

function DropdownMenu({ group, pathname }: { group: NavGroup; pathname: string }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const isAnyActive = group.links.some(l => pathname.startsWith(l.href));

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(!open)}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${isAnyActive
                    ? 'text-[var(--primary)] bg-[var(--primary)]/8'
                    : 'text-gray-600 hover:text-[var(--primary)] hover:bg-[var(--primary)]/5'
                    }`}
            >
                {group.name}
                <ChevronDown className={`w-3.5 h-3.5 ml-1 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className="absolute top-full left-0 mt-2 w-40 glass rounded-xl shadow-xl border border-white/30 py-2 z-50 animate-slide-down">
                    {group.links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className={`block px-4 py-2.5 text-sm font-medium transition-all duration-200 ${pathname.startsWith(link.href)
                                ? 'text-[var(--primary)] bg-[var(--primary)]/8'
                                : 'text-gray-600 hover:text-[var(--primary)] hover:bg-[var(--primary)]/5'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function Navbar() {
    const pathname = usePathname();
    const { user, logout } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`sticky top-0 z-50 transition-all duration-500 ${scrolled
            ? 'glass shadow-lg border-b border-white/20'
            : 'bg-white/70 backdrop-blur-sm border-b border-gray-100/50'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center group">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center mr-3 text-white text-lg font-bold transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                                style={{ background: 'var(--gradient-primary)' }}>
                                H
                            </div>
                            <span className="text-xl font-extrabold tracking-tight gradient-text">행복한교회</span>
                        </Link>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex md:space-x-1 items-center">
                        {navEntries.map((entry) => {
                            if (isGroup(entry)) {
                                return <DropdownMenu key={entry.name} group={entry} pathname={pathname} />;
                            }
                            if ('external' in entry && entry.external) {
                                return (
                                    <a
                                        key={entry.name}
                                        href={entry.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 text-gray-600 hover:text-[var(--primary)] hover:bg-[var(--primary)]/5"
                                    >
                                        {entry.name}
                                    </a>
                                );
                            }
                            const isActive = pathname.startsWith(entry.href);
                            return (
                                <Link
                                    key={entry.name}
                                    href={entry.href}
                                    className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${isActive
                                        ? 'text-[var(--primary)] bg-[var(--primary)]/8'
                                        : 'text-gray-600 hover:text-[var(--primary)] hover:bg-[var(--primary)]/5'
                                        }`}
                                >
                                    {entry.name}
                                    {isActive && (
                                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full"
                                            style={{ background: 'var(--gradient-primary)' }} />
                                    )}
                                </Link>
                            );
                        })}

                        {user && (
                            <>
                                <div className="w-px h-6 bg-gray-200 mx-2" />
                                <Link
                                    href="/change-password"
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 hover:text-[var(--primary)] rounded-lg transition-all duration-300 hover:bg-[var(--primary)]/5"
                                >
                                    <Shield className="w-4 h-4 mr-1.5" />
                                    비밀번호 변경
                                </Link>
                                <button
                                    onClick={logout}
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 hover:text-red-500 rounded-lg transition-all duration-300 hover:bg-red-50"
                                >
                                    <LogOut className="w-4 h-4 mr-1.5" />
                                    로그아웃
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <div className="-mr-2 flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-xl text-gray-500 hover:text-[var(--primary)] hover:bg-[var(--primary)]/5 focus:outline-none transition-all duration-300"
                        >
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden border-t border-gray-100/50 animate-slide-down">
                    <div className="px-4 pt-3 pb-4 space-y-1">
                        {navEntries.map((entry) => {
                            if (isGroup(entry)) {
                                return (
                                    <div key={entry.name}>
                                        <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">{entry.name}</div>
                                        {entry.links.map((link) => (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                onClick={() => setIsOpen(false)}
                                                className={`block px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${pathname.startsWith(link.href)
                                                    ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {link.name}
                                            </Link>
                                        ))}
                                    </div>
                                );
                            }
                            return (
                                'external' in entry && entry.external ? (
                                    <a
                                        key={entry.name}
                                        href={entry.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => setIsOpen(false)}
                                        className="block px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    >
                                        {entry.name}
                                    </a>
                                ) : (
                                    <Link
                                        key={entry.name}
                                        href={entry.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${pathname.startsWith(entry.href)
                                            ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        {entry.name}
                                    </Link>
                                )
                            );
                        })}

                        {user && (
                            <>
                                <div className="border-t border-gray-100 my-2" />
                                <Link
                                    href="/change-password"
                                    onClick={() => setIsOpen(false)}
                                    className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-[var(--primary)]/5 hover:text-[var(--primary)]"
                                >
                                    비밀번호 변경
                                </Link>
                                <button
                                    onClick={() => { logout(); setIsOpen(false); }}
                                    className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-500"
                                >
                                    로그아웃 ({user.name})
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

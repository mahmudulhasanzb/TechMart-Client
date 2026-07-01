'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Button,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from '@heroui/react';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  Cpu,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  LogIn,
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';

const NAV_LINKS = [
  { label: 'Products', href: '/products' },
  { label: 'Deals', href: '/products?tag=deals' },
  { label: 'Smartphones', href: '/products?category=Smartphones' },
  { label: 'Laptops', href: '/products?category=Laptops' },
  { label: 'Audio', href: '/products?category=Audio' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    authClient.getSession().then(({ data }) => setSession(data?.session ?? null));
  }, [pathname]);

  const handleSignOut = async () => {
    await authClient.signOut({ callbackURL: '/signin' });
    setSession(null);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-zinc-950/95 backdrop-blur-lg border-b border-zinc-800 shadow-xl shadow-black/40'
          : 'bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50'
      }`}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-shadow duration-300">
              <Cpu className="size-4 text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              TechMart
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const basePath = link.href.split('?')[0];
              const isActive = pathname === basePath;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'text-blue-400 bg-blue-500/10'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/70'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search Toggle Desktop */}
            <div className="hidden md:flex items-center">
              {searchOpen ? (
                <div className="flex items-center gap-2">
                  <Input
                    autoFocus
                    placeholder="Search gadgets…"
                    startContent={<Search className="size-4 text-zinc-400" />}
                    size="sm"
                    variant="bordered"
                    className="w-56"
                    classNames={{
                      inputWrapper:
                        'border-zinc-700 bg-zinc-900 text-white hover:border-blue-500 focus-within:border-blue-500',
                      input: 'text-white placeholder:text-zinc-500',
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        window.location.href = `/products?search=${e.target.value}`;
                        setSearchOpen(false);
                      }
                      if (e.key === 'Escape') setSearchOpen(false);
                    }}
                  />
                  <button
                    onClick={() => setSearchOpen(false)}
                    className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                    aria-label="Close search"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all duration-200"
                  aria-label="Open search"
                >
                  <Search className="size-4" />
                </button>
              )}
            </div>

            {/* Auth Actions */}
            {session ? (
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all duration-200">
                    <Avatar
                      name={session.user?.name?.charAt(0) ?? 'U'}
                      size="sm"
                      className="w-7 h-7 text-xs bg-blue-600 text-white"
                    />
                    <span className="hidden md:block max-w-[100px] truncate">
                      {session.user?.name ?? 'Account'}
                    </span>
                    <ChevronDown className="size-3 text-zinc-500" />
                  </button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Account actions"
                  className="bg-zinc-900 border border-zinc-800 text-white rounded-xl shadow-2xl"
                >
                  <DropdownItem
                    key="dashboard"
                    startContent={<LayoutDashboard className="size-4 text-blue-400" />}
                    className="text-zinc-200 hover:bg-zinc-800"
                    href="/dashboard"
                  >
                    Dashboard
                  </DropdownItem>
                  <DropdownItem
                    key="signout"
                    startContent={<LogOut className="size-4 text-red-400" />}
                    className="text-red-400 hover:bg-red-500/10"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/signin">
                  <Button
                    size="sm"
                    variant="light"
                    className="text-zinc-300 hover:text-white font-semibold hidden sm:flex"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-200"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="md:hidden p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all duration-200"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-zinc-800 py-4 flex flex-col gap-1">
            {/* Mobile Search */}
            <div className="px-2 mb-3">
              <Input
                placeholder="Search gadgets…"
                startContent={<Search className="size-4 text-zinc-400" />}
                size="sm"
                variant="bordered"
                classNames={{
                  inputWrapper: 'border-zinc-700 bg-zinc-900 text-white',
                  input: 'text-white placeholder:text-zinc-500',
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    window.location.href = `/products?search=${e.target.value}`;
                    setMenuOpen(false);
                  }
                }}
              />
            </div>

            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800/70 transition-all duration-200"
              >
                <ShoppingBag className="size-4 text-blue-400" />
                {link.label}
              </Link>
            ))}

            {!session && (
              <div className="flex gap-2 px-2 mt-3 pt-3 border-t border-zinc-800">
                <Link href="/signin" className="flex-1" onClick={() => setMenuOpen(false)}>
                  <Button
                    size="sm"
                    variant="bordered"
                    className="w-full border-zinc-700 text-zinc-300 font-semibold"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup" className="flex-1" onClick={() => setMenuOpen(false)}>
                  <Button
                    size="sm"
                    className="w-full bg-blue-600 text-white font-bold rounded-xl"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
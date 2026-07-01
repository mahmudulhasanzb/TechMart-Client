'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@heroui/react';
import {
  LayoutDashboard,
  Boxes,
  ClipboardList,
  Users,
  BarChart3,
  UserCheck,
  LogOut,
  ShoppingBag
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      icon: LayoutDashboard,
      label: 'Overview',
      path: '/dashboard',
      exact: true
    },
    {
      icon: Boxes,
      label: 'Inventory',
      path: '/dashboard/products',
    },
    {
      icon: ClipboardList,
      label: 'Orders',
      path: '/dashboard/orders',
    },
    {
      icon: Users,
      label: 'Customers',
      path: '/dashboard/customers',
    },
    {
      icon: BarChart3,
      label: 'Analytics',
      path: '/dashboard/reports',
    },
    {
      icon: UserCheck,
      label: 'Staff Portal',
      path: '/dashboard/staff',
    },
  ];

  const handleSignOut = async () => {
    await authClient.signOut({
      callbackURL: '/signin'
    });
    router.push('/signin');
    router.refresh();
  };

  return (
    <aside className="w-64 border-r border-zinc-800 bg-zinc-900 text-white flex flex-col h-screen sticky top-0">
      {/* Header */}
      <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <ShoppingBag className="size-4 text-white" />
        </div>
        <span className="font-extrabold text-lg bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          TechMart Staff
        </span>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5 overflow-y-auto">
        {navItems.map(item => {
          const isActive = item.exact 
            ? pathname === item.path 
            : pathname.startsWith(item.path);

          return (
            <Link key={item.label} href={item.path} className="block">
              <span className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}>
                <item.icon className="size-4" />
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Sign Out */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-900/60">
        <Button
          color="danger"
          variant="light"
          onClick={handleSignOut}
          className="w-full justify-start gap-3 rounded-xl text-red-400 hover:bg-red-500/10 font-bold"
          startContent={<LogOut className="size-4" />}
        >
          Sign Out
        </Button>
      </div>
    </aside>
  );
}

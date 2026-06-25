
import { Button, Drawer } from '@heroui/react';
import { Bell, Home, Mail, Menu, PersonStanding, Plus, Search, Settings } from 'lucide-react';
import Link from 'next/link';

export function DashboardSidebar() {
  const navItems = [
    { icon: Plus, label: 'Add Products', path: '/dashboard/sellar/add-products' },
    { icon: Search, label: 'Products', path: '/dashboard/sellar/products' },
    { icon: Bell, label: 'Notifications', path: '/dashboard/sellar/notifications' },
    { icon: Mail, label: 'Messages', path: '/dashboard/sellar/messages' },
    { icon: PersonStanding, label: 'Profile', path: '/dashboard/sellar/profile' },
    { icon: Settings, label: 'Settings', path: '/dashboard/sellar/settings' },
  ];

  return (
    <Drawer>
      <Button variant="secondary">
        <Menu />
        Dashboard
      </Button>

      <Drawer.Backdrop>
        <Drawer.Content placement="left" >
          <Drawer.Dialog>
            <Drawer.CloseTrigger />

            <Drawer.Header>
              <Drawer.Heading >Navigation</Drawer.Heading>
            </Drawer.Header>

            <Drawer.Body >
              <nav className="flex flex-col gap-1">
                {navItems.map(item => (
                  <Link
                    key={item.label}
                    href={item.path}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-black transition-colors hover:bg-default"
                    type="button"
                  >
                    <item.icon className="size-5 text-black" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}

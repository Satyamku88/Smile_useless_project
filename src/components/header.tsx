
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Smile, Menu, LayoutDashboard, BarChart, LineChart, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Camera', icon: Camera },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/leaderboard', label: 'Leaderboard', icon: BarChart },
    { href: '/growth', label: 'Your Growth', icon: LineChart },
  ];

  return (
    <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4">
      <Link href="/" className="flex items-center gap-2 font-headline text-2xl font-bold text-primary-foreground/80">
        <Smile className="h-8 w-8 text-primary" />
        <span>Smile Snaps</span>
      </Link>
      <nav className="hidden md:flex items-center gap-2">
        {navLinks.map(link => (
          <Button key={link.href} asChild variant={pathname === link.href ? 'secondary' : 'ghost'}>
            <Link href={link.href}>
              <link.icon className="mr-2" />
              {link.label}
            </Link>
          </Button>
        ))}
      </nav>
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {navLinks.map(link => (
                <DropdownMenuItem key={link.href} asChild>
                    <Link href={link.href} className={cn(pathname === link.href && 'bg-muted')}>
                        <link.icon className="mr-2" />
                        {link.label}
                    </Link>
                </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

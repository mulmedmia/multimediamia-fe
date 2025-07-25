"use client";

import Link from "next/link";
import { useAuthContext } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LightningBoltIcon,
  ExitIcon,
  PersonIcon,
  DashboardIcon,
} from "@radix-ui/react-icons";

export function DashboardHeader() {
  const { user, logout } = useAuthContext();
  const dashboardLink = user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard';
  const profileLink = '/profile';
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div>
              <img
                src="/MIALOGO.png"
                alt="Logo"
                className="h-6 w-6 object-contain"
              />
            </div>
            {/* Brand name is hidden on extra-small screens to save space */}
            <span className="hidden sm:inline text-xl font-bold bg-gradient-to-r from-red-600 to-red-700 dark:from-red-500 dark:to-red-700 bg-clip-text text-transparent">
              Multimedia in Action
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-auto justify-start px-3 gap-2">
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                      <PersonIcon />
                    </div>
                    <span className="font-medium hidden sm:inline">{user.name || "User"}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={dashboardLink}>
                      <DashboardIcon className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={profileLink}>
                      <PersonIcon className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-500 focus:text-red-500">
                    <ExitIcon className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
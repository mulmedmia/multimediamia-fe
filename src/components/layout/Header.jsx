"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { usePathname } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Cross1Icon,
  HamburgerMenuIcon,
  RocketIcon,
  LightningBoltIcon,
  ExitIcon,
  PersonIcon,
  DashboardIcon,
} from "@radix-ui/react-icons";

const Header = () => {
  const { user, loading, logout } = useAuthContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const landingPageNavItems = [
    { href: "#beranda", label: "Beranda" },
    { href: "#lomba", label: "Kategori Lomba" },
    { href: "#timeline", label: "Timeline" },
    { href: "#leaderboard", label: "Leaderboard" },
    { href: "#hadiah", label: "Hadiah" },
    { href: "#faq", label: "FAQ" },
  ];

  const competitionNavItems = [
    { href: "/#beranda", label: "Beranda" },
    { href: "/#lomba", label: "Kategori Lomba" },
    { href: "/#timeline", label: "Timeline" },
    { href: "/#leaderboard", label: "Leaderboard" },
    { href: "/#hadiah", label: "Hadiah" },
    { href: "/#faq", label: "FAQ" },
  ];

  const navItems = pathname.startsWith("/competition-info")
    ? competitionNavItems
    : landingPageNavItems;

  const handleLinkClick = () => setIsMenuOpen(false);

  const dashboardLink =
    user?.role === "ADMIN" ? "/admin/dashboard" : "/dashboard";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/95 dark:bg-black/80 backdrop-blur-sm border-b dark:border-gray-800"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-black rounded-xl flex items-center justify-center shadow-lg">
              <LightningBoltIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="hidden sm:inline text-xl font-bold bg-gradient-to-r from-red-600 to-red-700 dark:from-red-500 dark:to-red-700 bg-clip-text text-transparent">
                Multimedia in Action
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:text-primary transition-colors font-medium relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          <div className="flex items-center space-x-2">
            {loading ? (
              <div className="h-9 w-28 animate-pulse rounded-md bg-muted/50 hidden md:block"></div>
            ) : user ? (
              <div className="hidden sm:flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-9 w-auto justify-start px-3 gap-2"
                    >
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                        <PersonIcon />
                      </div>
                      <span className="font-medium">{user.name || "User"}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
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
                    <DropdownMenuItem onClick={logout}>
                      <ExitIcon className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/login" passHref>
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/register" passHref>
                  <Button>Daftar Sekarang</Button>
                </Link>
              </div>
            )}

            <ThemeToggle />

            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <Cross1Icon className="h-6 w-6" />
                ) : (
                  <HamburgerMenuIcon className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-background dark:bg-black border-t">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="py-2 text-muted-foreground hover:text-primary"
                  onClick={handleLinkClick}
                >
                  {item.label}
                </a>
              ))}
              <hr className="border-border my-2" />
              {user ? (
                <div className="flex flex-col space-y-2">
                  <Link href={dashboardLink} passHref>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={handleLinkClick}
                    >
                      <DashboardIcon className="mr-2 h-4 w-4" /> Dashboard
                    </Button>
                  </Link>
                  <Button
                    onClick={logout}
                    variant="ghost"
                    className="w-full justify-start text-red-500 hover:text-red-500"
                  >
                    <ExitIcon className="mr-2 h-4 w-4" /> Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-3 pt-2">
                  <Link href="/login" passHref>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleLinkClick}
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" passHref>
                    <Button className="w-full" onClick={handleLinkClick}>
                      Daftar Sekarang
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

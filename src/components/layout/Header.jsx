"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
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
  Cross1Icon,
  HamburgerMenuIcon,
  ExitIcon,
  PersonIcon,
  DashboardIcon,
} from "@radix-ui/react-icons";
import { GiftIcon } from "lucide-react";

export default function Header() {
  const { user, loading, logout } = useAuthContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "/#beranda", label: "Beranda" },
    { href: "/#lomba", label: "Kategori Lomba" },
    { href: "/#timeline", label: "Timeline" },
    { href: "/#faq", label: "FAQ" },
    { href: "/think-it", label: "Show It" },
    
  ];
  const profileLink = "/profile";
  const handleLinkClick = () => setIsMenuOpen(false);

  const dashboardLink =
    user?.role === "ADMIN" ? "/admin/dashboard" : "/dashboard";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/95 backdrop-blur-sm border-b"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div>
              <img
                src="/MIALOGO.png"
                alt="Logo"
                className="h-6 w-6 object-contain"
              />
            </div>
            <span className="hidden sm:inline text-xl font-bold bg-gradient-to-r from-red-600 to-red-700 dark:from-red-500 dark:to-red-700 bg-clip-text text-transparent">
              Multimedia in Action
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  {/* <GiftIcon className="h-4 w-4" /> */}
                  Hadiah
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[160px]">
                <DropdownMenuItem asChild>
                  <Link
                    href="/product"
                    className="flex items-center gap-2 px-2 py-2 w-full text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    <GiftIcon className="h-4 w-4" />
                    <span>Tukar Product</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
          <div className="flex items-center gap-2">
            {loading ? (
              <div className="h-9 w-24 animate-pulse rounded-md bg-muted/50 hidden sm:block"></div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-9 w-auto px-2 sm:px-3 gap-2"
                  >
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                      <PersonIcon />
                    </div>
                    <span className="hidden sm:inline font-medium text-sm">
                      {user.name || "User"}
                    </span>
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
                  <DropdownMenuItem asChild>
                    <Link href={profileLink}>
                      <PersonIcon className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <ExitIcon className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
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
        <div className="md:hidden bg-background border-t">
          <div className="container mx-auto px-4 sm:px-6 py-4 space-y-4">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  onClick={handleLinkClick}
                >
                  {item.label}
                </a>
              ))}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors w-full justify-start"
                  >
                    {/* <GiftIcon className="h-4 w-4" /> */}
                    Hadiah
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-[160px]">
                  <DropdownMenuItem asChild>
                    <Link
                      href="/product"
                      className="flex items-center gap-2 px-2 py-2 w-full text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                      onClick={handleLinkClick}
                    >
                      <GiftIcon className="h-4 w-4" />
                      <span>Tukar Product</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
            <div className="border-t pt-4">
              {user ? (
                <div className="flex flex-col space-y-2">
                  <Link href={dashboardLink} passHref>
                    <Button
                      variant="outline"
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
                <div className="flex flex-col space-y-3">
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
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

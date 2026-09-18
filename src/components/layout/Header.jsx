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
import Image from "next/image";

export default function Header() {
  const { user, loading, logout } = useAuthContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
    setWindowWidth(window.innerWidth);

    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const navItems = [
    { href: "/#beranda", label: "Beranda" },
    { href: "/#lomba", label: "Kategori Lomba" },
    { href: "/#timeline", label: "Timeline" },
    { href: "/#faq", label: "FAQ" },
    { href: "/show-it", label: "Show It" },
  ];

  const profileLink = "/profile";
  const handleLinkClick = () => setIsMenuOpen(false);

  const dashboardLink =
    user?.role === "ADMIN" ? "/admin/dashboard" : "/dashboard";

  // Prevent hydration mismatch
  if (!isMounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 h-14 sm:h-16 md:h-20 lg:h-20 bg-background/95 backdrop-blur-sm border-b">
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="flex h-16 sm:h-16 md:h-20 lg:h-20 items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 bg-muted animate-pulse rounded"></div>
              <div className="h-4 w-24 sm:h-5 sm:w-36 bg-muted animate-pulse rounded"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 sm:h-9 sm:w-9 bg-muted animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Determine logo text based on window width with better breakpoints
  const shouldShowFullText = windowWidth >= 480; // Increased from 400px
  const shouldShowMIA = windowWidth < 480 && windowWidth > 0;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full",
        scrolled
          ? "bg-[#0A0D14]/90 backdrop-blur-md border-b border-white/10 shadow-lg"
          : "bg-transparent",
      )}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between w-full min-w-0">
          {/* Logo Section */}
          <Link
            href="/"
            className="flex items-center space-x-2.5 flex-shrink-0 min-w-0"
          >
            <Image
              src="/mia2026_logo.png"
              alt="Multimedia in Action Logo"
              width={32}
              height={32}
              className="object-contain"
            />
            {shouldShowFullText && (
              <span className="text-lg sm:text-xl font-bold text-[#FFF9F5] tracking-tight">
                Multimedia <span className="text-[#E01C20]">in Action</span>
              </span>
            )}
            {shouldShowMIA && (
              <span className="text-xl font-bold text-[#E01C20]">MIA</span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-1.5 flex-1 justify-center max-w-2xl">
            {navItems.map((item, index) => {
              const isActive = pathname === "/" && index === 0;
              const linkClass = isActive
                ? "px-4 py-1.5 rounded-full bg-[#1E2939] text-[#FFF9F5] text-sm font-medium border border-white/10 shadow-sm"
                : "px-3 py-1.5 text-sm font-medium text-[#AAB1BD] hover:text-[#FFF9F5] hover:bg-[#1E2939]/50 rounded-full transition-all";

              return item.href.startsWith("/#") ? (
                <a key={item.href} href={item.href} className={linkClass}>
                  {item.label}
                </a>
              ) : (
                <Link key={item.href} href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              );
            })}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <button className="px-3 py-1.5 text-sm font-medium text-[#AAB1BD] hover:text-[#FFF9F5] hover:bg-[#1E2939]/50 rounded-full transition-all flex items-center gap-1 cursor-pointer">
                  Hadiah
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-[#1E2939] border border-white/10 text-[#FFF9F5]"
              >
                <DropdownMenuItem asChild>
                  <Link
                    href="/product"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-[#FFF9F5] hover:bg-[#0A0D14] cursor-pointer"
                  >
                    <GiftIcon className="h-4 w-4 text-[#E01C20]" />
                    <span>Tukar Product</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Desktop Auth Section */}
            <div className="hidden lg:flex items-center gap-2">
              {loading ? (
                <div className="h-9 w-20 animate-pulse rounded-full bg-[#1E2939]"></div>
              ) : user ? (
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1E2939] border border-white/10 text-[#FFF9F5] text-sm font-medium hover:border-white/20 transition-all cursor-pointer">
                      <div className="w-6 h-6 rounded-full bg-[#E01C20] text-white flex items-center justify-center text-xs font-bold">
                        {user.name ? user.name[0].toUpperCase() : "U"}
                      </div>
                      <span className="truncate max-w-[100px]">
                        {user.name || "User"}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-52 bg-[#1E2939] border border-white/10 text-[#FFF9F5]"
                    align="end"
                    forceMount
                  >
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-semibold text-[#FFF9F5] truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-[#AAB1BD] truncate">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem asChild>
                      <Link
                        href={dashboardLink}
                        className="flex items-center text-sm text-[#FFF9F5] hover:bg-[#0A0D14] cursor-pointer"
                      >
                        <DashboardIcon className="mr-2 h-4 w-4 text-[#E01C20]" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem asChild>
                      <Link
                        href={profileLink}
                        className="flex items-center text-sm text-[#FFF9F5] hover:bg-[#0A0D14] cursor-pointer"
                      >
                        <PersonIcon className="mr-2 h-4 w-4 text-[#E01C20]" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem
                      onClick={logout}
                      className="flex items-center text-sm text-[#E01C20] hover:bg-[#0A0D14] cursor-pointer"
                    >
                      <ExitIcon className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/login" passHref>
                    <span className="px-4 py-2 text-sm font-medium text-[#FFF9F5] hover:text-[#E01C20] transition-colors cursor-pointer">
                      Login
                    </span>
                  </Link>
                  <Link href="/register" passHref>
                    <span className="px-5 py-2 text-sm font-semibold rounded-full bg-[#E01C20] text-[#FFF9F5] hover:bg-[#c4181c] shadow-lg shadow-red-900/30 transition-all cursor-pointer inline-block">
                      Daftar
                    </span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile/Tablet Menu Button */}
            <div className="xl:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 flex-shrink-0"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <Cross1Icon className="h-4 w-4 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5" />
                ) : (
                  <HamburgerMenuIcon className="h-4 w-4 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Menu - Improved mobile styling */}
      {isMenuOpen && (
        <div className="xl:hidden bg-background/95 backdrop-blur-sm border-t shadow-lg">
          <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-4 sm:py-5 md:py-6">
            <div className="space-y-4">
              {/* Navigation Links */}
              <nav className="flex flex-col space-y-1">
                {navItems.map((item) =>
                  item.href.startsWith("/#") ? (
                    <a
                      key={item.href}
                      href={item.href}
                      className="py-3 sm:py-3.5 md:py-4 px-3 text-base sm:text-lg md:text-xl font-medium text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-md transition-colors"
                      onClick={handleLinkClick}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="py-3 sm:py-3.5 md:py-4 px-3 text-base sm:text-lg md:text-xl font-medium text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-md transition-colors"
                      onClick={handleLinkClick}
                    >
                      {item.label}
                    </Link>
                  ),
                )}

                {/* Mobile Hadiah Link */}
                <Link
                  href="/product"
                  className="py-3 sm:py-3.5 md:py-4 px-3 text-base sm:text-lg md:text-xl font-medium text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-md transition-colors flex items-center gap-2"
                  onClick={handleLinkClick}
                >
                  <GiftIcon className="h-5 w-5 sm:h-5.5 sm:w-5.5 md:h-6 md:w-6 flex-shrink-0" />
                  <span>Tukar Product</span>
                </Link>
              </nav>

              {/* Auth Section */}
              <div className="border-t pt-4">
                {user ? (
                  <div className="space-y-4">
                    {/* User Info */}
                    <div className="px-3 py-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          <PersonIcon className="h-4.5 w-4.5 sm:h-5 sm:w-5 md:h-5.5 md:w-5.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base sm:text-lg md:text-xl font-medium truncate">
                            {user.name}
                          </p>
                          <p className="text-sm sm:text-base md:text-lg text-muted-foreground truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* User Actions */}
                    <div className="flex flex-col space-y-3">
                      <Link href={dashboardLink} passHref>
                        <Button
                          variant="outline"
                          className="w-full justify-start h-11 sm:h-12 md:h-12 text-base sm:text-lg md:text-xl"
                          onClick={handleLinkClick}
                        >
                          <DashboardIcon className="mr-3 h-4 w-4 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5 flex-shrink-0" />
                          Dashboard
                        </Button>
                      </Link>

                      <Link href={profileLink} passHref>
                        <Button
                          variant="outline"
                          className="w-full justify-start h-11 sm:h-12 md:h-12 text-base sm:text-lg md:text-xl"
                          onClick={handleLinkClick}
                        >
                          <PersonIcon className="mr-3 h-4 w-4 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5 flex-shrink-0" />
                          Profile
                        </Button>
                      </Link>

                      <Button
                        onClick={() => {
                          logout();
                          handleLinkClick();
                        }}
                        variant="ghost"
                        className="w-full justify-start text-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 h-11 sm:h-12 md:h-12 text-base sm:text-lg md:text-xl"
                      >
                        <ExitIcon className="mr-3 h-4 w-4 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5 flex-shrink-0" />
                        Logout
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <Link href="/login" passHref>
                      <Button
                        variant="outline"
                        className="w-full h-11 sm:h-12 md:h-12 text-base sm:text-lg md:text-xl"
                        onClick={handleLinkClick}
                      >
                        Login
                      </Button>
                    </Link>
                    <Link href="/register" passHref>
                      <Button
                        className="w-full h-11 sm:h-12 md:h-12 text-base sm:text-lg md:text-xl"
                        onClick={handleLinkClick}
                      >
                        Daftar Sekarang
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Theme Toggle for Mobile/Tablet */}
                <div className="mt-5 pt-4 border-t">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-base sm:text-lg md:text-xl font-medium">
                      Theme
                    </span>
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

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
      <header className="fixed top-0 left-0 right-0 z-50 h-12 sm:h-14 md:h-16 bg-background/95 backdrop-blur-sm border-b">
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="flex h-12 sm:h-14 md:h-16 items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 bg-muted animate-pulse rounded"></div>
              <div className="h-3 w-20 sm:h-4 sm:w-32 bg-muted animate-pulse rounded"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 sm:h-8 sm:w-8 bg-muted animate-pulse rounded"></div>
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
          ? "bg-background/95 backdrop-blur-sm border-b"
          : "bg-transparent"
      )}
    >
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="flex h-12 sm:h-14 md:h-16 items-center justify-between w-full min-w-0">
          {/* Logo Section - Improved mobile responsiveness */}
          <Link
            href="/"
            className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0 min-w-0 max-w-[50%] sm:max-w-none"
          >
            <div className="flex-shrink-0">
              <img
                src="/MIALOGO.png"
                alt="Logo"
                className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 object-contain"
              />
            </div>
            {shouldShowFullText && (
              <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-bold bg-gradient-to-r from-red-600 to-red-700 dark:from-red-500 dark:to-red-700 bg-clip-text text-transparent truncate">
                Multimedia in Action
              </span>
            )}
            {shouldShowMIA && (
              <span className="text-xs sm:text-sm font-bold bg-gradient-to-r from-red-600 to-red-700 dark:from-red-500 dark:to-red-700 bg-clip-text text-transparent">
                MIA
              </span>
            )}
          </Link>

          {/* Desktop Navigation - Hidden on mobile and tablet */}
          <nav className="hidden xl:flex items-center space-x-2 2xl:space-x-4 flex-1 justify-center max-w-2xl">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-xs 2xl:text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group whitespace-nowrap px-1"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-1 2xl:gap-2 px-1 2xl:px-2 py-1 text-xs 2xl:text-sm font-medium text-muted-foreground hover:text-primary transition-colors h-7 2xl:h-8 cursor-pointer"
                >
                  Hadiah
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="min-w-[120px] sm:min-w-[140px]"
              >
                <DropdownMenuItem asChild>
                  <Link
                    href="/product"
                    className="flex items-center gap-2 px-2 py-2 w-full text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                  >
                    <GiftIcon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span>Tukar Product</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Right Section - Improved mobile layout */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 min-w-0">
            {/* Desktop Auth Section - Only show on larger screens */}
            <div className="hidden lg:flex items-center gap-1 min-w-0">
              {loading ? (
                <div className="h-7 w-14 lg:h-8 lg:w-16 animate-pulse rounded-md bg-muted/50"></div>
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-7 lg:h-8 w-auto px-1 lg:px-2 gap-1 text-xs lg:text-sm min-w-0"
                    >
                      <div className="w-4 h-4 lg:w-5 lg:h-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <PersonIcon className="h-2.5 w-2.5 lg:h-3 lg:w-3" />
                      </div>
                      <span className="hidden xl:inline font-medium truncate max-w-[60px] 2xl:max-w-[100px]">
                        {user.name || "User"}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-44 lg:w-48 xl:w-52"
                    align="end"
                    forceMount
                  >
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none truncate">
                          {user.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={dashboardLink} className="flex items-center">
                        <DashboardIcon className="mr-2 h-3 w-3 lg:h-4 lg:w-4 flex-shrink-0" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={profileLink} className="flex items-center">
                        <PersonIcon className="mr-2 h-3 w-3 lg:h-4 lg:w-4 flex-shrink-0" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={logout}
                      className="flex items-center"
                    >
                      <ExitIcon className="mr-2 h-3 w-3 lg:h-4 lg:w-4 flex-shrink-0" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-1 min-w-0">
                  <Link href="/login" passHref>
                    <Button
                      variant="ghost"
                      className="h-7 lg:h-8 px-2 lg:px-3 text-xs lg:text-sm cursor-pointer"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" passHref>
                    <Button className="h-7 lg:h-8 px-2 lg:px-3 text-xs lg:text-sm whitespace-nowrap cursor-pointer">
                      Daftar
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Theme Toggle - Only show on desktop */}
            <div className="hidden lg:block cursor-pointer">
              <ThemeToggle />
            </div>

            {/* Mobile/Tablet Menu Button */}
            <div className="xl:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <Cross1Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                ) : (
                  <HamburgerMenuIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Menu - Improved mobile styling */}
      {isMenuOpen && (
        <div className="xl:hidden bg-background/95 backdrop-blur-sm border-t shadow-lg">
          <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-3 sm:py-4">
            <div className="space-y-3">
              {/* Navigation Links */}
              <nav className="flex flex-col space-y-1">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="py-2.5 sm:py-3 px-3 text-sm sm:text-base font-medium text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-md transition-colors"
                    onClick={handleLinkClick}
                  >
                    {item.label}
                  </a>
                ))}

                {/* Mobile Hadiah Link */}
                <Link
                  href="/product"
                  className="py-2.5 sm:py-3 px-3 text-sm sm:text-base font-medium text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-md transition-colors flex items-center gap-2"
                  onClick={handleLinkClick}
                >
                  <GiftIcon className="h-4 w-4 flex-shrink-0" />
                  <span>Tukar Product</span>
                </Link>
              </nav>

              {/* Auth Section */}
              <div className="border-t pt-3">
                {user ? (
                  <div className="space-y-3">
                    {/* User Info */}
                    <div className="px-3 py-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          <PersonIcon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm sm:text-base font-medium truncate">
                            {user.name}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* User Actions */}
                    <div className="flex flex-col space-y-2">
                      <Link href={dashboardLink} passHref>
                        <Button
                          variant="outline"
                          className="w-full justify-start h-10 sm:h-11 text-sm sm:text-base"
                          onClick={handleLinkClick}
                        >
                          <DashboardIcon className="mr-3 h-4 w-4 flex-shrink-0" />
                          Dashboard
                        </Button>
                      </Link>

                      <Link href={profileLink} passHref>
                        <Button
                          variant="outline"
                          className="w-full justify-start h-10 sm:h-11 text-sm sm:text-base"
                          onClick={handleLinkClick}
                        >
                          <PersonIcon className="mr-3 h-4 w-4 flex-shrink-0" />
                          Profile
                        </Button>
                      </Link>

                      <Button
                        onClick={() => {
                          logout();
                          handleLinkClick();
                        }}
                        variant="ghost"
                        className="w-full justify-start text-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 h-10 sm:h-11 text-sm sm:text-base"
                      >
                        <ExitIcon className="mr-3 h-4 w-4 flex-shrink-0" />
                        Logout
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link href="/login" passHref>
                      <Button
                        variant="outline"
                        className="w-full h-10 sm:h-11 text-sm sm:text-base"
                        onClick={handleLinkClick}
                      >
                        Login
                      </Button>
                    </Link>
                    <Link href="/register" passHref>
                      <Button
                        className="w-full h-10 sm:h-11 text-sm sm:text-base"
                        onClick={handleLinkClick}
                      >
                        Daftar Sekarang
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Theme Toggle for Mobile/Tablet */}
                <div className="mt-4 pt-3 border-t">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-sm sm:text-base font-medium">
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

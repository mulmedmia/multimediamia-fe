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
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleResize = () => {
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
    { href: "/think-it", label: "Show It" },
  ];
  
  const profileLink = "/profile";
  const handleLinkClick = () => setIsMenuOpen(false);

  const dashboardLink =
    user?.role === "ADMIN" ? "/admin/dashboard" : "/dashboard";

  // Prevent hydration mismatch
  if (!isMounted) {
    return null;
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full",
        scrolled
          ? "bg-background/95 backdrop-blur-sm border-b"
          : "bg-transparent"
      )}
    >
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between w-full">
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <div className="flex-shrink-0">
              <img
                src="/MIALOGO.png"
                alt="Logo"
                className="h-5 w-5 sm:h-6 sm:w-6 object-contain"
              />
            </div>
            <span className="hidden xs:inline text-sm sm:text-base md:text-lg lg:text-xl font-bold bg-gradient-to-r from-red-600 to-red-700 dark:from-red-500 dark:to-red-700 bg-clip-text text-transparent truncate max-w-[150px] sm:max-w-none">
              Multimedia in Action
            </span>
            <span className="xs:hidden text-sm font-bold bg-gradient-to-r from-red-600 to-red-700 dark:from-red-500 dark:to-red-700 bg-clip-text text-transparent">
              MIA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6 flex-1 justify-center max-w-2xl">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-xs xl:text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group whitespace-nowrap"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-1 xl:gap-2 px-2 xl:px-3 py-2 text-xs xl:text-sm font-medium text-muted-foreground hover:text-primary transition-colors h-8 xl:h-9"
                >
                  Hadiah
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[140px] sm:min-w-[160px]">
                <DropdownMenuItem asChild>
                  <Link
                    href="/product"
                    className="flex items-center gap-2 px-2 py-2 w-full text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    <GiftIcon className="h-4 w-4 flex-shrink-0" />
                    <span>Tukar Product</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Desktop Auth Section */}
            <div className="hidden sm:flex items-center gap-1 sm:gap-2">
              {loading ? (
                <div className="h-8 w-16 sm:h-9 sm:w-20 animate-pulse rounded-md bg-muted/50"></div>
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 sm:h-9 w-auto px-1 sm:px-2 gap-1 sm:gap-2 text-xs sm:text-sm"
                    >
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <PersonIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                      </div>
                      <span className="hidden md:inline font-medium truncate max-w-[80px] lg:max-w-[120px]">
                        {user.name || "User"}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48 sm:w-56" align="end" forceMount>
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
                        <DashboardIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={profileLink} className="flex items-center">
                        <PersonIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="flex items-center">
                      <ExitIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Link href="/login" passHref>
                    <Button variant="ghost" className="h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" passHref>
                    <Button className="h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm whitespace-nowrap">
                      Daftar Sekarang
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            {/* Mobile Menu Button */}
            <div className="sm:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <Cross1Icon className="h-4 w-4" />
                ) : (
                  <HamburgerMenuIcon className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Tablet/Medium Screen Menu Button */}
            <div className="hidden sm:block lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 sm:h-9 sm:w-9"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <Cross1Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <HamburgerMenuIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-background/95 backdrop-blur-sm border-t shadow-lg">
          <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4">
            <div className="space-y-3 sm:space-y-4">
              {/* Navigation Links */}
              <nav className="flex flex-col space-y-1 sm:space-y-2">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="py-2 sm:py-3 px-2 text-sm sm:text-base font-medium text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-md transition-colors"
                    onClick={handleLinkClick}
                  >
                    {item.label}
                  </a>
                ))}
                
                {/* Mobile Hadiah Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 px-2 py-2 sm:py-3 text-sm sm:text-base font-medium text-muted-foreground hover:text-primary transition-colors w-full justify-start h-auto"
                    >
                      Hadiah
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="min-w-[200px] sm:min-w-[240px]">
                    <DropdownMenuItem asChild>
                      <Link
                        href="/product"
                        className="flex items-center gap-2 px-2 py-2 w-full text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                        onClick={handleLinkClick}
                      >
                        <GiftIcon className="h-4 w-4 flex-shrink-0" />
                        <span>Tukar Product</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </nav>

              {/* Auth Section */}
              <div className="border-t pt-3 sm:pt-4">
                {user ? (
                  <div className="space-y-2 sm:space-y-3">
                    {/* User Info */}
                    <div className="px-2 py-2 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          <PersonIcon className="h-4 w-4 sm:h-5 sm:w-5" />
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
                          className="w-full justify-start h-10 sm:h-11"
                          onClick={handleLinkClick}
                        >
                          <DashboardIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                          Dashboard
                        </Button>
                      </Link>
                      
                      <Link href={profileLink} passHref>
                        <Button
                          variant="outline"
                          className="w-full justify-start h-10 sm:h-11"
                          onClick={handleLinkClick}
                        >
                          <PersonIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                          Profile
                        </Button>
                      </Link>

                      <Button
                        onClick={() => {
                          logout();
                          handleLinkClick();
                        }}
                        variant="ghost"
                        className="w-full justify-start text-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 h-10 sm:h-11"
                      >
                        <ExitIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                        Logout
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2 sm:space-y-3">
                    <Link href="/login" passHref>
                      <Button
                        variant="outline"
                        className="w-full h-10 sm:h-11"
                        onClick={handleLinkClick}
                      >
                        Login
                      </Button>
                    </Link>
                    <Link href="/register" passHref>
                      <Button 
                        className="w-full h-10 sm:h-11" 
                        onClick={handleLinkClick}
                      >
                        Daftar Sekarang
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Theme Toggle for Mobile */}
                <div className="sm:hidden mt-3 pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Theme</span>
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
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuthContext } from "@/providers/AuthProvider";
import {
  Cross1Icon,
  HamburgerMenuIcon,
  RocketIcon,
  LightningBoltIcon,
  ExitIcon,
} from "@radix-ui/react-icons";

const Header = () => {
  const { user, loading, logout } = useAuthContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "#beranda", label: "Beranda" },
    { href: "#lomba", label: "Kategori Lomba" },
    { href: "#timeline", label: "Timeline" },
    { href: "#leaderboard", label: "Leaderboard" },
    { href: "#hadiah", label: "Hadiah" },
    { href: "#faq", label: "FAQ" },
  ];
  
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

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
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-black rounded-xl flex items-center justify-center shadow-lg">
              <LightningBoltIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-red-700 dark:from-red-500 dark:to-red-700 bg-clip-text text-transparent">
                Multimedia in Action
              </span>
            </div>
          </Link>

          {/* Navigasi Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="text-muted-foreground dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors font-medium relative group">
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* Tombol Aksi Kanan */}
          <div className="flex items-center space-x-2">
            {loading ? (
              <div className="h-9 w-40 animate-pulse rounded-md bg-muted/50 hidden md:block"></div>
            ) : user ? (
              <div className="hidden sm:flex items-center gap-4">
                <span className="text-sm font-medium">Hi, {user.name || "User"}</span>
                <Button onClick={logout} variant="outline" size="sm">
                  <ExitIcon className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/login" passHref>
                  <Button variant="ghost" className="text-muted-foreground dark:text-gray-300 hover:text-primary dark:hover:text-white border border-red-500">
                    Login
                  </Button>
                </Link>
                <Link href="/register" passHref>
                  <Button className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 dark:to-black text-white rounded-xl font-medium hover:from-red-700 hover:to-red-800 dark:hover:to-gray-900 shadow-lg hover:shadow-xl transition-all duration-300">
                    <RocketIcon className="h-4 w-4 mr-2" />
                    <span>Daftar Sekarang</span>
                  </Button>
                </Link>
              </div>
            )}
            
            <ThemeToggle />

            {/* Tombol Hamburger */}
            <Button
              variant="ghost"
              className="md:hidden text-foreground dark:text-white hover:bg-accent dark:hover:bg-gray-800"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <Cross1Icon className="h-6 w-6" /> : <HamburgerMenuIcon className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-background dark:bg-black border-t border-border dark:border-gray-800 shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a key={item.href} href={item.href} className="text-muted-foreground dark:text-gray-300 hover:text-primary dark:hover:text-white font-medium transition-colors" onClick={handleLinkClick}>
                  {item.label}
                </a>
              ))}
              
              <hr className="border-gray-200 dark:border-gray-700 my-2"/>

              {/* --- BAGIAN YANG DIPERBAIKI UNTUK MOBILE --- */}
              {loading ? (
                 <div className="h-9 w-full animate-pulse rounded-md bg-muted/50"></div>
              ) : user ? (
                <div className="flex flex-col items-start space-y-4">
                  <span className="font-medium">Hi, {user.name || "User"}</span>
                  <Button onClick={logout} variant="outline" className="w-full">
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-3">
                    <Link href="/login" passHref>
                        <Button variant="outline" className="w-full" onClick={handleLinkClick}>Login</Button>
                    </Link>
                    <Link href="/register" passHref>
                        <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 dark:to-black text-white" onClick={handleLinkClick}>
                            <RocketIcon className="h-4 w-4 mr-2" />
                            Daftar Sekarang
                        </Button>
                    </Link>
                </div>
              )}
              {/* --- AKHIR BAGIAN PERBAIKAN --- */}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
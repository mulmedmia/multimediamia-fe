"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
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
  PersonIcon,
} from "@radix-ui/react-icons";
import { LayoutDashboard, User, LogOut, Clock, Target, Gift, Bug } from "lucide-react";
import Image from "next/image";

export default function Header() {
  const { user, loading, logout } = useAuthContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("beranda");
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const sectionIds = ["beranda", "lomba", "timeline", "faq"];

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      if (window.location.pathname !== "/") return;

      const isBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100;

      if (isBottom) {
        setActiveSection("faq");
        return;
      }

      if (window.scrollY < 100) {
        setActiveSection("beranda");
        return;
      }

      const navOffset = 180;
      let currentSection = "beranda";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= navOffset) {
            currentSection = id;
          }
        }
      }
      setActiveSection(currentSection);
    };

    if (window.location.pathname === "/") {
      if (window.location.hash) {
        const hash = window.location.hash.replace("#", "");
        if (sectionIds.includes(hash)) {
          setActiveSection(hash);
        }
      } else {
        handleScroll();
      }
    }

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [pathname]);

  const navItems = [
    { href: "/#beranda", label: "Beranda", id: "beranda" },
    { href: "/#lomba", label: "Kategori Lomba", id: "lomba" },
    { href: "/#timeline", label: "Timeline", id: "timeline" },
    { href: "/#faq", label: "FAQ", id: "faq" },
    { href: "/show-it", label: "Show It" },
    { href: "/leaderboard", label: "Leaderboard" },
  ];

  const profileLink = "/profile";
  const handleLinkClick = () => setIsMenuOpen(false);

  const handleAnchorClick = (e, item) => {
    if (pathname === "/" && item.href.startsWith("/#")) {
      e.preventDefault();
      const targetId = item.id;
      if (targetId === "beranda") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.history.pushState(null, "", "/");
        setActiveSection("beranda");
      } else {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", item.href);
          setActiveSection(targetId);
        }
      }
    }
    setIsMenuOpen(false);
  };

  const isPeserta = user && user.role !== "ADMIN" && user.role !== "JURI";
  const historyPesananLink = "/history-pesanan";
  const misiHarianLink = "/misi-harian";
  const hadiahLink = "/product";

  const dashboardLink =
    user?.role === "ADMIN"
      ? "/admin/dashboard"
      : user?.role === "JURI"
        ? "/juri/manage-submission"
        : "/dashboard";

  const isItemActive = (item) => {
    if (pathname === "/") {
      if (item.id) {
        return activeSection === item.id;
      }
      return false;
    }

    if (item.href.startsWith("/#")) return false;
    if (pathname === item.href) return true;
    if (item.href !== "/" && pathname.startsWith(item.href)) return true;
    return false;
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full",
        scrolled || pathname !== "/"
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
            onClick={(e) => {
              if (pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
                window.history.pushState(null, "", "/");
                setActiveSection("beranda");
              }
            }}
          >
            <Image
              src="/mia2026_logo.png"
              alt="Multimedia in Action Logo"
              width={32}
              height={32}
              className="object-contain"
            />
            <span className="hidden min-[420px]:inline text-base sm:text-lg xl:text-xl font-bold text-[#FFF9F5] tracking-tight whitespace-nowrap">
              Multimedia{" "}
              <span className="bg-gradient-to-r from-[#E01C20] via-[#FF4500] to-[#FED700] bg-clip-text text-transparent">
                In Action
              </span>
            </span>
            <span className="inline min-[420px]:hidden text-xl font-bold bg-gradient-to-r from-[#E01C20] via-[#FF4500] to-[#FED700] bg-clip-text text-transparent">
              MIA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 lg:space-x-1.5 xl:space-x-2 flex-1 justify-center max-w-2xl min-w-0">
            {navItems.map((item) => {
              const isActive = isItemActive(item);
              const linkClass = isActive
                ? "px-3 xl:px-4 py-1.5 rounded-full bg-[#1E2939] text-[#FFF9F5] text-xs lg:text-sm font-medium border border-white/10 shadow-sm transition-all whitespace-nowrap"
                : "px-2.5 xl:px-3 py-1.5 text-xs lg:text-sm font-medium text-[#AAB1BD] hover:text-[#FFF9F5] hover:bg-[#1E2939]/50 rounded-full transition-all whitespace-nowrap";

              return item.href.startsWith("/#") ? (
                <a
                  key={item.href}
                  href={item.href}
                  className={linkClass}
                  onClick={(e) => handleAnchorClick(e, item)}
                >
                  {item.label}
                </a>
              ) : (
                <Link key={item.href} href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              );
            })}
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
                    className="w-56 bg-[#0A0D14] border border-white/10 text-[#FFF9F5] rounded-2xl p-2 shadow-2xl z-50"
                    align="end"
                    forceMount
                  >
                    <DropdownMenuLabel className="font-normal px-3 py-2">
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
                        className="flex items-center px-3 py-2 rounded-xl text-sm text-[#FFF9F5] hover:bg-white/5 cursor-pointer"
                      >
                        <LayoutDashboard className="mr-2 h-4 w-4 text-[#FFF9F5]" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={profileLink}
                        className="flex items-center px-3 py-2 rounded-xl text-sm text-[#FFF9F5] hover:bg-white/5 cursor-pointer"
                      >
                        <User className="mr-2 h-4 w-4 text-[#FFF9F5]" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>

                    {/* Menu khusus peserta: Misi Harian, Hadiah, History Pesanan */}
                    {isPeserta && (
                      <>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem asChild>
                          <Link
                            href={misiHarianLink}
                            className="flex items-center px-3 py-2 rounded-xl text-sm text-[#FFF9F5] hover:bg-white/5 cursor-pointer"
                          >
                            <Target className="mr-2 h-4 w-4 text-amber-400" />
                            <span>Misi Harian</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={hadiahLink}
                            className="flex items-center px-3 py-2 rounded-xl text-sm text-[#FFF9F5] hover:bg-white/5 cursor-pointer"
                          >
                            <Gift className="mr-2 h-4 w-4 text-amber-400" />
                            <span>Hadiah</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={historyPesananLink}
                            className="flex items-center px-3 py-2 rounded-xl text-sm text-[#FFF9F5] hover:bg-white/5 cursor-pointer"
                          >
                            <Clock className="mr-2 h-4 w-4 text-amber-400" />
                            <span>History Pesanan</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem asChild>
                      <a
                        href="https://forms.gle/L2GTwsMEREkcGxh29"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-3 py-2 rounded-xl text-sm text-[#FFF9F5] hover:bg-white/5 cursor-pointer"
                      >
                        <Bug className="mr-2 h-4 w-4 text-amber-400" />
                        <span>Laporkan Bug Web</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem
                      onClick={logout}
                      className="flex items-center px-3 py-2 rounded-xl text-sm text-[#E01C20] hover:bg-[#E01C20]/10 focus:text-[#E01C20] focus:bg-[#E01C20]/10 cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4 text-[#E01C20]" />
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
            <div className="lg:hidden">
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
        <div className="lg:hidden bg-background/95 backdrop-blur-sm border-t shadow-lg">
          <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-4 sm:py-5 md:py-6">
            <div className="space-y-4">
              {/* Navigation Links */}
              <nav className="flex flex-col space-y-1">
                {navItems.map((item) => {
                  const isActive = isItemActive(item);
                  const mobileClass = cn(
                    "py-3 sm:py-3.5 md:py-4 px-3 text-base sm:text-lg md:text-xl font-medium rounded-md transition-colors",
                    isActive
                      ? "text-[#FFF9F5] bg-[#1E2939] font-semibold"
                      : "text-muted-foreground hover:text-primary hover:bg-muted/50"
                  );

                  return item.href.startsWith("/#") ? (
                    <a
                      key={item.href}
                      href={item.href}
                      className={mobileClass}
                      onClick={(e) => handleAnchorClick(e, item)}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={mobileClass}
                      onClick={handleLinkClick}
                    >
                      {item.label}
                    </Link>
                  );
                })}
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
                          className="w-full justify-start h-11 sm:h-12 md:h-12 text-base sm:text-lg md:text-xl text-[#FFF9F5]"
                          onClick={handleLinkClick}
                        >
                          <LayoutDashboard className="mr-3 h-4 w-4 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5 flex-shrink-0 text-[#FFF9F5]" />
                          Dashboard
                        </Button>
                      </Link>

                      <Link href={profileLink} passHref>
                        <Button
                          variant="outline"
                          className="w-full justify-start h-11 sm:h-12 md:h-12 text-base sm:text-lg md:text-xl text-[#FFF9F5]"
                          onClick={handleLinkClick}
                        >
                          <User className="mr-3 h-4 w-4 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5 flex-shrink-0 text-[#FFF9F5]" />
                          Profile
                        </Button>
                      </Link>

                      {isPeserta && (
                        <>
                          <Link href={misiHarianLink} passHref>
                            <Button
                              variant="outline"
                              className="w-full justify-start h-11 sm:h-12 md:h-12 text-base sm:text-lg md:text-xl text-[#FFF9F5]"
                              onClick={handleLinkClick}
                            >
                              <Target className="mr-3 h-4 w-4 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5 flex-shrink-0 text-amber-400" />
                              Misi Harian
                            </Button>
                          </Link>
                          <Link href={hadiahLink} passHref>
                            <Button
                              variant="outline"
                              className="w-full justify-start h-11 sm:h-12 md:h-12 text-base sm:text-lg md:text-xl text-[#FFF9F5]"
                              onClick={handleLinkClick}
                            >
                              <Gift className="mr-3 h-4 w-4 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5 flex-shrink-0 text-amber-400" />
                              Hadiah
                            </Button>
                          </Link>
                          <Link href={historyPesananLink} passHref>
                            <Button
                              variant="outline"
                              className="w-full justify-start h-11 sm:h-12 md:h-12 text-base sm:text-lg md:text-xl text-[#FFF9F5]"
                              onClick={handleLinkClick}
                            >
                              <Clock className="mr-3 h-4 w-4 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5 flex-shrink-0 text-amber-400" />
                              History Pesanan
                            </Button>
                          </Link>
                        </>
                      )}

                      <a
                        href="https://forms.gle/L2GTwsMEREkcGxh29"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleLinkClick}
                        className="flex items-center h-11 sm:h-12 md:h-12 px-4 rounded-md border border-input text-base sm:text-lg md:text-xl text-[#FFF9F5] hover:bg-muted/50 transition-colors"
                      >
                        <Bug className="mr-3 h-4 w-4 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5 flex-shrink-0 text-amber-400" />
                        Laporkan Bug Web
                      </a>

                      <Button
                        onClick={() => {
                          logout();
                          handleLinkClick();
                        }}
                        variant="ghost"
                        className="w-full justify-start text-[#E01C20] hover:text-[#E01C20] hover:bg-red-500/10 dark:hover:bg-red-950/30 h-11 sm:h-12 md:h-12 text-base sm:text-lg md:text-xl"
                      >
                        <LogOut className="mr-3 h-4 w-4 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5 flex-shrink-0 text-[#E01C20]" />
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
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

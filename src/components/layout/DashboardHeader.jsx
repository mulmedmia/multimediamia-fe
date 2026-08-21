"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  LogOut,
  User,
  LayoutDashboard,
  Clock,
  Trophy,
  Sparkles,
  Menu,
} from "lucide-react";

export function DashboardHeader() {
  const { user, loading, logout } = useAuthContext();
  const pathname = usePathname();

  const dashboardLink = user?.role === "ADMIN" ? "/admin/dashboard" : "/dashboard";
  const profileLink = "/profile";
  const historyPesananLink = "/history-pesanan";
  const leaderboardLink = "/leaderboard";
  const showItLink = "/show-it";

  const getNavLinkClass = (href) => {
    const isActive = pathname === href;
    return isActive
      ? "px-3.5 py-1.5 rounded-full bg-[#1E2939] text-[#FFF9F5] text-sm font-medium border border-white/10 shadow-sm flex items-center gap-1.5 transition-all"
      : "px-3.5 py-1.5 rounded-full text-sm font-medium text-[#AAB1BD] hover:text-[#FFF9F5] hover:bg-[#1E2939]/50 flex items-center gap-1.5 transition-all";
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0D14]/90 backdrop-blur-md border-b border-white/10 transition-all duration-300">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-2.5 flex-shrink-0">
            <img
              src="/mia2026_logo.png"
              alt="Multimedia in Action Logo"
              className="h-8 w-8 object-contain"
            />
            <span className="text-lg sm:text-xl font-bold text-[#FFF9F5] tracking-tight">
              Multimedia <span className="text-[#E01C20]">in Action</span>
            </span>
          </Link>

          {/* Center Navigation Links for Desktop */}
          <nav className="hidden md:flex items-center space-x-2">
            <Link href={showItLink} className={getNavLinkClass(showItLink)}>
              <Sparkles className="h-4 w-4 text-[#E01C20]" />
              <span>Show It</span>
            </Link>

            <Link href={leaderboardLink} className={getNavLinkClass(leaderboardLink)}>
              <Trophy className="h-4 w-4 text-[#FED700]" />
              <span>Leaderboard</span>
            </Link>

            {/* History Pesanan HANYA tampil jika user sudah login */}
            {user && (
              <Link href={historyPesananLink} className={getNavLinkClass(historyPesananLink)}>
                <Clock className="h-4 w-4 text-[#E01C20]" />
                <span>History Pesanan</span>
              </Link>
            )}
          </nav>

          {/* Right Action Section */}
          <div className="flex items-center space-x-3">
            {loading ? (
              <div className="h-9 w-20 animate-pulse rounded-full bg-[#1E2939]"></div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1E2939] border border-white/10 text-[#FFF9F5] text-sm font-medium hover:border-white/20 transition-all cursor-pointer">
                    <div className="w-6 h-6 rounded-full bg-[#E01C20] text-white flex items-center justify-center text-xs font-bold">
                      {user.name ? user.name[0].toUpperCase() : "U"}
                    </div>
                    <span className="font-medium hidden sm:inline max-w-[120px] truncate">
                      {user.name || "User"}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 bg-[#1E2939] border border-white/10 text-[#FFF9F5]"
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
                      <LayoutDashboard className="mr-2 h-4 w-4 text-[#E01C20]" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link
                      href={profileLink}
                      className="flex items-center text-sm text-[#FFF9F5] hover:bg-[#0A0D14] cursor-pointer"
                    >
                      <User className="mr-2 h-4 w-4 text-[#E01C20]" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>

                  {/* Menu untuk mobile view di dalam dropdown */}
                  <div className="md:hidden">
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem asChild>
                      <Link
                        href={showItLink}
                        className="flex items-center text-sm text-[#FFF9F5] hover:bg-[#0A0D14] cursor-pointer"
                      >
                        <Sparkles className="mr-2 h-4 w-4 text-[#E01C20]" />
                        <span>Show It</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={leaderboardLink}
                        className="flex items-center text-sm text-[#FFF9F5] hover:bg-[#0A0D14] cursor-pointer"
                      >
                        <Trophy className="mr-2 h-4 w-4 text-[#FED700]" />
                        <span>Leaderboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={historyPesananLink}
                        className="flex items-center text-sm text-[#FFF9F5] hover:bg-[#0A0D14] cursor-pointer"
                      >
                        <Clock className="mr-2 h-4 w-4 text-[#E01C20]" />
                        <span>History Pesanan</span>
                      </Link>
                    </DropdownMenuItem>
                  </div>

                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    onClick={logout}
                    className="flex items-center text-sm text-[#E01C20] hover:bg-[#0A0D14] cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                {/* Mobile Dropdown for Unauthenticated user */}
                <div className="md:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-[#FFF9F5]">
                        <Menu className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-48 bg-[#1E2939] border border-white/10 text-[#FFF9F5]"
                      align="end"
                    >
                      <DropdownMenuItem asChild>
                        <Link
                          href={showItLink}
                          className="flex items-center text-sm text-[#FFF9F5] hover:bg-[#0A0D14] cursor-pointer"
                        >
                          <Sparkles className="mr-2 h-4 w-4 text-[#E01C20]" />
                          <span>Show It</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={leaderboardLink}
                          className="flex items-center text-sm text-[#FFF9F5] hover:bg-[#0A0D14] cursor-pointer"
                        >
                          <Trophy className="mr-2 h-4 w-4 text-[#FED700]" />
                          <span>Leaderboard</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/10" />
                      <DropdownMenuItem asChild>
                        <Link
                          href="/login"
                          className="flex items-center text-sm text-[#FFF9F5] hover:bg-[#0A0D14] cursor-pointer"
                        >
                          <span>Login</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/register"
                          className="flex items-center text-sm text-[#E01C20] font-semibold hover:bg-[#0A0D14] cursor-pointer"
                        >
                          <span>Daftar</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Desktop Buttons */}
                <div className="hidden sm:flex items-center space-x-2">
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
              </div>
            )}

            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthContext } from "@/providers/AuthProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
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
  const pathname = usePathname();
  const { user, loading, logout } = useAuthContext();

  const dashboardLink =
    user?.role === "ADMIN"
      ? "/admin/dashboard"
      : user?.role === "JURI"
      ? "/juri/manage-submission"
      : "/dashboard";
  const profileLink = "/profile";
  const historyPesananLink = "/history-pesanan";
  const leaderboardLink = "/leaderboard";
  const showItLink = "/show-it";

  const getNavLinkClass = (path) => {
    const isActive = pathname === path;
    return `hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
      isActive
        ? "bg-[#E01C20] text-white shadow-md shadow-red-900/30"
        : "bg-input/40 border border-border/50 text-foreground hover:bg-input"
    }`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-[#0F121A]/80 backdrop-blur-md text-foreground w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Logo & Brand Title */}
          <Link
            href="/"
            className="flex items-center space-x-2.5 flex-shrink-0"
          >
            <img
              src="/mia2026_logo.png"
              alt="Multimedia in Action Logo"
              className="h-7 w-7 sm:h-8 sm:w-8 object-contain"
            />
            <span className="text-base sm:text-lg font-bold text-foreground tracking-tight">
              Multimedia{" "}
              <span className="bg-gradient-to-r from-[#E01C20] via-[#FF4500] to-[#FED700] bg-clip-text text-transparent">
                In Action
              </span>
            </span>
          </Link>

          {/* Right Side Controls */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-2">
              {user && (
                <Link
                  href={historyPesananLink}
                  className={getNavLinkClass(historyPesananLink)}
                >
                  <Clock className="h-4 w-4 text-[#E01C20]" />
                  <span>History Pesanan</span>
                </Link>
              )}
              <Link
                href={showItLink}
                className={getNavLinkClass(showItLink)}
              >
                <Sparkles className="h-4 w-4 text-[#E01C20]" />
                <span>Show It</span>
              </Link>
              <Link
                href={leaderboardLink}
                className={getNavLinkClass(leaderboardLink)}
              >
                <Trophy className="h-4 w-4 text-amber-400" />
                <span>Leaderboard</span>
              </Link>
            </nav>

            {/* User Profile / Auth State */}
            {loading ? (
              <div className="h-9 w-20 animate-pulse rounded-full bg-[#141824]"></div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-input/40 border border-border/50 hover:bg-input text-xs sm:text-sm text-foreground transition-all cursor-pointer">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#E01C20] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {user.name ? user.name[0].toUpperCase() : "U"}
                    </div>
                    <span className="hidden sm:inline font-medium max-w-32 truncate">
                      {user.name || "User"}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 bg-[#0A0D14] border border-border/50 text-foreground rounded-2xl p-2 shadow-2xl z-50"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal px-3 py-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border/40" />
                  <DropdownMenuItem asChild>
                    <Link
                      href={dashboardLink}
                      className="flex items-center px-3 py-2 rounded-xl text-sm text-foreground hover:bg-white/5 cursor-pointer"
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href={profileLink}
                      className="flex items-center px-3 py-2 rounded-xl text-sm text-foreground hover:bg-white/5 cursor-pointer"
                    >
                      <User className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>

                  {/* Mobile Navigation in Dropdown */}
                  <div className="md:hidden">
                    <DropdownMenuSeparator className="bg-border/40" />
                    <DropdownMenuItem asChild>
                      <Link
                        href={historyPesananLink}
                        className="flex items-center px-3 py-2 rounded-xl text-sm text-foreground hover:bg-white/5 cursor-pointer"
                      >
                        <Clock className="mr-2 h-4 w-4 text-[#E01C20]" />
                        <span>History Pesanan</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={showItLink}
                        className="flex items-center px-3 py-2 rounded-xl text-sm text-foreground hover:bg-white/5 cursor-pointer"
                      >
                        <Sparkles className="mr-2 h-4 w-4 text-[#E01C20]" />
                        <span>Show It</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={leaderboardLink}
                        className="flex items-center px-3 py-2 rounded-xl text-sm text-foreground hover:bg-white/5 cursor-pointer"
                      >
                        <Trophy className="mr-2 h-4 w-4 text-amber-400" />
                        <span>Leaderboard</span>
                      </Link>
                    </DropdownMenuItem>
                  </div>

                  <DropdownMenuSeparator className="bg-border/40" />
                  <DropdownMenuItem
                    onClick={logout}
                    className="flex items-center px-3 py-2 rounded-xl text-sm text-destructive hover:bg-destructive/10 focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4 text-inherit" />
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
                      className="w-48 bg-[#141824] border border-white/10 text-[#FFF9F5]"
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
                  <Link href="/login">
                    <span className="px-4 py-2 text-sm font-medium text-[#FFF9F5] hover:text-[#E01C20] transition-colors cursor-pointer">
                      Login
                    </span>
                  </Link>
                  <Link href="/register">
                    <span className="px-5 py-2 text-sm font-semibold rounded-full bg-[#E01C20] text-[#FFF9F5] hover:bg-[#c4181c] shadow-lg shadow-red-900/30 transition-all cursor-pointer inline-block">
                      Daftar
                    </span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

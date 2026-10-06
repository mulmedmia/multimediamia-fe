"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu, Package, LogOut, User, ChevronLeft, Bug } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/providers/AuthProvider";
import Image from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const sidebarItems = [
  {
    title: "Manage Submission",
    href: "/juri/manage-submission",
    icon: Package,
  },
];

function SidebarContent({ onLogout, onLinkClick }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-[#0F121A]/90 backdrop-blur-md text-foreground border-r border-border/50">
      {/* Sidebar header */}
      <div className="flex h-16 sm:h-20 items-center border-b border-border/40 px-6">
        <Link
          href="/juri/manage-submission"
          className="flex items-center gap-2 font-bold tracking-tight"
        >
          <span className="text-lg sm:text-xl text-foreground">
            MIA Juri Panel
          </span>
        </Link>
      </div>

      {/* Navigation links container */}
      <nav className="flex-1 space-y-1.5 p-4 overflow-y-auto">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className={cn(
                "flex items-center space-x-3 rounded-xl px-5 py-2.5 text-sm font-medium transition-all cursor-pointer",
                isActive
                  ? "bg-gradient-to-r from-mia-orange to-mia-red text-white shadow-lg shadow-red-900/30 font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5",
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout button at the bottom */}
      <div className="p-4 border-t border-border/40">
        <button
          onClick={onLogout}
          className="flex w-full items-center space-x-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-all cursor-pointer"
        >
          <LogOut className="h-4 w-4 flex-shrink-0 text-destructive" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default function JuriLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { user, loading, logout } = useAuthContext();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && (!user || user.role !== "JURI")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "JURI") {
    return (
      <div className="h-screen flex items-center justify-center bg-background mia-connected-bg text-foreground px-4">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm sm:text-base text-muted-foreground">
            Memverifikasi akses...
          </span>
        </div>
      </div>
    );
  }

  if (!mounted) {
    return null;
  }

  const handleLinkClick = () => {
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    setSidebarOpen(false);
    logout();
  };

  return (
    <>
      <div className="flex h-screen w-full bg-background mia-connected-bg text-foreground overflow-hidden">
        {/* Desktop-only sidebar */}
        <div className="hidden lg:block lg:w-64 xl:w-72 flex-shrink-0">
          <SidebarContent onLogout={logout} />
        </div>

        {/* Scrollable Main area */}
        <div className="flex-1 overflow-y-auto relative">
          {/* Header with Glassmorphism Backdrop Blur */}
          <header className="sticky top-0 z-30 flex h-16 sm:h-20 items-center justify-between border-b border-border/40 px-4 sm:px-6 bg-[#0F121A]/80 backdrop-blur-md shadow-sm">
            {/* Left side of header */}
            <div className="flex items-center gap-3">
              {/* Mobile-only sidebar trigger */}
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden text-foreground"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="p-0 w-72 bg-[#0F121A] border-r-0"
                >
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <SidebarContent
                    onLogout={handleLogout}
                    onLinkClick={handleLinkClick}
                  />
                </SheetContent>
              </Sheet>

              {/* Logo & Brand Title */}
              <Link href="/" className="flex items-center space-x-2.5">
                <div className="relative h-7 w-7 sm:h-8 sm:w-8 aspect-square">
                  <Image
                    src="/mia2026_logo.png"
                    alt="Multimedia in Action Logo"
                    fill={true}
                    className="object-contain"
                  />
                </div>
                <span className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                  Multimedia{" "}
                  <span className="bg-gradient-to-b from-mia-orange to-mia-yellow bg-clip-text text-transparent">
                    In Action
                  </span>
                </span>
              </Link>
            </div>

            {/* Right side of header */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Button: Kembali ke Beranda */}
              <Link href="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-input/40 border-border/50 dark:border-border/50 hover:bg-input text-xs sm:text-sm text-foreground cursor-pointer px-4 h-9"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Kembali ke Beranda</span>
                </Button>
              </Link>

              {/* User Badge Dropdown */}
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-input/40 border border-border/50 text-xs sm:text-sm text-foreground hover:bg-input/60 transition-all cursor-pointer outline-none">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="hidden sm:inline truncate max-w-32 font-medium">
                      {user?.name || "Admin"}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 bg-[#0F121A] border border-border/40 text-foreground rounded-2xl p-2 shadow-2xl z-50"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal px-3 py-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {user?.name || "Admin"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user?.email || ""}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border/40" />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile"
                      className="flex items-center px-3 py-2 rounded-xl text-sm text-foreground hover:bg-white/5 cursor-pointer"
                    >
                      <User className="mr-2 h-4 w-4 text-foreground" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a
                      href="https://forms.gle/L2GTwsMEREkcGxh29"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-3 py-2 rounded-xl text-sm text-foreground hover:bg-white/5 cursor-pointer"
                    >
                      <Bug className="mr-2 h-4 w-4 text-amber-400" />
                      <span>Laporkan Bug Web</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/40" />
                  <DropdownMenuItem
                    onClick={logout}
                    className="flex items-center px-3 py-2 rounded-xl text-sm text-destructive hover:bg-destructive/10 focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4 text-destructive" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main content container */}
          <main className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">{children}</div>
          </main>
        </div>
      </div>
    </>
  );
}

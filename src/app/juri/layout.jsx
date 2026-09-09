"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu, Package, LogOut, User, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/providers/AuthProvider";

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
          <LogOut className="h-4 w-4 flex-shrink-0" />
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

        {/* Main content area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header for main content */}
          <header className="flex h-16 sm:h-20 items-center justify-between border-b border-border/40 px-4 sm:px-6 flex-shrink-0 bg-[#0F121A]/60 backdrop-blur-md z-30">
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
                <img
                  src="/mia2026_logo.png"
                  alt="Multimedia in Action Logo"
                  className="h-7 w-7 sm:h-8 sm:w-8 object-contain"
                />
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

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-input/40 border border-border/50 text-xs sm:text-sm text-foreground">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="hidden sm:inline truncate max-w-32 font-medium">
                  {user?.name || "Juri"}
                </span>
              </div>
            </div>
          </header>

          {/* Scrollable main content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">{children}</div>
          </main>
        </div>
      </div>
    </>
  );
}

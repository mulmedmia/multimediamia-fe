"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu, Package, LogOut, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/providers/AuthProvider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Toaster } from "sonner";

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
    <div className="flex h-full flex-col bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white">
      <div className="flex h-16 items-center border-b border-neutral-200 dark:border-neutral-800 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="text-lg">MIA Juri Panel</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className={cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-red-600 text-white"
                  : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="truncate">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
        <button
          onClick={onLogout}
          className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-red-400 transition-colors"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
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
  const { resolvedTheme } = useTheme();

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
      <div className="h-screen flex items-center justify-center bg-white dark:bg-black text-black dark:text-white px-4">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm sm:text-base">Memverifikasi akses...</span>
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
      <Toaster
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        position="top-right"
      />
      <div className="flex h-screen w-full bg-white dark:bg-black overflow-hidden">
        <div className="hidden lg:block lg:w-64 xl:w-72 flex-shrink-0 border-r border-neutral-200 dark:border-neutral-800">
          <SidebarContent onLogout={logout} />
        </div>

        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-16 items-center justify-between border-b border-neutral-200 dark:border-neutral-800 px-4 sm:px-6 flex-shrink-0">
            <div className="flex items-center gap-4">
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden text-black dark:text-white"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="p-0 w-72 bg-neutral-100 dark:bg-neutral-900 border-r-0"
                >
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <SidebarContent
                    onLogout={handleLogout}
                    onLinkClick={handleLinkClick}
                  />
                </SheetContent>
              </Sheet>

              <h1 className="text-xl font-semibold text-black dark:text-white">
                <span className="hidden sm:inline">Multimedia in Action</span>
                <span className="sm:hidden">MIA Juri</span>
              </h1>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                <span className="hidden sm:inline text-sm text-neutral-700 dark:text-neutral-300 truncate max-w-40">
                  {user?.name || "Juri"}
                </span>
              </div>
              <ThemeToggle />
            </div>
          </header>

          <main className="flex-1 overflow-y-auto bg-neutral-50 dark:bg-black text-black dark:text-neutral-200">
            <div className="p-4 sm:p-6 lg:p-8">{children}</div>
          </main>
        </div>
      </div>
    </>
  );
}

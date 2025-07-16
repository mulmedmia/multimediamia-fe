"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Menu,
  Package,
  Building2,
  LayoutDashboard,
  LogOut,
  User,
  Users,
  UploadCloud,
  Gamepad2,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/providers/AuthProvider";
import { Toaster } from "sonner";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Kategori",
    href: "/admin/category",
    icon: Package,
  },
  {
    title: "Pendaftar",
    href: "/admin/pendaftar",
    icon: Users,
  },
  {
    title: "Pengumpulan",
    href: "/admin/pengumpulan",
    icon: UploadCloud,
  },
  {
    title: "Produk",
    href: "/admin/product",
    icon: Building2,
  },
  {
    title: "Gamifikasi",
    href: "/admin/gamifikasi",
    icon: Gamepad2,
  },
];

function SidebarContent({ onLogout }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-gray-50">
      <div className="flex h-16 items-center border-b px-6">
        <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100",
                isActive ? "bg-blue-100 text-blue-700" : "text-gray-700"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={onLogout}
          className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuthContext();

  useEffect(() => {
    if (user === undefined) return;
    if (!user || user.role !== "ADMIN") {
      router.push("/dashboard");
      return;
    }
    setIsAuthenticated(true);
    setIsLoading(false);
  }, [user, router]);

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Toaster />
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        <div className="hidden md:flex md:w-64 md:flex-col">
          <SidebarContent onLogout={handleLogout} />
        </div>

        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="md:hidden fixed top-4 left-4 z-40 bg-gray-900 text-white border border-gray-700 shadow-lg"
            >
              <Menu className="h-4 w-4 text-gray-900" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <SidebarContent onLogout={handleLogout} />
          </SheetContent>
        </Sheet>

        <div className="flex-1 flex flex-col min-h-0">
          <header className="bg-white shadow-sm border-b px-6 py-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-gray-900 ml-12 md:ml-0">
                Multimedia in Action Admin
              </h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-700">
                    {user?.name || "Admin"}
                  </span>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6 h-full min-h-0">{children}</main>
        </div>
      </div>
    </>
  );
}

"use client";

import React, { useState, useMemo } from "react";
import { useUserCategories } from "@/hooks/user-use-category";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
} from "@/components/ui/pagination";
import { Search, Calendar, User, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

const PAGE_SIZE = 6;

// Loading skeleton component
function CategorySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <div className="relative h-48">
            <Skeleton className="w-full h-full" />
          </div>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Category card component
function CategoryCard({ category }) {
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd MMMM yyyy", { locale: id });
    } catch {
      return "Tanggal tidak valid";
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "VERIFIED":
        return "success";
      case "NOT_VERIFIED":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden">
        <img
          src={category.image || "/placeholder-image.jpg"}
          alt={category.category_name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.src = "/placeholder-image.jpg";
          }}
        />
        <div className="absolute top-4 left-4">
          <Badge variant={getStatusVariant(category.status)} className="text-xs">
            {category.status === "VERIFIED" ? "Terverifikasi" : "Belum Verifikasi"}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
          {category.title || category.category_name}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{category.category_name}</p>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
            {category.description || "Tidak ada deskripsi tersedia."}
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{category.organizer || "Penyelenggara tidak diketahui"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Deadline: {formatDate(category.deadline)}</span>
          </div>
          <div className="text-xs text-muted-foreground bg-gray-50 dark:bg-gray-800 rounded p-2">
            <div>Mulai: {formatDate(category.startDate)}</div>
            <div>Selesai: {formatDate(category.endDate)}</div>
          </div>
          
          {/* PERUBAHAN PENTING DI SINI */}
          <Link href={`/category/${category.category_id}`}>
            <Button className="w-full mt-4 group/btn">
              <span>Lihat Detail</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CategoryListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("");

  const { data, isLoading, isError, error } = useUserCategories({
    limit: PAGE_SIZE,
    page,
    search,
    status,
  });

  const categories = data?.categories || [];
  const totalPages = data?.meta?.totalPages || 1;

  const handleSearch = () => {
    setSearch(input);
    setPage(1);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const filteredCategories = useMemo(() => {
    return categories.filter(category => 
      category.status === "VERIFIED"
    );
  }, [categories]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background dark:bg-black">
        <Header />
        <main className="flex-grow container mx-auto pt-24 pb-12 px-4">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">Kategori Lomba</h1>
              <p className="text-muted-foreground">Jelajahi berbagai kategori lomba yang tersedia</p>
            </div>
            <CategorySkeleton />
        </main>
        <Footer />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col min-h-screen bg-background dark:bg-black">
        <Header />
        <main className="flex-grow container mx-auto pt-24 pb-12 px-4">
          <Alert variant="destructive" className="max-w-lg mx-auto">
            <AlertTitle>Gagal Memuat Data</AlertTitle>
            <AlertDescription>
              {error?.message || "Terjadi kesalahan saat memuat kategori. Silakan coba lagi."}
            </AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background dark:bg-black">
        <Header />
        <main className="flex-grow container mx-auto pt-24 pb-12 px-4">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-4">Kategori Lomba</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                Jelajahi berbagai kategori lomba yang tersedia dan temukan yang sesuai dengan minat dan keahlian Anda.
                </p>
            </div>

            <div className="mb-8">
                <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                        placeholder="Cari kategori lomba..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="pl-10"
                        />
                    </div>
                    <Button onClick={handleSearch} className="w-full sm:w-auto">
                        Cari
                    </Button>
                </div>
            </div>

            <div className="mb-8">
                {filteredCategories.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-lg font-semibold mb-2">Tidak Ada Kategori Ditemukan</h3>
                    <p className="text-muted-foreground">
                    {search 
                        ? `Tidak ada kategori yang cocok dengan pencarian "${search}"`
                        : "Belum ada kategori lomba yang tersedia"
                    }
                    </p>
                </div>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCategories.map((category) => (
                    <CategoryCard key={category.category_id} category={category} />
                    ))}
                </div>
                )}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink className="bg-primary text-primary-foreground">
                                {page}
                                </PaginationLink>
                            </PaginationItem>
                            {totalPages > 1 && page < totalPages && (
                                <PaginationItem>
                                <span className="px-4 py-2 text-muted-foreground">...</span>
                                </PaginationItem>
                            )}
                            {totalPages > 1 && (
                                <PaginationItem>
                                <PaginationLink>{totalPages}</PaginationLink>
                                </PaginationItem>
                            )}
                            <PaginationItem>
                                <PaginationNext
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </main>
        <Footer />
    </div>
  );
}
"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useAdminRegistrations } from "@/hooks/admin-use-pendaftar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { getPendaftarColumns } from "./pendaftar-table-config";
import PendaftarDetailModal from "./PendaftarDetailModal";
import PendaftarVerifyModal from "./PendaftarVerifyModal";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAllUserCategories } from "@/services/user-category.service";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

export default function AdminPendaftarPage() {
  // State untuk filter & pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState(""); // Untuk input search
  const [categoryId, setCategoryId] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Debounce search term untuk mengurangi API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmedInput = searchInput.trim();
      // Hanya ganti search term & reset halaman jika hasil trim berbeda
      if (trimmedInput !== searchTerm) {
        setSearchTerm(trimmedInput);
        setPage(1);
      }
    }, 500); // Delay 500ms

    return () => clearTimeout(timer);
  }, [searchInput, searchTerm]);

  // Ambil data kategori untuk filter dropdown
  const {
    data: categories = [],
    isLoading: loadingCategories,
    isError: errorCategories,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ["user-categories-dropdown"],
    queryFn: getAllUserCategories,
    staleTime: 1000 * 60 * 10,
  });

  // Ambil data pendaftar dengan server-side filtering dan pagination
  const {
    data,
    isLoading: loadingRegistrations,
    isFetching: fetchingRegistrations,
    isError: errorRegistrations,
    refetch: refetchRegistrations,
  } = useAdminRegistrations({
    page,
    limit,
    category_id: categoryId || undefined,
    search: searchTerm || undefined,
  });

  // Registrations dari API dengan referensi memori yang stabil untuk TanStack Table
  const tableData = useMemo(() => {
    return Array.isArray(data?.registrations) ? data.registrations : [];
  }, [data?.registrations]);

  const meta = data?.meta || {
    page: 1,
    limit,
    totalPages: 1,
    total: 0,
  };

  const totalItems = meta.total;
  const maxPages = meta.totalPages || 1;

  // Modal state
  const [detailData, setDetailData] = useState(null);
  const [verifyData, setVerifyData] = useState(null);

  const columns = useMemo(
    () => getPendaftarColumns({ setDetailData, setVerifyData }),
    [setDetailData, setVerifyData],
  );

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Handler untuk kategori
  const handleCategoryChange = (e) => {
    const newCategoryId = e.target.value;
    setCategoryId(newCategoryId);
    setPage(1); // Reset ke halaman 1 saat kategori berubah
  };

  // Handler untuk search input (tanpa langsung trigger API)
  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  // Handler untuk clear search
  const handleClearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
    setPage(1);
  };

  // Handler pagination
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (page < maxPages) {
      setPage((prev) => prev + 1);
    }
  };

  // Kondisi disabled untuk pagination
  const isPreviousDisabled = page <= 1;
  const isNextDisabled = page >= maxPages;

  // UI Loading (hanya saat awal muat data belum ada)
  if ((loadingRegistrations && !data) || loadingCategories) {
    return (
      <div className="container mx-auto py-10 px-4 h-full flex flex-col align-middle justify-center min-h-[60vh]">
        <div className="flex items-center space-x-3 self-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Memuat data...</p>
        </div>
      </div>
    );
  }

  // UI Error
  if (errorRegistrations || errorCategories) {
    const errorMessage = errorRegistrations
      ? "Gagal memuat data pendaftar."
      : "Gagal memuat data kategori.";

    const refetch = errorRegistrations
      ? refetchRegistrations
      : refetchCategories;

    return (
      <div className="container mx-auto py-10 px-4 h-full flex flex-col align-middle justify-center">
        <div className="text-center text-red-600 dark:text-red-400">
          <p>{errorMessage}</p>
          <Button variant="outline" onClick={() => refetch()} className="mt-4">
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
          Pendaftar
        </h1>
        <p className="text-muted-foreground">
          Kelola pendaftar kompetisi di sini.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-xl sm:text-2xl font-bold">
              Daftar Pendaftar
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              {/* Filter Kategori */}
              <select
                value={categoryId}
                onChange={handleCategoryChange}
                className="block w-full sm:w-48 h-11 px-3.5 bg-input border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring disabled:opacity-50 transition-all cursor-pointer"
                disabled={loadingCategories}
              >
                <option value="">Semua Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>

              {/* Search dengan Clear Button & Inline Spinner (Model SubmissionForm) */}
              <div className="relative flex-1">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mia-muted-2 z-10 pointer-events-none">
                  <Search className="w-4 h-4" />
                </div>
                <Input
                  placeholder="Cari nama / email / tim"
                  value={searchInput}
                  onChange={handleSearchInputChange}
                  className="h-11 bg-input rounded-xl pl-10 pr-10 text-sm text-foreground placeholder:text-mia-muted-2 border-border focus-visible:border-ring focus-visible:ring-ring/50 transition-all"
                />
                {fetchingRegistrations ? (
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : searchInput ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearSearch}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7 p-0 rounded-lg hover:bg-muted text-muted-foreground flex items-center justify-center"
                  >
                    ×
                  </Button>
                ) : null}
              </div>
            </div>
          </div>

          {/* Filter Status Info */}
          {(categoryId || searchTerm) && (
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-sm text-muted-foreground">
                Filter aktif:
              </span>
              {categoryId && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Kategori:{" "}
                  {
                    categories.find(
                      (c) => String(c.category_id) === String(categoryId),
                    )?.category_name
                  }
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setCategoryId("");
                      setPage(1);
                    }}
                    className="ml-1 h-4 w-4 p-0 hover:bg-blue-200"
                  >
                    ×
                  </Button>
                </span>
              )}
              {searchTerm && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Pencarian: "{searchTerm}"
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchInput("");
                      setSearchTerm("");
                      setPage(1);
                    }}
                    className="ml-1 h-4 w-4 p-0 hover:bg-green-200"
                  >
                    ×
                  </Button>
                </span>
              )}
              {(categoryId || searchTerm) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCategoryId("");
                    setSearchInput("");
                    setSearchTerm("");
                    setPage(1);
                  }}
                  className="text-xs"
                >
                  Hapus Semua Filter
                </Button>
              )}
            </div>
          )}
        </CardHeader>

        <CardContent>
          {tableData.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-muted-foreground text-lg font-medium mb-2">
                {searchTerm || categoryId
                  ? "Tidak ada pendaftar yang sesuai dengan filter"
                  : "Tidak ada data pendaftar"}
              </p>
              <p className="text-muted-foreground text-sm">
                {searchTerm || categoryId
                  ? "Coba ubah kriteria pencarian atau hapus filter untuk melihat data lain"
                  : "Belum ada pendaftar yang terdaftar dalam sistem"}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                  <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className="px-4 py-3 text-left font-semibold text-foreground dark:text-white bg-gray-50 dark:bg-gray-800"
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.map((row) => (
                      <tr
                        key={row.id}
                        className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className="px-4 py-3 text-foreground dark:text-white"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Enhanced Pagination dengan Info */}
              <div className="mt-6 space-y-4">
                {/* Pagination Info */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-muted-foreground">
                  <div>
                    Menampilkan {(page - 1) * limit + 1} -{" "}
                    {Math.min(page * limit, totalItems)} dari {totalItems} total
                    pendaftar
                    {(categoryId || searchTerm) && " (hasil filter)"}
                  </div>
                  <div>{maxPages > 1 && `${maxPages} halaman`}</div>
                </div>

                {/* Pagination Controls */}
                {maxPages > 1 && (
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={handlePreviousPage}
                          disabled={isPreviousDisabled}
                          className={
                            isPreviousDisabled
                              ? "cursor-not-allowed opacity-50 pointer-events-none"
                              : "cursor-pointer hover:bg-accent"
                          }
                        />
                      </PaginationItem>

                      {/* Page Numbers (untuk desktop) */}
                      <div className="hidden sm:flex items-center gap-1">
                        {[...Array(Math.min(5, maxPages))].map((_, i) => {
                          let pageNum;
                          if (maxPages <= 5) {
                            pageNum = i + 1;
                          } else if (page <= 3) {
                            pageNum = i + 1;
                          } else if (page >= maxPages - 2) {
                            pageNum = maxPages - 4 + i;
                          } else {
                            pageNum = page - 2 + i;
                          }

                          return (
                            <PaginationItem key={i}>
                              <Button
                                variant={
                                  pageNum === page ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => setPage(pageNum)}
                                className="w-8 h-8"
                              >
                                {pageNum}
                              </Button>
                            </PaginationItem>
                          );
                        })}
                      </div>

                      {/* Mobile Page Info */}
                      <PaginationItem className="sm:hidden">
                        <span className="px-3 py-1 rounded bg-muted text-foreground text-sm">
                          {page} / {maxPages}
                        </span>
                      </PaginationItem>

                      <PaginationItem>
                        <PaginationNext
                          onClick={handleNextPage}
                          disabled={isNextDisabled}
                          className={
                            isNextDisabled
                              ? "cursor-not-allowed opacity-50 pointer-events-none"
                              : "cursor-pointer hover:bg-accent"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal Detail */}
      <PendaftarDetailModal
        open={!!detailData}
        onClose={() => setDetailData(null)}
        data={detailData}
      />

      {/* Modal Verifikasi */}
      <PendaftarVerifyModal
        open={!!verifyData}
        onClose={() => setVerifyData(null)}
        data={verifyData}
      />
    </div>
  );
}

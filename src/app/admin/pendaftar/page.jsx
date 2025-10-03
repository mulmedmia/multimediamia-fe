"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useAdminRegistrations } from "@/hooks/admin-use-pendaftar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const limit = 3;

  // Debounce search term untuk mengurangi API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(1); // Reset ke halaman pertama saat search berubah
    }, 500); // Delay 500ms

    return () => clearTimeout(timer);
  }, [searchInput]);

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
  const { data, isLoading, isError, refetch } = useAdminRegistrations({
    page,
    limit,
    category: category || undefined,
    search: searchTerm || undefined,
  });

  // Registrations dari API
  const registrations = Array.isArray(data?.registrations)
    ? data.registrations
    : [];
  const meta = data?.meta || { page: 1, limit, totalPages: 1, total: 0 };

  // Client-side filtering jika backend belum mendukung
  const filteredRegistrations = useMemo(() => {
    let result = registrations;

    // Jika backend belum memfilter berdasarkan kategori
    if (category && !data?.isServerFiltered) {
      result = result.filter((reg) => {
        const regCategoryId = reg.category_id || reg.category?.category_id;
        return String(regCategoryId) === String(category);
      });
    }

    // Jika backend belum memfilter berdasarkan search
    if (searchTerm && !data?.isServerFiltered) {
      const search = searchTerm.toLowerCase();
      result = result.filter(
        (reg) =>
          reg.user?.name?.toLowerCase().includes(search) ||
          reg.user?.email?.toLowerCase().includes(search) ||
          reg.category?.category_name?.toLowerCase().includes(search) ||
          reg.team_name?.toLowerCase().includes(search)
      );
    }

    return result;
  }, [registrations, category, searchTerm, data?.isServerFiltered]);

  // Menentukan apakah menggunakan server-side atau client-side pagination
  const isUsingClientSidePagination =
    (category || searchTerm) && !data?.isServerFiltered;

  // Pagination calculations - FIXED
  const totalItems = isUsingClientSidePagination
    ? filteredRegistrations.length
    : meta.total;
  const actualTotalPages = Math.max(1, Math.ceil(totalItems / limit));

  // Client-side pagination untuk filtered data
  const paginatedData = useMemo(() => {
    if (isUsingClientSidePagination) {
      // Client-side pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      return filteredRegistrations.slice(startIndex, endIndex);
    } else {
      // Server-side pagination - gunakan data langsung dari API
      return registrations;
    }
  }, [
    filteredRegistrations,
    page,
    limit,
    registrations,
    isUsingClientSidePagination,
  ]);

  const tableData = paginatedData;

  // Modal state
  const [detailData, setDetailData] = useState(null);
  const [verifyData, setVerifyData] = useState(null);

  const columns = useMemo(
    () => getPendaftarColumns({ setDetailData, setVerifyData }),
    [setDetailData, setVerifyData]
  );

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Handler untuk kategori
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1); // Reset ke halaman pertama saat filter berubah
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

  // Handler pagination - FIXED
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    const maxPages = isUsingClientSidePagination
      ? actualTotalPages
      : meta.totalPages;
    if (page < maxPages) {
      setPage((prev) => prev + 1);
    }
  };

  // Kondisi disabled untuk pagination - FIXED
  const maxPages = isUsingClientSidePagination
    ? actualTotalPages
    : meta.totalPages;
  const isPreviousDisabled = page <= 1;
  const isNextDisabled = page >= maxPages;

  // UI Loading
  if (isLoading || loadingCategories) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Memuat data...</p>
        </div>
      </div>
    );
  }

  // UI Error
  if (isError) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="text-center text-red-600 dark:text-red-400">
          <p>Gagal memuat data pendaftar.</p>
          <Button variant="outline" onClick={() => refetch()} className="mt-4">
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  if (errorCategories) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="text-center text-red-600 dark:text-red-400">
          <p>Gagal memuat data kategori.</p>
          <Button
            variant="outline"
            onClick={() => refetchCategories()}
            className="mt-4"
          >
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
                value={category}
                onChange={handleCategoryChange}
                className="block w-full sm:w-48 px-3 py-2 bg-white border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
                disabled={loadingCategories}
              >
                <option value="">Semua Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>

              {/* Search dengan Clear Button */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari pendaftar di semua halaman..."
                  value={searchInput}
                  onChange={handleSearchInputChange}
                  className="pl-10 pr-10"
                />
                {searchInput && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearSearch}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-200"
                  >
                    ×
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Filter Status Info */}
          {(category || searchTerm) && (
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-sm text-muted-foreground">
                Filter aktif:
              </span>
              {category && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Kategori:{" "}
                  {
                    categories.find((c) => c.category_id === category)
                      ?.category_name
                  }
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setCategory("");
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
                    onClick={handleClearSearch}
                    className="ml-1 h-4 w-4 p-0 hover:bg-green-200"
                  >
                    ×
                  </Button>
                </span>
              )}
              {(category || searchTerm) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCategory("");
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
                {searchTerm || category
                  ? "Tidak ada pendaftar yang sesuai dengan filter"
                  : "Tidak ada data pendaftar"}
              </p>
              <p className="text-muted-foreground text-sm">
                {searchTerm || category
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
                              header.getContext()
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
                              cell.getContext()
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
                {/* Pagination Info - FIXED */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-muted-foreground">
                  <div>
                    Menampilkan {(page - 1) * limit + 1} -{" "}
                    {Math.min(page * limit, totalItems)} dari {totalItems} total
                    pendaftar
                    {(category || searchTerm) && " (hasil filter)"}
                  </div>
                  <div>{maxPages > 1 && `${maxPages} halaman`}</div>
                </div>

                {/* Pagination Controls - FIXED: Always show pagination if maxPages > 1 */}
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

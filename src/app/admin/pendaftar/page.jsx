"use client";

import React, { useMemo, useState } from "react";
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
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

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

  // Ambil data pendaftar dengan server-side pagination
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

  // Untuk client-side filtering (jika API tidak mendukung filter)
  const filteredRegistrations = useMemo(() => {
    let result = registrations;

    // Jika API belum mendukung filter kategori, lakukan client-side filtering
    if (category && !data?.isServerFiltered) {
      result = result.filter(
        (r) =>
          r.category_id === category || r.category?.category_id === category
      );
    }

    // Jika API belum mendukung search, lakukan client-side searching
    if (searchTerm && !data?.isServerFiltered) {
      const search = searchTerm.toLowerCase();
      result = result.filter(
        (r) =>
          r.user?.name?.toLowerCase().includes(search) ||
          r.user?.email?.toLowerCase().includes(search) ||
          r.category?.category_name?.toLowerCase().includes(search)
      );
    }

    return result;
  }, [registrations, category, searchTerm, data?.isServerFiltered]);

  // Gunakan server-side pagination jika tersedia, otherwise client-side
  const pagedRegistrations = data?.isServerFiltered
    ? registrations
    : filteredRegistrations;

  // Logika actualTotalPages yang lebih robust
  let actualTotalPages;

  // Jika ada filter aktif (category atau search) dan API tidak mendukung server filtering
  if ((category || searchTerm) && !data?.isServerFiltered) {
    // Untuk client-side filtering, hitung berdasarkan filtered data tapi tetap gunakan pagination
    actualTotalPages = Math.max(
      1,
      Math.ceil(filteredRegistrations.length / limit)
    );
  }
  // Jika API mendukung server-side filtering atau tidak ada filter
  else {
    // Gunakan meta dari server
    actualTotalPages =
      meta.totalPages ||
      Math.max(1, Math.ceil((meta.total || registrations.length) / limit));
  }

  // Modal state
  const [detailData, setDetailData] = useState(null);
  const [verifyData, setVerifyData] = useState(null);

  const columns = useMemo(
    () => getPendaftarColumns({ setDetailData, setVerifyData }),
    [setDetailData, setVerifyData]
  );

  // Table instance - untuk client-side filtering, kita perlu pagination manual
  const tableData = useMemo(() => {
    if ((category || searchTerm) && !data?.isServerFiltered) {
      // Client-side pagination untuk filtered data
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      return filteredRegistrations.slice(startIndex, endIndex);
    }
    return pagedRegistrations;
  }, [
    pagedRegistrations,
    filteredRegistrations,
    page,
    limit,
    category,
    searchTerm,
    data?.isServerFiltered,
  ]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Handler dengan debouncing
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1); // Reset ke halaman pertama saat filter berubah
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset ke halaman pertama saat search berubah
  };

  // Handler pagination
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (page < actualTotalPages) {
      setPage((prev) => prev + 1);
    }
  };

  // Tambahkan variabel untuk kondisi disabled
  const isPreviousDisabled = page <= 1;
  const isNextDisabled = page >= actualTotalPages;

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
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari pendaftar..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {tableData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchTerm || category
                  ? "Tidak ada pendaftar yang sesuai dengan filter."
                  : "Tidak ada data pendaftar."}
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

              {/* Enhanced Pagination */}
              <div className="mt-6">
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
                    <PaginationItem>
                      <span className="px-3 py-1 rounded bg-muted text-foreground text-sm">
                        Halaman {page} dari {actualTotalPages}
                      </span>
                    </PaginationItem>
                    <PaginationItem>
                      <span className="px-3 py-1 text-muted-foreground text-sm">
                        (
                        {(category || searchTerm) && !data?.isServerFiltered
                          ? filteredRegistrations.length
                          : meta.total || registrations.length}{" "}
                        total pendaftar)
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

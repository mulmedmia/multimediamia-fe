"use client";

import React, { useMemo, useState } from "react";
import { useAdminRedemptions } from "@/hooks/admin-use-reddem";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { getRedemptionColumns } from "./reddem-table-config";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ManageRedemptionPage() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const isMobile = useIsMobile();
  const isTablet = !isMobile && typeof window !== "undefined" && window.innerWidth < 1024;

  const { data, isLoading, isError } = useAdminRedemptions({ page, limit });
  const redemptions = data?.redemptions || [];
  const meta = data?.meta || { page: 1, totalPages: 1 };

  const columns = useMemo(
    () => getRedemptionColumns({ isMobile, isTablet }),
    [isMobile, isTablet]
  );

  const table = useReactTable({
    data: redemptions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: meta.totalPages,
  });

  return (
    <div className="container mx-auto py-10 px-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Riwayat Redeem User</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-10">Memuat data...</div>
          ) : isError ? (
            <div className="text-center text-red-600 py-10">Gagal memuat data.</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                  <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                          <th
                            key={header.id}
                            className="px-4 py-2 text-left font-semibold text-foreground dark:text-white bg-gray-50 dark:bg-gray-800"
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.map(row => (
                      <tr key={row.id} className="border-b dark:border-gray-800">
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id} className="px-4 py-2 text-foreground dark:text-white">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <div className="flex justify-between items-center mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  Prev
                </Button>
                <span>
                  Halaman {meta.page} dari {meta.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= meta.totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
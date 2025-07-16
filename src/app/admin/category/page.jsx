"use client";
import { useState } from "react";
import { useAdminCategories } from "@/hooks/admin-use-categories";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
  PaginationLink,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const PAGE_SIZE = 5;

export default function AdminCategoryPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const { data, isLoading, isError } = useAdminCategories({
    limit: PAGE_SIZE,
    page,
    search,
  });

  const categories = (data?.categories || [])
    .slice()
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const meta = data?.meta || {};
  const totalPages = meta.totalPages || 1;

  return (
    <div className="max-w-6xl mx-auto py-10 px-2">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Daftar Kategori</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-2 mb-4">
            <Input
              placeholder="Cari kategori..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && setSearch(input)}
              className="max-w-xs"
            />
            <Button
              onClick={() => setSearch(input)}
              className="w-full sm:w-auto"
            >
              Cari
            </Button>
          </div>
          <div className="overflow-x-auto rounded-lg border bg-background">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Judul</TableHead>
                  <TableHead>Penyelenggara</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: PAGE_SIZE }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-12 w-12 rounded" />
                      </TableCell>
                      <TableCell className="text-right flex gap-2 justify-end">
                        <Skeleton className="h-8 w-16 rounded" />
                        <Skeleton className="h-8 w-16 rounded" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : isError ? (
                  <TableRow>
                    <TableCell colSpan={8}>
                      <Alert variant="destructive">
                        <AlertTitle>Gagal memuat data</AlertTitle>
                        <AlertDescription>
                          Terjadi kesalahan saat mengambil data kategori.
                          Silakan coba lagi.
                        </AlertDescription>
                      </Alert>
                    </TableCell>
                  </TableRow>
                ) : categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      Tidak ada data
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((cat) => (
                    <TableRow key={cat.category_id}>
                      <TableCell className="font-medium">
                        {cat.category_name}
                      </TableCell>
                      <TableCell>{cat.title}</TableCell>
                      <TableCell>{cat.organizer}</TableCell>
                      <TableCell>
                        {cat.deadline
                          ? new Date(cat.deadline).toLocaleDateString("id-ID")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            cat.status === "VERIFIED"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {cat.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {cat.user?.name} <br />
                        <span className="text-xs text-muted-foreground">
                          {cat.user?.email}
                        </span>
                      </TableCell>
                      <TableCell>
                        {cat.image && (
                          <img
                            src={cat.image}
                            alt={cat.category_name}
                            className="w-12 h-12 object-cover rounded shadow"
                          />
                        )}
                      </TableCell>
                      <TableCell className="text-right flex gap-2 justify-end">
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive">
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  href="#"
                />
              </PaginationItem>
              {page > 2 && (
                <PaginationItem>
                  <PaginationLink onClick={() => setPage(1)} href="#">
                    1
                  </PaginationLink>
                </PaginationItem>
              )}
              {page > 3 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              {page > 1 && (
                <PaginationItem>
                  <PaginationLink onClick={() => setPage(page - 1)} href="#">
                    {page - 1}
                  </PaginationLink>
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink isActive href="#">
                  {page}
                </PaginationLink>
              </PaginationItem>
              {page < totalPages && (
                <PaginationItem>
                  <PaginationLink onClick={() => setPage(page + 1)} href="#">
                    {page + 1}
                  </PaginationLink>
                </PaginationItem>
              )}
              {page < totalPages - 1 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              {page < totalPages && totalPages > 1 && (
                <PaginationItem>
                  <PaginationLink onClick={() => setPage(totalPages)} href="#">
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= totalPages}
                  href="#"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardContent>
      </Card>
    </div>
  );
}

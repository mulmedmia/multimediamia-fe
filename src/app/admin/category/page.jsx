"use client";
import { useState } from "react";
import {
  useAdminCategories,
  useCreateAdminCategory,
  useUpdateAdminCategory,
  useDeleteAdminCategory,
} from "@/hooks/admin-use-categories";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
} from "@/components/ui/pagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Search } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { getCategoryColumns } from "./category-table-config";
import CategoryForm from "./CategoryForm";
import CategoryCard from "./CategoryCard";
import MobileSkeletonLoader from "./MobileSkeletonLoader";

const PAGE_SIZE = 5;

export default function AdminCategoryPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const isMobile = useIsMobile();

  const { data, isLoading, isError } = useAdminCategories({
    limit: PAGE_SIZE,
    page,
    search,
  });

  const createMutation = useCreateAdminCategory(() => setOpenCreate(false));
  const updateMutation = useUpdateAdminCategory(() => setEditData(null));
  const deleteMutation = useDeleteAdminCategory(() => setDeleteId(null));

  const categories = data?.categories || [];
  const totalPages = data?.meta?.totalPages || 1;

  const columns = getCategoryColumns({ setEditData, setDeleteId });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-xl sm:text-2xl font-bold">
              Daftar Kategori
            </CardTitle>
            <Dialog open={openCreate} onOpenChange={setOpenCreate}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Kategori
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Tambah Kategori</DialogTitle>
                </DialogHeader>
                <CategoryForm
                  onSubmit={createMutation.mutate}
                  isLoading={createMutation.isPending}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari kategori..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && setSearch(input)}
                className="pl-10"
              />
            </div>
            <Button
              onClick={() => setSearch(input)}
              className="w-full sm:w-auto"
            >
              Cari
            </Button>
          </div>

          <div>
            {isLoading ? (
              isMobile ? (
                <MobileSkeletonLoader />
              ) : (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex gap-2">
                      <div className="flex-1">
                        <div className="h-8 bg-muted rounded mb-2" />
                        <div className="h-4 bg-muted rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : isError ? (
              <Alert variant="destructive">
                <AlertTitle>Gagal memuat data</AlertTitle>
                <AlertDescription>
                  Terjadi kesalahan. Silakan coba lagi.
                </AlertDescription>
              </Alert>
            ) : categories.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Tidak ada data kategori ditemukan.
                </p>
              </div>
            ) : isMobile ? (
              <div className="space-y-4">
                {categories.map((cat) => (
                  <CategoryCard
                    key={cat.category_id}
                    category={cat}
                    onEdit={setEditData}
                    onDelete={setDeleteId}
                  />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      {columns.map((col) => (
                        <th
                          key={col.header}
                          className="whitespace-nowrap px-4 py-2 text-left font-semibold"
                        >
                          {col.header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat) => (
                      <tr key={cat.category_id}>
                        {columns.map((col, i) => (
                          <td key={i} className="whitespace-nowrap py-3 px-4">
                            {col.cell({ row: { original: cat } })}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink>{page}</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog
        open={!!editData}
        onOpenChange={(open) => !open && setEditData(null)}
      >
        <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Kategori</DialogTitle>
          </DialogHeader>
          <CategoryForm
            initial={editData}
            onSubmit={(payload) =>
              updateMutation.mutate({ ...payload, id: editData?.category_id })
            }
            isLoading={updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <DialogContent className="w-[95vw] max-w-md">
          <DialogHeader>
            <DialogTitle>Hapus Kategori</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Apakah Anda yakin ingin menghapus kategori ini? Tindakan ini tidak
            dapat dibatalkan.
          </p>
          <DialogFooter className="flex-col sm:flex-row pt-2">
            <DialogClose asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                Batal
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => deleteMutation.mutate(deleteId)}
              disabled={deleteMutation.isPending}
              className="w-full sm:w-auto"
            >
              {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
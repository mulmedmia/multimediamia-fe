"use client";
import { useState } from "react";
import {
  useAdminProducts,
  useCreateAdminProduct,
  useUpdateAdminProduct,
  useDeleteAdminProduct,
} from "@/hooks/admin-use.product";
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
  PaginationLink,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
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
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import { getProductColumns } from "./product-table-config";
import { Plus, Search } from "lucide-react";

const PAGE_SIZE = 10;

// --- Sub-Components ---

function ProductForm({ initial, onSubmit, isLoading }) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    description: initial?.description || "",
    price: initial?.price || "",
    stock: initial?.stock || "",
    is_active: initial?.is_active ?? true,
    image: null,
  });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.description || form.description.length < 10) {
      setError("Deskripsi minimal 10 karakter.");
      return;
    }
    setError("");
    const payload = {
      ...form,
      image: form.image,
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nama Produk</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Deskripsi</Label>
          <Input
            id="description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            required
          />
          {error && (
            <p className="text-xs text-red-500 mt-1">{error}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Harga</Label>
          <Input
            id="price"
            type="number"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Stok</Label>
          <Input
            id="stock"
            type="number"
            value={form.stock}
            onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2 w-full">
          <Label>Status</Label>
          <select
            value={form.is_active ? "true" : "false"}
            onChange={(e) =>
              setForm((f) => ({ ...f, is_active: e.target.value === "true" }))
            }
            className="w-full border rounded px-2 py-1"
          >
            <option value="true">Aktif</option>
            <option value="false">Nonaktif</option>
          </select>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="image">Image</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) =>
              setForm((f) => ({ ...f, image: e.target.files?.[0] }))
            }
          />
        </div>
      </div>
      <DialogFooter className="flex-col sm:flex-row pt-4">
        <DialogClose asChild>
          <Button type="button" variant="outline" className="w-full sm:w-auto">
            Batal
          </Button>
        </DialogClose>
        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? "Menyimpan..." : "Simpan"}
        </Button>
      </DialogFooter>
    </form>
  );
}

// Skeleton loader for mobile card
function MobileSkeletonLoader() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-32 w-full rounded-lg" />
      ))}
    </div>
  );
}

// --- Main Page Component ---

export default function AdminProductPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const isMobile = useIsMobile();

  const { data, isLoading, isError } = useAdminProducts({
    limit: PAGE_SIZE,
    page,
    search,
  });

  const createMutation = useCreateAdminProduct(() => setOpenCreate(false));
  const updateMutation = useUpdateAdminProduct(() => setEditData(null));
  const deleteMutation = useDeleteAdminProduct(() => setDeleteId(null));

  const products = data?.products || [];
  const totalPages = data?.meta?.totalPages || 1;

  const columns = getProductColumns({ isMobile, setEditData, setDeleteId });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-xl sm:text-2xl font-bold">
              Daftar Produk
            </CardTitle>
            <Dialog open={openCreate} onOpenChange={setOpenCreate}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Produk
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Tambah Produk</DialogTitle>
                </DialogHeader>
                <ProductForm
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
                placeholder="Cari produk..."
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
                <p>Loading table...</p>
              )
            ) : isError ? (
              <Alert variant="destructive">
                <AlertTitle>Gagal memuat data</AlertTitle>
                <AlertDescription>
                  Terjadi kesalahan. Silakan coba lagi.
                </AlertDescription>
              </Alert>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Tidak ada data produk ditemukan.
                </p>
              </div>
            ) : isMobile ? (
              <div className="space-y-4">
                {products.map((prod) => (
                  <div key={prod.product_id}>
                    {columns[0].cell({ row: { original: prod } })}
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {columns.map((col) => (
                        <TableHead
                          key={col.header}
                          className="whitespace-nowrap"
                        >
                          {col.header}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((prod) => (
                      <TableRow key={prod.product_id}>
                        {columns.map((col, i) => (
                          <TableCell key={i} className="whitespace-nowrap py-3">
                            {col.cell({ row: { original: prod } })}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
            <DialogTitle>Edit Produk</DialogTitle>
          </DialogHeader>
          <ProductForm
            initial={editData}
            onSubmit={(payload) =>
              updateMutation.mutate({ ...payload, id: editData?.product_id })
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
            <DialogTitle>Hapus Produk</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.
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
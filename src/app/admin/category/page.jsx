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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import { getCategoryColumns } from "./category-table-config";

const PAGE_SIZE = 5;

function DatePickerField({ value, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-start text-left font-normal ${
            !value ? "text-muted-foreground" : ""
          }`}
        >
          {value ? format(value, "dd MMM yyyy") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-0 w-auto">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange(date);
            setOpen(false);
          }}
          initialFocus
          fromYear={2020}
          toYear={2030}
          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  );
}

function CategoryForm({ initial, onSubmit, isLoading }) {
  const [form, setForm] = useState({
    category_name: initial?.category_name || "",
    name: initial?.name || "",
    startDate: initial?.startDate ? new Date(initial.startDate) : null,
    endDate: initial?.endDate ? new Date(initial.endDate) : null,
    title: initial?.title || "",
    description: initial?.description || "",
    deadline: initial?.deadline ? new Date(initial.deadline) : null,
    status: initial?.status || "NOT_VERIFIED",
    image: null,
    organizer: initial?.organizer || "",
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const payload = {
          ...form,
          startDate: form.startDate ? form.startDate.toISOString() : "",
          endDate: form.endDate ? form.endDate.toISOString() : "",
          deadline: form.deadline ? form.deadline.toISOString() : "",
          image: form.image,
        };
        onSubmit(payload);
      }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <Label>Nama Kategori</Label>
          <Input
            value={form.category_name}
            onChange={(e) =>
              setForm((f) => ({ ...f, category_name: e.target.value }))
            }
            required
          />
        </div>
        <div className="space-y-3">
          <Label>Nama Lomba</Label>
          <Input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-3">
          <Label>Judul</Label>
          <Input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-3">
          <Label>Penyelenggara</Label>
          <Input
            value={form.organizer}
            onChange={(e) =>
              setForm((f) => ({ ...f, organizer: e.target.value }))
            }
          />
        </div>
        <div className="space-y-3">
          <Label>Deskripsi</Label>
          <Input
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            required
          />
        </div>
        <div className="space-y-3">
          <Label>Status</Label>
          <Select
            value={form.status}
            onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NOT_VERIFIED">NOT_VERIFIED</SelectItem>
              <SelectItem value="VERIFIED">VERIFIED</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-3">
          <Label>Start Date</Label>
          <DatePickerField
            value={form.startDate}
            onChange={(date) => setForm((f) => ({ ...f, startDate: date }))}
            placeholder="Pilih tanggal"
          />
        </div>
        <div className="space-y-3">
          <Label>End Date</Label>
          <DatePickerField
            value={form.endDate}
            onChange={(date) => setForm((f) => ({ ...f, endDate: date }))}
            placeholder="Pilih tanggal"
          />
        </div>
        <div className="space-y-3">
          <Label>Deadline</Label>
          <DatePickerField
            value={form.deadline}
            onChange={(date) => setForm((f) => ({ ...f, deadline: date }))}
            placeholder="Pilih tanggal"
          />
        </div>
        <div className="space-y-3">
          <Label>Image</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setForm((f) => ({ ...f, image: e.target.files?.[0] }))
            }
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Menyimpan..." : "Simpan"}
        </Button>
      </DialogFooter>
    </form>
  );
}

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

  const createMutation = useCreateAdminCategory();
  const updateMutation = useUpdateAdminCategory();
  const deleteMutation = useDeleteAdminCategory();

  const categories = (data?.categories || [])
    .slice()
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const meta = data?.meta || {};
  const totalPages = meta.totalPages || 1;

  const columns = getCategoryColumns({
    isMobile,
    setEditData,
    setDeleteId,
    updateMutation,
    deleteMutation,
  });

  return (
    <div className="max-w-6xl mx-auto py-10 px-2">
      <Card className="mb-6">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle className="text-2xl font-bold">Daftar Kategori</CardTitle>
          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogTrigger asChild>
              <Button onClick={() => setOpenCreate(true)} className="w-full sm:w-auto">
                Tambah Kategori
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Kategori</DialogTitle>
              </DialogHeader>
              <CategoryForm
                onSubmit={(payload) => {
                  createMutation.mutate(payload, {
                    onSuccess: () => setOpenCreate(false),
                  });
                }}
                isLoading={createMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-2 mb-4">
            <Input
              placeholder="Cari kategori..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && setSearch(input)}
              className="w-full sm:max-w-xs"
            />
            <Button
              onClick={() => setSearch(input)}
              className="w-full sm:w-auto"
            >
              Cari
            </Button>
          </div>
          {/* Responsive Table/Card */}
          {isMobile ? (
            <div className="flex flex-col gap-4">
              {isLoading
                ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
                    <div key={i} className="p-4 bg-background rounded shadow">
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-4 w-16 mb-2" />
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-12 w-12 rounded" />
                    </div>
                  ))
                : isError ? (
                    <Alert variant="destructive">
                      <AlertTitle>Gagal memuat data</AlertTitle>
                      <AlertDescription>
                        Terjadi kesalahan saat mengambil data kategori.
                        Silakan coba lagi.
                      </AlertDescription>
                    </Alert>
                  )
                : categories.length === 0 ? (
                    <div className="text-center py-8">Tidak ada data</div>
                  )
                : categories.map((cat) => (
                    <div key={cat.category_id} className="p-4 bg-background rounded shadow">
                      {columns[0].cell({ row: { original: cat } })}
                    </div>
                  ))}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border bg-background">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((col) => (
                      <TableHead key={col.header}>{col.header}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: PAGE_SIZE }).map((_, i) => (
                      <TableRow key={i}>
                        {columns.map((col, idx) => (
                          <TableCell key={idx}>
                            <Skeleton className="h-4 w-24" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : isError ? (
                    <TableRow>
                      <TableCell colSpan={columns.length}>
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
                      <TableCell colSpan={columns.length} className="text-center">
                        Tidak ada data
                      </TableCell>
                    </TableRow>
                  ) : (
                    categories.map((cat) => (
                      <TableRow key={cat.category_id}>
                        {columns.map((col, idx) => (
                          <TableCell key={idx}>
                            {col.cell({ row: { original: cat } })}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
          {/* Pagination */}
          <div className="mt-6 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={page === i + 1}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
      {/* Dialog Edit */}
      <Dialog open={!!editData} onOpenChange={(open) => setEditData(open ? editData : null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Kategori</DialogTitle>
          </DialogHeader>
          <CategoryForm
            initial={editData}
            onSubmit={(payload) => {
              updateMutation.mutate(
                { ...payload, category_id: editData?.category_id },
                {
                  onSuccess: () => setEditData(null),
                }
              );
            }}
            isLoading={updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>
      {/* Dialog Delete */}
      <Dialog open={!!deleteId} onOpenChange={(open) => setDeleteId(open ? deleteId : null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Kategori</DialogTitle>
          </DialogHeader>
          <div>Apakah Anda yakin ingin menghapus kategori ini?</div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Batal</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() =>
                deleteMutation.mutate(deleteId, {
                  onSuccess: () => setDeleteId(null),
                })
              }
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
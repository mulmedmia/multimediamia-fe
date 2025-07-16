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

  return (
    <div className="max-w-6xl mx-auto py-10 px-2">
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Daftar Kategori</CardTitle>
          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogTrigger asChild>
              <Button onClick={() => setOpenCreate(true)}>
                Tambah Kategori
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Kategori</DialogTitle>
              </DialogHeader>
              <div className="py-2" />
              <CategoryForm
                onSubmit={(data) =>
                  createMutation.mutate(data, {
                    onSuccess: () => setOpenCreate(false),
                  })
                }
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
                        <Dialog
                          open={editData?.category_id === cat.category_id}
                          onOpenChange={(open) =>
                            setEditData(open ? cat : null)
                          }
                        >
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Kategori</DialogTitle>
                            </DialogHeader>
                            <div className="py-2" />
                            <CategoryForm
                              initial={cat}
                              onSubmit={(data) =>
                                updateMutation.mutate(
                                  { id: cat.category_id, ...data },
                                  { onSuccess: () => setEditData(null) }
                                )
                              }
                              isLoading={updateMutation.isPending}
                            />
                          </DialogContent>
                        </Dialog>
                        <Dialog
                          open={deleteId === cat.category_id}
                          onOpenChange={(open) =>
                            setDeleteId(open ? cat.category_id : null)
                          }
                        >
                          <DialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              Delete
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Hapus Kategori</DialogTitle>
                            </DialogHeader>
                            <div>
                              Yakin ingin menghapus kategori{" "}
                              <b>{cat.category_name}</b>?
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Batal</Button>
                              </DialogClose>
                              <Button
                                variant="destructive"
                                onClick={() =>
                                  deleteMutation.mutate(cat.category_id, {
                                    onSuccess: () => setDeleteId(null),
                                  })
                                }
                                disabled={deleteMutation.isPending}
                              >
                                {deleteMutation.isPending
                                  ? "Menghapus..."
                                  : "Hapus"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
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

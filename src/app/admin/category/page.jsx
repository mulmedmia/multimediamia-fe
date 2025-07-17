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
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Calendar as CalendarIcon,
} from "lucide-react";

const PAGE_SIZE = 5;

// --- Sub-Components with Responsive Implementation ---

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
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "dd MMM yyyy") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange(date);
            setOpen(false); // Close popover on selection
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
  // This state management is for the form fields
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Prepare payload for submission, converting dates to ISO strings
    const payload = {
      ...form,
      startDate: form.startDate ? form.startDate.toISOString() : "",
      endDate: form.endDate ? form.endDate.toISOString() : "",
      deadline: form.deadline ? form.deadline.toISOString() : "",
      image: form.image, // The hook will handle the file object
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      {/* Responsive grid for form fields. 1 column on mobile, 2 on larger screens. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-2">
          <Label htmlFor="category_name">Nama Kategori</Label>
          <Input
            id="category_name"
            value={form.category_name}
            onChange={(e) =>
              setForm((f) => ({ ...f, category_name: e.target.value }))
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Nama Lomba</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Judul</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="organizer">Penyelenggara</Label>
          <Input
            id="organizer"
            value={form.organizer}
            onChange={(e) =>
              setForm((f) => ({ ...f, organizer: e.target.value }))
            }
          />
        </div>

        {/* This field spans 2 columns on larger screens */}
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Deskripsi</Label>
          <Input
            id="description"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            required
          />
        </div>

        <div className="space-y-2 w-full">
          <Label>Status</Label>
          <Select
            value={form.status}
            onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent className="w-full">
              <SelectItem value="NOT_VERIFIED">NOT_VERIFIED</SelectItem>
              <SelectItem value="VERIFIED">VERIFIED</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Start Date</Label>
          <DatePickerField
            value={form.startDate}
            onChange={(date) => setForm((f) => ({ ...f, startDate: date }))}
            placeholder="Pilih tanggal mulai"
          />
        </div>

        <div className="space-y-2">
          <Label>End Date</Label>
          <DatePickerField
            value={form.endDate}
            onChange={(date) => setForm((f) => ({ ...f, endDate: date }))}
            placeholder="Pilih tanggal selesai"
          />
        </div>

        <div className="space-y-2">
          <Label>Deadline</Label>
          <DatePickerField
            value={form.deadline}
            onChange={(date) => setForm((f) => ({ ...f, deadline: date }))}
            placeholder="Pilih deadline"
          />
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

      {/* Responsive dialog footer. Buttons stack on mobile, side-by-side on larger screens. */}
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

// Card component optimized for mobile view
function CategoryCard({ category, onEdit, onDelete }) {
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1">
              <h3 className="font-semibold text-sm line-clamp-2">
                {category.category_name}
              </h3>
              <p className="text-xs text-muted-foreground">{category.name}</p>
            </div>
            {/* Action buttons */}
            <div className="flex flex-shrink-0">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => onEdit(category)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-red-500"
                onClick={() => onDelete(category.category_id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Grid layout for structured data display on mobile */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
            <div>
              <span className="text-muted-foreground">Judul:</span>
              <p className="font-medium truncate">{category.title || "-"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Status:</span>
              <p className="font-medium">{category.status}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Organizer:</span>
              <p className="font-medium truncate">
                {category.organizer || "-"}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Deadline:</span>
              <p className="font-medium">
                {category.deadline
                  ? format(new Date(category.deadline), "dd MMM yyyy")
                  : "-"}
              </p>
            </div>
          </div>

          {category.description && (
            <div className="text-xs">
              <span className="text-muted-foreground">Deskripsi:</span>
              <p className="line-clamp-2">{category.description}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton loader that mimics the mobile card layout
function MobileSkeletonLoader() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="p-4">
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-20" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-16" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-3 w-14" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// --- Main Page Component ---

export default function AdminCategoryPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // Custom hook to detect mobile viewport, used for conditional rendering
  const isMobile = useIsMobile();

  const { data, isLoading, isError } = useAdminCategories({
    limit: PAGE_SIZE,
    page,
    search,
  });

  const createMutation = useCreateAdminCategory(() => setOpenCreate(false));
  const updateMutation = useUpdateAdminCategory(() => setEditData(null));
  const deleteMutation = useDeleteAdminCategory(() => setDeleteId(null));

  // Memoized data processing
  const categories = data?.categories || [];
  const totalPages = data?.meta?.totalPages || 1;

  // The logic for table columns is externalized for cleanliness
  const columns = getCategoryColumns({ setEditData, setDeleteId });

  return (
    // Main wrapper for the page. Padding is handled by the parent layout for consistency.
    <div className="space-y-6">
      <Card>
        <CardHeader>
          {/* Responsive header. Stacks on mobile, row on larger screens. */}
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
              {/* Responsive dialog. Full-width on mobile, max-width on desktop. */}
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
          {/* Responsive search bar */}
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

          {/* Conditional rendering based on loading/error/data state */}
          <div>
            {isLoading ? (
              isMobile ? (
                <MobileSkeletonLoader />
              ) : (
                <p>Loading table...</p>
              ) // Placeholder for table skeleton
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
            ) : // This is the core responsive pattern: show cards on mobile, table on desktop.
            isMobile ? (
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
                    {categories.map((cat) => (
                      <TableRow key={cat.category_id}>
                        {columns.map((col, i) => (
                          <TableCell key={i} className="whitespace-nowrap py-3">
                            {col.cell({ row: { original: cat } })}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          {/* Pagination, visible only if there's more than one page */}
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

      {/* Edit Dialog (logic is similar to Create Dialog) */}
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

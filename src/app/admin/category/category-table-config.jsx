import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";

// Helper untuk deteksi tablet
function isTabletScreen() {
  if (typeof window === "undefined") return false;
  const width = window.innerWidth;
  return width >= 768 && width < 1024;
}

export function getCategoryColumns({
  isMobile,
  setEditData,
  setDeleteId,
  updateMutation,
  deleteMutation,
}) {
  // Tablet & Mobile: card-style, tombol full width, padding kiri-kanan
  if (isMobile || (typeof window !== "undefined" && isTabletScreen())) {
    return [
      {
        header: "Kategori",
        accessorKey: "category_name",
        cell: ({ row }) => (
          <div className="flex gap-3 items-start bg-mia-surface rounded-lg shadow border p-3 px-4 max-w-full md:max-w-2xl mx-auto">
            {row.original.image && (
              <div className="relative w-16 h-16 rounded-md border flex-shrink-0">
                <Image
                  src={row.original.image}
                  alt={row.original.name || row.original.slug || "Category"}
                  fill={true}
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <div className="font-bold text-base mb-0.5">
                {row.original.name || row.original.category_name}
              </div>
              <div className="text-xs text-muted-foreground font-mono mb-1">
                {row.original.slug || row.original.category_name}
              </div>
              <div className="text-xs mb-1">{row.original.organizer}</div>
              <div className="text-xs mb-1 space-y-0.5">
                <div>
                  <span className="font-medium">Karya Sementara:</span>{" "}
                  {row.original.preliminary_deadline
                    ? new Date(row.original.preliminary_deadline).toLocaleDateString("id-ID")
                    : row.original.deadline
                      ? new Date(row.original.deadline).toLocaleDateString("id-ID")
                      : "-"}
                </div>
                <div>
                  <span className="font-medium">Karya Final:</span>{" "}
                  {row.original.final_deadline
                    ? new Date(row.original.final_deadline).toLocaleDateString("id-ID")
                    : row.original.deadline
                      ? new Date(row.original.deadline).toLocaleDateString("id-ID")
                      : "-"}
                </div>
              </div>
              <div className="mb-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    row.original.status === "VERIFIED"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {row.original.status}
                </span>
              </div>
              <div className="flex flex-col gap-2 mt-2 w-full">
                <Dialog
                  open={row.original.isEditing}
                  onOpenChange={(open) =>
                    setEditData(open ? row.original : null)
                  }
                >
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="w-full">
                      Edit
                    </Button>
                  </DialogTrigger>
                </Dialog>
                <Dialog
                  open={row.original.isDeleting}
                  onOpenChange={(open) =>
                    setDeleteId(open ? row.original.category_id : null)
                  }
                >
                  <DialogTrigger asChild>
                    <Button size="sm" variant="destructive" className="w-full">
                      Delete
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            </div>
          </div>
        ),
      },
    ];
  }

  // Desktop: kolom lengkap
  return [
    {
      header: "Nama Perlombaan",
      accessorKey: "name",
      cell: ({ row }) => (
        <div>
          <div className="font-semibold text-foreground">
            {row.original.name || row.original.category_name}
          </div>
          <div className="text-xs text-muted-foreground font-mono">
            {row.original.slug || row.original.category_name}
          </div>
        </div>
      ),
    },
    {
      header: "Penyelenggara",
      accessorKey: "organizer",
      cell: ({ row }) => row.original.organizer,
    },
    {
      header: "Batas Karya (Sementara / Final)",
      accessorKey: "deadline",
      cell: ({ row }) => (
        <div className="text-xs space-y-0.5">
          <div>
            <span className="text-muted-foreground">Sementara: </span>
            <span className="font-medium">
              {row.original.preliminary_deadline
                ? new Date(row.original.preliminary_deadline).toLocaleDateString("id-ID")
                : row.original.deadline
                  ? new Date(row.original.deadline).toLocaleDateString("id-ID")
                  : "-"}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Final: </span>
            <span className="font-medium">
              {row.original.final_deadline
                ? new Date(row.original.final_deadline).toLocaleDateString("id-ID")
                : row.original.deadline
                  ? new Date(row.original.deadline).toLocaleDateString("id-ID")
                  : "-"}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${
            row.original.status === "VERIFIED"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {row.original.status}
        </span>
      ),
    },
    {
      header: "Image",
      accessorKey: "image",
      cell: ({ row }) =>
        row.original.image && (
          <div className="relative w-12 h-12 rounded shadow">
            <Image
              src={row.original.image}
              alt={row.original.name || row.original.slug || "Category"}
              fill={true}
              className="object-cover"
            />
          </div>
        ),
    },
    {
      header: "Aksi",
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2 justify-end">
          <Dialog
            open={row.original.isEditing}
            onOpenChange={(open) => setEditData(open ? row.original : null)}
          >
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                Edit
              </Button>
            </DialogTrigger>
          </Dialog>
          <Dialog
            open={row.original.isDeleting}
            onOpenChange={(open) =>
              setDeleteId(open ? row.original.category_id : null)
            }
          >
            <DialogTrigger asChild>
              <Button size="sm" variant="destructive">
                Delete
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      ),
    },
  ];
}

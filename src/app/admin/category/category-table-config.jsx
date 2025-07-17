import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";

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
          <div className="flex gap-3 items-start bg-white rounded-lg shadow border p-3 px-4 max-w-full md:max-w-2xl mx-auto">
            {row.original.image && (
              <img
                src={row.original.image}
                alt={row.original.category_name}
                className="w-16 h-16 object-cover rounded-md border flex-shrink-0"
              />
            )}
            <div className="flex-1">
              <div className="font-bold text-base mb-1">{row.original.category_name}</div>
              <div className="text-xs text-muted-foreground mb-1">{row.original.title}</div>
              <div className="text-xs mb-1">{row.original.organizer}</div>
              <div className="text-xs mb-1">
                <span className="font-medium">Deadline:</span>{" "}
                {row.original.deadline
                  ? new Date(row.original.deadline).toLocaleDateString("id-ID")
                  : "-"}
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
                  onOpenChange={(open) => setEditData(open ? row.original : null)}
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
      header: "Nama",
      accessorKey: "category_name",
      cell: ({ row }) => row.original.category_name,
    },
    {
      header: "Judul",
      accessorKey: "title",
      cell: ({ row }) => row.original.title,
    },
    {
      header: "Penyelenggara",
      accessorKey: "organizer",
      cell: ({ row }) => row.original.organizer,
    },
    {
      header: "Deadline",
      accessorKey: "deadline",
      cell: ({ row }) =>
        row.original.deadline
          ? new Date(row.original.deadline).toLocaleDateString("id-ID")
          : "-",
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
          <img
            src={row.original.image}
            alt={row.original.category_name}
            className="w-12 h-12 object-cover rounded shadow"
          />
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
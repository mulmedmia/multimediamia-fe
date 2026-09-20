import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";

// Helper untuk deteksi tablet
function isTabletScreen() {
  if (typeof window === "undefined") return false;
  const width = window.innerWidth;
  return width >= 768 && width < 1024;
}

export function getProductColumns({ isMobile, setEditData, setDeleteId }) {
  // Mobile & Tablet: card-style
  if (isMobile || (typeof window !== "undefined" && isTabletScreen())) {
    return [
      {
        header: "Produk",
        accessorKey: "name",
        cell: ({ row }) => (
          <div className="flex gap-3 items-start bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-3 px-4 max-w-full md:max-w-2xl mx-auto">
            {row.original.image_url && (
              <div className="relative w-16 h-16 rounded-md border border-gray-200 dark:border-gray-600 flex-shrink-0">
                <Image
                  src={row.original.image_url}
                  alt={row.original.name}
                  fill={true}
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <div className="font-bold text-base mb-1 text-gray-900 dark:text-white">
                {row.original.name}
              </div>
              <div className="text-xs text-muted-foreground dark:text-gray-400 mb-1">
                {row.original.description}
              </div>
              <div className="text-xs mb-1 text-gray-700 dark:text-gray-300">
                <span className="font-medium">Harga:</span> Rp
                {row.original.price.toLocaleString()}
              </div>
              <div className="text-xs mb-1 text-gray-700 dark:text-gray-300">
                <span className="font-medium">Stok:</span> {row.original.stock}
              </div>
              <div className="mb-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    row.original.is_active
                      ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                      : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                  }`}
                >
                  {row.original.is_active ? "Aktif" : "Nonaktif"}
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
                    setDeleteId(open ? row.original.product_id : null)
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
      accessorKey: "name",
      cell: ({ row }) => row.original.name,
    },
    {
      header: "Kategori",
      accessorKey: "category_id",
      cell: ({ row }) => row.original.category?.name || "-",
    },
    {
      header: "Deskripsi",
      accessorKey: "description",
      cell: ({ row }) => row.original.description,
    },
    {
      header: "Harga",
      accessorKey: "price",
      cell: ({ row }) => `Rp${row.original.price.toLocaleString()}`,
    },
    {
      header: "Stok",
      accessorKey: "stock",
      cell: ({ row }) => row.original.stock,
    },
    {
      header: "Status",
      accessorKey: "is_active",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${
            row.original.is_active
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.original.is_active ? "Aktif" : "Nonaktif"}
        </span>
      ),
    },
    {
      header: "Image",
      accessorKey: "image_url",
      cell: ({ row }) =>
        row.original.image_url && (
          <div className="relative w-12 h-12 rounded shadow">
            <Image
              src={row.original.image_url}
              alt={row.original.name}
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
              setDeleteId(open ? row.original.product_id : null)
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

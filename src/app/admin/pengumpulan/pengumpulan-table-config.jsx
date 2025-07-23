import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Kolom untuk mobile
export const mobileColumns = [
  { accessorKey: "user.name", header: "Nama" },
  { accessorKey: "category.category_name", header: "Kategori" },
  { accessorKey: "status", header: "Status", cell: ({ row }) => (
      <Badge variant={
        row.original.status === "APPROVED"
          ? "success"
          : row.original.status === "REJECTED"
          ? "destructive"
          : row.original.status === "REVISION"
          ? "warning"
          : "outline"
      }>
        {row.original.status}
      </Badge>
    )
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row, setEditData }) => (
      <Button
        size="sm"
        variant="outline"
        onClick={() => setEditData(row.original)}
      >
        Detail
      </Button>
    ),
  },
];

// Kolom untuk desktop/tablet
export const desktopColumns = [
  { accessorKey: "user.name", header: "Nama" },
  { accessorKey: "user.email", header: "Email" },
  { accessorKey: "category.category_name", header: "Kategori" },
  { accessorKey: "title", header: "Judul" },
  { accessorKey: "status", header: "Status", cell: ({ row }) => (
      <Badge variant={
        row.original.status === "APPROVED"
          ? "success"
          : row.original.status === "REJECTED"
          ? "destructive"
          : row.original.status === "REVISION"
          ? "warning"
          : "outline"
      }>
        {row.original.status}
      </Badge>
    )
  },
  { accessorKey: "score", header: "Skor" },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row, setEditData }) => (
      <Button
        size="sm"
        variant="outline"
        onClick={() => setEditData(row.original)}
      >
        Detail
      </Button>
    ),
  },
];

// Fungsi untuk memilih kolom berdasarkan device
export function getPengumpulanColumns({ isMobile, setEditData }) {
  return (isMobile ? mobileColumns : desktopColumns).map(col =>
    col.id === "actions"
      ? { ...col, cell: (props) => col.cell({ ...props, setEditData }) }
      : col
  );
}
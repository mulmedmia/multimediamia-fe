import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Kolom utama untuk table pengumpulan
export const getPengumpulanColumns = ({ isMobile, setDetailData, setStatusData }) => [
  { accessorKey: "user.name", header: "Nama" },
  { accessorKey: "user.email", header: "Email" },
  { accessorKey: "category.category_name", header: "Kategori" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
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
    ),
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => setDetailData(row.original)}>
          Detail
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setStatusData(row.original)}>
          Status
        </Button>
      </div>
    ),
  },
];
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, CheckCircle } from "lucide-react";

export function getPendaftarColumns({ setDetailData, setVerifyData }) {
  return [
    {
      header: "Nama",
      accessorKey: "user.name",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.user?.name}</div>
      ),
    },
    {
      header: "Email",
      accessorKey: "user.email",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {row.original.user?.email}
        </div>
      ),
    },
    {
      header: "Kategori",
      accessorKey: "category.category_name",
      cell: ({ row }) => (
        <Badge variant="outline">
          {row.original.category?.category_name}
        </Badge>
      ),
    },
    {
      header: "Status",
      accessorKey: "is_verified",
      cell: ({ row }) => (
        <Badge variant={row.original.is_verified ? "default" : "secondary"}>
          {row.original.is_verified ? "Terverifikasi" : "Belum Terverifikasi"}
        </Badge>
      ),
    },
    {
      header: "Aksi",
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDetailData(row.original)}
          >
            <Eye className="h-4 w-4 mr-1" />
            Detail
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => setVerifyData(row.original)}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Verifikasi
          </Button>
        </div>
      ),
    },
  ];
}
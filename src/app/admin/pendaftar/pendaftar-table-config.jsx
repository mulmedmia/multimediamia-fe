import { Button } from "@/components/ui/button";

// Kolom untuk mobile
export const mobileColumns = [
  { accessorKey: "user.name", header: "Nama" },
  { accessorKey: "category.category_name", header: "Kategori" },
  { accessorKey: "is_verified", header: "Status", cell: ({ row }) => (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${row.original.is_verified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
        {row.original.is_verified ? "Terverifikasi" : "Belum"}
      </span>
    )
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row, setEditData }) => (
      <Button
        size="sm"
        variant={row.original.is_verified ? "outline" : "destructive"}
        onClick={() => setEditData(row.original)}
      >
        {row.original.is_verified ? "Batalkan" : "Verifikasi"}
      </Button>
    ),
  },
];

// Kolom untuk desktop/tablet
export const desktopColumns = [
  { accessorKey: "user.name", header: "Nama" },
  { accessorKey: "user.email", header: "Email" },
  { accessorKey: "category.category_name", header: "Kategori" },
  { accessorKey: "category.team_type", header: "Tipe" },
  { accessorKey: "file_url", header: "File", cell: ({ row }) => (
      <a href={row.original.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Lihat File</a>
    )
  },
  { accessorKey: "team_name", header: "Nama Tim" },
  { accessorKey: "team_members", header: "Anggota Tim" },
  { accessorKey: "is_verified", header: "Status", cell: ({ row }) => (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${row.original.is_verified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
        {row.original.is_verified ? "Terverifikasi" : "Belum"}
      </span>
    )
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row, setEditData }) => (
      <Button
        size="sm"
        variant={row.original.is_verified ? "outline" : "destructive"}
        onClick={() => setEditData(row.original)}
      >
        {row.original.is_verified ? "Batalkan" : "Verifikasi"}
      </Button>
    ),
  },
];

// Fungsi untuk memilih kolom berdasarkan device
export function getPendaftarColumns({ isMobile, setEditData }) {
  return isMobile ? mobileColumns.map(col =>
    col.id === "actions"
      ? { ...col, cell: (props) => col.cell({ ...props, setEditData }) }
      : col
  ) : desktopColumns.map(col =>
    col.id === "actions"
      ? { ...col, cell: (props) => col.cell({ ...props, setEditData }) }
      : col
  );
}
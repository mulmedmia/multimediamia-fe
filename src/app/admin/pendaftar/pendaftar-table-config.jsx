import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, CheckCircle } from "lucide-react";

// Card style untuk mobile & tablet
const cardCell = ({ row, setDetailData, setVerifyData }) => (
  <div className="rounded-xl border p-4 shadow-sm bg-white flex flex-col gap-2">
    <div className="flex justify-between items-start">
      <div>
        <div className="font-semibold">{row.original.category?.category_name}</div>
        <div className="text-xs text-muted-foreground">{row.original.competition_name}</div>
      </div>
      <div className="flex gap-2">
        <Button
          size="icon"
          variant="ghost"
          className="text-primary"
          onClick={() => setDetailData(row.original)}
          aria-label="Detail"
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="text-green-600"
          onClick={() => setVerifyData(row.original)}
          aria-label="Verifikasi"
        >
          <CheckCircle className="h-4 w-4" />
        </Button>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-2 text-xs">
      <div>
        <span className="font-semibold">Judul:</span>
        <div className="truncate">{row.original.title}</div>
      </div>
      <div>
        <span className="font-semibold">Status:</span>
        <div className="uppercase font-bold text-green-600">{row.original.is_verified ? "VERIFIED" : "UNVERIFIED"}</div>
      </div>
      <div>
        <span className="font-semibold">Organizer:</span>
        <div>{row.original.organizer}</div>
      </div>
      <div>
        <span className="font-semibold">Deadline:</span>
        <div>{row.original.deadline}</div>
      </div>
    </div>
    <div>
      <span className="font-semibold text-xs">Deskripsi:</span>
      <div className="text-xs text-muted-foreground line-clamp-2">{row.original.description}</div>
    </div>
  </div>
);

// Kolom untuk mobile (card style)
const mobileColumns = [
  {
    id: "card",
    header: "",
    cell: cardCell,
  },
];

// Kolom untuk tablet (card style, bisa tambah info jika mau)
const tabletColumns = [
  {
    id: "card",
    header: "",
    cell: cardCell,
  },
];

// Kolom untuk desktop (tetap tabel)
const desktopColumns = [
  {
    header: "Nama",
    accessorKey: "user.name",
    cell: ({ row }) => (
      <div className="font-medium truncate max-w-[180px]">{row.original.user?.name}</div>
    ),
  },
  {
    header: "Email",
    accessorKey: "user.email",
    cell: ({ row }) => (
      <div className="text-xs text-muted-foreground truncate max-w-[200px]">{row.original.user?.email}</div>
    ),
  },
  {
    header: "Kategori",
    accessorKey: "category.category_name",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-xs px-2 py-1 truncate max-w-[120px]">
        {row.original.category?.category_name}
      </Badge>
    ),
  },
  {
    header: "Status",
    accessorKey: "is_verified",
    cell: ({ row }) => (
      <Badge
        variant={row.original.is_verified ? "default" : "secondary"}
        className="text-xs px-2 py-1"
      >
        {row.original.is_verified ? "Terverifikasi" : "Belum Terverifikasi"}
      </Badge>
    ),
  },
  {
    header: "Aksi",
    id: "actions",
    cell: ({ row, setDetailData, setVerifyData }) => (
      <div className="flex gap-1 md:gap-2 flex-wrap">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 p-0 md:w-auto md:px-3"
          onClick={() => setDetailData(row.original)}
          aria-label="Detail"
        >
          <Eye className="h-4 w-4 md:mr-1" />
          <span className="hidden md:inline">Detail</span>
        </Button>
        <Button
          variant="default"
          size="icon"
          className="h-8 w-8 p-0 md:w-auto md:px-3"
          onClick={() => setVerifyData(row.original)}
          aria-label="Verifikasi"
        >
          <CheckCircle className="h-4 w-4 md:mr-1" />
          <span className="hidden md:inline">Verifikasi</span>
        </Button>
      </div>
    ),
  },
];

// Fungsi utama untuk memilih kolom berdasarkan device
export function getPendaftarColumns({ isMobile, isTablet, setDetailData, setVerifyData }) {
  // Inject props ke cell card/actions
  const injectProps = (cols) =>
    cols.map((col) =>
      col.id === "actions" || col.id === "card"
        ? { ...col, cell: (props) => col.cell({ ...props, setDetailData, setVerifyData }) }
        : col
    );
  if (isMobile) return injectProps(mobileColumns);
  if (isTablet) return injectProps(tabletColumns);
  return injectProps(desktopColumns);
}
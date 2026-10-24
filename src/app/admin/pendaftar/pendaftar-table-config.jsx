import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, CheckCircle } from "lucide-react";

// Helper function untuk parse team members
const parseTeamMembers = (teamMembersString) => {
  if (!teamMembersString) return [];

  try {
    // Coba parse sebagai JSON array
    const parsed = JSON.parse(teamMembersString);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    // Jika gagal, coba split berdasarkan koma dan bersihkan karakter
    return teamMembersString
      .split(",")
      .map((member) => member.trim().replace(/['"\[\]]/g, ""))
      .filter((member) => member.length > 0);
  }
};

// Card style untuk mobile & tablet
const cardCell = ({ row, setDetailData, setVerifyData }) => {
  const members = parseTeamMembers(row.original.team_members);

  return (
    <div className="rounded-xl border p-4 shadow-sm bg-white flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-base">
            {row.original.category?.category_name}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {row.original.user?.name}
          </div>
          {row.original.team_name && (
            <div className="text-sm font-medium text-primary mt-1">
              Tim: {row.original.team_name}
            </div>
          )}
          <div className="text-xs text-muted-foreground mt-1">
            Terdaftar:{" "}
            {formatMediumShortDate(row.original.created_at_at)}
          </div>
        </div>
        <div className="flex gap-2 ml-2">
          <Button
            size="icon"
            variant="ghost"
            className="text-primary h-8 w-8"
            onClick={() => setDetailData(row.original)}
            aria-label="Detail"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="text-green-600 h-8 w-8"
            onClick={() => setVerifyData(row.original)}
            aria-label="Verifikasi"
          >
            <CheckCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {members.length > 0 && (
        <div>
          <span className="font-semibold text-sm">Anggota Tim:</span>
          <div className="mt-1 space-y-1">
            {members.slice(0, 3).map((member, idx) => (
              <div
                key={idx}
                className="text-sm text-muted-foreground flex items-center gap-2"
              >
                <span className="text-xs bg-muted px-1.5 py-0.5 rounded">
                  {idx + 1}
                </span>
                {member}
              </div>
            ))}
            {members.length > 3 && (
              <div className="text-sm text-muted-foreground">
                +{members.length - 3} anggota lainnya
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
        <div>
          <span className="font-semibold">Email:</span>
          <div className="text-muted-foreground truncate">
            {row.original.user?.email}
          </div>
        </div>
        <div>
          <span className="font-semibold">Status:</span>
          <div
            className={`font-bold ${
              row.original.is_verified ? "text-green-600" : "text-orange-600"
            }`}
          >
            {row.original.is_verified ? "Terverifikasi" : "Belum Terverifikasi"}
          </div>
        </div>
        <div>
          <span className="font-semibold">Status Finance:</span>
          <div
            className={`font-bold ${
              row.original.is_verified_finance ? "text-green-600" : "text-orange-600"
            }`}
          >
            {row.original.is_verified_finance ? "Valid" : "Belum Dicek"}
          </div>
        </div>
      </div>
    </div>
  );
};

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
      <div className="font-medium truncate max-w-[180px]">
        {row.original.user?.name}
      </div>
    ),
  },
  {
    header: "Email",
    accessorKey: "user.email",
    cell: ({ row }) => (
      <div className="text-xs text-muted-foreground truncate max-w-[200px]">
        {row.original.user?.email}
      </div>
    ),
  },
  {
    header: "Kategori",
    accessorKey: "category.category_name",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="text-xs px-2 py-1 truncate max-w-[120px]"
      >
        {row.original.category?.category_name}
      </Badge>
    ),
  },
  {
    header: "Nama Tim",
    accessorKey: "team_name",
    cell: ({ row }) => (
      <div className="font-medium truncate max-w-[150px]">
        {row.original.team_name}
      </div>
    ),
  },
  {
    header: "Anggota Tim",
    accessorKey: "team_members",
    cell: ({ row }) => {
      const members = parseTeamMembers(row.original.team_members);

      return (
        <div className="max-w-[200px]">
          {members.length > 0 ? (
            <div className="space-y-1">
              {members.slice(0, 3).map((member, idx) => (
                <div
                  key={idx}
                  className="text-xs text-muted-foreground truncate"
                >
                  • {member}
                </div>
              ))}
              {members.length > 3 && (
                <div className="text-xs text-muted-foreground">
                  +{members.length - 3} lainnya
                </div>
              )}
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">-</span>
          )}
        </div>
      );
    },
  },
  {
    header: "Waktu Registrasi",
    accessorKey: "created_at",
    cell: ({ row }) => (
      <div className="text-xs text-muted-foreground">
        <div>
          {new Date(row.original.created_at).toLocaleDateString("id-ID")}
        </div>
        <div className="text-xs opacity-75">
          {new Date(row.original.created_at).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
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
    header: "Status Finance",
    accessorKey: "is_verified_finance",
    cell: ({ row }) => (
      <Badge
        variant={row.original.is_verified_finance ? "default" : "secondary"}
        className={`text-xs px-2 py-1 ${
          row.original.is_verified_finance
            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
            : "bg-amber-600/20 text-amber-500 hover:bg-amber-600/30"
        }`}
      >
        {row.original.is_verified_finance ? "Finance: Valid" : "Belum Dicek"}
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
export function getPendaftarColumns({
  isMobile,
  isTablet,
  setDetailData,
  setVerifyData,
}) {
  // Inject props ke cell card/actions
  const injectProps = (cols) =>
    cols.map((col) =>
      col.id === "actions" || col.id === "card"
        ? {
            ...col,
            cell: (props) =>
              col.cell({ ...props, setDetailData, setVerifyData }),
          }
        : col,
    );
  if (isMobile) return injectProps(mobileColumns);
  if (isTablet) return injectProps(tabletColumns);
  return injectProps(desktopColumns);
}

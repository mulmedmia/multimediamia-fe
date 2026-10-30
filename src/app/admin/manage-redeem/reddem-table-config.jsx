import React from "react";
import { Badge } from "@/components/ui/badge";
import { Phone, ExternalLink } from "lucide-react";
import { formatMediumShortDate } from "@/lib/utils";

// Kolom untuk mobile
export const mobileColumns = [
  {
    accessorKey: "user.name",
    header: "Peserta & Tim",
    cell: ({ row }) => (
      <div className="flex flex-col gap-0.5">
        <span className="font-medium text-foreground">{row.original.user?.name || "-"}</span>
        {row.original.registration?.team_name && (
          <span className="text-[10px] text-muted-foreground font-normal">
            Tim: {row.original.registration.team_name}
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "product.name",
    header: "Produk",
    cell: ({ row }) => (
      <div className="flex flex-col gap-0.5">
        <span>{row.original.product?.name}</span>
        {(row.original.category?.name || row.original.product?.category?.name) && (
          <span className="text-[10px] text-blue-400 font-medium">
            {row.original.category?.name || row.original.product?.category?.name}
          </span>
        )}
        {Number(row.original.product?.reward_xp) > 0 && (
          <span className="text-[10px] text-emerald-400 font-medium">
            +{(Number(row.original.product.reward_xp) * (row.original.quantity || 1)).toLocaleString()} XP
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "quantity",
    header: "Jumlah",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.quantity || 1} item</span>
    ),
  },
  {
    accessorKey: "points_used",
    header: "Poin",
    cell: ({ row }) => <Badge>{row.original.points_used}</Badge>,
  },
];

// Kolom untuk tablet
export const tabletColumns = [
  ...mobileColumns,
  {
    accessorKey: "user.email",
    header: "Email",
    cell: ({ row }) => <span>{row.original.user?.email}</span>,
  },
  {
    accessorKey: "category",
    header: () => <div className="text-center">Kategori</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Badge className="bg-blue-500/15 text-blue-400 border border-blue-500/30 text-[11px] px-2.5 py-0.5 rounded-full font-medium whitespace-nowrap">
          {row.original.registration?.category_name || row.original.category?.name || row.original.product?.category?.name || "Kompetisi"}
        </Badge>
      </div>
    ),
  },
];

// Kolom untuk desktop
export const desktopColumns = [
  ...tabletColumns,
  {
    accessorKey: "created_at",
    header: "Tanggal",
    cell: ({ row }) => (
      <span>
        {formatMediumShortDate(row.original.created_at)}
      </span>
    ),
  },
];

// Fungsi untuk memilih kolom berdasarkan device
export function getRedemptionColumns({ isMobile, isTablet }) {
  if (isMobile) return mobileColumns;
  if (isTablet) return tabletColumns;
  return desktopColumns;
}
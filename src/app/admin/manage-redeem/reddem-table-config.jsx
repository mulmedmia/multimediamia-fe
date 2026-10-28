import React from "react";
import { Badge } from "@/components/ui/badge";
import { Phone, ExternalLink } from "lucide-react";
import { formatMediumShortDate } from "@/lib/utils";

// Kolom untuk mobile
export const mobileColumns = [
  {
    accessorKey: "user.name",
    header: "Nama",
    cell: ({ row }) => <span>{row.original.user?.name}</span>,
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
    accessorKey: "user.whatsapp_number",
    header: "Nomor WhatsApp",
    cell: ({ row }) => {
      const wa = row.original.user?.whatsapp_number || row.original.user?.whatsapp;
      if (!wa) return <span className="text-muted-foreground/40 italic">-</span>;
      const cleanWa = wa.replace(/[^0-9]/g, "").replace(/^0/, "62");
      return (
        <a
          href={`https://wa.me/${cleanWa}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-400 hover:text-emerald-300 hover:underline inline-flex items-center gap-1 font-medium text-xs"
        >
          <Phone className="h-3 w-3" />
          <span>{wa}</span>
          <ExternalLink className="h-2.5 w-2.5 opacity-60" />
        </a>
      );
    },
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
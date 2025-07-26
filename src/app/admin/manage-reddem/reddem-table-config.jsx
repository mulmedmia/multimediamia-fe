import React from "react";
import { Badge } from "@/components/ui/badge";

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
    cell: ({ row }) => <span>{row.original.product?.name}</span>,
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
];

// Kolom untuk desktop
export const desktopColumns = [
  ...tabletColumns,
  {
    accessorKey: "created_at",
    header: "Tanggal",
    cell: ({ row }) => (
      <span>
        {new Date(row.original.created_at).toLocaleString("id-ID", {
          dateStyle: "medium",
          timeStyle: "short",
        })}
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
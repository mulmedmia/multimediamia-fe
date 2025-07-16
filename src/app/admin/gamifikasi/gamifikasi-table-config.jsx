import React from "react";
import { Button } from "@/components/ui/button";

// Kolom untuk mobile (hanya info penting)
export const mobileColumns = [
  { accessorKey: "name", header: "Nama" },
  { accessorKey: "points", header: "Poin", cell: ({ row }) => row.original.points ?? 0 },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row, setEditUser, reset }) => (
      <Button
        size="sm"
        onClick={() => {
          setEditUser(row.original);
          reset({ points: "" });
        }}
      >
        Edit
      </Button>
    ),
  },
];

// Kolom untuk tablet (tambah email)
export const tabletColumns = [
  { accessorKey: "name", header: "Nama" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "points", header: "Poin", cell: ({ row }) => row.original.points ?? 0 },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row, setEditUser, reset }) => (
      <Button
        size="sm"
        onClick={() => {
          setEditUser(row.original);
          reset({ points: "" });
        }}
      >
        Edit
      </Button>
    ),
  },
];

// Kolom untuk desktop (tambah role)
export const desktopColumns = [
  { accessorKey: "name", header: "Nama" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "points", header: "Poin", cell: ({ row }) => row.original.points ?? 0 },
  { accessorKey: "role", header: "Role" },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row, setEditUser, reset }) => (
      <Button
        size="sm"
        onClick={() => {
          setEditUser(row.original);
          reset({ points: "" });
        }}
      >
        Edit
      </Button>
    ),
  },
];

// Fungsi untuk memilih kolom berdasarkan device
export function getGamifikasiColumns({ isMobile, isTablet, setEditUser, reset }) {
  const injectProps = (cols) =>
    cols.map((col) =>
      col.id === "actions"
        ? { ...col, cell: (props) => col.cell({ ...props, setEditUser, reset }) }
        : col
    );
  if (isMobile) return injectProps(mobileColumns);
  if (isTablet) return injectProps(tabletColumns);
  return injectProps(desktopColumns);
}
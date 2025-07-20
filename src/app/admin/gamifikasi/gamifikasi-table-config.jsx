import React from "react";
import { Button } from "@/components/ui/button";

// Kolom untuk mobile (hanya info penting)
export const mobileColumns = [
  { accessorKey: "name", header: "Nama" },
  { accessorKey: "points", header: "Poin", cell: ({ row }) => (
      <span className="text-foreground dark:text-white">{row.original.points ?? 0}</span>
    )
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row, setEditUser, reset }) => (
      <Button
        size="sm"
        variant="outline"
        className="bg-white dark:bg-gray-900 text-black dark:text-white border dark:border-gray-700"
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
  { accessorKey: "email", header: "Email", cell: ({ row }) => (
      <span className="text-foreground dark:text-white">{row.original.email}</span>
    )
  },
  { accessorKey: "points", header: "Poin", cell: ({ row }) => (
      <span className="text-foreground dark:text-white">{row.original.points ?? 0}</span>
    )
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row, setEditUser, reset }) => (
      <Button
        size="sm"
        variant="outline"
        className="bg-white dark:bg-gray-900 text-black dark:text-white border dark:border-gray-700"
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
  { accessorKey: "email", header: "Email", cell: ({ row }) => (
      <span className="text-foreground dark:text-white">{row.original.email}</span>
    )
  },
  { accessorKey: "points", header: "Poin", cell: ({ row }) => (
      <span className="text-foreground dark:text-white">{row.original.points ?? 0}</span>
    )
  },
  { accessorKey: "role", header: "Role", cell: ({ row }) => (
      <span className="text-foreground dark:text-white">{row.original.role}</span>
    )
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row, setEditUser, reset }) => (
      <Button
        size="sm"
        variant="outline"
        className="bg-white dark:bg-gray-900 text-black dark:text-white border dark:border-gray-700"
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
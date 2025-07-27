import React from "react";
import { Button } from "@/components/ui/button";

export const getGamifikasiColumns = ({ isMobile, setEditUser, reset }) => {
  const baseColumns = [
    {
      accessorKey: "name",
      header: "Nama",
    },
    {
      accessorKey: "points",
      header: "Poin",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.points ?? 0}</span>
      ),
    },
  ];

  const desktopColumns = [
    ...baseColumns.slice(0, 1),
    {
      accessorKey: "email",
      header: "Email",
    },
    ...baseColumns.slice(1),
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <span className="capitalize">{row.original.role}</span>
      ),
    },
  ];

  const actionColumn = {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => (
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          setEditUser(row.original);
          reset({ points: row.original.points || 0 });
        }}
      >
        Edit
      </Button>
    ),
  };

  const columns = isMobile ? baseColumns : desktopColumns;
  return [...columns, actionColumn];
};

import React from "react";
import { Button } from "@/components/ui/button";

export const getGamifikasiColumns = ({ isMobile, setEditTeam, reset }) => {
  const baseColumns = [
    {
      accessorKey: "team_name",
      header: "Nama Tim",
    },
    {
      accessorKey: "diamond",
      header: "Diamond",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.diamond ?? 0}</span>
      ),
    },
    {
      accessorKey: "xp",
      header: "XP",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.xp ?? 0} XP</span>
      ),
    },
  ];

  const desktopColumns = [
    ...baseColumns.slice(0, 1),
    {
      accessorKey: "category",
      header: "Kategori",
      cell: ({ row }) => (
        <span>{row.original.category?.name || "-"}</span>
      ),
    },
    {
      accessorKey: "team_leader_name",
      header: "Ketua Tim",
      cell: ({ row }) => (
        <span>{row.original.team_leader_name || row.original.user?.name || "-"}</span>
      ),
    },
    ...baseColumns.slice(1),
  ];

  const actionColumn = {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => (
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          setEditTeam(row.original);
          reset({
            diamond: row.original.diamond ?? 0,
            xp: row.original.xp ?? 0,
          });
        }}
      >
        Edit Diamond & XP
      </Button>
    ),
  };

  const columns = isMobile ? baseColumns : desktopColumns;
  return [...columns, actionColumn];
};

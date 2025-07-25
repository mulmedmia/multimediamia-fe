"use client";

import React, { useState } from "react";
import { useAdminJuri, useCreateJuri, useDeleteJuri } from "@/hooks/admin-use-juri";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";

// Tambahkan hook untuk deteksi mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

function CreateJuriDialog({ open, onOpenChange, onSubmit, isLoading }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Juri</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nama</label>
            <Input name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <Input name="password" type="password" value={form.password} onChange={handleChange} required />
          </div>
          <DialogFooter className="pt-2 flex-col sm:flex-row gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="w-full sm:w-auto">Batal</Button>
            </DialogClose>
            <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : "Tambah"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function ManageJuriPage() {
  const { data: juri = [], isLoading, isError } = useAdminJuri();
  const createMutation = useCreateJuri();
  const deleteMutation = useDeleteJuri();
  const [openCreate, setOpenCreate] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Manajemen Juri</h1>
          <p className="text-muted-foreground">Tambah dan hapus akun juri di sini.</p>
        </div>
        <Button onClick={() => setOpenCreate(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Juri
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Daftar Juri</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Memuat data...</div>
          ) : isError ? (
            <div className="text-center text-red-600">Gagal memuat data juri.</div>
          ) : juri.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Belum ada juri.</div>
          ) : isMobile ? (
            <div className="space-y-4">
              {juri.map((j) => (
                <div key={j.users_id} className="border rounded-lg p-4 flex items-center justify-between bg-white dark:bg-gray-900">
                  <div>
                    <div className="font-semibold">{j.name}</div>
                    <div className="text-sm text-muted-foreground">{j.email}</div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteMutation.mutate(j.users_id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold">Nama</th>
                    <th className="px-4 py-2 text-left font-semibold">Email</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {juri.map((j) => (
                    <tr key={j.users_id} className="border-b dark:border-gray-800">
                      <td className="px-4 py-2">{j.name}</td>
                      <td className="px-4 py-2">{j.email}</td>
                      <td className="px-4 py-2 text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteMutation.mutate(j.users_id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateJuriDialog
        open={openCreate}
        onOpenChange={setOpenCreate}
        onSubmit={createMutation.mutate}
        isLoading={createMutation.isPending}
      />
    </div>
  );
}
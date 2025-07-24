import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import DatePickerField from "./DatePickerField";

export default function CategoryForm({ initial, onSubmit, isLoading }) {
  const [form, setForm] = useState({
    category_name: initial?.category_name || "",
    name: initial?.name || "",
    startDate: initial?.startDate ? new Date(initial.startDate) : null,
    endDate: initial?.endDate ? new Date(initial.endDate) : null,
    title: initial?.title || "",
    description: initial?.description || "",
    deadline: initial?.deadline ? new Date(initial.deadline) : null,
    status: initial?.status || "NOT_VERIFIED",
    image: null,
    organizer: initial?.organizer || "",
    team_type: initial?.team_type || "GROUP",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      startDate: form.startDate ? form.startDate.toISOString() : "",
      endDate: form.endDate ? form.endDate.toISOString() : "",
      deadline: form.deadline ? form.deadline.toISOString() : "",
      image: form.image,
      team_type: form.team_type,
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-2">
          <Label htmlFor="category_name">Nama Kategori</Label>
          <Input
            id="category_name"
            value={form.category_name}
            onChange={(e) =>
              setForm((f) => ({ ...f, category_name: e.target.value }))
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Nama Lomba</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">Judul</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="organizer">Penyelenggara</Label>
          <Input
            id="organizer"
            value={form.organizer}
            onChange={(e) =>
              setForm((f) => ({ ...f, organizer: e.target.value }))
            }
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Deskripsi</Label>
          <Input
            id="description"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            required
          />
        </div>
        <div className="space-y-2 w-full">
          <Label>Status</Label>
          <Select
            value={form.status}
            onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent className="w-full">
              <SelectItem value="NOT_VERIFIED">NOT_VERIFIED</SelectItem>
              <SelectItem value="VERIFIED">VERIFIED</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 w-full">
          <Label>Team Type</Label>
          <Select
            value={form.team_type}
            onValueChange={(v) => setForm((f) => ({ ...f, team_type: v }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih tipe tim" />
            </SelectTrigger>
            <SelectContent className="w-full">
              <SelectItem value="GROUP">GROUP</SelectItem>
              <SelectItem value="INDIVIDUAL">INDIVIDUAL</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Start Date</Label>
          <DatePickerField
            value={form.startDate}
            onChange={(date) => setForm((f) => ({ ...f, startDate: date }))}
            placeholder="Pilih tanggal mulai"
          />
        </div>
        <div className="space-y-2">
          <Label>End Date</Label>
          <DatePickerField
            value={form.endDate}
            onChange={(date) => setForm((f) => ({ ...f, endDate: date }))}
            placeholder="Pilih tanggal selesai"
          />
        </div>
        <div className="space-y-2">
          <Label>Deadline</Label>
          <DatePickerField
            value={form.deadline}
            onChange={(date) => setForm((f) => ({ ...f, deadline: date }))}
            placeholder="Pilih deadline"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="image">Image</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) =>
              setForm((f) => ({ ...f, image: e.target.files?.[0] }))
            }
          />
        </div>
      </div>
      <DialogFooter className="flex-col sm:flex-row pt-4 gap-2 sm:gap-4">
        <DialogClose asChild>
          <Button type="button" variant="outline" className="w-full sm:w-auto">
            Batal
          </Button>
        </DialogClose>
        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? "Menyimpan..." : "Simpan"}
        </Button>
      </DialogFooter>
    </form>
  );
}
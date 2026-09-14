import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
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
import DateTimePickerField from "./DateTimePickerField";

const getCategorySchema = (type = "create") =>
  z.object({
    category_name: z.string().trim().min(3, "Nama Kategori minimal 3 karakter"),
    name: z.string().trim().min(3, "Nama Lomba minimal 3 karakter"),
    title: z.string().trim().min(3, "Judul minimal 3 karakter"),
    organizer: z.string().trim().min(3, "Penyelenggara minimal 3 karakter"),
    description: z.string().trim().min(10, "Deskripsi minimal 10 karakter"),
    status: z.enum(["NOT_VERIFIED", "VERIFIED"]).default("VERIFIED"),
    team_type: z.enum(["GROUP", "INDIVIDUAL"]).default("GROUP"),
    startDate: z.any(),
    endDate: z.any(),
    deadline: z.any(),
    image:
      type === "create"
        ? z.any().refine((file) => !!file, { message: "Gambar wajib diunggah" })
        : z.any().optional().nullable(),
    file_url: z.url({
      protocol: /^https?$/,
      message: "Harap masukkan URL yang valid.",
    }),
  });

export default function CategoryForm({
  initial,
  onSubmit,
  isLoading,
  type = "create",
}) {
  const schema = useMemo(() => getCategorySchema(type), [type]);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      category_name: initial?.category_name || "",
      name: initial?.name || "",
      startDate: initial?.startDate
        ? new Date(initial.startDate)
        : (() => {
            const now = new Date();
            now.setHours(9, 0, 0, 0);
            return now;
          })(),
      endDate: initial?.endDate
        ? new Date(initial.endDate)
        : (() => {
            const now = new Date();
            now.setDate(now.getDate() + 30);
            now.setHours(23, 59, 0, 0);
            return now;
          })(),
      title: initial?.title || "",
      description: initial?.description || "",
      deadline: initial?.deadline
        ? new Date(initial.deadline)
        : (() => {
            const now = new Date();
            now.setDate(now.getDate() + 30);
            now.setHours(23, 59, 0, 0);
            return now;
          })(),
      status: initial?.status || "VERIFIED",
      image: null,
      file_url: initial?.file_url || "",
      organizer: initial?.organizer || "",
      team_type: initial?.team_type || "GROUP",
    },
  });

  const statusValue = watch("status");
  const teamTypeValue = watch("team_type");
  const startDateValue = watch("startDate");
  const endDateValue = watch("endDate");
  const deadlineValue = watch("deadline");

  const onFormSubmit = (data) => {
    const payload = {
      ...data,
      startDate: data.startDate ? new Date(data.startDate).toISOString() : "",
      endDate: data.endDate ? new Date(data.endDate).toISOString() : "",
      deadline: data.deadline ? new Date(data.deadline).toISOString() : "",
      image: data.image,
      team_type: data.team_type,
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-2">
          <Label htmlFor="category_name">Nama Kategori</Label>
          <Input
            id="category_name"
            placeholder="Masukkan nama kategori..."
            {...register("category_name")}
            className={cn(
              errors.category_name &&
                "border-destructive focus-visible:ring-destructive",
            )}
          />
          {errors.category_name && (
            <p className="text-xs text-mia-red font-medium mt-1">
              {errors.category_name.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Nama Lomba</Label>
          <Input
            id="name"
            placeholder="Masukkan nama lomba..."
            {...register("name")}
            className={cn(
              errors.name &&
                "border-destructive focus-visible:ring-destructive",
            )}
          />
          {errors.name && (
            <p className="text-xs text-mia-red font-medium mt-1">
              {errors.name.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">Judul</Label>
          <Input
            id="title"
            placeholder="Masukkan judul..."
            {...register("title")}
            className={cn(
              errors.title &&
                "border-destructive focus-visible:ring-destructive",
            )}
          />
          {errors.title && (
            <p className="text-xs text-mia-red font-medium mt-1">
              {errors.title.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="organizer">Penyelenggara</Label>
          <Input
            id="organizer"
            placeholder="Masukkan penyelenggara..."
            {...register("organizer")}
            className={cn(
              errors.organizer &&
                "border-destructive focus-visible:ring-destructive",
            )}
          />
          {errors.organizer && (
            <p className="text-xs text-mia-red font-medium mt-1">
              {errors.organizer.message}
            </p>
          )}
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Deskripsi</Label>
          <Input
            id="description"
            placeholder="Masukkan deskripsi..."
            {...register("description")}
            className={cn(
              errors.description &&
                "border-destructive focus-visible:ring-destructive",
            )}
          />
          {errors.description && (
            <p className="text-xs text-mia-red font-medium mt-1">
              {errors.description.message}
            </p>
          )}
        </div>
        <div className="space-y-2 w-full">
          <Label>Status</Label>
          <Select
            value={statusValue}
            onValueChange={(v) =>
              setValue("status", v, { shouldValidate: true })
            }
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
            value={teamTypeValue}
            onValueChange={(v) =>
              setValue("team_type", v, { shouldValidate: true })
            }
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
          <DateTimePickerField
            value={startDateValue}
            onChange={(date) => setValue("startDate", date)}
            placeholder="Pilih tanggal mulai dengan waktu"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>End Date</Label>
          <DateTimePickerField
            value={endDateValue}
            onChange={(date) => setValue("endDate", date)}
            placeholder="Pilih tanggal selesai dengan waktu"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Deadline</Label>
          <DateTimePickerField
            value={deadlineValue}
            onChange={(date) => setValue("deadline", date)}
            placeholder="Pilih deadline dengan waktu"
            required
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="image">Image</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            className={cn(
              errors.image &&
                "border-destructive focus-visible:ring-destructive",
            )}
            onChange={(e) =>
              setValue("image", e.target.files?.[0] || null, {
                shouldValidate: true,
              })
            }
          />
          {errors.image && (
            <p className="text-xs text-mia-red font-medium mt-1">
              {errors.image.message}
            </p>
          )}
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="file_url">Link File (Google Drive, dsb)</Label>
          <Input
            id="file_url"
            type="url"
            placeholder="https://drive.google.com/file/d/xxx/view?usp=sharing"
            {...register("file_url")}
            className={cn(
              errors.file_url &&
                "border-destructive focus-visible:ring-destructive",
            )}
          />
          {errors.file_url && (
            <p className="text-xs text-mia-red font-medium mt-1">
              {errors.file_url.message}
            </p>
          )}
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

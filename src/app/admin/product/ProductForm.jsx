"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getSafeImageUrl } from "@/lib/image-loader";
import { useQuery } from "@tanstack/react-query";
import { getAllUserCategories } from "@/services/user-category.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogFooter } from "@/components/ui/dialog";
import { Image as ImageIcon, CheckCircle2, Upload, AlertCircle, Infinity as InfinityIcon, Zap, Trophy } from "lucide-react";

export default function ProductForm({ initial, onSubmit, isLoading, onCancel }) {
  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ["user-categories-dropdown"],
    queryFn: getAllUserCategories,
    staleTime: 5 * 60 * 1000,
  });

  const [form, setForm] = useState({
    category_id: initial?.category_id || "ALL",
    name: initial?.name || "",
    description: initial?.description || "",
    price: initial?.price !== undefined ? String(initial.price) : "",
    stock: initial?.stock !== undefined ? String(initial.stock) : "",
    reward_xp: initial?.reward_xp !== undefined ? String(initial.reward_xp) : "0",
    is_unlimited_stock: initial?.is_unlimited_stock !== undefined ? Boolean(initial.is_unlimited_stock) : false,
    is_single_redeem: initial?.is_single_redeem !== undefined ? Boolean(initial.is_single_redeem) : false,
    is_active: initial?.is_active !== undefined ? Boolean(initial.is_active) : true,
    image: null,
  });

  const [previewUrl, setPreviewUrl] = useState(initial?.image_url || null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initial) {
      setForm({
        category_id: initial.category_id || "ALL",
        name: initial.name || "",
        description: initial.description || "",
        price: initial.price !== undefined ? String(initial.price) : "",
        stock: initial.stock !== undefined ? String(initial.stock) : "",
        reward_xp: initial.reward_xp !== undefined ? String(initial.reward_xp) : "0",
        is_unlimited_stock: initial.is_unlimited_stock !== undefined ? Boolean(initial.is_unlimited_stock) : false,
        is_single_redeem: initial.is_single_redeem !== undefined ? Boolean(initial.is_single_redeem) : false,
        is_active: initial.is_active !== undefined ? Boolean(initial.is_active) : true,
        image: null,
      });
      setPreviewUrl(initial.image_url || null);
    }
  }, [initial]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((f) => ({ ...f, image: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Nama produk wajib diisi.");
      return;
    }
    if (!form.description || form.description.trim().length < 10) {
      setError("Deskripsi produk minimal 10 karakter.");
      return;
    }
    if (!form.price || Number(form.price) <= 0) {
      setError("Harga produk harus bernilai lebih dari 0.");
      return;
    }
    if (!form.is_unlimited_stock && (form.stock === "" || Number(form.stock) < 0)) {
      setError("Stok produk harus bernilai 0 atau lebih.");
      return;
    }
    if (!initial && !form.image) {
      setError("Gambar produk wajib diunggah.");
      return;
    }

    setError("");

    const payload = {
      category_id:
        form.category_id && form.category_id !== "ALL" ? form.category_id : null,
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      stock: form.is_unlimited_stock ? 0 : Number(form.stock),
      reward_xp: Number(form.reward_xp) || 0,
      is_unlimited_stock: Boolean(form.is_unlimited_stock),
      is_single_redeem: Boolean(form.is_single_redeem),
      is_active: form.is_active,
    };

    if (form.image) {
      payload.image = form.image;
    }

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Kategori Kompetisi */}
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
            <Trophy className="h-3.5 w-3.5 text-[#FED700]" />
            <span>Kategori Kompetisi</span>
          </Label>
          <Select
            value={form.category_id || "ALL"}
            onValueChange={(val) => setForm((f) => ({ ...f, category_id: val }))}
            disabled={loadingCategories}
          >
            <SelectTrigger className="h-10 bg-input/40 border-border/50 rounded-xl text-xs text-foreground">
              <SelectValue placeholder={loadingCategories ? "Memuat kategori..." : "Pilih cakupan kategori"} />
            </SelectTrigger>
            <SelectContent className="bg-[#141824] border-border/50 text-foreground">
              <SelectItem value="ALL">
                🌐 Semua Kategori (Global / Bersama)
              </SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.category_id} value={String(cat.category_id)}>
                  {cat.category_name || cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-[11px] text-muted-foreground">
            {form.category_id === "ALL" || !form.category_id
              ? "Produk ini akan tampil di seluruh kategori lomba (WIA & UIA). Peserta dari kategori lomba mana pun dapat menukar produk ini."
              : "Produk ini hanya akan tampil khusus untuk kategori yang dipilih."}
          </p>
        </div>

        {/* Nama Produk */}
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="name" className="text-xs text-muted-foreground font-medium">
            Nama Produk <span className="text-[#E01C20]">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Contoh: Kaos Eksklusif MIA 2026"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="h-10 bg-input/40 border-border/50 rounded-xl text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60"
            required
          />
        </div>

        {/* Harga */}
        <div className="space-y-1.5">
          <Label htmlFor="price" className="text-xs text-muted-foreground font-medium">
            Harga (Diamonds / Poin) <span className="text-[#E01C20]">*</span>
          </Label>
          <Input
            id="price"
            type="number"
            min="0"
            placeholder="Contoh: 50"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            className="h-10 bg-input/40 border-border/50 rounded-xl text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60"
            required
          />
        </div>

        {/* Stok */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="stock" className="text-xs text-muted-foreground font-medium">
              Jumlah Stok {!form.is_unlimited_stock && <span className="text-[#E01C20]">*</span>}
            </Label>
            {form.is_unlimited_stock && (
              <span className="text-[10px] text-purple-400 font-medium flex items-center gap-1">
                <InfinityIcon className="h-3 w-3" /> Tidak terbatas
              </span>
            )}
          </div>
          <Input
            id="stock"
            type="number"
            min="0"
            placeholder={form.is_unlimited_stock ? "Stok tidak terbatas (∞)" : "Contoh: 25"}
            value={form.is_unlimited_stock ? "" : form.stock}
            disabled={form.is_unlimited_stock}
            onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
            className="h-10 bg-input/40 border-border/50 rounded-xl text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-input/20"
            required={!form.is_unlimited_stock}
          />
        </div>

        {/* Reward XP */}
        <div className="space-y-1.5 sm:col-span-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="reward_xp" className="text-xs text-muted-foreground font-medium">
              Reward XP per Unit (Opsional)
            </Label>
            {Number(form.reward_xp) > 0 && (
              <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md font-medium flex items-center gap-1">
                <Zap className="h-3 w-3" />
                +{Number(form.reward_xp)} XP per Redeem
              </span>
            )}
          </div>
          <Input
            id="reward_xp"
            type="number"
            min="0"
            placeholder="Contoh: 10 (Isi nilai > 0 jika penukaran produk ini menambah XP peserta)"
            value={form.reward_xp}
            onChange={(e) => setForm((f) => ({ ...f, reward_xp: e.target.value }))}
            className="h-10 bg-input/40 border-border/50 rounded-xl text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60"
          />
          <p className="text-[11px] text-muted-foreground">
            Bila diisi lebih dari 0, setiap kali peserta menukar produk ini, sistem akan otomatis menambahkan XP sebesar (Reward XP × Jumlah Penukaran). Contoh: Jika Harga = 1 Diamond dan Reward XP = 10, maka 1 Diamond bernilai 10 XP.
          </p>
        </div>

        {/* Opsi Stok Tidak Terbatas & Batasan Redeem */}
        <div className="space-y-3 sm:col-span-2 p-3.5 rounded-xl bg-white/[0.02] border border-border/40">
          <div className="flex items-start gap-3">
            <Checkbox
              id="is_unlimited_stock"
              checked={form.is_unlimited_stock}
              onCheckedChange={(checked) =>
                setForm((f) => ({ ...f, is_unlimited_stock: Boolean(checked) }))
              }
              className="mt-0.5"
            />
            <label
              htmlFor="is_unlimited_stock"
              className="space-y-1 leading-none cursor-pointer"
            >
              <div className="text-xs font-semibold text-foreground cursor-pointer flex items-center gap-1.5">
                <span>Jumlah Stok Tidak Terbatas</span>
                <span className="text-[10px] text-purple-400 bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.5 rounded font-medium">
                  Unlimited
                </span>
              </div>
              
              <p className="text-[11px] text-muted-foreground">
                Centang jika produk ini tidak memiliki batasan kuota stok (misal produk digital atau stok selalu tersedia).
              </p>
            </label>
          </div>

          <div className="flex items-start gap-3 pt-2.5 border-t border-border/30">
            <Checkbox
              id="is_single_redeem"
              checked={form.is_single_redeem}
              onCheckedChange={(checked) =>
                setForm((f) => ({ ...f, is_single_redeem: Boolean(checked) }))
              }
              className="mt-0.5"
            />
            <label
              htmlFor="is_single_redeem"
              className="space-y-1 leading-none cursor-pointer"
            >
              <div className="text-xs font-semibold text-foreground cursor-pointer flex items-center gap-1.5">
                <span>Hanya Bisa Di-redeem 1 Kali per Tim</span>
                <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded font-medium">
                  1x Redeem
                </span>
              </div>
              
              <p className="text-[11px] text-muted-foreground">
                Jika diaktifkan, setiap tim hanya dapat menukarkan produk ini 1 kali saja (kuantitas otomatis terkunci 1). Jika nonaktif, tim dapat menentukan sendiri berapa banyak produk yang ingin di-redeem.
              </p>
            </label>
          </div>
        </div>

        {/* Status Aktif */}
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-xs text-muted-foreground font-medium">
            Status Produk
          </Label>
          <Select
            value={form.is_active ? "true" : "false"}
            onValueChange={(val) =>
              setForm((f) => ({ ...f, is_active: val === "true" }))
            }
          >
            <SelectTrigger className="h-10 bg-input/40 border-border/50 rounded-xl text-xs text-foreground">
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent className="bg-[#141824] border-border/50 text-foreground">
              <SelectItem value="true">Aktif (Dapat Dilihat / Ditebus)</SelectItem>
              <SelectItem value="false">Nonaktif (Disembunyikan)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Deskripsi */}
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="description" className="text-xs text-muted-foreground font-medium">
            Deskripsi Produk <span className="text-[#E01C20]">*</span>
          </Label>
          <Textarea
            id="description"
            rows={3}
            placeholder="Deskripsi detail bahan, ukuran, dan informasi produk (minimal 10 karakter)..."
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="bg-input/40 border-border/50 rounded-xl p-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60"
            required
          />
        </div>

        {/* Upload Gambar */}
        <div className="space-y-2 sm:col-span-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="image" className="text-xs text-muted-foreground font-medium">
              Gambar Produk {!initial && <span className="text-[#E01C20]">*</span>}
            </Label>
            <span className="text-[10px] text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-md font-medium">
              Rekomendasi: 800 × 800 px (1:1)
            </span>
          </div>

          <div className="flex items-center gap-4 p-3 bg-[#0F121A] border border-border/40 rounded-xl">
            {previewUrl ? (
              <div className="relative w-18 h-18 rounded-xl overflow-hidden border border-border/50 bg-black/40 flex-shrink-0">
                <Image
                  src={getSafeImageUrl(previewUrl)}
                  alt="Preview"
                  fill
                  className="object-cover"
                  unoptimized={typeof previewUrl === "string" && previewUrl.startsWith("blob:")}
                />
              </div>
            ) : (
              <div className="w-18 h-18 rounded-xl border border-dashed border-border/60 bg-white/[0.02] flex flex-col items-center justify-center text-muted-foreground flex-shrink-0 gap-1">
                <ImageIcon className="h-5 w-5 opacity-40" />
                <span className="text-[9px] opacity-40">1 : 1</span>
              </div>
            )}

            <div className="flex-1 min-w-0">
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="image"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border/50 bg-input/40 hover:bg-input/60 text-xs font-medium text-foreground cursor-pointer transition-colors"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>{previewUrl ? "Ganti Gambar Produk" : "Unggah Gambar Produk"}</span>
              </label>
              <div className="space-y-0.5 mt-1.5">
                <p className="text-[11px] text-muted-foreground flex items-center gap-1 flex-wrap">
                  <span>Ukuran disarankan:</span>
                  <span className="text-foreground font-semibold">800 × 800 px</span>
                  <span className="text-blue-400 font-medium">(1:1 Square)</span>
                  <span>atau</span>
                  <span className="text-foreground font-semibold">1200 × 675 px</span>
                  <span className="text-blue-400 font-medium">(16:9)</span>
                </p>
                <p className="text-[10px] text-muted-foreground/70">
                  Format JPG, PNG, atau WEBP. Maksimal file 5MB (otomatis dikonversi & dikompresi ke AVIF).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter className="gap-2 sm:gap-2 pt-3">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-xl text-xs text-muted-foreground hover:text-white"
          >
            Batal
          </Button>
        )}
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-[#FF5722] to-[#E01C20] hover:from-[#e04515] hover:to-[#c4181c] text-white rounded-xl text-xs font-semibold px-4 cursor-pointer"
        >
          <CheckCircle2 className="h-4 w-4 mr-1.5" />
          {isLoading ? "Menyimpan..." : initial ? "Perbarui Produk" : "Simpan Produk"}
        </Button>
      </DialogFooter>
    </form>
  );
}

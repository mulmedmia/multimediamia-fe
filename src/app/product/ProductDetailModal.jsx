"use client";

import React from "react";
import Image from "next/image";
import { getSafeImageUrl } from "@/lib/image-loader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Gift,
  CheckCircle2,
  AlertCircle,
  Infinity as InfinityIcon,
  Zap,
  Gem,
  Boxes,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProductDetailModal({
  isOpen,
  onOpenChange,
  product,
  activeCategory,
  myRedemptions = [],
  isOutOfStockLocal = false,
  onRedeem,
}) {
  if (!product) return null;

  const isZeroStock = isOutOfStockLocal;
  const currentStock = isZeroStock ? 0 : Number(product.stock);

  const userDiamonds = Number(
    activeCategory?.diamond ?? 0
  );
  const userXp = Number(activeCategory?.xp ?? 0);

  const maxPerTeam =
    Number(product.max_redeem_per_team) > 0
      ? Number(product.max_redeem_per_team)
      : product.is_single_redeem
      ? 1
      : 0;
  const hasTeamLimit = maxPerTeam > 0;

  // Total kuantitas produk ini yang sudah ditukar oleh tim
  const teamRedeemedQty = myRedemptions
    .filter((r) => r.product_id === product.product_id)
    .reduce((sum, r) => sum + (Number(r.quantity) || 1), 0);

  const remainingTeamQuota = hasTeamLimit
    ? Math.max(0, maxPerTeam - teamRedeemedQty)
    : Infinity;
  const alreadyClaimed = hasTeamLimit && remainingTeamQuota <= 0;

  const isUnlimited = Boolean(product.is_unlimited_stock);
  const hasXpPrice = Number(product.price_xp) > 0;
  const hasXpReward = !hasXpPrice && Number(product.reward_xp) > 0;
  const isOutOfStock = !isUnlimited && (currentStock < 1 || isZeroStock);
  const canRedeem = product.is_active && !isOutOfStock && !alreadyClaimed;

  const notClaimable = !canRedeem || !activeCategory;

  const actionButtonText = !activeCategory
    ? "Daftar Lomba Dulu"
    : alreadyClaimed
    ? `Batas Tercapai (Maks ${maxPerTeam}x)`
    : isOutOfStock
    ? "Hadiah Telah Habis"
    : hasXpReward
    ? "Tukar ke XP"
    : "Tukar Produk";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-[#0A0D14] border border-white/10 text-[#FFF9F5] sm:max-w-md rounded-2xl p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto selection:bg-primary"
        showCloseButton={false}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="space-y-3 pb-2 border-b border-white/10">
          {/* Header Badges */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#141824] text-[#FFF9F5] border border-white/10">
              <Gift className="h-3.5 w-3.5 text-[#E01C20]" />
              {hasXpReward ? "Konversi XP" : "Produk"}
            </span>

            {!product.category_id ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-800/40">
                🌐 Semua Kategori
              </span>
            ) : product.category?.name ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-950/80 text-blue-300 border border-blue-800/40">
                {product.category.name}
              </span>
            ) : null}
          </div>

          <DialogTitle className="text-xl font-bold text-[#FFF9F5]">
            {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Big Hero Image */}
          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-gradient-to-br from-red-950/20 via-black to-red-900/10 border border-white/10 shadow-lg">
            <Image
              src={getSafeImageUrl(product.image_url) || "/placeholder-image.png"}
              alt={product.name}
              fill={true}
              priority
              className="object-cover"
            />
          </div>

          {/* Full Description */}
          <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {product.description || "Tidak ada deskripsi rinci untuk produk ini."}
          </div>

          {/* Pricing & Rewards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Price Card */}
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
              <p className="text-xs text-muted-foreground font-medium">
                Harga
              </p>
              <div className="flex items-center gap-2.5 flex-wrap">
                {Number(product.price_xp) > 0 && (
                  <span className="flex items-center gap-1.5 text-amber-300 font-bold text-base">
                    <Zap className="h-4 w-4 text-amber-400" />
                    <span>{Number(product.price_xp).toLocaleString("id-ID")} XP</span>
                  </span>
                )}
                {Number(product.price_diamond) > 0 && (
                  <span className="flex items-center gap-1.5 text-cyan-300 font-bold text-base">
                    <Gem className="h-4 w-4 text-cyan-400" />
                    <span>{Number(product.price_diamond).toLocaleString("id-ID")}</span>
                  </span>
                )}
                {Number(product.price_diamond) <= 0 && Number(product.price_xp) <= 0 && (
                  <span className="text-emerald-400 font-bold text-base">Gratis</span>
                )}
              </div>
            </div>

            {/* Ketersediaan / Stok */}
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
              <p className="text-xs text-muted-foreground font-medium">
                Stok
              </p>
              <p className={cn(
                "inline-flex gap-1 items-center text-sm font-semibold text-[#FFF9F5]",
                isUnlimited && "text-purple-400",
              )}>
                <span>
                  {isUnlimited 
                    ? "Tidak Terbatas"
                    : currentStock > 0 
                      ? `Tersedia ${currentStock} item`
                      : "Hadiah Telah Habis"}
                </span>
                {isUnlimited && (
                  <span className="text-xs inline-flex items-center">
                    (
                    <InfinityIcon className="h-4 w-4"/>
                    )
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Quota / Reward Card */}
          {hasXpReward && (
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1.5 col-span-full">
              <p className="text-xs text-emerald-300/80 font-medium">
                Reward
              </p>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Zap className="h-3.5 w-3.5" />
                </div>
                <span className="font-bold text-emerald-400 text-base">
                  +{Number(product.reward_xp).toLocaleString("id-ID")} XP / item
                </span>
              </div>
            </div>
          )}

          {/* User Balance Overview */}
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs text-[#AAB1BD]">
            <span>Saldo Tim Anda:</span>
            <div className="flex items-center gap-3 font-semibold">
              <span className="text-amber-400 flex items-center gap-1">
                <Zap className="h-3.5 w-3.5 fill-amber-400" /> {userXp.toLocaleString("id-ID")} XP
              </span>
              <span className="text-cyan-400 flex items-center gap-1">
                <Gem className="h-3.5 w-3.5 fill-cyan-400" /> {userDiamonds.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>

        {/* Warnings / Limit notices */}
        {hasTeamLimit && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
            <div className="flex flex-row flex-wrap">
              <span>
                Produk ini dibatasi maksimal {maxPerTeam} item per tim.
              </span>
              <span className="font-bold">Sisa kuota tim: {remainingTeamQuota} / {maxPerTeam} item</span>
            </div>
          </div>
        )}

        {/* Modal Footer with Cancel & Redeem Action */}
        <DialogFooter 
          className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3"
        >
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-full border border-white/15 bg-transparent hover:bg-white/5 text-[#FFF9F5] text-xs font-semibold h-10 px-5 cursor-pointer transition-colors"
          >
            Batal
          </button>

          <button
            type="button"
            className={cn(
              "mia-btn-primary h-10 px-5 text-xs text-white font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
              (alreadyClaimed || isOutOfStock) &&
                "border hover:shadow-none! hover:transform-none! cursor-default! opacity-100!",
              isOutOfStock && "bg-white/5! text-[#AAB1BD]/50! border-white/10!",
              alreadyClaimed && "bg-emerald-600/20! text-emerald-300! border-emerald-500/30!",
            )}
            disabled={notClaimable}
            onClick={(e) => onRedeem(e, true)}
          >
            {(alreadyClaimed || !isOutOfStock) && (
              <CheckCircle2 className="h-4 w-4" />
            )}
            <span>{actionButtonText}</span>
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { ProductDetailModal as ProductDetailCard };

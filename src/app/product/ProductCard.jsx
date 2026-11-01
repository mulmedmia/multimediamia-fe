"use client";

import React, { useState } from "react";
import Image from "next/image";
import { getSafeImageUrl } from "@/lib/image-loader";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useHoldPress } from "@/hooks/use-hold-press";
import { useRedeemProduct } from "@/hooks/use-product-gamification";
import {
  Gift,
  CheckCircle2,
  Loader2,
  Infinity as InfinityIcon,
  Zap,
  Gem,
} from "lucide-react";
import ProductDetailModal from "./ProductDetailModal";
import ProductRedeemModal from "./ProductRedeemModal";

export function HoldButton({ children, onAction, disabled, className, title }) {
  const holdProps = useHoldPress(onAction, { disabled });

  return (
    <button
      type="button"
      disabled={disabled}
      className={cn("select-none touch-none", className)}
      title={title}
      {...holdProps}
    >
      {children}
    </button>
  );
}

export default function ProductCard({
  product,
  activeCategory,
  selectedCategoryId,
  myRedemptions = [],
  isOutOfStockLocal = false,
  onOutOfStock,
  redeemMutation: customRedeemMutation,
  onOpenDetail,
}) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isRedeemOpen, setIsRedeemOpen] = useState(false);
  const [redeemQuantity, setRedeemQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backToDetail, setBackToDetail] = useState(false);

  const defaultRedeemMutation = useRedeemProduct();
  const redeemMutation = customRedeemMutation || defaultRedeemMutation;

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

  // Hitung total kuantitas produk ini yang sudah ditukar oleh tim
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

  // Hitung kuantitas maksimal yang mampu dibeli berdasarkan saldo Diamond & XP
  const maxAffordableDiamonds =
    Number(product.price_diamond) > 0
      ? Math.floor(userDiamonds / Number(product.price_diamond))
      : Infinity;

  const maxAffordableXp = hasXpPrice
    ? Math.floor(userXp / Number(product.price_xp))
    : Infinity;

  const maxAffordable = Math.min(maxAffordableDiamonds, maxAffordableXp);
  const maxStock = isUnlimited ? 999 : Math.max(0, currentStock);

  // Kuantitas maksimal yang diizinkan untuk diinput (dibatasi oleh stok, sisa kuota tim, & saldo, min 1)
  const maxAllowedByQuota = hasTeamLimit ? remainingTeamQuota : Infinity;

  const maxRedeemable = Math.max(
    1,
    Math.min(
      maxStock,
      maxAllowedByQuota,
      maxAffordable === Infinity ? maxStock : maxAffordable
    )
  );

  const currentQty = Math.min(maxRedeemable, Math.max(1, redeemQuantity));

  const isPending = isSubmitting || (redeemMutation.isPending && isRedeemOpen);
  const notClaimable = !canRedeem || !activeCategory || isPending;

  const handleRedeem = () => {
    setIsSubmitting(true);
    redeemMutation.mutate(
      {
        productId: product.product_id,
        quantity: currentQty,
        categoryId: selectedCategoryId || activeCategory?.category_id,
        registrationId: activeCategory?.registration_id,
      },
      {
        onSuccess: (resData) => {
          setIsSubmitting(false);
          const earned = resData?.earned_xp;
          toast.success(
            earned > 0
              ? `Produk berhasil ditukar! Selamat, Anda mendapatkan +${earned.toLocaleString()} XP! ⚡`
              : "Produk berhasil ditukar!",
            {
              style: { background: "#e6ffed", color: "#1a7f37" },
            }
          );
          setIsRedeemOpen(false);
          setRedeemQuantity(1);
          redeemMutation.reset();
        },
        onError: (error) => {
          setIsSubmitting(false);
          const errMsg =
            error?.response?.data?.message ||
            error?.message ||
            "Gagal menukar produk!";

          if (
            typeof errMsg === "string" &&
            errMsg.toLowerCase().includes("out of stock")
          ) {
            onOutOfStock?.(product.product_id);
          }

          toast.error(errMsg, {
            style: { background: "#ffeaea", color: "#c00" },
          });
          setIsRedeemOpen(false);
          setRedeemQuantity(1);
          redeemMutation.reset();
        },
      }
    );
  };

  const handleCardClick = () => {
    if (onOpenDetail) {
      onOpenDetail(product);
    } else {
      setIsDetailOpen(true);
    }
  };

  const handleOpenRedeem = (e, newBackToDetail = false) => {
    if (e) e.stopPropagation();
    setIsDetailOpen(false);
    setIsRedeemOpen(true);
    setRedeemQuantity(1);
    setBackToDetail(newBackToDetail);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="mia-card overflow-hidden hover:border-[#E01C20]/50 hover:shadow-[0_0_25px_rgba(224,28,32,0.12)] transition-all duration-300 relative flex flex-col group cursor-pointer"
      >
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-red-950/20 via-black to-red-900/10">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent z-10"></div>
          <Image
            src={getSafeImageUrl(product.image_url) || "/placeholder-image.png"}
            alt={product.name}
            fill={true}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 px-3 z-20 flex items-start gap-1.5 justify-between w-full">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#141824]/90 text-[#FFF9F5] border border-white/10 backdrop-blur-md">
              <Gift className="h-3.5 w-3.5 text-[#E01C20]" />
              {hasXpReward ? "Konversi XP" : "Produk"}
            </span>

            <div className="flex flex-col gap-1.5 items-end mt-0.5">
              {!product.category_id && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-950/90 text-emerald-300 border border-emerald-800/40 backdrop-blur-md w-fit">
                  🌐 Semua Kategori
                </span>
              )}
              {hasTeamLimit && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-950/90 text-amber-300 border border-amber-800/40 backdrop-blur-md w-fit">
                  Maks {maxPerTeam}x / Tim
                </span>
              )}
              {hasXpReward && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-950/90 text-emerald-300 border border-emerald-800/40 backdrop-blur-md w-fit">
                  <Zap className="h-3 w-3 text-emerald-400" />
                  +{product.reward_xp} XP / item
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 flex flex-col flex-1 space-y-4">
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-[#FFF9F5] group-hover:text-[#E01C20] transition-colors line-clamp-1">
              {product.name}
            </h3>
            <p className="text-xs sm:text-sm text-[#AAB1BD] line-clamp-2 leading-relaxed">
              {product.description ||
                "Tidak ada deskripsi tersedia untuk produk hadiah ini."}
            </p>
          </div>

          {/* Price & Stock info */}
          <div className="flex items-center justify-between text-sm mt-auto pt-3 border-t border-white/10 flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap font-semibold">
              {Number(product.price_xp) > 0 && (
                <span className="flex items-center gap-1 text-amber-300">
                  <Zap className="h-3.5 w-3.5 text-amber-400" />
                  <span>{Number(product.price_xp).toLocaleString("id-ID")} XP</span>
                </span>
              )}
              {Number(product.price_diamond) > 0 && (
                <span className="flex items-center gap-1 text-cyan-300">
                  <Gem className="h-3.5 w-3.5 text-cyan-400" /> 
                  <span>{Number(product.price_diamond).toLocaleString("id-ID")}</span>
                </span>
              )}
            </div>

            {isUnlimited ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/15 text-purple-400 border border-purple-500/30">
                <span>Stok: </span>
                <InfinityIcon className="h-3 w-3" />
              </span>
            ) : currentStock > 0 && (
              <span
                className={cn(
                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                  "bg-zinc-500/15 text-zinc-400 border border-zinc-500/30",
                  currentStock > 0 && "bg-[#E01C20]/15 text-[#E01C20] border border-[#E01C20]/30",
                  currentStock > 5 && "bg-[#00B445]/15 text-[#00B445] border border-[#00B445]/30",
                )}
              >
                Stok: {currentStock}
              </span>
            )}
          </div>

          {/* Claim / Redeem Action Button */}
          <button
            type="button"
            className={cn(
              "w-full mt-2 mia-btn-primary h-10 text-xs text-white font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
              (alreadyClaimed || isOutOfStock) &&
                "border hover:shadow-none! hover:transform-none! cursor-default! opacity-100!",
              isOutOfStock && "bg-white/5! text-[#AAB1BD]/50! border-white/10!",
              alreadyClaimed && "bg-emerald-600/20! text-emerald-300! border-emerald-500/30!",
            )}
            disabled={notClaimable}
            onClick={handleOpenRedeem}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              (alreadyClaimed || !isOutOfStock) && (
                <CheckCircle2 className="h-4 w-4" />
              )
            )}
            <span>
              {!activeCategory
                ? "Daftar Lomba Dulu"
                : alreadyClaimed
                ? `Batas Tercapai (Maks ${maxPerTeam}x)`
                : isOutOfStock
                ? "Hadiah Telah Habis"
                : hasXpReward
                ? "Tukar ke XP"
                : "Tukar Produk"}
            </span>
          </button>
        </div>
      </div>

      {/* Product Detail Modal (Popup) */}
      <ProductDetailModal
        isOpen={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        product={product}
        activeCategory={activeCategory}
        myRedemptions={myRedemptions}
        isOutOfStockLocal={isOutOfStockLocal}
        onOpenRedeem={handleOpenRedeem}
        />

      {/* Product Redeem Modal (Popup) */}
      <ProductRedeemModal 
        isOpen={isRedeemOpen}
        onOpenChange={setIsRedeemOpen}
        onOpenDetail={setIsDetailOpen}
        product={product}
        activeCategory={activeCategory}
        myRedemptions={myRedemptions}
        redeemMutation={redeemMutation}
        isOutOfStockLocal={isOutOfStockLocal}
        isRedeemOpen={isRedeemOpen}
        onRedeem={handleRedeem}
        redeemQuantity={redeemQuantity}
        onRedeemQuantity={setRedeemQuantity}
        isSubmitting={isSubmitting}
        backToDetail={backToDetail}
      />
    </>
  );
}

export { ProductCard };

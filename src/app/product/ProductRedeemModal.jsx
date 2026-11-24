import { useState, useMemo, useEffect, useRef } from "react";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle, Gem, Loader2, Mail, Minus, Phone, Plus, User, Zap } from "lucide-react";
import { HoldButton } from "./ProductCard";
import { cn } from "@/lib/utils";

const EMAIL_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9._%+-]{0,63}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const FORMULA_PREFIX_REGEX = /^[=+\-@\t\r]/;
const PHONE_DIGITS_REGEX = /^[0-9]{8,16}$/;

const createInitialRecipients = (defaultRecipient) => [
  {
    name: defaultRecipient?.name || "",
    email: defaultRecipient?.email || "",
    phone: defaultRecipient?.phone || "",
  },
  { name: "", email: "", phone: "" },
  { name: "", email: "", phone: "" },
];

export default function ProductRedeemModal({
  isOpen,
  onOpenChange,
  product,
  activeCategory,
  myRedemptions = [],
  isOutOfStockLocal = false,
  isRedeemOpen,
  onRedeem,
  redeemMutation: customRedeemMutation,
  redeemQuantity,
  onRedeemQuantity,
  isSubmitting,
  onOpenDetail,
  backToDetail,
  defaultRecipient = null,
}) {
  const [recipients, setRecipients] = useState(() =>
    createInitialRecipients(defaultRecipient),
  );
  const [touchedRecipients, setTouchedRecipients] = useState(false);
  const wasOpenRef = useRef(false);

  // Hanya inisialisasi/reset saat modal benar-benar dibuka atau ditutup (tidak menghapus input saat background refetch/alt-tab)
  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      setRecipients(createInitialRecipients(defaultRecipient));
      setTouchedRecipients(false);
    } else if (!isOpen && wasOpenRef.current) {
      setRecipients(createInitialRecipients(defaultRecipient));
      setTouchedRecipients(false);
    }
    wasOpenRef.current = isOpen;
  }, [isOpen, defaultRecipient]);

  const requireRecipientEmails = Boolean(product?.require_recipient_emails);

  const recipientValidation = useMemo(() => {
    if (!requireRecipientEmails) {
      return {
        isValid: true,
        cleaned: [],
        slotErrors: [
          { name: "", email: "", phone: "" },
          { name: "", email: "", phone: "" },
          { name: "", email: "", phone: "" },
        ],
      };
    }

    const slotErrors = [
      { name: "", email: "", phone: "" },
      { name: "", email: "", phone: "" },
      { name: "", email: "", phone: "" },
    ];
    const cleaned = [];
    const seenEmails = new Map();

    for (let i = 0; i < 3; i++) {
      const slot = recipients[i] || { name: "", email: "", phone: "" };
      const name = (slot.name || "").trim();
      const email = (slot.email || "").trim().toLowerCase();
      const phone = (slot.phone || "").trim().replace(/[\s\-()]/g, "").replace(/^\+/, "");
      const hasAny = Boolean(name || email || phone);

      if (i > 0 && !hasAny) {
        continue;
      }

      if (!name) {
        slotErrors[i].name = "Nama wajib diisi.";
      } else if (name.length < 2 || name.length > 100 || FORMULA_PREFIX_REGEX.test(name)) {
        slotErrors[i].name = "Nama tidak valid (2–100 karakter).";
      }

      if (!email) {
        slotErrors[i].email = "Email wajib diisi.";
      } else if (email.length > 254 || !EMAIL_REGEX.test(email)) {
        slotErrors[i].email = "Format email tidak valid.";
      } else if (seenEmails.has(email)) {
        slotErrors[i].email = "Email tidak boleh sama dengan penerima lain.";
      } else {
        seenEmails.set(email, i);
      }

      if (!phone) {
        slotErrors[i].phone = "No. Telp wajib diisi.";
      } else if (!PHONE_DIGITS_REGEX.test(phone)) {
        slotErrors[i].phone = "Format nomor tidak valid (8–16 digit).";
      }

      if (!slotErrors[i].name && !slotErrors[i].email && !slotErrors[i].phone) {
        cleaned.push({ name, email, phone });
      }
    }

    const hasError = slotErrors.some((e) => e.name || e.email || e.phone);
    const isValid = !hasError && cleaned.length >= 1 && cleaned.length <= 3;

    return { isValid, cleaned, slotErrors };
  }, [requireRecipientEmails, recipients]);

  if (!product) return null;

  const isZeroStock = isOutOfStockLocal;
  const currentStock = isZeroStock ? 0 : Number(product.stock);

  const userDiamonds = Number(activeCategory?.diamond ?? 0);
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
      maxAffordable === Infinity ? maxStock : maxAffordable,
    ),
  );

  const currentQty = Math.min(maxRedeemable, Math.max(1, redeemQuantity));
  const totalDiamondCost = Number(product.price_diamond ?? 0) * currentQty;
  const totalXpCost = hasXpPrice ? Number(product.price_xp) * currentQty : 0;
  const earnedXp = hasXpReward ? Number(product.reward_xp) * currentQty : 0;
  const remainingDiamonds = userDiamonds - totalDiamondCost;
  const remainingXp = userXp - totalXpCost;

  const isPending = isSubmitting || (customRedeemMutation.isPending && isRedeemOpen);
  const notClaimable = !canRedeem || !activeCategory || isPending;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) {
          onRedeemQuantity(1);
        }
      }}
    >
      <DialogContent
        showCloseButton={false}
        onOpenAutoFocus={(e) => e.preventDefault()}
        className={cn(
          "rounded-2xl border border-white/10 bg-[#0A0D14] text-[#FFF9F5] p-6 shadow-2xl max-h-[90vh] overflow-y-auto selection:bg-primary selection:text-white",
          requireRecipientEmails ? "sm:max-w-lg" : "sm:max-w-md",
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-[#FFF9F5]">
            {hasXpReward
              ? "Konfirmasi Penukaran Diamond ke XP"
              : "Konfirmasi Penukaran Hadiah"}
          </DialogTitle>
          <p className="text-sm text-[#AAB1BD] mt-2 leading-relaxed">
            Apakah Anda yakin ingin menukar{" "}
            <span className="font-bold text-[#FFF9F5]">{product.name}</span>?
          </p>
        </DialogHeader>

        {/* Info khusus batas penukaran per tim */}
        {hasTeamLimit && (
          <div className="my-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
            <span>
              Produk ini dibatasi maksimal <strong>{maxPerTeam} item</strong>{" "}
              per tim.
            </span>
          </div>
        )}

        {/* Quantity counter */}
        <div className="my-3 p-3.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#FFF9F5]">
              Jumlah Penukaran
            </p>
            <p className="text-[11px] text-[#AAB1BD]">
              {isUnlimited
                ? "Stok tidak terbatas"
                : `Tersedia: ${currentStock} item`}
            </p>
            <p className="text-[10px] text-amber-400/90 mt-0.5">
              {hasTeamLimit
                ? `Sisa kuota tim: ${remainingTeamQuota} / ${maxPerTeam} item`
                : `Maks penukaran: ${
                    maxRedeemable < maxAffordable
                      ? `${maxRedeemable} item (sesuai stok)`
                      : `${maxAffordable} item (sesuai saldo)`
                  }`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <HoldButton
              disabled={currentQty <= 1}
              onAction={() => onRedeemQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 disabled:opacity-30 disabled:cursor-default flex items-center justify-center text-[#FFF9F5] transition-colors cursor-pointer select-none touch-manipulation"
              title="Kurangi jumlah (klik atau tahan untuk mengurangi)"
            >
              <Minus className="h-3.5 w-3.5" />
            </HoldButton>
            <input
              type="number"
              min={maxAffordable !== 0 ? "1" : maxAffordable}
              max={maxAffordable !== 0 ? maxRedeemable : maxAffordable}
              value={maxAffordable !== 0 ? currentQty : maxAffordable}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (isNaN(val) || val < 1) {
                  onRedeemQuantity(1);
                } else {
                  onRedeemQuantity(Math.min(maxRedeemable, Math.max(1, val)));
                }
              }}
              className="w-14 h-8 rounded-lg bg-black/50 border border-white/20 text-center text-xs font-bold text-[#FFF9F5] focus:outline-none focus:border-[#E01C20]"
            />
            <HoldButton
              disabled={currentQty >= maxRedeemable}
              onAction={() => {
                onRedeemQuantity((q) => Math.min(maxRedeemable, q + 1));
              }}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 disabled:opacity-30 disabled:cursor-default flex items-center justify-center text-[#FFF9F5] transition-colors cursor-pointer select-none touch-manipulation"
              title="Tambah jumlah (klik atau tahan untuk menambah)"
            >
              <Plus className="h-3.5 w-3.5" />
            </HoldButton>
          </div>
        </div>

        {/* Highlight Perolehan XP jika produk memiliki reward_xp */}
        {hasXpReward && (
          <div className="my-3 p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/40 to-emerald-900/20 border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] text-[#AAB1BD]">
                  Reward XP Diperoleh
                </p>
                <p className="text-sm font-bold text-emerald-400">
                  +{earnedXp.toLocaleString()} XP
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded font-medium border border-emerald-500/20">
                1 item = +{product.reward_xp} XP
              </span>
            </div>
          </div>
        )}

        {/* Input Data Penerima (1 wajib auto-fill Ketua, 2 & 3 opsional) */}
        {requireRecipientEmails && (
          <div className="my-3 p-4 rounded-xl bg-white/[0.04] border border-cyan-500/25 space-y-3.5">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                <Mail className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#FFF9F5]">
                  Data Penerima (Min. 1, Maks. 3 Orang)
                </p>
                <p className="text-[11px] text-[#AAB1BD] leading-relaxed">
                  Penerima 1 (Ketua) otomatis terisi dari akun Anda dan tetap bisa diubah. Penerima 2 &amp; 3 opsional (jika diisi, lengkapi Nama, Email, dan No. Telp).
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {[0, 1, 2].map((idx) => {
                const isFirst = idx === 0;
                const slot = recipients[idx] || { name: "", email: "", phone: "" };
                const errs = touchedRecipients
                  ? recipientValidation.slotErrors[idx]
                  : { name: "", email: "", phone: "" };

                const updateField = (field, value) => {
                  setTouchedRecipients(true);
                  setRecipients((prev) => {
                    const next = [...prev];
                    next[idx] = { ...next[idx], [field]: value };
                    return next;
                  });
                };

                return (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-black/30 border border-white/10 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-[#FFF9F5]">
                        {isFirst ? "Penerima 1 (Ketua)" : `Penerima ${idx + 1}`}
                      </span>
                      {isFirst ? (
                        <span className="text-[10px] font-semibold text-[#E01C20] bg-[#E01C20]/10 border border-[#E01C20]/30 px-2 py-0.5 rounded-full">
                          Wajib
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#99A1AF] bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                          Opsional
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {/* Nama */}
                      <div className="space-y-1 sm:col-span-2">
                        <label
                          htmlFor={`recipient-name-${idx}`}
                          className="text-[10px] font-medium text-[#AAB1BD] flex items-center gap-1"
                        >
                          <User className="h-3 w-3 text-[#99A1AF]" />
                          <span>Nama Lengkap</span>
                        </label>
                        <input
                          id={`recipient-name-${idx}`}
                          type="text"
                          value={slot.name}
                          onChange={(e) => updateField("name", e.target.value)}
                          placeholder={isFirst ? "Nama lengkap ketua" : `Nama lengkap anggota ${idx + 1}`}
                          className={cn(
                            "w-full h-8.5 px-3 rounded-lg bg-black/50 border text-xs text-[#FFF9F5] placeholder:text-[#99A1AF]/60 focus:outline-none transition-colors",
                            errs.name
                              ? "border-red-500/70 focus:border-red-500"
                              : "border-white/15 focus:border-cyan-400",
                          )}
                        />
                        {errs.name && <p className="text-[10px] text-red-400">{errs.name}</p>}
                      </div>

                      {/* Email */}
                      <div className="space-y-1">
                        <label
                          htmlFor={`recipient-email-${idx}`}
                          className="text-[10px] font-medium text-[#AAB1BD] flex items-center gap-1"
                        >
                          <Mail className="h-3 w-3 text-[#99A1AF]" />
                          <span>Email</span>
                        </label>
                        <input
                          id={`recipient-email-${idx}`}
                          type="email"
                          value={slot.email}
                          onChange={(e) => updateField("email", e.target.value)}
                          placeholder={`anggota${idx + 1}@gmail.com`}
                          className={cn(
                            "w-full h-8.5 px-3 rounded-lg bg-black/50 border text-xs text-[#FFF9F5] placeholder:text-[#99A1AF]/60 focus:outline-none transition-colors",
                            errs.email
                              ? "border-red-500/70 focus:border-red-500"
                              : "border-white/15 focus:border-cyan-400",
                          )}
                        />
                        {errs.email && <p className="text-[10px] text-red-400">{errs.email}</p>}
                      </div>

                      {/* No. Telp / WA */}
                      <div className="space-y-1">
                        <label
                          htmlFor={`recipient-phone-${idx}`}
                          className="text-[10px] font-medium text-[#AAB1BD] flex items-center gap-1"
                        >
                          <Phone className="h-3 w-3 text-[#99A1AF]" />
                          <span>No. Telp / WA</span>
                        </label>
                        <input
                          id={`recipient-phone-${idx}`}
                          type="tel"
                          value={slot.phone}
                          onChange={(e) => updateField("phone", e.target.value)}
                          placeholder="081234567890"
                          className={cn(
                            "w-full h-8.5 px-3 rounded-lg bg-black/50 border text-xs text-[#FFF9F5] placeholder:text-[#99A1AF]/60 focus:outline-none transition-colors",
                            errs.phone
                              ? "border-red-500/70 focus:border-red-500"
                              : "border-white/15 focus:border-cyan-400",
                          )}
                        />
                        {errs.phone && <p className="text-[10px] text-red-400">{errs.phone}</p>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Informasi Saldo & Biaya */}
        <div className="my-3 p-4 rounded-xl bg-white/[0.04] border border-white/10 space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[#AAB1BD]">Diamond Anda:</span>
            <span className="font-bold text-cyan-400 flex items-center gap-1 text-sm">
              <Gem className="h-3.5 w-3.5" />
              <span>{userDiamonds.toLocaleString()}</span>
            </span>
          </div>
          {hasXpPrice && (
            <div className="flex items-center justify-between">
              <span className="text-[#AAB1BD]">XP Anda:</span>
              <span className="font-bold text-amber-400 flex items-center gap-1 text-sm">
                <Zap className="h-3.5 w-3.5" />
                <span>{userXp.toLocaleString()} XP</span>
              </span>
            </div>
          )}
          {totalDiamondCost > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-[#AAB1BD]">
                Total Biaya Diamond{" "}
                {currentQty > 1 ? `(${currentQty} item)` : ""}:
              </span>
              <span className="font-bold text-[#E01C20] flex items-center gap-1 text-sm">
                - <Gem className="h-3.5 w-3.5" />{" "}
                {totalDiamondCost.toLocaleString()}
              </span>
            </div>
          )}
          {totalXpCost > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-[#AAB1BD]">
                Total Biaya XP {currentQty > 1 ? `(${currentQty} item)` : ""}:
              </span>
              <span className="font-bold text-[#E01C20] flex items-center gap-1 text-sm">
                - <Zap className="h-3.5 w-3.5" /> {totalXpCost.toLocaleString()}{" "}
                XP
              </span>
            </div>
          )}
          {hasXpReward && (
            <div className="flex items-center justify-between text-emerald-400">
              <span className="text-[#AAB1BD]">Total XP Didapatkan:</span>
              <span className="font-bold flex items-center gap-1 text-sm">
                <Zap className="h-3.5 w-3.5" /> +{earnedXp.toLocaleString()} XP
              </span>
            </div>
          )}
          <div className="pt-2.5 border-t border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-[#FFF9F5]">Sisa Diamond:</span>
              <span
                className={cn(
                  "font-bold flex items-center gap-1 text-sm",
                  remainingDiamonds >= 0 ? "text-[#00B445]" : "text-[#E01C20]",
                )}
              >
                <Gem className="h-3.5 w-3.5" />
                {remainingDiamonds.toLocaleString()}
              </span>
            </div>
            {hasXpPrice && (
              <div className="flex items-center justify-between">
                <span className="font-medium text-[#FFF9F5]">Sisa XP:</span>
                <span
                  className={`font-bold flex items-center gap-1 text-sm ${
                    remainingXp >= 0 ? "text-[#00B445]" : "text-[#E01C20]"
                  }`}
                >
                  <Zap className="h-3.5 w-3.5" /> {remainingXp.toLocaleString()}{" "}
                  XP
                </span>
              </div>
            )}
          </div>
        </div>

        {userDiamonds < totalDiamondCost &&
        hasXpPrice &&
        userXp < totalXpCost ? (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span>
              Diamond dan XP Anda tidak cukup untuk menukar produk ini.
            </span>
          </div>
        ) : userDiamonds < totalDiamondCost ? (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span>
              Diamond Anda tidak cukup untuk menukar{" "}
              {currentQty > 1 ? `${currentQty} item ` : ""}
              produk ini.
            </span>
          </div>
        ) : hasXpPrice && userXp < totalXpCost ? (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span>
              XP Anda tidak cukup untuk menukar{" "}
              {currentQty > 1 ? `${currentQty} item ` : ""}
              produk ini. Diperlukan {totalXpCost.toLocaleString()} XP.
            </span>
          </div>
        ) : null}

        {requireRecipientEmails && !recipientValidation.isValid && (
          <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
            <span>
              Lengkapi Nama, Email, dan No. Telp yang valid untuk Penerima 1 (serta penerima tambahan jika diisi).
            </span>
          </div>
        )}

        <DialogFooter className="gap-2 sm:space-x-2">
          <DialogClose
            className="rounded-full border border-white/15 bg-transparent hover:bg-white/5 text-[#FFF9F5] text-xs font-semibold h-10 cursor-pointer px-4 py-2"
            onClick={(e) => {
              if (backToDetail) {
                e.preventDefault();
                onOpenDetail(true);
                onOpenChange(false);
              }
            }}
          >
            {!backToDetail ? "Batal" : "Kembali"}
          </DialogClose>
          <button
            className="mia-btn-primary inline-flex items-center text-xs font-semibold h-10 px-5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={
              isPending ||
              userDiamonds < totalDiamondCost ||
              (hasXpPrice && userXp < totalXpCost) ||
              !activeCategory ||
              (requireRecipientEmails && !recipientValidation.isValid)
            }
            onClick={() => {
              if (requireRecipientEmails && !recipientValidation.isValid) {
                setTouchedRecipients(true);
                return;
              }
              onRedeem(requireRecipientEmails ? recipientValidation.cleaned : []);
            }}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin text-white mr-1.5" />
            ) : null}
            <span>
              {hasXpReward ? "Ya, Konversi ke XP" : "Ya, Tukar Hadiah"}
            </span>
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

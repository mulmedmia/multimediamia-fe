import { useState, useMemo, useEffect, useRef } from "react";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle, Gem, Loader2, Mail, Phone, User, Zap } from "lucide-react";
import { getProductRedeemState } from "./redeem-utils";
import { cn } from "@/lib/utils";

const EMAIL_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9._%+-]{0,63}@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
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

  const {
    currentStock,
    userDiamonds,
    userXp,
    maxPerTeam,
    hasTeamLimit,
    isSingleAttempt,
    requireRecipientEmails,
    remainingTeamQuota,
    isUnlimited,
    hasXpPrice,
    hasXpReward,
    maxAffordable,
    maxRedeemable,
    currentQty,
    totalDiamondCost,
    totalXpCost,
    earnedXp,
    remainingDiamonds,
    remainingXp,
  } = getProductRedeemState({
    product,
    activeCategory,
    myRedemptions,
    isOutOfStockLocal,
    redeemQuantity,
  });

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
    const targetCount = Math.min(3, Math.max(1, currentQty));

    for (let i = 0; i < targetCount; i++) {
      const slot = recipients[i] || { name: "", email: "", phone: "" };
      const name = (slot.name || "").trim();
      const email = (slot.email || "").trim().toLowerCase();
      const phone = (slot.phone || "").trim().replace(/[\s\-()]/g, "").replace(/^\+/, "");

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
    const isValid = !hasError && cleaned.length === targetCount;

    return { isValid, cleaned, slotErrors };
  }, [requireRecipientEmails, recipients, currentQty]);

  if (!product) return null;

  const isPending = isSubmitting || (customRedeemMutation.isPending && isRedeemOpen);

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

        {/* Info khusus batas penukaran per tim & aturan 1x transaksi */}
        {(hasTeamLimit || isSingleAttempt) && (
          <div className="my-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
            <div className="space-y-1">
              {hasTeamLimit && (
                <p>
                  Produk ini dibatasi maksimal <strong>{maxPerTeam} item</strong>{" "}
                  per tim.
                </p>
              )}
              {isSingleAttempt && (
                <p>
                  Penukaran hanya dapat dilakukan{" "}
                  <strong>1 kali transaksi per tim</strong> — pastikan memilih
                  jumlah tiket yang sesuai sekarang.
                </p>
              )}
            </div>
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
          <div className="flex items-center">
            <input
              type="number"
              min="1"
              max={maxRedeemable}
              value={currentQty}
              disabled={maxAffordable === 0}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (isNaN(val) || val < 1) {
                  onRedeemQuantity(1);
                } else {
                  onRedeemQuantity(Math.min(maxRedeemable, Math.max(1, val)));
                }
              }}
              className="w-20 h-9 px-2 rounded-lg bg-black/50 border border-white/20 text-center text-xs font-bold text-[#FFF9F5] focus:outline-none focus:border-[#E01C20] disabled:opacity-50 disabled:cursor-not-allowed"
            />
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

        {/* Input Data Penerima (jumlah form otomatis mengikuti jumlah tiket yang ditukar: 1-3 orang) */}
        {requireRecipientEmails && (
          <div className="my-3 p-4 rounded-xl bg-white/[0.04] border border-cyan-500/25 space-y-3.5">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                <Mail className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#FFF9F5]">
                  Data Penerima ({currentQty} Orang)
                </p>
                <p className="text-[11px] text-[#AAB1BD] leading-relaxed">
                  Penerima 1 (Ketua) otomatis terisi dan tetap bisa diubah. Lengkapi Nama, Email, dan No. Telp untuk{" "}
                  {currentQty === 1 ? "penerima tiket" : `semua ${currentQty} penerima tiket`}.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {Array.from({ length: Math.min(3, Math.max(1, currentQty)) }, (_, idx) => {
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
                      <span className="text-[10px] font-semibold text-[#E01C20] bg-[#E01C20]/10 border border-[#E01C20]/30 px-2 py-0.5 rounded-full">
                        Wajib
                      </span>
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
              Lengkapi Nama, Email, dan No. Telp yang valid untuk seluruh {currentQty} penerima sesuai jumlah tiket yang ditukar.
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

export const MAX_RECIPIENTS_PER_REDEEM = 3;

/**
 * Compute consistent product redemption limits, team quota, attempt state, and stock/balance caps.
 */
export function getProductRedeemState({
  product,
  activeCategory,
  myRedemptions = [],
  isOutOfStockLocal = false,
  redeemQuantity = 1,
}) {
  const isZeroStock = Boolean(isOutOfStockLocal);
  const currentStock = isZeroStock ? 0 : Number(product?.stock ?? 0);

  const userDiamonds = Number(activeCategory?.diamond ?? 0);
  const userXp = Number(activeCategory?.xp ?? 0);

  const maxPerTeam =
    Number(product?.max_redeem_per_team) > 0
      ? Number(product.max_redeem_per_team)
      : product?.is_single_redeem
      ? 1
      : 0;
  const hasTeamLimit = maxPerTeam > 0;
  const isSingleAttempt = Boolean(product?.is_single_attempt);
  const requireRecipientEmails = Boolean(product?.require_recipient_emails);

  const teamProductRedemptions = myRedemptions.filter(
    (r) => r.product_id === product?.product_id
  );
  const teamAttemptCount = teamProductRedemptions.length;
  const teamRedeemedQty = teamProductRedemptions.reduce(
    (sum, r) => sum + (Number(r.quantity) || 1),
    0
  );

  const remainingTeamQuota = hasTeamLimit
    ? Math.max(0, maxPerTeam - teamRedeemedQty)
    : Infinity;
  const attemptLimitReached = isSingleAttempt && teamAttemptCount >= 1;
  const alreadyClaimed =
    attemptLimitReached || (hasTeamLimit && remainingTeamQuota <= 0);

  const isUnlimited = Boolean(product?.is_unlimited_stock);
  const hasXpPrice = Number(product?.price_xp) > 0;
  const hasXpReward = !hasXpPrice && Number(product?.reward_xp) > 0;
  const isOutOfStock = !isUnlimited && (currentStock < 1 || isZeroStock);
  const canRedeem = Boolean(product?.is_active) && !isOutOfStock && !alreadyClaimed;

  const maxAffordableDiamonds =
    Number(product?.price_diamond) > 0
      ? Math.floor(userDiamonds / Number(product.price_diamond))
      : Infinity;

  const maxAffordableXp = hasXpPrice
    ? Math.floor(userXp / Number(product.price_xp))
    : Infinity;

  const maxAffordable = Math.min(maxAffordableDiamonds, maxAffordableXp);
  const maxStock = isUnlimited ? 999 : Math.max(0, currentStock);
  const maxAllowedByQuota = hasTeamLimit ? remainingTeamQuota : Infinity;
  const maxAllowedByRecipients = requireRecipientEmails
    ? MAX_RECIPIENTS_PER_REDEEM
    : Infinity;

  const maxRedeemable = Math.max(
    1,
    Math.min(
      maxStock,
      maxAllowedByQuota,
      maxAllowedByRecipients,
      maxAffordable === Infinity ? maxStock : maxAffordable
    )
  );

  const currentQty = Math.min(maxRedeemable, Math.max(1, redeemQuantity));
  const totalDiamondCost = Number(product?.price_diamond ?? 0) * currentQty;
  const totalXpCost = hasXpPrice ? Number(product.price_xp) * currentQty : 0;
  const earnedXp = hasXpReward ? Number(product.reward_xp) * currentQty : 0;
  const remainingDiamonds = userDiamonds - totalDiamondCost;
  const remainingXp = userXp - totalXpCost;

  const actionButtonText = !activeCategory
    ? "Daftar Lomba Dulu"
    : attemptLimitReached
    ? "Sudah Ditukar (Maks 1x)"
    : alreadyClaimed
    ? `Batas Tercapai (Maks ${maxPerTeam}x)`
    : isOutOfStock
    ? "Hadiah Telah Habis"
    : hasXpReward
    ? "Tukar ke XP"
    : "Tukar Produk";

  return {
    currentStock,
    userDiamonds,
    userXp,
    maxPerTeam,
    hasTeamLimit,
    isSingleAttempt,
    requireRecipientEmails,
    teamAttemptCount,
    teamRedeemedQty,
    remainingTeamQuota,
    attemptLimitReached,
    alreadyClaimed,
    isUnlimited,
    hasXpPrice,
    hasXpReward,
    isOutOfStock,
    canRedeem,
    maxAffordable,
    maxRedeemable,
    currentQty,
    totalDiamondCost,
    totalXpCost,
    earnedXp,
    remainingDiamonds,
    remainingXp,
    actionButtonText,
  };
}

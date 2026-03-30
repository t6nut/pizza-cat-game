export const CAT_SIZE_MIN = 1;
export const CAT_SIZE_MAX = Number.POSITIVE_INFINITY;

export function clampCatSize(size) {
  const numeric = Number.isFinite(size) ? size : CAT_SIZE_MIN;
  return Math.max(CAT_SIZE_MIN, numeric);
}

export function applyGrowthDelta(currentSize, delta) {
  return clampCatSize((currentSize || CAT_SIZE_MIN) + delta);
}

export function computeGrowthDelta(food, growthValue) {
  const sourceType = food?.sourceType || (growthValue > 1 ? 'whole' : 'slice');
  const baseValue = food?.baseFoodValue || (sourceType === 'whole' ? 5 : 1);
  const baseDelta = sourceType === 'whole' ? 1 : 0.1;
  const decayRatio = Math.min(1, Math.max(0.5, growthValue / baseValue));
  return baseDelta * decayRatio;
}
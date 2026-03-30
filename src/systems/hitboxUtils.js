export function computeBodyFromDisplay(displayWidth, displayHeight, options = {}) {
  const {
    widthRatio = 0.5,
    heightRatio = 0.5,
    minWidth = 14,
    minHeight = 10,
    bottomPadRatio = 0,
  } = options;

  const w = Math.max(1, displayWidth || 1);
  const h = Math.max(1, displayHeight || 1);
  const bodyW = Math.max(minWidth, Math.round(w * widthRatio));
  const bodyH = Math.max(minHeight, Math.round(h * heightRatio));
  const offsetX = Math.max(0, (w - bodyW) * 0.5);
  const offsetY = Math.max(0, h - bodyH - h * bottomPadRatio);

  return { bodyW, bodyH, offsetX, offsetY };
}
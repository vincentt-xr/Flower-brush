import { BRUSH_CONFIG } from "./brushConfig";

export type BrushPoint = { x: number; y: number };
type NormalizedPoint = { x: number; y: number };

export const distance = (a: BrushPoint, b: BrushPoint) =>
  Math.hypot(a.x - b.x, a.y - b.y);

export const normalizedToCanvas = (point: NormalizedPoint): BrushPoint => ({
  x: ((point.x + 1) / 2) * BRUSH_CONFIG.canvas.width,
  y: ((1 - point.y) / 2) * BRUSH_CONFIG.canvas.height,
});

export const isPeaceSign = (points: NormalizedPoint[] | undefined) => {
  if (!points || points.length < 21) return false;
  const wrist = points[0];
  const indexExtended = distance(points[8], wrist) > distance(points[6], wrist) * BRUSH_CONFIG.peaceSign.indexExtensionRatio;
  const middleExtended = distance(points[12], wrist) > distance(points[10], wrist) * BRUSH_CONFIG.peaceSign.middleExtensionRatio;
  const ringFolded = distance(points[16], wrist) < distance(points[14], wrist) * BRUSH_CONFIG.peaceSign.foldedFingerRatio;
  const pinkyFolded = distance(points[20], wrist) < distance(points[18], wrist) * BRUSH_CONFIG.peaceSign.foldedFingerRatio;
  return indexExtended && middleExtended && ringFolded && pinkyFolded;
};

export const stampFlower = (
  context: CanvasRenderingContext2D,
  image: CanvasImageSource,
  point: BrushPoint,
) => {
  const scale = 1 - BRUSH_CONFIG.scaleVariation / 2 + Math.random() * BRUSH_CONFIG.scaleVariation;
  const size = BRUSH_CONFIG.size * scale;
  const angle = (Math.random() - 0.5) * BRUSH_CONFIG.rotationVariation;
  context.save();
  context.translate(point.x, point.y);
  context.rotate(angle);
  context.drawImage(image, -size / 2, -size / 2, size, size);
  context.restore();
};

export const stampBetween = (
  context: CanvasRenderingContext2D,
  image: CanvasImageSource,
  from: BrushPoint,
  to: BrushPoint,
) => {
  const steps = Math.max(1, Math.ceil(distance(from, to) / BRUSH_CONFIG.minStampDistance));
  for (let step = 1; step <= steps; step += 1) {
    const amount = step / steps;
    stampFlower(context, image, {
      x: from.x + (to.x - from.x) * amount,
      y: from.y + (to.y - from.y) * amount,
    });
  }
};

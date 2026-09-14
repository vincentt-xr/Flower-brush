/** Main remix controls. Change these values to change the brush experience. */
export const BRUSH_CONFIG = {
  canvas: { width: 720, height: 1280 },
  image: "/images/flower-03.png",
  size: 58,
  minStampDistance: 30,
  scaleVariation: 0.12,
  rotationVariation: 0.35,
  mouseDebug: true,
  peaceSign: {
    indexExtensionRatio: 1.12,
    middleExtensionRatio: 1.12,
    foldedFingerRatio: 1.08,
  },
} as const;

export const SCENE_CONFIG = {
  frameImage: "images/frame.png",
  frameRenderOrder: 2000,
  paintRenderOrder: 100,
} as const;

export const CURSOR_CONFIG = {
  color: "red",
  radius: 0.06,
  smoothing: 10,
  targetFps: 60,
} as const;

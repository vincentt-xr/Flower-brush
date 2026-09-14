// Scene.tsx — the agent's surface.
// Add SDK components and R3F primitives here.
// See GROUNDING.md for the API reference and pattern catalog.
//
// react/no-unknown-property is disabled for this file in .eslintrc.json, not by
// a directive here: R3F props (position, rotation, args) are unknown to the rule
// and every one of them errors, but this file is EMPTY of primitives until an
// agent adds some — so an in-file directive sits unused, and the lint script
// runs --report-unused-disable-directives, which makes the unused directive
// itself the error. Disabling at the config keeps the suppression true in both
// states.
import { useState } from "react";
import {
  ScreenImage,
  ScreenSpaceUI,
  type ScreenTransform2DSettings,
} from "@vincentt-xr/sdk";
import { HandCursors } from "./HandCursors";
import { PaintStrokes } from "./PaintStrokes";
import { BRUSH_CONFIG, SCENE_CONFIG } from "./brushConfig";

export const Scene = () => {
  const [portraitFrameTransform] = useState<ScreenTransform2DSettings>({
    enabled: true,
    position: { x: 0, y: 0 },
    size: BRUSH_CONFIG.canvas,
    pivot: [0.5, 0.5],
    rotation: 0,
    scale2D: { x: 1, y: 1 },
    referencePixelsPerUnit: 32,
    renderOrder: SCENE_CONFIG.frameRenderOrder,
    overlay: true,
    visible: true,
    showTransformGuides: false,
  });

  return (
    <>
      <HandCursors />
      <PaintStrokes />
      <ScreenSpaceUI>
        <ScreenImage
          name="Footer Frame"
          src={SCENE_CONFIG.frameImage}
          fit="contain"
          transparent
          alphaTest={0.01}
          transform={portraitFrameTransform}
          transformGuideLayer="overlay"
        />
      </ScreenSpaceUI>
    </>
  );
};

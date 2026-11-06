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
//
// The frame is a ScreenImage with a literal `src` and literal `anchors`, so the
// console's visual editor can swap, move and resize it. The paint layer stays
// placed from code: it must line up with the fingers.
import { ScreenImage, ScreenSpaceUI } from "@vincentt-xr/sdk";
import { HandCursors } from "./HandCursors";
import { PaintStrokes } from "./PaintStrokes";

export const Scene = () => (
  <>
    <HandCursors />
    <PaintStrokes />
    <ScreenSpaceUI>
      <ScreenImage
        name="Footer Frame"
        src="images/frame.png"
        fit="contain"
        transparent
        alphaTest={0.01}
        overlay
        renderOrder={2000}
        anchors={{ left: -1, right: 1, top: 1, bottom: -1 }}
      />
    </ScreenSpaceUI>
  </>
);

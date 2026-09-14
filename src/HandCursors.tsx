import { TrackingAnchor, HandTracker } from "@vincentt-xr/sdk/tracking";
import { CURSOR_CONFIG } from "./brushConfig";

const FingerCursor = ({ hand }: { hand: "left" | "right" }) => (
  <HandTracker hand={hand} targetFps={CURSOR_CONFIG.targetFps}>
    <TrackingAnchor target="hand.indexTip" smoothing={CURSOR_CONFIG.smoothing}>
      <mesh name={`${hand}-index-cursor`}>
        <circleGeometry args={[CURSOR_CONFIG.radius, 32]} />
        <meshBasicMaterial color={CURSOR_CONFIG.color} />
      </mesh>
    </TrackingAnchor>
  </HandTracker>
);

export const HandCursors = () => (
  <>
    <FingerCursor hand="left" />
    <FingerCursor hand="right" />
  </>
);

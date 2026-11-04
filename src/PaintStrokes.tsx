import { useFrame, useThree } from "@react-three/fiber";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from "react";
import * as THREE from "three";
import { ScreenImage, ScreenSpaceUI, XRModel } from "@vincentt-xr/sdk";
import { useXRModelNode, type XRModelNodeHandTracking } from "@vincentt-xr/sdk/low-level";
import { BRUSH_CONFIG, SCENE_CONFIG } from "./brushConfig";
import { distance, isPeaceSign, normalizedToCanvas, stampBetween, stampFlower, type BrushPoint } from "./brushUtils";

export type PaintStrokesHandle = { clear: () => void };
type HandName = "left" | "right";

/** Mouse debug input and two-hand peace-sign painting share this canvas. */
export const PaintStrokes = forwardRef<PaintStrokesHandle>((_, ref) => {
  const { gl } = useThree();
  const handNode = useXRModelNode<XRModelNodeHandTracking>(XRModel.HAND_TRACKER);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const brushImageRef = useRef<HTMLImageElement | null>(null);
  const mousePreviousRef = useRef<BrushPoint | null>(null);
  const mouseDrawingRef = useRef(false);
  const handPreviousRef = useRef<Record<HandName, BrushPoint | null>>({ left: null, right: null });
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = BRUSH_CONFIG.canvas.width;
    canvas.height = BRUSH_CONFIG.canvas.height;
    canvasRef.current = canvas;
    const nextTexture = new THREE.CanvasTexture(canvas);
    nextTexture.colorSpace = THREE.SRGBColorSpace;
    return nextTexture;
  }, []);

  const clear = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    mousePreviousRef.current = null;
    handPreviousRef.current = { left: null, right: null };
    texture.needsUpdate = true;
  };

  // `clear` intentionally stays stable for the imperative handle's lifetime.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useImperativeHandle(ref, () => ({ clear }), [texture]);
  useEffect(() => () => texture.dispose(), [texture]);

  useEffect(() => {
    const image = new Image();
    image.onload = () => { brushImageRef.current = image; };
    image.src = BRUSH_CONFIG.image;
  }, []);

  // Debug input: hold the mouse button and drag across the canvas.
  useEffect(() => {
    if (!BRUSH_CONFIG.mouseDebug) return undefined;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return undefined;
    const getPoint = (event: PointerEvent): BrushPoint => {
      const bounds = gl.domElement.getBoundingClientRect();
      return {
        x: ((event.clientX - bounds.left) / bounds.width) * BRUSH_CONFIG.canvas.width,
        y: ((event.clientY - bounds.top) / bounds.height) * BRUSH_CONFIG.canvas.height,
      };
    };
    const stamp = (point: BrushPoint) => {
      if (brushImageRef.current) stampFlower(context, brushImageRef.current, point);
      texture.needsUpdate = true;
    };
    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      mouseDrawingRef.current = true;
      mousePreviousRef.current = getPoint(event);
      stamp(mousePreviousRef.current);
      gl.domElement.setPointerCapture?.(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!mouseDrawingRef.current || !mousePreviousRef.current || !brushImageRef.current) return;
      const current = getPoint(event);
      if (distance(mousePreviousRef.current, current) < BRUSH_CONFIG.minStampDistance) return;
      stampBetween(context, brushImageRef.current, mousePreviousRef.current, current);
      mousePreviousRef.current = current;
      texture.needsUpdate = true;
    };
    const stop = () => { mouseDrawingRef.current = false; mousePreviousRef.current = null; };
    gl.domElement.addEventListener("pointerdown", onPointerDown);
    gl.domElement.addEventListener("pointermove", onPointerMove);
    gl.domElement.addEventListener("pointerup", stop);
    gl.domElement.addEventListener("pointercancel", stop);
    return () => {
      gl.domElement.removeEventListener("pointerdown", onPointerDown);
      gl.domElement.removeEventListener("pointermove", onPointerMove);
      gl.domElement.removeEventListener("pointerup", stop);
      gl.domElement.removeEventListener("pointercancel", stop);
    };
  }, [gl, texture]);

  // Hand input: each hand paints only while its peace sign is held.
  useFrame(() => {
    const context = canvasRef.current?.getContext("2d");
    const image = brushImageRef.current;
    const hands = handNode?.hands;
    if (!context || !image || !hands) return;
    (Object.keys(handPreviousRef.current) as HandName[]).forEach((handName) => {
      const hand = hands.find((candidate) => candidate.handedness === handName);
      const points = hand?.coordinates;
      const tip = points?.[8];
      if (!tip || !isPeaceSign(points)) {
        handPreviousRef.current[handName] = null;
        return;
      }
      const current = normalizedToCanvas(tip);
      const previous = handPreviousRef.current[handName];
      if (!previous) stampFlower(context, image, current);
      else if (distance(previous, current) >= BRUSH_CONFIG.minStampDistance) {
        stampBetween(context, image, previous, current);
      } else return;
      handPreviousRef.current[handName] = current;
      texture.needsUpdate = true;
    });
  });

  return (
    <ScreenSpaceUI>
      <ScreenImage
        name="Paint Strokes"
        source={{ kind: "texture", texture }}
        transform={{
          enabled: true,
          position: { x: 0, y: 0 },
          size: BRUSH_CONFIG.canvas,
          pivot: [0.5, 0.5],
          rotation: 0,
          scale2D: { x: 1, y: 1 },
          referencePixelsPerUnit: 32,
          renderOrder: SCENE_CONFIG.paintRenderOrder,
          overlay: true,
          visible: true,
          showTransformGuides: false,
        }}
        transparent
        renderOrder={SCENE_CONFIG.paintRenderOrder}
      />
    </ScreenSpaceUI>
  );
});

PaintStrokes.displayName = "PaintStrokes";

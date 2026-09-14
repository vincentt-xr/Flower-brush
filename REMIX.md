# Flower Brush Remix Guide

This project is a working hand-painting scene. Start remixing in `src/Scene.tsx`.

## Main edit points

- `src/brushConfig.ts` — primary creative controls.
- `src/PaintStrokes.tsx` — canvas brush behavior and input flow.
- `src/HandCursors.tsx` — fingertip cursor appearance.
- `src/Scene.tsx` — scene composition and frame placement.
- `public/images/flower-01.png` — current brush image.

## Common changes

Change `BRUSH_CONFIG.image` to use another transparent PNG. Adjust `size` and
`minStampDistance` to control flower scale and density. Increase or decrease
`scaleVariation` and `rotationVariation` for a more uniform or organic result.

Peace-sign painting is custom two-hand landmark detection. Tune the three
`peaceSign` ratios in `brushConfig.ts` if recognition is too sensitive or too
strict. The index fingertip controls the brush position; index plus middle
extended and ring plus pinky folded activates painting.

Mouse press-and-drag is a debug path. Set `mouseDebug: false` for a hand-only
experience. The canvas component exposes a `clear()` handle through
`PaintStrokesHandle` for a future button or gesture.

Do not edit `src/App.tsx` or `src/main.tsx` for normal scene remixing; they own
the Vincentt runtime shell and camera/session lifecycle.

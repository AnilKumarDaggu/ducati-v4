import { CanvasTexture, EquirectangularReflectionMapping, type Texture } from 'three';

/**
 * Procedural studio HDR environment (V1, code-only — no .hdr asset needed).
 *
 * Paints an equirectangular "softbox studio" into a canvas: a graded sky, a
 * dark floor, and several bright soft panels overhead and to the sides. Used as
 * scene.environment (via PMREM) it gives every metal real reflection streaks —
 * the single biggest fix for the matte look. Swapping in a real .hdr later is a
 * one-line change at the call site.
 */
export function makeStudioEnvironment(): Texture {
  const w = 1024;
  const h = 512;
  const canvas =
    typeof OffscreenCanvas !== 'undefined'
      ? new OffscreenCanvas(w, h)
      : Object.assign(document.createElement('canvas'), { width: w, height: h });
  const ctx = (canvas as HTMLCanvasElement).getContext('2d')!;

  // Vertical studio gradient: bright ceiling → mid wall → darker floor.
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0.0, '#fbfbfd');
  sky.addColorStop(0.45, '#d7d9de');
  sky.addColorStop(0.62, '#a9acb3');
  sky.addColorStop(1.0, '#3c3e44');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  // Soft bright panels (the reflections you actually see in chrome).
  const panel = (cx: number, cy: number, rx: number, ry: number, peak: number) => {
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx, ry));
    g.addColorStop(0, `rgba(255,255,255,${peak})`);
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(rx / Math.max(rx, ry), ry / Math.max(rx, ry));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, Math.max(rx, ry), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };
  panel(w * 0.5, h * 0.12, w * 0.28, h * 0.1, 1.0); // key overhead
  panel(w * 0.16, h * 0.3, w * 0.13, h * 0.22, 0.7); // left wall
  panel(w * 0.84, h * 0.3, w * 0.13, h * 0.22, 0.7); // right wall
  panel(w * 0.5, h * 0.5, w * 0.4, h * 0.12, 0.35); // horizon glow

  const tex = new CanvasTexture(canvas as HTMLCanvasElement);
  tex.mapping = EquirectangularReflectionMapping;
  tex.needsUpdate = true;
  return tex;
}

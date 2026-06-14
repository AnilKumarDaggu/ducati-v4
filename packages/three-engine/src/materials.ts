import { MeshPhysicalMaterial, type MeshStandardMaterial } from 'three';

/**
 * Material treatment at load (V1).
 *
 * Two regimes:
 *  - PLACEHOLDER materials (the procedural engine) are upgraded to physically-
 *    based by NAME — clearcoat rosso, anisotropic alu, chrome — so flat fills
 *    become surfaces under the studio environment.
 *  - REAL model materials (a scanned/purchased GLB with its own textures, e.g.
 *    the Ducati Panigale) are PRESERVED: we keep the authored maps and only
 *    raise envMapIntensity so they catch the studio reflections. We never
 *    clobber a real material's textures (the earlier default-to-cast bug).
 *
 * Per-mesh clones either way, so selection FX never bleed across shared mats.
 */

const PLACEHOLDER_NAMES = new Set([
  'rosso_corsa',
  'chrome',
  'brushed_aluminium',
  'cast_aluminium',
]);

export function upgradeToPhysical(std: MeshStandardMaterial): MeshStandardMaterial {
  // Real (authored) material: preserve it, just let it reflect the studio env.
  if (!PLACEHOLDER_NAMES.has(std.name)) {
    const keep = std.clone();
    keep.envMapIntensity = Math.max(keep.envMapIntensity ?? 1, 1.0);
    return keep;
  }

  // Placeholder material: promote to physically-based by name.
  const m = new MeshPhysicalMaterial({
    name: std.name,
    color: std.color.clone(),
    metalness: std.metalness,
    roughness: std.roughness,
  });
  switch (std.name) {
    case 'rosso_corsa':
      m.metalness = 0.0;
      m.roughness = 0.38;
      m.clearcoat = 1.0;
      m.clearcoatRoughness = 0.12;
      m.envMapIntensity = 1.1;
      break;
    case 'chrome':
      m.metalness = 1.0;
      m.roughness = 0.08;
      m.envMapIntensity = 1.7;
      break;
    case 'brushed_aluminium':
      m.metalness = 0.9;
      m.roughness = 0.3;
      m.anisotropy = 0.7;
      m.envMapIntensity = 1.25;
      break;
    case 'cast_aluminium':
      m.metalness = 0.65;
      m.roughness = 0.55;
      m.envMapIntensity = 0.85;
      break;
  }
  return m;
}

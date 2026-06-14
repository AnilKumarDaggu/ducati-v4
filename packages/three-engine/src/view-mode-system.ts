import {
  Color,
  DoubleSide,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshStandardMaterial,
  type BufferGeometry,
  type DirectionalLight,
  type HemisphereLight,
  type Scene,
  type ShadowMaterial,
} from 'three';

/**
 * ViewModeSystem — DTEA-ADR-010, UXD-001 §A/§H, V1.5 exploration depth.
 *
 * A view mode is a world+representation PRESET (materials + stage together) and
 * owns mode-aware selection FX. V1.5 deepens two modes via material
 * classification (shell vs core; CAD class palette):
 *  - X-RAY: ghost the outer SHELL (bodywork/glass), keep the mechanical CORE
 *    solid → "see the engine through the fairing", with the selection
 *    highlighted. Reads as internal understanding, not flat transparency.
 *  - TECNICO: flat CAD fills coloured by material CLASS + black edge line-work
 *    on every part → a premium CAD-review look (boundaries, classification).
 */

export type ViewMode = 'studio' | 'officina' | 'tecnico' | 'xray' | 'enginetest';

const EDGE_BUDGET_MESHES = 260;
const EDGE_BUDGET_TRIANGLES = 600_000;
const EDGE_THRESHOLD_DEG = 24;
const DIM_FACTOR = 0.5;

/** Material classification (V1.5): shell-vs-core for X-ray, flat colour for CAD. */
interface MatClass {
  shell: boolean;
  cad: number;
}
function classify(materialName: string): MatClass {
  const n = (materialName || '').toLowerCase();
  if (n.includes('glass') || n.includes('mirror')) return { shell: true, cad: 0x86b5d6 };
  if (n.includes('red_paint') || n.includes('body_red')) return { shell: true, cad: 0xb23a3a };
  if (n.includes('paint') || n.includes('carros') || n.includes('body')) return { shell: true, cad: 0x596069 };
  if (n.includes('tyre') || n.includes('rubber') || n.includes('caucho')) return { shell: false, cad: 0x2b2b30 };
  if (n.includes('polish') || n.includes('mattle') || n.includes('matle') || n.includes('heavy') || n.includes('metal') || n.includes('chrom'))
    return { shell: false, cad: 0x9aa0a8 };
  if (n.includes('plastic')) return { shell: false, cad: 0x44474d };
  return { shell: false, cad: 0x7d828a };
}

interface StageRefs {
  scene: Scene;
  hemi: HemisphereLight;
  key: DirectionalLight;
  fill: DirectionalLight;
  rim: DirectionalLight;
  shadowMaterial: ShadowMaterial;
  hasEnvironment: boolean;
}

interface StagePreset {
  background: number;
  hemi: number;
  key: number;
  keyColor: number;
  fill: number;
  rim: number;
  envIntensity: number;
  shadowOpacity: number;
}

const STAGE_PRESETS: Record<ViewMode, StagePreset> = {
  studio: { background: 0xf4f4f2, hemi: 0.55, key: 2.4, keyColor: 0xffffff, fill: 0.7, rim: 1.1, envIntensity: 0.9, shadowOpacity: 0.18 },
  officina: { background: 0x101014, hemi: 0.12, key: 3.2, keyColor: 0xffe2c4, fill: 0.15, rim: 0.9, envIntensity: 0.25, shadowOpacity: 0.4 },
  tecnico: { background: 0xeceae4, hemi: 1.0, key: 1.1, keyColor: 0xffffff, fill: 0.7, rim: 0.25, envIntensity: 0.12, shadowOpacity: 0.05 },
  xray: { background: 0x0f1622, hemi: 0.4, key: 1.6, keyColor: 0xbfd4ff, fill: 0.5, rim: 1.4, envIntensity: 0.5, shadowOpacity: 0.0 },
  // Dyno cell: dark, dramatic, focused — the engine on the bench.
  enginetest: { background: 0x141518, hemi: 0.25, key: 2.6, keyColor: 0xffe9d2, fill: 0.3, rim: 1.5, envIntensity: 0.7, shadowOpacity: 0.3 },
};

interface ManagedMesh {
  mesh: Mesh;
  photoreal: MeshStandardMaterial;
  baseColor: Color;
  shell: boolean;
  tecnico: MeshStandardMaterial;
  edges?: LineSegments;
}

export class ViewModeSystem {
  private mode: ViewMode = 'studio';
  private managed: ManagedMesh[] = [];
  private selectedId: string | null = null;
  private hoveredId: string | null = null;
  private edgesBuilt = false;

  // X-ray: a cool glassy shell, near-transparent, double-sided so the silhouette reads.
  private readonly ghostShell = new MeshStandardMaterial({
    color: 0x8fb8d8,
    transparent: true,
    opacity: 0.05,
    depthWrite: false,
    side: DoubleSide,
    roughness: 0.4,
    metalness: 0,
  });
  private readonly edgeInk = new LineBasicMaterial({ color: 0x33363c });
  private readonly edgeRosso = new LineBasicMaterial({ color: 0xcc0405 });

  constructor(private readonly stage: StageRefs) {}

  /** Register a mesh whose photoreal material is already a per-mesh clone (viewer guarantees this). */
  register(mesh: Mesh): void {
    const photoreal = mesh.material as MeshStandardMaterial;
    const cls = classify(photoreal.name);
    const tecnico = new MeshStandardMaterial({
      color: cls.cad,
      roughness: 0.85,
      metalness: 0.0,
      flatShading: true,
    });
    this.managed.push({ mesh, photoreal, baseColor: photoreal.color.clone(), shell: cls.shell, tecnico });
  }

  getMode(): ViewMode {
    return this.mode;
  }

  setMode(mode: ViewMode): void {
    if (mode === this.mode) return;
    this.mode = mode;
    this.applyStage();
    if (mode === 'tecnico') this.ensureEdges();
    this.setEdgesVisible(mode === 'tecnico');
    this.applySelection(this.selectedId, this.hoveredId);
  }

  applySelection(selectedId: string | null, hoveredId: string | null): void {
    this.selectedId = selectedId;
    this.hoveredId = hoveredId;
    const hasSelection = selectedId !== null;

    for (const entry of this.managed) {
      const isSelected = hasSelection && this.isUnder(entry.mesh, selectedId);
      const isHovered = hoveredId !== null && this.isUnder(entry.mesh, hoveredId);

      switch (this.mode) {
        case 'studio':
        case 'officina': {
          entry.mesh.material = entry.photoreal;
          entry.photoreal.color.copy(entry.baseColor);
          if (hasSelection && !isSelected) entry.photoreal.color.multiplyScalar(DIM_FACTOR);
          entry.photoreal.emissive.setHex(isSelected ? 0x1c1c1e : isHovered ? 0x101012 : 0x000000);
          break;
        }
        case 'tecnico': {
          entry.mesh.material = entry.tecnico;
          entry.tecnico.emissive.setHex(isSelected ? 0x3a0a0c : isHovered ? 0x141414 : 0x000000);
          if (entry.edges) entry.edges.material = isSelected ? this.edgeRosso : this.edgeInk;
          break;
        }
        case 'xray': {
          // Shell (bodywork/glass) ghosts; mechanical CORE stays solid → see inside.
          // Selection always wins: the chosen part is solid + emphasized.
          if (isSelected) {
            entry.mesh.material = entry.photoreal;
            entry.photoreal.color.copy(entry.baseColor);
            entry.photoreal.emissive.setHex(0x2a1208); // warm highlight against the cool ghost
          } else if (entry.shell) {
            entry.mesh.material = this.ghostShell;
          } else {
            // Core: solid, cool-neutralised; dimmed when something else is selected.
            entry.mesh.material = entry.photoreal;
            entry.photoreal.color.copy(entry.baseColor);
            if (hasSelection) entry.photoreal.color.multiplyScalar(DIM_FACTOR);
            entry.photoreal.emissive.setHex(isHovered ? 0x101012 : 0x000000);
          }
          break;
        }
      }
    }
  }

  dispose(): void {
    for (const entry of this.managed) {
      entry.edges?.geometry.dispose();
      entry.edges?.removeFromParent();
      entry.tecnico.dispose();
    }
    this.ghostShell.dispose();
    this.edgeInk.dispose();
    this.edgeRosso.dispose();
  }

  // ───────────────────────────────────────────────────────────────────────────

  private applyStage(): void {
    const p = STAGE_PRESETS[this.mode];
    const { scene, hemi, key, fill, rim, shadowMaterial, hasEnvironment } = this.stage;
    (scene.background as Color).setHex(p.background);
    hemi.intensity = p.hemi;
    key.intensity = p.key;
    key.color.setHex(p.keyColor);
    fill.intensity = p.fill;
    rim.intensity = p.rim;
    shadowMaterial.opacity = p.shadowOpacity;
    if (hasEnvironment) scene.environmentIntensity = p.envIntensity;
  }

  private ensureEdges(): void {
    if (this.edgesBuilt) return;
    this.edgesBuilt = true;
    const totalTris = this.managed.reduce((sum, e) => {
      const geo = e.mesh.geometry as BufferGeometry;
      const index = geo.getIndex();
      return sum + (index ? index.count : (geo.getAttribute('position')?.count ?? 0)) / 3;
    }, 0);
    if (this.managed.length > EDGE_BUDGET_MESHES || totalTris > EDGE_BUDGET_TRIANGLES) {
      console.warn('[dtea] tecnico edges skipped: above budget', { meshes: this.managed.length, totalTris });
      return;
    }
    for (const entry of this.managed) {
      const geometry = new EdgesGeometry(entry.mesh.geometry as BufferGeometry, EDGE_THRESHOLD_DEG);
      const edges = new LineSegments(geometry, this.edgeInk);
      edges.visible = false;
      edges.renderOrder = 1;
      entry.mesh.add(edges);
      entry.edges = edges;
    }
  }

  private setEdgesVisible(visible: boolean): void {
    for (const entry of this.managed) {
      if (entry.edges) entry.edges.visible = visible;
    }
  }

  /** Matches by BOM componentId (engine) OR node name (native model parts). */
  private isUnder(obj: Mesh, id: string): boolean {
    let cur: typeof obj.parent | Mesh = obj;
    while (cur) {
      if ((cur.userData as Record<string, unknown>)['componentId'] === id) return true;
      if (cur.name === id) return true;
      cur = cur.parent;
    }
    return false;
  }
}

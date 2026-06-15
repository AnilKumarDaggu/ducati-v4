import {
  ACESFilmicToneMapping,
  AnimationMixer,
  Box3,
  Color,
  DirectionalLight,
  Group,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Raycaster,
  Scene,
  ShadowMaterial,
  SRGBColorSpace,
  Sphere,
  Vector2,
  Vector3,
  WebGLRenderer,
  type Object3D,
} from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import type { ExplodeDef } from '@dtea/data';
import { RendererManager } from './renderer-manager.js';
import { ViewModeSystem, type ViewMode } from './view-mode-system.js';
import { ExplodeController } from './explode-controller.js';
import { CrankAngleClock, type RotationAxis } from './crank-angle-clock.js';
import { PerfMonitor, type PerfStats } from './perf-monitor.js';
import { makeStudioEnvironment } from './studio-environment.js';
import { upgradeToPhysical } from './materials.js';
import { EngineRig, type EngineState, type FlowKind } from './engine-rig.js';

/**
 * EsploraViewer — the cinematic staged viewer (UXD-001 §H, V1 visual pass).
 *
 * V1: WebGL2-preferred so the EffectComposer post stack runs — studio HDR
 * environment (real reflections on every material), physically-based materials
 * (clearcoat rosso, anisotropic alu, chrome), ambient occlusion (SAO), subtle
 * bloom, and an OutlinePass selection glow. The ViewModeSystem (ADR-010) still
 * owns world+representation presets and subject-isolation FX.
 */

/**
 * EsploraViewer — the staged viewer (UXD-001 §H, RDM-003 Sprint 2).
 *
 * D-1 closed: ACES tone mapping + IBL (PMREM RoomEnvironment, WebGL2 path) +
 * a full analytic studio rig on BOTH renderer paths. The stage itself is
 * mode-dependent: the ViewModeSystem (DTEA-ADR-010) swaps world+representation
 * presets (studio/officina/tecnico/xray) and owns mode-aware selection FX.
 *
 * Camera: damped inertial orbit, dolly-to-cursor, pan; cinematica framing
 * journeys (UXD §E/§G).
 */

// Self-hosting moves with the asset CDN story (Sprint 2 backlog note).
const DRACO_DECODER_URL = 'https://www.gstatic.com/draco/versioned/decoders/1.5.7/';

const HOVER_INTENT_MS = 120;
const FRAME_JOURNEY_MS = 1200;
const HERO_AZIMUTH = (38 * Math.PI) / 180;
const HERO_ELEVATION = (20 * Math.PI) / 180;
const HERO_FILL = 2.15; // smaller = engine fills more of the frame
const IDLE_DRIFT_MS = 4000; // begin the slow museum drift after this idle

export interface ComponentHit {
  componentId: string;
  /** Human label (catalog displayName for mapped parts; humanized node name for native parts). */
  label: string;
  extras: Record<string, unknown>;
}

export interface ScenePart {
  id: string;
  label: string;
}

export interface EsploraViewerOptions {
  /** Pipeline manifest (BOM-mapped engine) — id = componentId from injected metadata. */
  manifestUrl?: string;
  /** OR a direct GLB (real model, e.g. the Panigale) — id = node name, native materials kept. */
  modelUrl?: string;
  /** Pre-parsed explode choreography (config-driven; authored per ExplodeDef contract). */
  explode?: ExplodeDef;
  /** Accessibility (LXD-001 / PRD §0.2): collapse camera journeys to instant cuts. */
  reducedMotion?: boolean;
  onStatus: (status: 'loading' | 'loaded' | 'error', detail?: string) => void;
  onSelect: (hit: ComponentHit | null) => void;
  onHover: (componentId: string | null) => void;
  /** Isolation state changed (V1.5 drill-down). */
  onIsolate?: (isolated: boolean) => void;
  /** Download progress 0–1 for the loading experience. */
  onProgress?: (fraction: number) => void;
  /** Selectable parts after load — drives the navigator (model or catalog). */
  onParts?: (parts: ScenePart[]) => void;
  /** Performance telemetry, emitted ~2×/s (UXD-001 30 FPS floor instrumentation). */
  onStats?: (stats: PerfStats) => void;
  /** Engine Test live state (rpm, running, per-cylinder stroke/firing), ~6×/s. */
  onEngineState?: (state: EngineState) => void;
}

/** Humanize a raw node name into a presentable label (native-model parts). */
function humanizeName(raw: string): string {
  return raw
    .replace(/_\d+$/, '')
    .replace(/\.\d+$/, '')
    .replace(/[._]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export interface EsploraHandle {
  backend: 'webgpu' | 'webgl2';
  frameComponent(componentId: string): void;
  frameAll(): void;
  selectComponent(componentId: string | null): void;
  setViewMode(mode: ViewMode): void;
  getViewMode(): ViewMode;
  /** Esploso: scrub the global level directly (0–1). */
  setExplodeLevel(level: number): void;
  getExplodeLevel(): number;
  /** Esploso: timed playback to a target level (cinematica). */
  playExplodeTo(level: number): void;
  /** Ciclo: the global crank-angle clock, 0–720° (BOM-001 rule 4, ADR-011). */
  setCrankAngle(angleDeg: number): void;
  getCrankAngle(): number;
  setCrankRunning(running: boolean, rpm?: number): void;
  /** Bind an AN-R part's ratio rotation (cam 360°/cycle, crank 720°, idler −720°). */
  bindCrankRotation(
    componentId: string,
    degreesPerCycle: number,
    axis?: RotationAxis,
    phaseDeg?: number,
  ): boolean;
  /** Toggle reduced-motion at runtime (system preference changes). */
  setReducedMotion(reduced: boolean): void;
  /** V1.5 drill-down: isolate the current selection (hide the rest). */
  setIsolated(on: boolean): void;
  isIsolated(): boolean;
  /** Engine Test: enter/leave the procedural V4 cutaway (hides the bike). */
  setEngineTest(on: boolean): void;
  /** Engine Test: start/stop the running engine. */
  setEngineRunning(running: boolean): void;
  /** Engine Test: target rpm (animation scales by rpm). */
  setEngineRpm(rpm: number): void;
  /** Engine Test visual toggles. */
  setEngineCombustion(on: boolean): void;
  setEngineCutaway(on: boolean): void;
  setEngineFlow(kind: FlowKind, on: boolean): void;
  dispose(): void;
}

interface Manifest {
  assets: Array<{ file: string; nodes: string[] }>;
}

const easeCinematica = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export async function createEsploraViewer(
  canvas: HTMLCanvasElement,
  options: EsploraViewerOptions,
): Promise<EsploraHandle> {
  options.onStatus('loading');

  // V1 prefers WebGL2 so the EffectComposer post stack runs (renderer-manager.ts).
  const info = await RendererManager.create(canvas, { preferWebGL2: true });
  const renderer = info.renderer as WebGLRenderer;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.shadowMap.enabled = true;

  // ── Stage (preset-controlled; defaults = studio) ─────────────────────────
  // Engine-scale stage (mm): the hero is ~440mm; lights/shadows are sized for it.
  const scene = new Scene();

  // Studio base colour; the ViewModeSystem tints this per preset.
  scene.background = new Color(0xf4f4f2);

  // Studio HDR environment via PMREM → real reflections on every material.
  // (Swap makeStudioEnvironment() for an .hdr load later — one line.)
  const pmrem = new PMREMGenerator(renderer);
  const envSource = makeStudioEnvironment();
  scene.environment = pmrem.fromEquirectangular(envSource).texture;
  scene.environmentIntensity = 1.0;
  envSource.dispose();
  const hasEnvironment = true;

  const hemi = new HemisphereLight(0xffffff, 0x9a9ca2, 0.5);
  scene.add(hemi);
  const key = new DirectionalLight(0xfff4e8, 3.0); // warm key
  key.position.set(420, 700, 460);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.near = 50;
  key.shadow.camera.far = 2400;
  key.shadow.bias = -0.0004;
  const s = 700;
  key.shadow.camera.left = -s;
  key.shadow.camera.right = s;
  key.shadow.camera.top = s;
  key.shadow.camera.bottom = -s;
  scene.add(key);
  const fill = new DirectionalLight(0xe8eefc, 0.8); // cool fill, opposite
  fill.position.set(-560, 260, -180);
  scene.add(fill);
  const rim = new DirectionalLight(0xffffff, 1.7); // back rim for edge separation
  rim.position.set(-120, 380, -680);
  scene.add(rim);

  // Contact shadow + faint floor reflection so the hero sits, never floats.
  const shadowMaterial = new ShadowMaterial({ opacity: 0.32 });
  const shadowPlane = new Mesh(new PlaneGeometry(4000, 4000), shadowMaterial);
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = -2;
  shadowPlane.receiveShadow = true;
  scene.add(shadowPlane);

  const viewModes = new ViewModeSystem({
    scene,
    hemi,
    key,
    fill,
    rim,
    shadowMaterial,
    hasEnvironment,
  });

  const camera = new PerspectiveCamera(40, 1, 0.5, 4000);

  // ── Camera controls: AAA orbit (UXD §E) ──────────────────────────────────
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.zoomToCursor = true;
  controls.minPolarAngle = (10 * Math.PI) / 180;
  controls.maxPolarAngle = (170 * Math.PI) / 180;
  controls.screenSpacePanning = true;
  controls.autoRotateSpeed = 0.4; // gentle museum drift (enabled after idle)
  let lastInteraction = performance.now();

  const modelRoot = new Group();
  scene.add(modelRoot);

  // Engine Test rig — procedural V4 cutaway (educational simulation), hidden
  // until the Engine Test mode is entered. See engine-rig.ts for real-vs-sim.
  const engineRig = new EngineRig();
  scene.add(engineRig.group);
  let engineTestActive = false;
  let engineRunning = false;
  let engineRpm = 1200;
  let lastEngineEmit = 0;

  // Post-processing (AO/bloom/outline) is deferred: the EffectComposer chain
  // rendered black under this scene's colour-management, and a correct image
  // outranks effects. Selection emphasis comes from the ViewModeSystem (subject
  // isolation + emissive). Reflections come from the studio HDR environment;
  // depth from the light rig + contact shadow + DOM vignette. Re-add post as a
  // dedicated colour-managed pass (see GLB/visual follow-ups).

  // ── Asset load: pipeline manifest (engine) OR direct GLB (real model) ────
  const nodeById = new Map<string, Object3D>();
  const crank = new CrankAngleClock();
  const isModel = !!options.modelUrl;

  const processScene = (sceneNode: Object3D) => {
    sceneNode.traverse((obj) => {
      if (obj instanceof Mesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
        // Placeholder mats → physically-based; real model mats preserved (materials.ts).
        obj.material = upgradeToPhysical(obj.material as MeshStandardMaterial);
        viewModes.register(obj);
      }
      const id = (obj.userData as Record<string, unknown>)['componentId'];
      if (typeof id === 'string') nodeById.set(id, obj);
    });
    modelRoot.add(sceneNode);
  };

  const normalizeModelRoot = () => {
    const box = new Box3().setFromObject(modelRoot);
    if (box.isEmpty()) return;
    const size = box.getSize(new Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    modelRoot.scale.setScalar(500 / maxDim); // canonical stage size for the light rig
    const grounded = new Box3().setFromObject(modelRoot);
    const center = grounded.getCenter(new Vector3());
    modelRoot.position.x -= center.x;
    modelRoot.position.z -= center.z;
    modelRoot.position.y -= grounded.min.y; // sit on the contact-shadow plane
  };

  const collectParts = (): ScenePart[] => {
    const parts: ScenePart[] = [];
    if (isModel) {
      // Native model (Path A): mesh node names are auto-generated ("Object_6"),
      // so label each selectable mesh by its MATERIAL — far more meaningful
      // ("Body Red Paint", "Rubber Tyre", "Glass"). A running suffix keeps them
      // distinct. id = mesh node name (stable, selectable, framable).
      const labelCount = new Map<string, number>();
      modelRoot.traverse((obj) => {
        if (!(obj instanceof Mesh)) return;
        const id = obj.name || `mesh_${parts.length}`;
        const mat = Array.isArray(obj.material) ? obj.material[0] : obj.material;
        const base = mat?.name ? humanizeName(mat.name) : 'Part';
        const n = (labelCount.get(base) ?? 0) + 1;
        labelCount.set(base, n);
        nodeById.set(id, obj);
        parts.push({ id, label: `${base} ${n}` });
      });
    } else {
      for (const id of nodeById.keys()) parts.push({ id, label: humanizeName(id) });
    }
    return parts.sort((a, b) => a.label.localeCompare(b.label));
  };

  try {
    const dracoLoader = new DRACOLoader().setDecoderPath(DRACO_DECODER_URL);
    const loader = new GLTFLoader().setDRACOLoader(dracoLoader);
    const onProg = (e: ProgressEvent) => {
      if (e.lengthComputable) options.onProgress?.(e.loaded / e.total);
    };

    if (options.modelUrl) {
      const gltf = await loader.loadAsync(options.modelUrl, onProg);
      processScene(gltf.scene);
    } else if (options.manifestUrl) {
      const baseUrl = options.manifestUrl.slice(0, options.manifestUrl.lastIndexOf('/') + 1);
      const manifest = (await (await fetch(options.manifestUrl)).json()) as Manifest;
      for (const asset of manifest.assets) {
        const gltf = await loader.loadAsync(baseUrl + asset.file, onProg);
        // AN-T/AN-O clips authored to the one-cycle convention (ADR-011).
        if (gltf.animations.length > 0) {
          const mixer = new AnimationMixer(gltf.scene);
          let cycleDuration = 0;
          for (const clip of gltf.animations) {
            mixer.clipAction(clip).play();
            cycleDuration = Math.max(cycleDuration, clip.duration);
          }
          crank.bindMixer(mixer, cycleDuration);
        }
        processScene(gltf.scene);
      }
    }
    normalizeModelRoot();
    options.onParts?.(collectParts());
    options.onProgress?.(1);
    options.onStatus('loaded');
  } catch (err) {
    options.onStatus('error', err instanceof Error ? err.message : String(err));
  }

  // ── Esploso choreography (config-driven; nodes bound post-load) ──────────
  let explode: ExplodeController | null = null;
  if (options.explode) {
    explode = new ExplodeController(options.explode);
    explode.bind((name) => nodeById.get(name));
  }

  // ── Framing engine ───────────────────────────────────────────────────────
  let journey: {
    fromPos: Vector3;
    toPos: Vector3;
    fromTarget: Vector3;
    toTarget: Vector3;
    start: number;
  } | null = null;

  const flyTo = (target: Vector3, position: Vector3) => {
    journey = {
      fromPos: camera.position.clone(),
      toPos: position,
      fromTarget: controls.target.clone(),
      toTarget: target,
      start: performance.now(),
    };
  };

  let reducedMotion = options.reducedMotion ?? false;
  const frameObject = (object: Object3D, instant = false) => {
    const sphere = new Box3().setFromObject(object).getBoundingSphere(new Sphere());
    if (sphere.radius <= 0) return;
    const distance = sphere.radius * HERO_FILL;
    const dir = new Vector3(
      Math.cos(HERO_ELEVATION) * Math.sin(HERO_AZIMUTH),
      Math.sin(HERO_ELEVATION),
      Math.cos(HERO_ELEVATION) * Math.cos(HERO_AZIMUTH),
    );
    const position = sphere.center.clone().addScaledVector(dir, distance);
    // Reduced-motion (a11y): cut instantly instead of flying (UXD-001 §G).
    if (instant || reducedMotion) {
      camera.position.copy(position);
      controls.target.copy(sphere.center);
      controls.update();
    } else {
      flyTo(sphere.center.clone(), position);
    }
  };

  // ── Selection state (visuals delegated to the ViewModeSystem) ───────────
  let selectedId: string | null = null;
  let hoveredId: string | null = null;

  const componentIdOf = (object: Object3D): ComponentHit | null => {
    let cur: Object3D | null = object;
    while (cur) {
      const id = (cur.userData as Record<string, unknown>)['componentId'];
      if (typeof id === 'string')
        return { componentId: id, label: humanizeName(id), extras: cur.userData as Record<string, unknown> };
      if (cur.name && nodeById.has(cur.name))
        return {
          componentId: cur.name,
          label: humanizeName(cur.name),
          extras: (cur.userData as Record<string, unknown>) ?? {},
        };
      cur = cur.parent;
    }
    return null;
  };

  // ── Pointer handling ─────────────────────────────────────────────────────
  const raycaster = new Raycaster();
  const pointer = new Vector2();
  let pointerClient: { x: number; y: number } | null = null;
  let hoverTimer: ReturnType<typeof setTimeout> | null = null;
  let dragging = false;
  let downAt = 0;

  const pick = (): ComponentHit | null => {
    if (!pointerClient) return null;
    const rect = canvas.getBoundingClientRect();
    pointer.set(
      ((pointerClient.x - rect.left) / rect.width) * 2 - 1,
      -((pointerClient.y - rect.top) / rect.height) * 2 + 1,
    );
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(modelRoot.children, true)[0];
    return hit ? componentIdOf(hit.object) : null;
  };

  const onPointerMove = (e: PointerEvent) => {
    pointerClient = { x: e.clientX, y: e.clientY };
    lastInteraction = performance.now();
    if (dragging) return;
    if (hoverTimer) clearTimeout(hoverTimer);
    hoverTimer = setTimeout(() => {
      const hit = pick();
      const id = hit?.componentId ?? null;
      if (id !== hoveredId) {
        hoveredId = id;
        viewModes.applySelection(selectedId, hoveredId);
        options.onHover(id);
        canvas.style.cursor = id ? 'pointer' : 'grab';
      }
    }, HOVER_INTENT_MS);
  };

  const onPointerDown = () => {
    dragging = false;
    downAt = performance.now();
    lastInteraction = performance.now();
  };
  const onControlsStart = () => {
    dragging = true;
    lastInteraction = performance.now();
    canvas.style.cursor = 'grabbing';
  };
  const onControlsEnd = () => {
    dragging = false;
    canvas.style.cursor = hoveredId ? 'pointer' : 'grab';
  };

  // ── Isolation (V1.5 drill-down): hide everything but the selected subtree ──
  let isolatedId: string | null = null;
  const nodeUnder = (obj: Object3D, id: string): boolean => {
    let cur: Object3D | null = obj;
    while (cur) {
      if (cur.name === id || (cur.userData as Record<string, unknown>)['componentId'] === id) return true;
      cur = cur.parent;
    }
    return false;
  };
  const applyIsolation = () => {
    modelRoot.traverse((obj) => {
      if (obj instanceof Mesh) obj.visible = isolatedId === null || nodeUnder(obj, isolatedId);
    });
  };
  const setIsolated = (on: boolean) => {
    isolatedId = on && selectedId ? selectedId : null;
    applyIsolation();
    if (isolatedId) {
      const node = nodeById.get(isolatedId);
      if (node) frameObject(node);
    } else {
      frameObject(modelRoot);
    }
    options.onIsolate?.(isolatedId !== null);
  };

  const applyEngineTest = (on: boolean) => {
    if (on === engineTestActive) return;
    engineTestActive = on;
    engineRig.setVisible(on);
    modelRoot.visible = !on;
    if (on) {
      if (isolatedId) setIsolated(false);
      frameObject(engineRig.group);
    } else {
      crank.setRunning(false);
      engineRunning = false;
      frameObject(modelRoot);
    }
  };

  const select = (hit: ComponentHit | null) => {
    if ((hit?.componentId ?? null) !== selectedId && isolatedId) {
      isolatedId = null; // changing selection exits isolation
      applyIsolation();
      options.onIsolate?.(false);
    }
    selectedId = hit?.componentId ?? null;
    viewModes.applySelection(selectedId, hoveredId);
    options.onSelect(hit);
  };

  // Progressive click: select+frame → (click same) isolate → (click same) exit.
  const onClick = (e: PointerEvent) => {
    if (performance.now() - downAt > 350 && dragging) return;
    pointerClient = { x: e.clientX, y: e.clientY };
    const hit = pick();
    if (hit && hit.componentId === selectedId) {
      setIsolated(!isolatedId); // notifies onIsolate internally
    } else {
      select(hit);
    }
  };

  const onDblClick = (e: MouseEvent) => {
    pointerClient = { x: e.clientX, y: e.clientY };
    const hit = pick();
    if (hit) {
      const node = nodeById.get(hit.componentId);
      if (node) frameObject(node);
    } else {
      frameObject(modelRoot);
    }
  };

  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('click', onClick);
  canvas.addEventListener('dblclick', onDblClick);
  controls.addEventListener('start', onControlsStart);
  controls.addEventListener('end', onControlsEnd);
  canvas.style.cursor = 'grab';
  canvas.style.touchAction = 'none';

  // ── Resize ───────────────────────────────────────────────────────────────
  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas;
    if (w === 0 || h === 0) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  };
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();

  frameObject(modelRoot, true);

  // ── Render loop (instrumented) ───────────────────────────────────────────
  const perf = new PerfMonitor();
  let lastFrame = performance.now();
  let lastStatsEmit = lastFrame;
  renderer.setAnimationLoop(() => {
    const now = performance.now();
    const delta = now - lastFrame;
    lastFrame = now;
    perf.sample(delta);
    if (journey) {
      const t = Math.min((now - journey.start) / FRAME_JOURNEY_MS, 1);
      const k = easeCinematica(t);
      camera.position.lerpVectors(journey.fromPos, journey.toPos, k);
      controls.target.lerpVectors(journey.fromTarget, journey.toTarget, k);
      if (t >= 1) journey = null;
    }
    explode?.update(now);
    crank.update(delta);
    if (engineTestActive) {
      engineRig.update(crank.getAngle(), delta, engineRpm, engineRunning);
      if (options.onEngineState && now - lastEngineEmit > 160) {
        lastEngineEmit = now;
        options.onEngineState(engineRig.state(crank.getAngle(), engineRpm, engineRunning));
      }
    }
    // Idle museum drift: only when nothing else is moving and the user is away.
    controls.autoRotate = !journey && !dragging && now - lastInteraction > IDLE_DRIFT_MS;
    controls.update();
    renderer.render(scene, camera);
    if (options.onStats && now - lastStatsEmit > 500) {
      lastStatsEmit = now;
      options.onStats(perf.stats());
    }
  });

  return {
    backend: info.backend,
    frameComponent(componentId) {
      const node = nodeById.get(componentId);
      if (node) frameObject(node);
    },
    frameAll() {
      frameObject(modelRoot);
    },
    selectComponent(componentId) {
      if (componentId === null) {
        if (isolatedId) setIsolated(false);
        return select(null);
      }
      const node = nodeById.get(componentId);
      if (!node) return;
      select(componentIdOf(node));
      frameObject(node);
    },
    setViewMode(mode) {
      viewModes.setMode(mode);
      applyEngineTest(mode === 'enginetest');
    },
    getViewMode() {
      return viewModes.getMode();
    },
    setEngineTest(on) {
      applyEngineTest(on);
    },
    setEngineRunning(running) {
      engineRunning = running;
      crank.setRunning(running, engineRpm);
    },
    setEngineRpm(rpm) {
      engineRpm = rpm;
      if (engineRunning) crank.setRunning(true, rpm);
    },
    setEngineCombustion(on) {
      engineRig.setCombustion(on);
    },
    setEngineCutaway(on) {
      engineRig.setCutaway(on);
    },
    setEngineFlow(kind, on) {
      engineRig.setFlow(kind, on);
    },
    setExplodeLevel(level) {
      explode?.setLevel(level);
    },
    getExplodeLevel() {
      return explode?.getLevel() ?? 0;
    },
    playExplodeTo(level) {
      explode?.playTo(level);
    },
    setCrankAngle(angleDeg) {
      crank.setAngle(angleDeg);
    },
    getCrankAngle() {
      return crank.getAngle();
    },
    setCrankRunning(running, rpm) {
      crank.setRunning(running, rpm);
    },
    bindCrankRotation(componentId, degreesPerCycle, axis = 'y', phaseDeg = 0) {
      const node = nodeById.get(componentId);
      if (!node) return false;
      crank.bindRotation(node, degreesPerCycle, axis, phaseDeg);
      return true;
    },
    setReducedMotion(reduced) {
      reducedMotion = reduced;
    },
    setIsolated(on) {
      setIsolated(on);
    },
    isIsolated() {
      return isolatedId !== null;
    },
    dispose() {
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('click', onClick);
      canvas.removeEventListener('dblclick', onDblClick);
      controls.dispose();
      observer.disconnect();
      viewModes.dispose();
      engineRig.dispose();
      pmrem.dispose();
      renderer.setAnimationLoop(null);
      renderer.dispose();
    },
  };
}

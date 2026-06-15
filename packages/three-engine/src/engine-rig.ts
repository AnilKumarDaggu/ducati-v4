import {
  AdditiveBlending,
  BoxGeometry,
  CatmullRomCurve3,
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  Group,
  IcosahedronGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  SphereGeometry,
  TubeGeometry,
  Vector3,
} from 'three';

export type FlowKind = 'air' | 'fuel' | 'oil';
type FlowStyle = 'gas' | 'liquid' | 'oil';

interface FlowPart {
  mesh: Mesh;
  curve: CatmullRomCurve3;
  phase: number;
  speed: number;
  orient: boolean;
}

/**
 * FlowStream — a cinematic (stylized, performant) flow visualization.
 *   gas    → soft additive puffs drawn down the intake (airflow)
 *   liquid → glossy elongated droplets, oriented along flow (fuel injection)
 *   oil    → viscous amber beads circulating the galleries
 * Each path also gets a faint translucent "conduit" tube so the route reads even
 * between droplets. Honest: illustrative routes, not CFD; off by default.
 */
class FlowStream {
  readonly group = new Group();
  private readonly parts: FlowPart[] = [];
  private readonly disposables: Array<{ dispose(): void }> = [];
  private readonly pos = new Vector3();
  private readonly tan = new Vector3();
  private static readonly UP = new Vector3(0, 1, 0);

  constructor(
    paths: Array<{ points: Vector3[]; closed?: boolean }>,
    color: number,
    style: FlowStyle,
    perPath: number,
    private readonly speed: number,
  ) {
    const dropGeo = FlowStream.geoFor(style);
    const dropMat = FlowStream.matFor(style, color);
    this.disposables.push(dropGeo, dropMat);

    const tubeMat = new MeshBasicMaterial({
      color,
      transparent: true,
      opacity: style === 'gas' ? 0.05 : 0.13,
      depthWrite: false,
      ...(style === 'gas' ? { blending: AdditiveBlending } : {}),
    });
    this.disposables.push(tubeMat);
    const tubeR = style === 'gas' ? 4 : style === 'oil' ? 2.6 : 1.8;

    for (const p of paths) {
      const curve = new CatmullRomCurve3(p.points, p.closed ?? false);
      const tubeGeo = new TubeGeometry(curve, 48, tubeR, 8, p.closed ?? false);
      this.disposables.push(tubeGeo);
      this.group.add(new Mesh(tubeGeo, tubeMat));
      for (let i = 0; i < perPath; i++) {
        const mesh = new Mesh(dropGeo, dropMat);
        this.parts.push({ mesh, curve, phase: i / perPath, speed, orient: style !== 'gas' });
        this.group.add(mesh);
      }
    }
    this.group.visible = false;
  }

  private static geoFor(style: FlowStyle) {
    if (style === 'gas') return new SphereGeometry(5.5, 8, 8);
    if (style === 'oil') return new SphereGeometry(3.4, 10, 10);
    return new ConeGeometry(2.6, 11, 8); // liquid teardrop, apex leads the flow
  }

  private static matFor(style: FlowStyle, color: number) {
    if (style === 'gas') {
      return new MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.22,
        depthWrite: false,
        blending: AdditiveBlending,
      });
    }
    return new MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: style === 'oil' ? 0.25 : 0.7,
      metalness: style === 'oil' ? 0.2 : 0.0,
      roughness: style === 'oil' ? 0.2 : 0.12,
      transparent: true,
      opacity: style === 'oil' ? 0.96 : 0.92,
    });
  }

  setEnabled(on: boolean): void {
    this.group.visible = on;
  }

  update(dtMs: number): void {
    if (!this.group.visible || dtMs <= 0) return;
    for (const part of this.parts) {
      part.phase = (part.phase + (part.speed * dtMs) / 1000) % 1;
      part.curve.getPointAt(part.phase, this.pos);
      part.mesh.position.copy(this.pos);
      if (part.orient) {
        part.curve.getTangentAt(part.phase, this.tan);
        part.mesh.quaternion.setFromUnitVectors(FlowStream.UP, this.tan);
      }
    }
  }

  dispose(): void {
    for (const d of this.disposables) d.dispose();
  }
}

/**
 * EngineRig — procedural, kinematically-correct V4 cutaway (Engine Test mode).
 *
 * IMPORTANT (real vs. simulated): the imported Panigale GLB has NO internals.
 * This rig is an EDUCATIONAL SIMULATION — representative geometry driven by real
 * slider-crank mathematics, not scanned Ducati parts. Accuracy of the MOTION is
 * the priority (per brief): pistons follow the exact slider-crank equation,
 * conrods track crankpin→wrist-pin each frame, the crank rotates 720° per
 * four-stroke cycle. Crankpin phasing is representative (a clean even-fire), not
 * the exact Desmosedici Twin-Pulse crank — labelled as such in the UI.
 */

const R = 26; // crank radius (half stroke)
const L = 96; // conrod length (centre-to-centre)
const BANK = Math.PI / 4; // 45° → 90° included vee
const BORE = 30; // cylinder/piston radius
const X = [-46, 46]; // two cylinders per bank along the crank (X) axis

type Stroke = 'intake' | 'compression' | 'power' | 'exhaust';

interface CylDef {
  x: number;
  bank: 'front' | 'rear';
  /** crank phase offset, degrees (representative even-fire) */
  phase: number;
  /** cylinder-axis angle from +Y in the Y–Z plane */
  axisAngle: number;
}

const CYLS: CylDef[] = [
  { x: X[0]!, bank: 'front', phase: 0, axisAngle: BANK },
  { x: X[1]!, bank: 'front', phase: 180, axisAngle: BANK },
  { x: X[0]!, bank: 'rear', phase: 270, axisAngle: -BANK },
  { x: X[1]!, bank: 'rear', phase: 90, axisAngle: -BANK },
];

function axisOf(def: CylDef): Vector3 {
  return new Vector3(0, Math.cos(def.axisAngle), Math.sin(def.axisAngle)).normalize();
}
function centerOf(def: CylDef): Vector3 {
  return new Vector3(def.x, 0, 0);
}

export interface CylinderState {
  index: number;
  bank: 'front' | 'rear';
  stroke: Stroke;
  firing: boolean;
}

interface CylRuntime {
  def: CylDef;
  axis: Vector3; // unit cylinder axis
  piston: Mesh;
  pistonMat: MeshStandardMaterial;
  rod: Mesh;
}

interface Flame {
  flame: Mesh;
  spark: Mesh;
  flameMat: MeshBasicMaterial;
  sparkMat: MeshBasicMaterial;
}

const Y = new Vector3(0, 1, 0);

function strokeFor(cycleDeg: number): { stroke: Stroke; firing: boolean } {
  const c = ((cycleDeg % 720) + 720) % 720;
  if (c < 180) return { stroke: 'intake', firing: false };
  if (c < 360) return { stroke: 'compression', firing: false };
  if (c < 540) return { stroke: 'power', firing: c < 410 }; // flash just after ignition
  return { stroke: 'exhaust', firing: false };
}

export class EngineRig {
  readonly group = new Group();
  private readonly crank = new Group();
  private readonly cyls: CylRuntime[] = [];
  private readonly flames: Flame[] = [];
  private readonly disposables: Array<{ dispose(): void }> = [];
  private readonly cutawayMeshes: Mesh[] = []; // bores + crankcase ghost
  private readonly flows = new Map<FlowKind, FlowStream>();
  private combustion = true;

  constructor() {
    this.build();
    this.buildFlows();
    this.buildCombustion();
    this.buildLighting();
    this.group.visible = false;
  }

  /**
   * Engine-test accent lighting — children of the rig group, so they only act
   * while Engine Test is live (hidden with the rig elsewhere). DirectionalLights
   * are distance-independent; positions are directions. A cool back rim separates
   * the polished metal from the dark dyno background, and a rosso fill rakes the
   * near edges for the Ducati signature highlight.
   */
  private buildLighting(): void {
    const rim = new DirectionalLight(0xdfe8ff, 2.6); // cool back rim for edge pop
    rim.position.set(-140, 220, -260);
    const rosso = new DirectionalLight(0xff2a1e, 1.5); // Ducati-red raking accent
    rosso.position.set(220, -40, 180);
    const lift = new DirectionalLight(0xffffff, 1.2); // crisp top spec highlight
    lift.position.set(40, 360, 120);
    this.group.add(rim, rosso, lift);
  }

  private mat(opts: ConstructorParameters<typeof MeshStandardMaterial>[0]): MeshStandardMaterial {
    const m = new MeshStandardMaterial(opts);
    this.disposables.push(m);
    return m;
  }

  private build(): void {
    const steel = this.mat({ color: 0xc2c7cf, metalness: 1, roughness: 0.18, envMapIntensity: 1.7 });
    const titanium = this.mat({ color: 0x9aa0ac, metalness: 1, roughness: 0.34, envMapIntensity: 1.4 });
    const darkSteel = this.mat({ color: 0x3c3f47, metalness: 1, roughness: 0.46, envMapIntensity: 1.2 });
    const caseMat = new MeshPhysicalMaterial({
      color: 0x2a2c31,
      metalness: 0.6,
      roughness: 0.5,
      transparent: true,
      opacity: 0.16,
      transmission: 0,
    });
    this.disposables.push(caseMat);

    // Crankcase ghost (cutaway context).
    const block = new Mesh(new BoxGeometry(150, 150, 130), caseMat);
    block.position.y = 30;
    this.group.add(block);
    this.cutawayMeshes.push(block);

    // Crankshaft: main shaft along X + per-cylinder phased crankpins.
    const shaftGeo = new CylinderGeometry(10, 10, 200, 24);
    const shaft = new Mesh(shaftGeo, darkSteel);
    shaft.rotation.z = Math.PI / 2; // align cylinder (Y) to X
    this.disposables.push(shaftGeo);
    this.crank.add(shaft);
    this.group.add(this.crank);

    const bore = this.mat({
      color: 0x8fb8d8,
      metalness: 0,
      roughness: 0.15,
      transparent: true,
      opacity: 0.12,
    });

    for (let i = 0; i < CYLS.length; i++) {
      const def = CYLS[i]!;
      const axis = axisOf(def);

      // Crankpin: a child of the crank, pre-rotated by phase about X, pin at radius R.
      const pinGroup = new Group();
      pinGroup.rotation.x = (def.phase * Math.PI) / 180;
      pinGroup.position.x = def.x;
      const pinGeo = new CylinderGeometry(7, 7, 26, 16);
      const pin = new Mesh(pinGeo, steel);
      pin.rotation.z = Math.PI / 2;
      pin.position.y = R;
      this.disposables.push(pinGeo);
      pinGroup.add(pin);
      this.crank.add(pinGroup);

      // Cylinder bore (transparent cutaway tube), fixed at mid-stroke along the axis.
      const boreGeo = new CylinderGeometry(BORE + 4, BORE + 4, 130, 28, 1, true);
      const boreMesh = new Mesh(boreGeo, bore);
      boreMesh.position.copy(axis.clone().multiplyScalar(R + L * 0.55));
      boreMesh.position.x = def.x;
      boreMesh.quaternion.setFromUnitVectors(Y, axis);
      this.disposables.push(boreGeo);
      this.group.add(boreMesh);
      this.cutawayMeshes.push(boreMesh);

      // Piston.
      const pistonGeo = new CylinderGeometry(BORE, BORE, 34, 28);
      const pistonMat = this.mat({ color: 0xdadfe6, metalness: 1, roughness: 0.15, envMapIntensity: 1.8 });
      const piston = new Mesh(pistonGeo, pistonMat);
      this.disposables.push(pistonGeo);
      this.group.add(piston);

      // Connecting rod (thin cylinder, re-oriented each frame).
      const rodGeo = new CylinderGeometry(5, 6, L, 16);
      const rod = new Mesh(rodGeo, titanium);
      this.disposables.push(rodGeo);
      this.group.add(rod);

      this.cyls.push({ def, axis, piston, pistonMat, rod });
    }
  }

  private buildFlows(): void {
    const airPaths: Array<{ points: Vector3[] }> = [];
    const fuelPaths: Array<{ points: Vector3[] }> = [];
    for (const def of CYLS) {
      const axis = axisOf(def);
      const chamber = centerOf(def).addScaledVector(axis, R + L * 0.92);
      // Air: drawn down the intake into the chamber.
      airPaths.push({
        points: [
          chamber.clone().addScaledVector(axis, 96),
          chamber.clone().addScaledVector(axis, 50),
          chamber.clone().addScaledVector(axis, 14),
        ],
      });
      // Fuel: injector spray just above the chamber, into the bore.
      fuelPaths.push({
        points: [
          chamber.clone().addScaledVector(axis, 40),
          chamber.clone().addScaledVector(axis, 16),
          chamber.clone().addScaledVector(axis, -4),
        ],
      });
    }
    // Fuel rail across the top of the vee (delivery to the injectors).
    fuelPaths.push({
      points: [
        new Vector3(-72, 150, 0),
        new Vector3(-46, 156, 6),
        new Vector3(46, 156, 6),
        new Vector3(72, 150, 0),
      ],
    });

    const air = new FlowStream(airPaths, 0x7fc4ff, 'gas', 7, 0.7); // pale intake blue
    const fuel = new FlowStream(fuelPaths, 0xffc24a, 'liquid', 6, 0.9); // petrol gold
    const oil = new FlowStream(
      [
        {
          points: [
            new Vector3(-58, -8, 22),
            new Vector3(0, -20, 0),
            new Vector3(58, -8, 22),
            new Vector3(54, 70, 8),
            new Vector3(0, 96, -6),
            new Vector3(-54, 70, 8),
          ],
          closed: true,
        },
      ],
      0xe0a022,
      'oil',
      16,
      0.45,
    );

    for (const [k, s] of [['air', air], ['fuel', fuel], ['oil', oil]] as const) {
      this.flows.set(k, s);
      this.group.add(s.group);
    }
  }

  private buildCombustion(): void {
    const flameGeo = new IcosahedronGeometry(13, 1);
    const sparkGeo = new SphereGeometry(5, 10, 10);
    this.disposables.push(flameGeo, sparkGeo);
    for (const def of CYLS) {
      const axis = axisOf(def);
      const chamber = centerOf(def).addScaledVector(axis, R + L * 0.9);
      const g = new Group();
      g.position.copy(chamber);
      const flameMat = new MeshBasicMaterial({
        color: 0xff6a1e,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: AdditiveBlending,
      });
      const sparkMat = new MeshBasicMaterial({
        color: 0xfff0c2,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: AdditiveBlending,
      });
      this.disposables.push(flameMat, sparkMat);
      const flame = new Mesh(flameGeo, flameMat);
      const spark = new Mesh(sparkGeo, sparkMat);
      g.add(flame, spark);
      this.group.add(g);
      this.flames.push({ flame, spark, flameMat, sparkMat });
    }
  }

  setCombustion(on: boolean): void {
    this.combustion = on;
  }

  setCutaway(on: boolean): void {
    for (const m of this.cutawayMeshes) m.visible = on;
  }

  setFlow(kind: FlowKind, on: boolean): void {
    this.flows.get(kind)?.setEnabled(on);
  }

  /**
   * Advance the rig to a crank angle (degrees). Flows animate by wall time scaled
   * to rpm (faster at higher revs); combustion/spark are crank-driven so they
   * fire in step with the four-stroke cycle. When stopped, motion freezes.
   */
  update(crankDeg: number, dtMs = 16, rpm = 1200, running = true): void {
    const theta = (crankDeg * Math.PI) / 180;
    this.crank.rotation.x = theta;

    const flowDt = running ? dtMs * Math.min(Math.max(rpm / 2400, 0.4), 5) : 0;
    for (const s of this.flows.values()) s.update(flowDt);

    for (let i = 0; i < this.cyls.length; i++) {
      const c = this.cyls[i]!;
      const eff = theta + (c.def.phase * Math.PI) / 180;
      const a = c.def.axisAngle;
      // Slider-crank along an axis at angle `a` (measured from +Y in the Y–Z plane).
      const rel = eff - a;
      const s = R * Math.cos(rel) + Math.sqrt(Math.max(L * L - R * R * Math.sin(rel) * Math.sin(rel), 0));
      const centre = new Vector3(c.def.x, 0, 0);
      const wristPin = centre.clone().add(c.axis.clone().multiplyScalar(s));
      const crankPin = centre.clone().add(new Vector3(0, R * Math.cos(eff), R * Math.sin(eff)));

      c.piston.position.copy(wristPin);
      c.piston.quaternion.setFromUnitVectors(Y, c.axis);

      // Rod: span crankPin → wristPin.
      const dir = wristPin.clone().sub(crankPin);
      const len = dir.length();
      c.rod.position.copy(crankPin).addScaledVector(dir, 0.5);
      c.rod.quaternion.setFromUnitVectors(Y, dir.normalize());
      c.rod.scale.y = len / L;

      // Combustion: a real flash + expanding flame front on the power stroke, with
      // a sharp spark at ignition. Crank-driven (so it tracks the firing order).
      const cyc = ((crankDeg + c.def.phase) % 720 + 720) % 720;
      let burn = 0;
      let sparkAmt = 0;
      if (this.combustion && running) {
        if (cyc >= 350 && cyc <= 520) {
          const t = (cyc - 350) / 170; // 0 at ignition → 1 at end of power stroke
          burn = Math.pow(Math.max(0, 1 - t), 1.4); // quick flash, then decay
        }
        if (cyc >= 348 && cyc <= 372) sparkAmt = Math.max(0, 1 - Math.abs(cyc - 360) / 12);
      }
      const fl = this.flames[i]!;
      fl.flameMat.opacity = burn * 0.85;
      fl.flame.scale.setScalar(0.5 + burn * 1.5);
      fl.sparkMat.opacity = sparkAmt;
      fl.spark.scale.setScalar(0.6 + sparkAmt * 0.9);

      // Subtle heat glow on the piston crown during the burn.
      c.pistonMat.emissive.setHex(burn > 0.04 ? 0xff5a1e : 0x000000);
      c.pistonMat.emissiveIntensity = burn * 1.3;
    }
  }

  state(crankDeg: number, rpm: number, running: boolean): EngineState {
    return {
      rpm,
      running,
      cylinders: this.cyls.map((c, i) => {
        const { stroke, firing } = strokeFor(crankDeg + c.def.phase);
        return { index: i + 1, bank: c.def.bank, stroke, firing };
      }),
    };
  }

  setVisible(v: boolean): void {
    this.group.visible = v;
  }

  dispose(): void {
    for (const d of this.disposables) d.dispose();
    for (const s of this.flows.values()) s.dispose();
    this.group.removeFromParent();
  }
}

export interface EngineState {
  rpm: number;
  running: boolean;
  cylinders: CylinderState[];
}

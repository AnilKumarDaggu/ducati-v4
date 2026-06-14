import {
  BoxGeometry,
  CylinderGeometry,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Vector3,
} from 'three';

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
  private readonly disposables: Array<{ dispose(): void }> = [];

  constructor() {
    this.build();
    this.group.visible = false;
  }

  private mat(opts: ConstructorParameters<typeof MeshStandardMaterial>[0]): MeshStandardMaterial {
    const m = new MeshStandardMaterial(opts);
    this.disposables.push(m);
    return m;
  }

  private build(): void {
    const steel = this.mat({ color: 0x9a9ea6, metalness: 1, roughness: 0.28, envMapIntensity: 1.4 });
    const darkSteel = this.mat({ color: 0x4a4d54, metalness: 1, roughness: 0.4 });
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
      const axis = new Vector3(0, Math.cos(def.axisAngle), Math.sin(def.axisAngle)).normalize();

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

      // Piston.
      const pistonGeo = new CylinderGeometry(BORE, BORE, 34, 28);
      const pistonMat = this.mat({ color: 0xbfc4cc, metalness: 1, roughness: 0.22, envMapIntensity: 1.5 });
      const piston = new Mesh(pistonGeo, pistonMat);
      this.disposables.push(pistonGeo);
      this.group.add(piston);

      // Connecting rod (thin cylinder, re-oriented each frame).
      const rodGeo = new CylinderGeometry(5, 6, L, 16);
      const rod = new Mesh(rodGeo, steel);
      this.disposables.push(rodGeo);
      this.group.add(rod);

      this.cyls.push({ def, axis, piston, pistonMat, rod });
    }
  }

  /** Advance the rig to a crank angle (degrees). Pure function of angle. */
  update(crankDeg: number): void {
    const theta = (crankDeg * Math.PI) / 180;
    this.crank.rotation.x = theta;

    for (const c of this.cyls) {
      const eff = theta + (c.def.phase * Math.PI) / 180;
      const a = c.def.axisAngle;
      // Slider-crank along an axis at angle `a` (measured from +Y in the Y–Z plane).
      const rel = eff - a;
      const s = R * Math.cos(rel) + Math.sqrt(Math.max(L * L - R * R * Math.sin(rel) * Math.sin(rel), 0));
      const centre = new Vector3(c.def.x, 0, 0);
      const wristPin = centre.clone().add(c.axis.clone().multiplyScalar(s));
      const crankPin = centre
        .clone()
        .add(new Vector3(0, R * Math.cos(eff), R * Math.sin(eff)));

      c.piston.position.copy(wristPin);
      c.piston.quaternion.setFromUnitVectors(Y, c.axis);

      // Rod: span crankPin → wristPin.
      const dir = wristPin.clone().sub(crankPin);
      const len = dir.length();
      c.rod.position.copy(crankPin).addScaledVector(dir, 0.5);
      c.rod.quaternion.setFromUnitVectors(Y, dir.normalize());
      c.rod.scale.y = len / L;

      // Combustion flash on the power stroke.
      const { firing } = strokeFor(crankDeg + c.def.phase);
      c.pistonMat.emissive.setHex(firing ? 0xff5a1e : 0x000000);
      c.pistonMat.emissiveIntensity = firing ? 1.4 : 0;
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
    this.group.removeFromParent();
  }
}

export interface EngineState {
  rpm: number;
  running: boolean;
  cylinders: CylinderState[];
}

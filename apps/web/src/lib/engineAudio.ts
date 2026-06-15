/**
 * EngineAudio — a procedural, RPM-reactive V4 engine voice (Web Audio API).
 *
 * Honest note: this is SYNTHESIZED, not a recording of a real Ducati (their
 * audio is copyrighted). It models the engine note from first principles: a
 * four-stroke V4 fires twice per crank revolution, so the firing fundamental is
 * rpm/30 Hz (40 Hz at 1,200 → 400 Hz at 12,000). Sawtooth oscillators at that
 * fundamental (plus an octave and a sub) run through a soft-clip waveshaper for
 * grit and a resonant low-pass that opens with revs, with intake/exhaust hiss on
 * top. Default muted; the AudioContext is only created on the user's gesture.
 */
export class EngineAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private oscs: OscillatorNode[] = [];
  private noiseGain: GainNode | null = null;
  private enabled = false;
  private running = false;
  private rpm = 1200;

  /** Lazily build the graph. Must be called from a user gesture (resume()s ctx). */
  private ensure(): boolean {
    if (this.ctx) return true;
    if (typeof window === 'undefined') return false;
    const Ctx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return false;

    const ctx = new Ctx();
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 500;
    filter.Q.value = 6;

    const shaper = ctx.createWaveShaper();
    shaper.curve = EngineAudio.driveCurve(2.4);
    shaper.oversample = '2x';

    filter.connect(shaper);
    shaper.connect(master);

    const f = this.firingFreq();
    // Sub rumble, fundamental growl, and an octave bite — detuned for richness.
    const specs: Array<{ mult: number; type: OscillatorType; gain: number; detune: number }> = [
      { mult: 0.5, type: 'sawtooth', gain: 0.5, detune: 0 },
      { mult: 1, type: 'sawtooth', gain: 0.7, detune: -7 },
      { mult: 1, type: 'sawtooth', gain: 0.6, detune: 8 },
      { mult: 2, type: 'square', gain: 0.22, detune: 0 },
    ];
    for (const s of specs) {
      const osc = ctx.createOscillator();
      osc.type = s.type;
      osc.frequency.value = f * s.mult;
      osc.detune.value = s.detune;
      const g = ctx.createGain();
      g.gain.value = s.gain;
      osc.connect(g);
      g.connect(filter);
      osc.start();
      this.oscs.push(osc);
      // remember the multiplier on the node for retuning
      (osc as OscillatorNode & { _mult?: number })._mult = s.mult;
    }

    // Intake/exhaust hiss: looping white noise, band-limited, scales with revs.
    const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuf;
    noise.loop = true;
    const noiseBp = ctx.createBiquadFilter();
    noiseBp.type = 'bandpass';
    noiseBp.frequency.value = 1600;
    noiseBp.Q.value = 0.7;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0;
    noise.connect(noiseBp);
    noiseBp.connect(noiseGain);
    noiseGain.connect(master);
    noise.start();

    this.ctx = ctx;
    this.master = master;
    this.filter = filter;
    this.noiseGain = noiseGain;
    this.applyRpm(0); // set frequencies/cutoff for the current rpm immediately
    return true;
  }

  private firingFreq(): number {
    // Four-stroke V4: 2 firing events per crank revolution → rpm/60 * 2 = rpm/30.
    return Math.max(this.rpm / 30, 12);
  }

  private applyRpm(ramp = 0.08): void {
    if (!this.ctx || !this.filter || !this.noiseGain) return;
    const t = this.ctx.currentTime;
    const f = this.firingFreq();
    for (const osc of this.oscs) {
      const mult = (osc as OscillatorNode & { _mult?: number })._mult ?? 1;
      osc.frequency.setTargetAtTime(f * mult, t, ramp);
    }
    this.filter.frequency.setTargetAtTime(360 + this.rpm * 0.16, t, ramp);
    const noiseLevel = this.enabled && this.running ? 0.015 + (this.rpm / 14000) * 0.05 : 0;
    this.noiseGain.gain.setTargetAtTime(noiseLevel, t, ramp);
  }

  private applyLevel(): void {
    if (!this.ctx || !this.master) return;
    const t = this.ctx.currentTime;
    const target = this.enabled && this.running ? 0.16 : 0;
    this.master.gain.setTargetAtTime(target, t, 0.12);
  }

  /** Toggle the sound on/off (mute). Creating the graph requires a gesture. */
  setEnabled(on: boolean): void {
    this.enabled = on;
    if (on) {
      if (!this.ensure()) return;
      void this.ctx?.resume();
    }
    this.applyRpm();
    this.applyLevel();
  }

  setRunning(on: boolean): void {
    this.running = on;
    this.applyRpm();
    this.applyLevel();
  }

  setRpm(rpm: number): void {
    this.rpm = rpm;
    this.applyRpm();
  }

  dispose(): void {
    for (const osc of this.oscs) {
      try {
        osc.stop();
      } catch {
        /* already stopped */
      }
    }
    this.oscs = [];
    void this.ctx?.close();
    this.ctx = null;
  }

  /** Soft-clip transfer curve → harmonic grit without harsh digital clipping. */
  private static driveCurve(amount: number): Float32Array<ArrayBuffer> {
    const n = 1024;
    const curve = new Float32Array(new ArrayBuffer(n * 4));
    for (let i = 0; i < n; i++) {
      const x = (i / (n - 1)) * 2 - 1;
      curve[i] = Math.tanh(x * amount);
    }
    return curve;
  }
}

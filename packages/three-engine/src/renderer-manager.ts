import { WebGLRenderer } from 'three';

export interface RendererInfo {
  backend: 'webgpu' | 'webgl2';
  /** The renderer instance; typed loosely because WebGPURenderer is a dynamic import. */
  renderer: WebGLRenderer | unknown;
}

export interface RendererOptions {
  /**
   * Prefer the WebGL2 renderer even when WebGPU is available. The mature
   * EffectComposer post stack (SAO/bloom/outline) is WebGL-only, so the OFFICINA
   * hero opts into WebGL2 for V1 visual quality. Re-evaluate when WebGPU's
   * node-based post-processing matures (ADR-012 is unaffected — that governs
   * vanilla-three vs R3F, not the backend choice).
   */
  preferWebGL2?: boolean;
}

/**
 * RendererManager — RDM-003 Sprint 1 task 2.
 * WebGPU where available, automatic WebGL2 fallback. WebGL2 is the QA floor
 * (RDM-001 §2.6); WebGPU issues are logged, never blocking.
 */
export class RendererManager {
  static async create(canvas: HTMLCanvasElement, opts: RendererOptions = {}): Promise<RendererInfo> {
    if (!opts.preferWebGL2 && (await RendererManager.webgpuAvailable())) {
      try {
        // Dynamic import keeps the WebGPU path out of the WebGL2 bundle path.
        const { default: WebGPURenderer } = await import('three/webgpu').then((m) => ({
          default: m.WebGPURenderer,
        }));
        const renderer = new WebGPURenderer({ canvas, antialias: true });
        await renderer.init();
        return { backend: 'webgpu', renderer };
      } catch (err) {
        // Fall through to WebGL2 — log, don't block (QA-floor policy).
        console.warn('[dtea] WebGPU init failed; falling back to WebGL2', err);
      }
    }
    const renderer = new WebGLRenderer({ canvas, antialias: true });
    return { backend: 'webgl2', renderer };
  }

  private static async webgpuAvailable(): Promise<boolean> {
    const gpu = (navigator as Navigator & { gpu?: { requestAdapter(): Promise<unknown> } }).gpu;
    if (!gpu) return false;
    try {
      return (await gpu.requestAdapter()) !== null;
    } catch {
      return false;
    }
  }
}

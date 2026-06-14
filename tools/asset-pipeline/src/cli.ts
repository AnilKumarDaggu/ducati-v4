/**
 * dtea-assets — asset pipeline CLI (ARCH-002 §8, RDM-003 S1 task 5).
 *
 * Runs the full chain on a representative procedural asset:
 *   generate → lint → inject → optimize (prune/weld/draco) → manifest → write
 * Scan-derived GLBs reuse the same stages.
 *   standin → the single test bolt (pipeline acceptance)
 *   engine  → the engine HERO assembly (the product viewport)
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Document, NodeIO } from '@gltf-transform/core';
import { KHRDracoMeshCompression } from '@gltf-transform/extensions';
import draco3d from 'draco3dgltf';
import { createStandinBolt } from './standin.js';
import { createStandinEngine } from './engine.js';
import {
  buildManifestEntry,
  injectMetadata,
  lintDocument,
  optimizeDocument,
  type AssetManifest,
} from './stages.js';

function arg(name: string, fallback: string): string {
  const i = process.argv.indexOf(`--${name}`);
  const value = i >= 0 ? process.argv[i + 1] : undefined;
  return value ?? fallback;
}

interface PipelineSpec {
  label: string;
  assemblyId: string;
  doc: Document;
  budget: 'fastener' | 'default';
}

async function runPipeline(spec: PipelineSpec): Promise<void> {
  const outDir = resolve(arg('out', '../../apps/web/public/assets'));
  const componentsPath = resolve(arg('components', '../../content/components.json'));
  const catalog = JSON.parse(await readFile(componentsPath, 'utf-8')) as unknown;

  console.log(`[dtea-assets] generate: ${spec.label}`);
  const { doc } = spec;

  console.log('[dtea-assets] stage 1/4: lint');
  const lint = lintDocument(doc, catalog, spec.budget);
  if (!lint.ok) {
    for (const e of lint.errors) console.error(`  ✗ ${e}`);
    process.exit(1);
  }

  console.log('[dtea-assets] stage 2/4: inject metadata');
  const injected = injectMetadata(doc, catalog);
  console.log(`  injected: ${injected.join(', ')}`);

  console.log('[dtea-assets] stage 3/4: optimize (prune → weld → draco)');
  await optimizeDocument(doc);

  console.log('[dtea-assets] stage 4/4: write + manifest');
  const io = new NodeIO()
    .registerExtensions([KHRDracoMeshCompression])
    .registerDependencies({ 'draco3d.encoder': await draco3d.createEncoderModule({}) });
  const glb = await io.writeBinary(doc);

  const entry = buildManifestEntry(spec.assemblyId, glb, injected);
  const manifest: AssetManifest = { generatedAt: new Date().toISOString(), assets: [entry] };

  await mkdir(outDir, { recursive: true });
  await writeFile(resolve(outDir, entry.file), glb);
  await writeFile(resolve(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

  console.log(`[dtea-assets] done: ${entry.file} (${entry.bytes} bytes, ${injected.length} parts)`);
}

const command = process.argv[2];
switch (command) {
  case 'standin':
    await runPipeline({ label: 'procedural stand-in bolt', assemblyId: 'standin', doc: createStandinBolt(), budget: 'fastener' });
    break;
  case 'engine':
    await runPipeline({ label: 'procedural engine hero', assemblyId: 'engine', doc: createStandinEngine(), budget: 'default' });
    break;
  default:
    console.log('usage: dtea-assets <standin|engine> [--out dir] [--components path]');
    process.exitCode = command ? 1 : 0;
}

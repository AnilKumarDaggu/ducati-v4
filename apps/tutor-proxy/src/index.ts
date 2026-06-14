import Fastify from 'fastify';
import cors from '@fastify/cors';

/**
 * Tutor proxy — RDM-003 Sprint 1 task 7: SSE hello-world end-to-end.
 *
 * Sprint 4 replaces the canned stream with:
 *   - context assembler (tutor_context.md + client scene snapshot + client-held history)
 *   - Claude tool-use round trip (claude-sonnet-4-6, 5 scene tools)
 *   - cite-or-decline post-processor against spec_records.json
 * Statelessness is a design constraint (RDM-002 §2): no sessions, no Redis —
 * the client sends everything needed on every request.
 */
const app = Fastify({ logger: true });

await app.register(cors, {
  origin: process.env['CORS_ORIGIN'] ?? 'http://localhost:5173',
});

app.get('/health', () => ({ ok: true, scope: 'valve-slice' }));

app.post('/tutor', (request, reply) => {
  reply.raw.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  // Canned stream proving the SSE path. Sprint 4 wires Claude here.
  const chunks = [
    'Hello from the DTEA tutor proxy. ',
    'This is the Sprint 1 canned stream — ',
    'Claude tool-use arrives in Sprint 4 (DTEA-RDM-003).',
  ];
  let i = 0;
  const timer = setInterval(() => {
    const chunk = chunks[i];
    if (chunk === undefined) {
      reply.raw.write('event: done\ndata: {}\n\n');
      clearInterval(timer);
      reply.raw.end();
      return;
    }
    reply.raw.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
    i += 1;
  }, 150);

  request.raw.on('close', () => clearInterval(timer));
});

const port = Number(process.env['PORT'] ?? 8787);
await app.listen({ port, host: '0.0.0.0' });

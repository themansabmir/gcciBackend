// ────────────────────────────────────────────────────────────
// src/index.ts   (entry for both local & Vercel)
// ────────────────────────────────────────────────────────────
import 'tsconfig-paths/register';
import http from 'http';
import dotenv from 'dotenv';

import app from './app';
import { connectToDatabase } from './config/db';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

/**
 * 1.  Always export the Express instance.
 *     ↪︎  Vercel’s @vercel/node builder will wrap it inside
 *        a serverless handler automatically.
 */
export default app;

/**
 * 2.  Only create an HTTP server **when NOT on Vercel**.
 *     Vercel sets the env‑var `VERCEL=true`.
 */
if (false) {
  let server: http.Server;

  (async () => {
    try {
      // Optional: connect to DB only for long‑lived local server.
      // await connectToDatabase();

      server = app.listen(PORT, () => {
        console.log(`🚀  Server running at http://localhost:${PORT}`);
      });

      // ── Runtime‑error guards ───────────────────────────────
      process.on('unhandledRejection', (reason) => {
        console.error('UNHANDLED REJECTION:', reason);
        shutdown(1);
      });

      process.on('uncaughtException', (error) => {
        console.error('UNCAUGHT EXCEPTION:', error);
        shutdown(1);
      });

      // ── Graceful shutdown signals ─────────────────────────
      ['SIGINT', 'SIGTERM'].forEach((sig) => process.on(sig, () => shutdown(0)));
    } catch (err) {
      console.error('❌  Error starting server:', err);
      shutdown(1);
    }

    function shutdown(code: number) {
      console.log('🛑  Shutting down...');
      if (server) {
        server.close(() => {
          console.log('✅  HTTP server closed');
          // Optionally close DB connections here
          process.exit(code);
        });
      } else {
        process.exit(code);
      }
    }
  })();
}

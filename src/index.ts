import http from 'http';
import dotenv from 'dotenv';

import app from './app';
import { connectToDatabase } from './config/db';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

let server: http.Server;

(async () => {
  try {
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('MONGODB_URI:', process.env.MONGODB_URI);
    await connectToDatabase();

    server = app.listen(PORT, () => {
      console.log(`🚀  Server running at http://localhost:${PORT}`);
    });

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
        process.exit(code);
      });
    } else {
      process.exit(code);
    }
  }
})();

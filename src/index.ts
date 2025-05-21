// src/server.ts
import http from "http";
import app from "./app";
import { connectToDatabase } from "./config/db";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;
let server: http.Server;

async function startServer() {
  try {
    await connectToDatabase();

    server = app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });

    // Handle unexpected errors
    process.on("unhandledRejection", (reason) => {
      console.error("UNHANDLED REJECTION:", reason);
      shutdown(1);
    });

    process.on("uncaughtException", (error) => {
      console.error("UNCAUGHT EXCEPTION:", error);
      shutdown(1);
    });

    // Handle graceful shutdown
    process.on("SIGINT", () => shutdown(0)); // Ctrl+C
    process.on("SIGTERM", () => shutdown(0)); // kill process
  } catch (err) {
    console.error("❌ Error starting server:", err);
    shutdown(1);
  }
}

function shutdown(code: number) {
  console.log("🛑 Shutting down...");
  if (server) {
    server.close(() => {
      console.log("✅ HTTP server closed");
      // Optional: close DB connection here
      process.exit(code);
    });
  } else {
    process.exit(code);
  }
}

startServer();

// src/index.ts
// library imports
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
// ALL MIDDLEWARES
import { errorHandler } from "@middleware/error-handler";

// ALL FEATURE ROUTES
import teamRouter from "@features/team/team.route";
import airportRouter from "@features/airport/airport.route";
import vendorRouter from "@features/vendor/vendor.route";
dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());

// APP ROUTES
app.use("/api", teamRouter);
app.use("/api", airportRouter);
app.use("/api/vendor", vendorRouter);

// GLOBAL ERROR HANDLER
app.use(errorHandler);

export default app;

// src/index.ts
// library imports
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
// ALL MIDDLEWARES
import { errorHandler } from '@middleware/error-handler';

// ALL FEATURE ROUTES
import teamRouter from '@features/team/team.route';
import airportRouter from '@features/airport/airport.route';
import vendorRouter from '@features/vendor/vendor.route';
import authRouter from 'auth/auth.router';
import portRouter from '@features/port/port.route';
import shipmentRouter from '@features/shipment/shipment.router';
import { validateToken } from '@middleware/routeProtector';
import mblRouter from '@features/mbl/mbl.route';
dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());

// APP ROUTES
app.use('/api', authRouter);
app.use('/api/shipment', validateToken, shipmentRouter);
app.use('/api/team', teamRouter);
app.use('/api/vendor', vendorRouter);
app.use('/api/airport', airportRouter);
app.use('/api/port', portRouter);
app.use('/api/mbl', validateToken, mblRouter);

// GLOBAL ERROR HANDLER
app.use(errorHandler);

export default app;

// src/index.ts
// library imports
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
// ALL MIDDLEWARES
// import { errorHandler } from '@middleware/error-handler';

// ALL FEATURE ROUTES
import teamRouter from '@features/team/team.route';
import airportRouter from '@features/airport/airport.route';
import vendorRouter from '@features/vendor/vendor.route';
import authRouter from 'auth/auth.router';
import portRouter from '@features/port/port.route';
import shipmentRouter from '@features/shipment/shipment.router';
import { validateToken } from '@middleware/routeProtector';
import mblRouter from '@features/mbl/mbl.route';
import hblRouter from '@features/hbl/hbl.router';
import { errorHandler } from '@middleware/error-handler';
// import { apiLogger } from '@middleware/api-logger';
import { generalLimiter, authLimiter } from '@middleware/rate-limiter';
import invoiceItemRouter from '@features/invoicefield/invoiceitem.route';
import financeRouter from '@features/finance/finance.route';
import excelRouter from '@features/excel/excel.route';
import rateSheetMasterRouter from '@features/ratemaster/ratemaster.route';
import customerRouter from '@features/customer/customer.route';
import quotationRouter from '@features/quotation/quotation.route';
dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());

// Global Rate Limiter - Apply to all requests
// app.use(generalLimiter);

// Global API Logger Middleware
// app.use(apiLogger);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'GCO Backend API is running!' });
});
// APP ROUTES
// Auth routes with strict rate limiting to prevent brute force
app.use('/api', authRouter);
app.use('/api/shipment', validateToken, shipmentRouter);
app.use('/api/team', validateToken, teamRouter);
app.use('/api/vendor', vendorRouter);
app.use('/api/airport', validateToken, airportRouter);
app.use('/api/port', portRouter);
app.use('/api/mbl', validateToken, mblRouter);
app.use('/api/hbl', validateToken, hblRouter);
app.use('/api/invoiceitem', validateToken, invoiceItemRouter);
app.use('/api/finance', financeRouter);
app.use('/api/excel', excelRouter);
app.use('/api/rate-sheet', rateSheetMasterRouter);
app.use('/api/customer', customerRouter);
app.use('/api/quotation', quotationRouter);

// GLOBAL ERROR HANDLER
app.use(errorHandler);

export default app;

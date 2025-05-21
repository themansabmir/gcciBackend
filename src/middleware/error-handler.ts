// src/common/middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";
// import { AppError } from "../errors/AppError";
import mongoose from "mongoose";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Default values
  let statusCode = 500;
  let message = "Internal Server Error";

//   // If it's an instance of our AppError
  if (err instanceof Error) {
    statusCode = 400;
    message = err.message;
  }

  // Handle Mongoose Validation Error
  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // MongoDB duplicate key error
  if ((err as any).code === 11000 && (err as any).name === "MongoServerError") {
    statusCode = 409;
    const key = Object.keys((err as any).keyValue).join(", ");
    message = `Duplicate value for field(s): ${key}`;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

import { Response } from "express";

interface SuccessResponseParams {
  res: Response;
  message: string;
  data?: any;        // ✅ added
  response?: any;    // optional legacy support
  total?: number;
  statusCode?: number;
}

export const successResponse = ({
                                  res,
                                  message,
                                  data,
                                  response,
                                  total,
                                  statusCode = 200,
                                }: SuccessResponseParams): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data: data ?? response ?? null,  // ✅ use either key safely
    total,
  });
};

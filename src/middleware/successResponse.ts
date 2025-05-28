import { Response } from 'express';

export const successResponse = (responseHandler: { res: Response; message: string; response?: any; total?: number }) => {
  const { res, response, message, total } = responseHandler;
  res.status(200).json({ message, response: response ?? null, total: total });
};

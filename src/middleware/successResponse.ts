import { Response } from 'express';

export const successResponse = (responseHandler: { res: Response; message: string; response?: any }) => {
  const { res, response, message } = responseHandler;
  res.status(200).json({ message, response: response ?? null });
};

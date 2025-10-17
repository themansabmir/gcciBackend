import JwtService from '@lib/jwt';
import { NextFunction, Request, Response } from 'express';
import { JWT_PAYLOAD } from './express';
import { Logger } from '@lib/logger';

const jwtService = new JwtService(); // Create once, not per request

export async function validateToken(req: Request<any, any, any>, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  'Bearer 234234232342342342'
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authorization header missing or invalid' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = (await jwtService.verify(token)) as unknown as JWT_PAYLOAD;
    if (!decoded.is_active) throw new Error('Your profile is not active anymore');

    if (req.body) {
      req.body['created_by'] = decoded?.id;
    }

    req.user = decoded;
    next();
  } catch (error) {
    Logger.error('Invalid or expired token', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export const permissionCheck = (permission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      Logger.info('Decoded User', user);
      if (user?.role === 'admin') return next();
      const available_permissions = user?.permissions;
      if (!available_permissions?.length || available_permissions.length < 1 || !available_permissions?.includes(permission))
        throw new Error('Please ask system administrator to grant you permission');
      next();
    } catch (error) {
      next(error);
    }
  };
};

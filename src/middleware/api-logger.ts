import { Request, Response, NextFunction } from 'express';
import { Logger } from '@lib/logger';

/**
 * API Logger Middleware
 * Logs all incoming HTTP requests and outgoing responses with timing information
 */
export const apiLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  // Log incoming request
  Logger.info('Incoming API Request', {
    method: req.method,
    url: req.url,
    path: req.path,
    query: req.query,
    body: req.body,
    headers: {
      'user-agent': req.headers['user-agent'],
      'content-type': req.headers['content-type'],
      'authorization': req.headers.authorization ? '[REDACTED]' : undefined,
    },
    ip: req.ip || req.socket.remoteAddress,
  });

  // Capture the original res.json method
  const originalJson = res.json.bind(res);
  
  // Override res.json to log response
  res.json = function (body: any) {
    const duration = Date.now() - startTime;
    
    Logger.info('Outgoing API Response', {
      method: req.method,
      url: req.url,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      responseBody: body,
    });
    
    return originalJson(body);
  };

  // Capture the original res.send method
  const originalSend = res.send.bind(res);
  
  // Override res.send to log response
  res.send = function (body: any) {
    const duration = Date.now() - startTime;
    
    Logger.info('Outgoing API Response', {
      method: req.method,
      url: req.url,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      responseBody: body,
    });
    
    return originalSend(body);
  };

  // Log when response finishes (for cases where neither json nor send is called)
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    // Only log if we haven't already logged via json/send
    if (!res.headersSent) {
      Logger.info('API Response Finished', {
        method: req.method,
        url: req.url,
        path: req.path,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
      });
    }
  });

  next();
};

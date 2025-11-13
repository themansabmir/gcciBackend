import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import { Logger } from '@lib/logger';

/**
 * Custom rate limit handler that logs violations
 */
const rateLimitHandler = (req: Request, res: Response) => {
  Logger.warn('Rate limit exceeded', {
    ip: req.ip,
    path: req.path,
    method: req.method,
    userAgent: req.headers['user-agent'],
  });

  res.status(429).json({
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: res.getHeader('Retry-After'),
  });
};

/**
 * Skip rate limiting for successful requests (only count failures)
 * Useful for login endpoints to prevent brute force
 */
const skipSuccessfulRequests = (req: Request, res: Response) => {
  return res.statusCode < 400;
};

/**
 * General API rate limiter
 * Applies to all API routes
 * 
 * Limits: 100 requests per 15 minutes per IP
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: rateLimitHandler,
  // Skip counting successful requests
  skip: (req) => {
    // Don't count requests to health check or static assets
    return req.path === '/' || req.path.startsWith('/health');
  },
});

/**
 * Strict rate limiter for authentication endpoints
 * Prevents brute force attacks on login/signup
 * 
 * Limits: 5 failed attempts per 15 minutes per IP
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 failed login attempts per windowMs
  message: 'Too many login attempts from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  // Only count failed requests (status >= 400)
  skipSuccessfulRequests: true,
});

/**
 * Moderate rate limiter for data creation endpoints
 * Prevents spam and abuse
 * 
 * Limits: 20 requests per 15 minutes per IP
 */
export const createLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 create requests per windowMs
  message: 'Too many create requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

/**
 * Strict rate limiter for file upload endpoints
 * Prevents abuse of upload functionality
 * 
 * Limits: 10 uploads per hour per IP
 */
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 uploads per hour
  message: 'Too many file uploads, please try again after an hour',
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

/**
 * Very strict rate limiter for password reset endpoints
 * Prevents abuse of password reset functionality
 * 
 * Limits: 3 requests per hour per IP
 */
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password reset requests per hour
  message: 'Too many password reset attempts, please try again after an hour',
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

/**
 * Lenient rate limiter for read-only endpoints
 * Allows more requests for GET operations
 * 
 * Limits: 200 requests per 15 minutes per IP
 */
export const readLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 read requests per windowMs
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  // Only apply to GET requests
  skip: (req) => req.method !== 'GET',
});

/**
 * API key based rate limiter (for future use with API keys)
 * Uses API key instead of IP for rate limiting
 */
export const apiKeyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Higher limit for authenticated API keys
  message: 'API rate limit exceeded',
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  // Use API key from header for rate limiting
  keyGenerator: (req) => {
    return req.headers['x-api-key'] as string || req.ip || 'unknown';
  },
});

/**
 * Export all limiters for easy import
 */
export default {
  general: generalLimiter,
  auth: authLimiter,
  create: createLimiter,
  upload: uploadLimiter,
  passwordReset: passwordResetLimiter,
  read: readLimiter,
  apiKey: apiKeyLimiter,
};

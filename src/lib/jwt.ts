import { JWT_SECRET } from '@config/env';
import jwt, { Secret, SignOptions, VerifyOptions } from 'jsonwebtoken';

export default class JwtService {
  private secret: Secret;
  private signOptions: SignOptions;
  private verifyOptions: VerifyOptions;

  constructor() {
    //  Get JWT secret from environment variables.  Crucial for security.
    this.secret = JWT_SECRET || 'defaultSecret'; // Fallback, but MUST be in .env

    this.signOptions = {
      expiresIn: '1d',
      algorithm: 'HS256', // Default algorithm
    };
    this.verifyOptions = {
      algorithms: ['HS256'],
    };
  }

  /**
   * Generates a JWT token for a given payload.
   * @param payload - The data to be included in the token.
   * @param options - Optional signing options.
   * @returns A Promise that resolves to the JWT token string.
   */
  async generateToken(payload: Record<string, any>, options: SignOptions = {}): Promise<string> {
    const combinedOptions = { ...this.signOptions, ...options };
    return new Promise((resolve, reject) => {
      jwt.sign(payload, this.secret, combinedOptions, (err, token) => {
        if (err) {
          reject(err);
        } else if (token) {
          resolve(token);
        } else {
          reject(new Error('Token not generated'));
        }
      });
    });
  }

  /**
   * Verifies a JWT token.
   * @param token - The JWT token to verify.
   * @param options - Optional verification options.
   * @returns A Promise that resolves to the decoded payload if the token is valid.
   * Rejects with an error if the token is invalid or expired.
   */
  async verify(token: string, options: VerifyOptions = {}): Promise<any> {
    const combinedOptions = { ...this.verifyOptions, ...options };
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.secret, combinedOptions, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });
  }

  /**
   * Decodes a JWT token without verifying its signature.
   * @param token - The JWT token to decode.
   * @returns The decoded payload, or null if the token is invalid.
   */
  decode(token: string): any | null {
    return jwt.decode(token);
  }

    /**
     * Express.js middleware to authenticate JWT tokens from the Authorization header.
     * This is a convenience method to easily protect your routes.
     * @param req - Express Request object.
     * @param res - Express Response object.
     * @param next - Express NextFunction.
     */
    // authenticateToken = async (
    //   req: Request,
    //   res: Response,
    //   next: NextFunction
    // ) => {
    //   const authHeader = req.headers.authorization;
    //   if (authHeader) {
    //     const token = authHeader.split(" ")[1];
    //     if (token) {
    //       try {
    //         const decoded = await this.verify(token);

    //         next();
    //       } catch (error) {
    //         // Token is invalid or expired
    //         res.status(401).json({ message: "Invalid or expired token" });
    //       }
    //     } else {
    //       res
    //         .status(401)
    //         .json({ message: "Authorization header is missing the token" });
    //     }
    //   } else {
    //     res.status(401).json({ message: "Authorization header is missing" });
    //   }
    // };
}


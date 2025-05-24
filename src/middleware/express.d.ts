// src/types/express.d.ts
import { Request } from 'express';


export interface JWT_PAYLOAD {
  id: string;
  email: string;
    role: string;
    is_active: boolean;
    permissions:string[]
  [key: string]: any;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: JWT_PAYLOAD; // Make it optional, as it might not exist before routeProtector runs
  }
}

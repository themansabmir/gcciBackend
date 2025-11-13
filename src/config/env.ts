import dotenv from "dotenv";
dotenv.config();
const env = process.env.NODE_ENV ?? "development";
const production_database_uri = process.env.PROD_MONGO_URI


// db
const dbConnections: Record<string, string> = {

  development: 'mongodb://localhost:27017/freightdex-dev',
  staging: 'mongodb://staging-db-host:27017/freightdex-staging',
  production: production_database_uri ??''

};
export const MONGO_URI = dbConnections[env] || dbConnections.development;

// jwt
export const JWT_SECRET = process.env.JWT_SECRET ?? "jwtsecret";

// email
export const EMAIL_HOST = process.env.EMAIL_HOST ?? 'smtp.ethereal.email';
export const EMAIL_PORT = process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : 587;
export const EMAIL_USER = process.env.EMAIL_USER ?? 'test@ethereal.email';
export const EMAIL_PASS = process.env.EMAIL_PASS ?? 'password';


// env
export const ENV = env;

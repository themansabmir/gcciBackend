import dotenv from "dotenv";
dotenv.config();
const env = process.env.NODE_ENV ?? "development";
const production_database_uri = process.env.PROD_MONGO_URI

// db
const dbConnections: Record<string, string> = {

  development: 'mongodb://127.0.0.1:27017/freightdex-dev',
  staging: 'mongodb://staging-db-host:27017/freightdex-staging',
  production: production_database_uri ??''

};
export const MONGO_URI = dbConnections[env] || dbConnections.development;

// jwt
export const JWT_SECRET = process.env.JWT_SECRET ?? "jwtsecret";

// env
export const ENV = env;

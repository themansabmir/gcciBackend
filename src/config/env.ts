const env = process.env.NODE_ENV || "development";

// db
const dbConnections: Record<string, string> = {
  development: "mongodb://127.0.0.1:27017/freightdex-dev",
  staging: "mongodb://staging-db-host:27017/freightdex-staging",
  production: "mongodb+srv://user:password@cluster.mongodb.net/freightdex-prod",
};
export const MONGO_URI = dbConnections[env] || dbConnections.development;

// jwt
export const JWT_SECRET = process.env.JWT_SECRET ?? "jwtsecret";

// env
export const ENV = env;

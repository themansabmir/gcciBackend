const env = process.env.NODE_ENV || "development";

// db
const dbConnections: Record<string, string> = {
  development: "mongodb://127.0.0.1:27017/freightdex-dev",
  staging: "",
  production: "",
};
export const MONGO_URI = dbConnections[env] || dbConnections.development;

// jwt
export const JWT_SECRET = process.env.JWT_SECRET ?? "jwtsecret";

// env
export const ENV = env;

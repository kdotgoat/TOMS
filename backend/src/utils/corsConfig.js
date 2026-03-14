import { ALLOWED_ORIGINS } from "../config.js"

const allowedOrigins = ALLOWED_ORIGINS.split(",")


export const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., Postman, curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed for this origin"));
    }
  },
  credentials: true,
};
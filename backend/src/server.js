import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import { connectDB, disconnectDB, prisma } from './utils/prisma.js';
import { authRoutes,staffRoutes } from './routes/routes.js';
dotenv.config();
const app = express();

//Middleware
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/staff", staffRoutes);



const PORT = process.env.PORT || 5000;
const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  // Graceful shutdown
  process.on("SIGTERM", async () => {
    console.log("SIGTERM received, shutting down gracefully");
    await disconnectDB();
    server.close(() => process.exit(0));
  });

  process.on("unhandledRejection", async (err) => {
    console.error("Unhandled Rejection:", err);
    await disconnectDB();
    server.close(() => process.exit(1));
  });

  process.on("uncaughtException", async (err) => {
    console.error("Uncaught Exception:", err);
    await disconnectDB();
    process.exit(1);
  });
 };

startServer();
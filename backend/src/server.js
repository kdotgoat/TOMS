import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { ALLOWED_ORIGINS } from './config.js';
import { connectDB, disconnectDB } from './utils/prisma.js';
import {
  authRoutes,
  staffRoutes,
  clothingRoute,
  orderRoute,
  paymentRoute,
  searchRoute,
  notificationRoute
} from './routes/routes.js';


dotenv.config();
const app = express();


// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: ALLOWED_ORIGINS.split(',').map(o => o.trim()),
  credentials: true,
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/orders", orderRoute);
app.use("/api/clothingTypes", clothingRoute);
app.use("/api/payments", paymentRoute);
app.use("/api/search", searchRoute);
app.use("/api/notifications", notificationRoute);


const PORT = process.env.PORT || 5000;

const startServer = async () => {

  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  process.on("SIGTERM", async () => {
    await disconnectDB();
    server.close(() => process.exit(0));
  });

};

startServer();
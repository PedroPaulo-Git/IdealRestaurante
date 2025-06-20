import express from "express";
import clientRoutes from "./routes/clienteRoutes";
import adminRouter from "./routes/adminRoutes";
import stripeRoutes from "./Services/StripeService";
import cors,{ CorsOptions } from "cors";
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const allowedOrigins = [
  "https://ideal-restaurante.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

// O tipo do origin é string | undefined
const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api", clientRoutes);
app.use("/api", stripeRoutes);
app.use("/admin", adminRouter);

export default app;

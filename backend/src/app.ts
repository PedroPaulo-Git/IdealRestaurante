import express from "express";
import clientRoutes from "./routes/clienteRoutes";
import adminRouter from "./routes/adminRoutes";
import stripeRoutes from "./Services/StripeService";
import cors from "cors";

const app = express();
const corsOptions = {
  origin: "https://ideal-restaurante.vercel.app", // Substitua pela origem permitida
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Inclua 'OPTIONS' aqui
  allowedHeaders: ["Content-Type", "Authorization"], // Inclua cabeçalhos permitidos se necessário
};

// Aplicar o middleware CORS com as opções configuradas
app.use(cors(corsOptions));
app.use(express.json());
app.use("/api", clientRoutes);
app.use("/api", stripeRoutes);
app.use("/admin", adminRouter);

export default app;

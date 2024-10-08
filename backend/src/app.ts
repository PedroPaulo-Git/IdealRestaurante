import express from 'express';
import clientRoutes from './Routes/clienteRoutes'; 
import stripeRoutes from './Services/StripeService'
import cors from 'cors';


const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', clientRoutes);
app.use('/api', stripeRoutes)

export default app;

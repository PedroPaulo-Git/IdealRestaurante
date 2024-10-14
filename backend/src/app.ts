import express from 'express';
import clientRoutes from './Routes/clienteRoutes'; 
import adminRoutes from './Routes/adminRoutes';
import stripeRoutes from './Services/StripeService'
import cors from 'cors';


const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', clientRoutes);
app.use('/api', stripeRoutes)
app.use('/admin', adminRoutes)

export default app;

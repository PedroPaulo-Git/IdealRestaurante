import express from 'express';
import clientRoutes from '../src/routes/clienteRoutes'; 
import cors from 'cors';


const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', clientRoutes);

export default app;

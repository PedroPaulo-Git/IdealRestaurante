import express from 'express';
import clientRoutes from '../src/routes/clienteRoutes'; 

const app = express();

app.use(express.json());
app.use((req, res, next) => {
    console.log(`${res.json}`);
    next();
});
app.use('/api', clientRoutes);

export default app;

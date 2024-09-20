import { Router,Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

router.post('/clients', async (req: Request, res: Response) => {
    console.log(req.body);
    const { firstName, lastName, email, phone, address, city, state, zipcode } = req.body;
  
    try {
      const client = await prisma.client.create({
        data: {
          firstName,
          lastName,
          email,
          phone,
          address,
          city,
          state,
          zipcode,
        },
      });
      res.json(client); // Return the created client
      
    } catch (error) {
      res.status(400).json({ error: 'Error creating client' });
    }
  });

  router.get('/clients', async (req: Request, res: Response) => {
    try {
      const clients = await prisma.client.findMany();
      res.json(clients);
      console.log(clients) // Return all clients
    } catch (error) {
      res.status(500).json({ error: 'Error fetching clients' });
    }
  });
  

  export default router;
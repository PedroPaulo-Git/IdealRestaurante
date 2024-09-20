import { Router,Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const router = Router();

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(req.body);
   // const { firstName, lastName,username,password,email, phone, address, city, state, zipcode } = req.body;
  
    try {
      const client_register = await prisma.client.create({
        data: {
            username,
            password:hashedPassword,
            email,
            firstName: "", // or null
            lastName: "",  // or null
            phone: "",     // or null
            address: "",   // or null
            city: "",      // or null
            state: "",     // or null
            zipcode: "",   // or null
        },
      });
      res.json(client_register); // Return the created client
      
    } catch (error) {
      res.status(400).json({ error: 'Error creating client' });
    }
    // Implement your registration logic (e.g., hash the password, save to database)
  });

router.post('/clients', async (req: Request, res: Response) => {
    console.log(req.body);
    const { firstName, lastName,username,password,email, phone, address, city, state, zipcode } = req.body;
  
    try {
      const client = await prisma.client.create({
        data: {
          firstName,
          lastName,
          username,
          password,
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
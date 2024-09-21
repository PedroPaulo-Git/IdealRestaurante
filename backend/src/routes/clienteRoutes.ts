import { Router,Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const router = Router();

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(req.body);
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

  });

//login router >>>>>>>>>>>>>>>>

router.post('/login',async (req:Request,res:Response)=>{
  const {email,password} = req.body
  try{
    const client = await prisma.client.findUnique({
      where: { email },
    });

    // CLIENT IS REGISTRED ?
    if (!client) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, client.password);
    // PASSWORD USER VALID ?
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    return res.json({ message: 'Login successful', client });



  }catch(error){
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Error during login' });
  }
})

router.post('/carrinho', async (req, res) => {
  const { clientId, productId, quantity } = req.body;
  try {
    // Check if an active cart exists for the client
    const existingCart = await prisma.cart.findFirst({
      where: {
        clientId,
      },
      include: {
        items: true, // Optionally include items for further processing
      },
    });

    let cart;

    if (existingCart) {
      // If a cart exists, you can choose to update it
      cart = await prisma.cart.update({
        where: { id: existingCart.id },
        data: {
          items: {
            upsert: {
              where:{ cartId_productId: { cartId: existingCart.id, productId } }, // Check if the item already exists in the cart
              update: {
                quantity: {
                  increment: quantity, // Increment the quantity if it exists
                },
              },
              create: {
                productId,
                quantity,
              },
            },
          },
        },
      });
      
    } else {
      // If no cart exists, create a new one
      cart = await prisma.cart.create({
        data: {
          clientId,
          items: {
            create: {
              productId,
              quantity,
            },
          },
        },
      });
    }
    res.json(cart);
  } catch (error) {
    res.status(400).json({ error: 'Error updating cart' });
  }
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
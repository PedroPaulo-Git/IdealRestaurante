import { Router,Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
//import { QrCodePix } from 'qrcode-pix';
import { NubankApi } from 'nubank-api';
import { v4 as uuidv4 } from 'uuid';
import { writeFile } from 'fs/promises';
import { createInterface } from "readline";

import bcrypt from 'bcrypt';


const CPF = '';
const PASSWORD = '';
const AUTH_CODE = uuidv4();

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter something: ', (answer) => {
  console.log(`You entered: ${answer}`);
  rl.close(); // Close the readline interface after usage
});
const apiNubank = new NubankApi();

const authenticateWithQRCode = async () => {
  const AUTH_CODE = uuidv4();
  console.log(`Generate a QR code and read it with the app: ${AUTH_CODE}`);
  try {
      await apiNubank.auth.authenticateWithQrCode(CPF, PASSWORD, AUTH_CODE);
      console.log("You are authenticated!");
      console.log(apiNubank.authState);
      await writeFile("./auth-state.json", JSON.stringify(apiNubank.authState));
  } catch (error) {
      console.error("Authentication error:", error);
  }
};

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


router.post('/carrinho/:clientId', async (req, res) => {
  const clientId = parseInt(req.params.clientId, 10);
  const { productId, quantity } = req.body;
  console.log('Received payload:', req.body);
  // Convert productId to a number
  const productIdNum = parseInt(productId, 10);

  if (isNaN(clientId) || isNaN(productIdNum) || quantity <= 0) {
      return res.status(400).json({ error: 'Invalid input parameters' });
  }

  try {
      // Check if an active cart exists for the client
      let cart = await prisma.cart.findFirst({
          where: { clientId },
          include: { items: true },
      });

      if (!cart) {
          console.log('CREATING A CART');
          cart = await prisma.cart.create({
              data: {
                  clientId,
                  items: {
                      create: {
                          productId: productIdNum, // Use the converted number
                          quantity,
                      },
                  },
              },
              include: { items: true },
          });
      } else {
        console.log('UPDATING A CART');
        // Check if the item already exists in the cart
        const existingItem = cart.items.find(item => item.productId === productIdNum);

        if (existingItem) {
            // Update the quantity of the existing item
            const updatedItem = await prisma.cartItem.update({
                where: { id: existingItem.id }, // Assuming your item has an id
                data: { quantity: existingItem.quantity + 1 },
            });
            console.log('Updated item:', updatedItem);
            cart = await prisma.cart.findFirst({
                where: { clientId },
                include: { items: true },
            });
        } else {
            // Add the new item to the cart
            const newItem = await prisma.cartItem.create({
                data: {
                    cartId: cart.id, // Assuming you have the cart's ID
                    productId: productIdNum,
                    quantity,
                },
            });
            console.log('New item added:', newItem);
            cart = await prisma.cart.findFirst({
                where: { clientId },
                include: { items: true },
            });
        }
      }

      return res.json(cart);
  } catch (error) {
      console.error("Error updating cart:", error);
      return res.status(400).json({ error: 'Error updating cart' });
  }
});


router.post('/address/:clientId', async (req, res) => {
  const { firstName,lastName,phone,address,city,state,zipcode } = req.body;
  console.log('Received payload:', req.body);
  const { clientId } = req.params
  try {
  const savedAddress = await prisma.client.update({
    where: {
      id: parseInt(clientId), 
    },
    data: {
      firstName,
      lastName,
      phone,
      address,
      city,
      state,
      zipcode,
    },
  });
  res.status(201).json({
    message: 'Address saved successfully',
    address: savedAddress,
  });
}catch(error){
  console.log(error)
  console.error('Error saving address:', error);
  res.status(500).json({ error: 'Failed to save address' });
}
  
})

router.get('/address/:clientId', async (req, res) => {
  const { clientId } = req.params; 

  try {
    const address = await prisma.client.findUnique({
      where: {
        id: parseInt(clientId),
      },
      select: {
        firstName: true,
        lastName: true,
        phone: true,
        address: true,
        city: true,
        state: true,
        zipcode: true,
      },
    });
 
    if (!address) {
      return res.status(404).json({ error: 'Address not found' });
    }

    return res.status(200).json(address); // Return the fetched address
  } catch (error) {
    console.error('Error fetching address:', error);
    return res.status(500).json({ error: 'Failed to fetch address' });
  }
});









router.delete('/carrinho/:clientId/:productId', async (req: Request, res: Response) => {
  const clientId = parseInt(req.params.clientId, 10);
  const productId = parseInt(req.params.productId, 10);
  const { quantity } = req.body;
  

  if (isNaN(clientId) || isNaN(productId)) {
    return res.status(400).json({ error: 'Invalid input parameters' });
  }


  try{  
    console.log('Product ID :',productId)
    console.log('quantity :',quantity)

    const cart = await prisma.cart.findFirst({
      where: { clientId },
      include: { items: true },
    });
//verify if cart exist
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
//verify if item exist
    const existingItem = cart.items.find(item => item.productId === productId);

    if (!existingItem) {
      return res.status(404).json({ error: 'Product not found in cart' });
    }

    if (quantity && existingItem.quantity > quantity) {
      // If quantity is specified and greater than 0, reduce the item's quantity
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity - 1 },
      });

      console.log('Item quantity reduced:', updatedItem);

      // Fetch the updated cart
      const updatedCart = await prisma.cart.findFirst({
        where: { clientId },
        include: { items: true },
      });

      return res.json(updatedCart);

    }  else {
      // If no quantity or quantity is equal to or less than existing, remove the item entirely
      await prisma.cartItem.delete({
        where: { id: existingItem.id },
      });

      console.log('Item removed from cart');

      // Fetch the updated cart
      const updatedCart = await prisma.cart.findFirst({
        where: { clientId },
        include: { items: true },
      });

      return res.json(updatedCart);
    }



  }catch(error){
    console.error("Error deleting item from cart:", error);
    return res.status(500).json({ error: 'Error deleting item from cart' });
  }
  
})


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



router.get('/carrinho/:clientId', async (req, res) => {

  console.log(`Received request for cart with clientId: ${req.params.clientId}`);
  const { clientId } = req.params;
  try {
      const cart = await prisma.cart.findFirst({
          where: { clientId: Number(clientId) },
          include: { items: true }, 
      });
      
      if (!cart) {
          return res.status(404).json({ error: 'Cart not found' });
      }

      return res.json(cart);
  } catch (error) {
      return res.status(500).json({ error: 'Error fetching cart' });
  }
});

router.delete('/:clientId/:id', async (req, res) => {
  const clientId = parseInt(req.params.id);

  try {
       await prisma.cartItem.deleteMany({
          where: {
              cart: {
                  clientId: clientId, 
              },
          },
      });
      await prisma.cart.deleteMany({
          where: {
              clientId: clientId,
          },
      });

      const deletedClient = await prisma.client.delete({
          where: {
              id: clientId,
          },
      });

      res.json({ message: 'Client and associated data deleted successfully', deletedClient });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error deleting client and associated data' });
  }
});

//pix code router >>>>>>>>>
router.post('/:clientId/generate-qr', async (req: Request, res: Response) => {
  const { amount, pixKey } = req.body; // Get both amount and pixKey from the request body
  console.log('Request body:', req.body);

  // Validate that both parameters are provided
  if (!amount || !pixKey) {
    return res.status(400).json({ error: 'Amount and PixKey are required' });
  }
  try {
    // Assuming you have already authenticated and have the auth context set up
    await apiNubank.auth.authenticateWithQrCode(CPF, PASSWORD, AUTH_CODE); // Ensure authentication
    console.log("You are authenticated!");

    // Use the appropriate method from the payment context
    const paymentResponse = await apiNubank.payment.createPixPaymentRequest(
      pixKey, 
      amount
    );

    return res.json(paymentResponse);
  } catch (error) {
    console.error('Error making payment:', error);
    return res.status(500).json({ error: 'Error making payment' });
  }
});

// Initialize authentication when the server starts
authenticateWithQRCode();

  export default router;
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
  
  router.get('/example', (req, res) => {
    res.json({ message: 'Hello, world!' });
});




router.get('/carrinho/:clientId', async (req, res) => {

  console.log(`Received request for cart with clientId: ${req.params.clientId}`);
  const { clientId } = req.params;
  try {
      const cart = await prisma.cart.findFirst({
          where: { clientId: Number(clientId) },
          include: { items: true }, // Inclui os itens do carrinho
      });
      
      if (!cart) {
          return res.status(404).json({ error: 'Cart not found' });
      }

      return res.json(cart); // Retorna o carrinho, incluindo a propriedade `items`
  } catch (error) {
      return res.status(500).json({ error: 'Error fetching cart' });
  }
});



  export default router;
import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';
import { config } from "dotenv";
config();
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'some_jwt_key';

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(req.body);
  try {
    const client_register = await prisma.client.create({
      data: {
        username,
        password: hashedPassword,
        email,
        firstName: "", // or null
        lastName: "", // or null
        phone: "", // or null
        address: "", // or null
        city: "", // or null
        state: "", // or null
        zipcode: "", // or null
      },
    });
    res.json(client_register); // Return the created client
  } catch (error) {
    res.status(400).json({ error: "Error creating client" });
  }
});
//login router >>>>>>>>>>>>>>>>

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const client = await prisma.client.findUnique({
      where: { email },
    });

    // CLIENT IS REGISTRED ?
    if (!client) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: client.id,
        email: client.email,
        isAdmin: client.isAdmin,
      },
      JWT_SECRET,
      { expiresIn: "1h" } // Token válido por 1 hora
    );

    const isPasswordValid = await bcrypt.compare(password, client.password);
    // PASSWORD USER VALID ?
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    return res.json({ message: "Login successful", client,token });
    
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Error during login" });
  }
});

router.post("/clients", async (req: Request, res: Response) => {
  console.log(req.body);
  const {
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
  } = req.body;

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
    res.status(400).json({ error: "Error creating client" });
  }
});

router.post("/cart/:clientId", async (req, res) => {
  const clientId = parseInt(req.params.clientId, 10);
  const { productId, quantity } = req.body;
  console.log("Received payload:", req.body);
  // Convert productId to a number
  const productIdNum = parseInt(productId, 10);

  if (isNaN(clientId) || isNaN(productIdNum) || quantity <= 0) {
    return res.status(400).json({ error: "Invalid input parameters" });
  }

  try {
    // Check if an active cart exists for the client
    let cart = await prisma.cart.findFirst({
      where: { clientId },
      include: { items: true },
    });

    if (!cart) {
      console.log("CREATING A CART");
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
      console.log("UPDATING A CART");
      // Check if the item already exists in the cart
      const existingItem = cart.items.find(
        (item) => item.productId === productIdNum
      );

      if (existingItem) {
        // Update the quantity of the existing item
        const updatedItem = await prisma.cartItem.update({
          where: { id: existingItem.id }, // Assuming your item has an id
          data: { quantity: existingItem.quantity + 1 },
        });
        console.log("Updated item:", updatedItem);
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
        console.log("New item added:", newItem);
        cart = await prisma.cart.findFirst({
          where: { clientId },
          include: { items: true },
        });
      }
    }

    return res.json(cart);
  } catch (error) {
    console.error("Error updating cart:", error);
    return res.status(400).json({ error: "Error updating cart" });
  }
});
// type CartItem = {
//   productId: number;
//   price: number;
//   quantity: number;
// };

async function getProductById(productId: number) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error("Could not fetch product");
  }
}

router.post("/createorder", async (req: Request, res: Response) => {
  const { items, clientId } = req.body;

  console.log("Received payload:", req.body);
  console.log(
    "Creating new order for clientId:",
    clientId,
    "with items:",
    items
  );

  // Validate input
  if (!clientId || !Array.isArray(items) || items.length === 0) {
    console.log("Validation failed:", { clientId, items });
    return res.status(400).json({ error: "Invalid input parameters" });
  }

  try {
    // Check if product exists in the product table or add new product if not
    const itemPromises = items.map(async (item) => {
      let product = await getProductById(item.productId);

      // If the product doesn't exist, add it to the product table
      if (!product) {
        product = await prisma.product.create({
          data: {
            id: item.productId,
            name: item.name, // Assuming you have this in your payload
            price: item.price, // Assuming price is sent from frontend
          },
        });
      }

      return product;
    });

    const products = await Promise.all(itemPromises);

    // Calculate total from items using fetched products
    const total = items.reduce((acc, item, index) => {
      const product = products[index];
      if (product) {
        console.log(
          `Product price for productId ${item.productId}:`,
          product.price
        ); // Add this line
        return acc + product.price * item.quantity;
      }
      return acc; // If product not found, don't add to total
    }, 0);

    const newOrder = await prisma.order.create({
      data: {
        total,
        status: "pendente",
        items: {
          create: items.map((item, index) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: products[index]?.price ?? 0,
          })),
        },
        client: {
          // Assuming you need to connect the client
          connect: { id: clientId },
        },
      },
    });

    console.log("Order was created:", items);
    await prisma.cartItem.deleteMany({
      where: {
        cart: { clientId },
      },
    });

    console.log("Cart cleared for client:", clientId);

    return res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error saving cart:", error);
    return res.status(500).json({ error: "Failed to save cart" });
  }
});

router.post("/address/:clientId", async (req, res) => {
  const { firstName, lastName, phone, address, city, state, zipcode } =
    req.body;
  console.log("Received payload:", req.body);
  const { clientId } = req.params;
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
      message: "Address saved successfully",
      address: savedAddress,
    });
  } catch (error) {
    console.log(error);
    console.error("Error saving address:", error);
    res.status(500).json({ error: "Failed to save address" });
  }
});

router.get("/clients/:clientId", async (req: Request, res: Response) => {
  const clientId = parseInt(req.params.clientId, 10);
  console.log(clientId);
  try {
    const client = await prisma.client.findUnique({
      where: {
        id: clientId,
      },
    });
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: "Error fetching client" });
  }
});
router.get("/address/:clientId", async (req, res) => {
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
      return res.status(404).json({ error: "Address not found" });
    }

    return res.status(200).json(address); // Return the fetched address
  } catch (error) {
    console.error("Error fetching address:", error);
    return res.status(500).json({ error: "Failed to fetch address" });
  }
});

router.get("/clients", async (req: Request, res: Response) => {
  try {
    const clients = await prisma.client.findMany();
    res.json(clients);
    console.log(clients); // Return all clients
  } catch (error) {
    res.status(500).json({ error: "Error fetching clients" });
  }
});

router.get("/cart/:clientId", async (req, res) => {
  console.log(
    `Received request for cart with clientId: ${req.params.clientId}`
  );
  const { clientId } = req.params;
  try {
    const cart = await prisma.cart.findFirst({
      where: { clientId: Number(clientId) },
      include: { items: true },
    });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    return res.json(cart);
  } catch (error) {
    return res.status(500).json({ error: "Error fetching cart" });
  }
});

router.get("/carts", async (req, res) => {
  try {
    const carts = await prisma.cart.findMany({
      include: { items: true }, // Include items in each cart
    });

    if (carts.length === 0) {
      return res.status(404).json({ error: "No carts found" });
    }

    return res.json(carts); // Return all carts
  } catch (error) {
    console.error("Error fetching carts:", error);
    return res.status(500).json({ error: "Error fetching carts" });
  }
});

router.put("/clients/:id", async (req, res) => {
  const clientId = parseInt(req.params.id);
  const { username, email, isAdmin } = req.body; // Destructure the data from the request body

  try {
    // Validate incoming data (add more validation as needed)
    if (!username || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    // Update the client information in the database
    const updatedClient = await prisma.client.update({
      where: { id: Number(clientId) }, // Find the client by ID
      data: {
        username,
        email,
        isAdmin, // Optional: update isAdmin if provided
      },
    });

    // Send the updated client as the response
    return res.json(updatedClient);
  } catch (error) {
    console.error("Error updating client:", error);
    return res.status(500).json({ error: "Failed to update client" });
  }
});

// DELETE CART CLIENT
router.delete("/cart/:clientId", async (req: Request, res: Response) => {
  const clientId = parseInt(req.params.clientId, 10);

  if (isNaN(clientId)) {
    return res.status(400).json({ error: "Invalid clientId" });
  }

  try {
    // Encontra o cart ativo do cliente
    const cart = await prisma.cart.findFirst({
      where: { clientId },
      include: { items: true },
    });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Deleta todos os itens do cart
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    // Retorna o cart vazio
    return res.status(200).json({
      message: "Cart cleared successfully",
      cart: { ...cart, items: [] }, // Retorna o cart sem os itens
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return res.status(500).json({ error: "Error clearing cart" });
  }
});

router.delete(
  "/cart/:clientId/:productId",
  async (req: Request, res: Response) => {
    const clientId = parseInt(req.params.clientId, 10);
    const productId = parseInt(req.params.productId, 10);
    const { quantity } = req.body;

    if (isNaN(clientId) || isNaN(productId)) {
      return res.status(400).json({ error: "Invalid input parameters" });
    }

    try {
      console.log("Product ID :", productId);
      console.log("quantity :", quantity);

      const cart = await prisma.cart.findFirst({
        where: { clientId },
        include: { items: true },
      });
      //verify if cart exist
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }
      //verify if item exist
      const existingItem = cart.items.find(
        (item) => item.productId === productId
      );

      if (!existingItem) {
        return res.status(404).json({ error: "Product not found in cart" });
      }

      if (quantity && existingItem.quantity > quantity) {
        // If quantity is specified and greater than 0, reduce the item's quantity
        const updatedItem = await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity - 1 },
        });

        console.log("Item quantity reduced:", updatedItem);

        // Fetch the updated cart
        const updatedCart = await prisma.cart.findFirst({
          where: { clientId },
          include: { items: true },
        });

        return res.json(updatedCart);
      } else {
        // If no quantity or quantity is equal to or less than existing, remove the item entirely
        await prisma.cartItem.delete({
          where: { id: existingItem.id },
        });

        console.log("Item removed from cart");

        // Fetch the updated cart
        const updatedCart = await prisma.cart.findFirst({
          where: { clientId },
          include: { items: true },
        });

        return res.json(updatedCart);
      }
    } catch (error) {
      console.error("Error deleting item from cart:", error);
      return res.status(500).json({ error: "Error deleting item from cart" });
    }
  }
);

router.delete("/:clientId/:id", async (req, res) => {
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

    res.json({
      message: "Client and associated data deleted successfully",
      deletedClient,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error deleting client and associated data" });
  }
});

export default router;

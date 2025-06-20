import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "some_jwt_key";

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await prisma.client.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(400).json({ error: "email já está em uso." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(req.body);

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
    return res.json(client_register); // Return the created client
  } catch (error) {
    return res.status(400).json({ error: "Error creating client" });
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
    return res.json({ message: "Login successful", client, token });
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

//CART <<<<<<<<<<<<<<<<<<<<<<<<<<

router.post("/cart/:clientId", async (req, res) => {
  const clientId = parseInt(req.params.clientId, 10);
  const { productId, quantity } = req.body;
  const productIdNum = parseInt(productId, 10);

  if (isNaN(clientId) || isNaN(productIdNum) || quantity <= 0) {
    return res.status(400).json({ error: "Invalid input parameters" });
  }

  try {
    // Pega ou cria o cart primeiro
    let cart = await prisma.cart.findFirst({ where: { clientId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { clientId } });
    }

    // Use upsert para evitar race conditions
    await prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: productIdNum,
        },
      },
      update: { quantity: { increment: quantity || 1 } },
      create: {
        cartId: cart.id,
        productId: productIdNum,
        quantity: quantity || 1,
      },
    });

    // Retorna cart atualizado
    const updatedCart = await prisma.cart.findFirst({
      where: { clientId },
      include: { items: true },
    });

    return res.json(updatedCart);
  } catch (error) {
    console.error("Error updating cart:", error);
    return res.status(500).json({ error: "Error updating cart" });
  }
});


// DELETE CART CLIENT
router.delete("/cart/:clientId/:productId", async (req, res) => {
  const clientId = parseInt(req.params.clientId, 10);
  const productId = parseInt(req.params.productId, 10);
  const { quantity } = req.body;

  if (isNaN(clientId) || isNaN(productId)) {
    return res.status(400).json({ error: "Invalid input parameters" });
  }

  try {
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cart: { clientId },
        productId,
      },
      include: { cart: true },
    });

    if (!existingItem) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    // 🔥 lógica principal, limpa e única
    if (quantity === 0 || existingItem.quantity <= 1) {
      await prisma.cartItem.delete({ where: { id: existingItem.id } });
    } else {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity - 1 },
      });
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { id: existingItem.cartId },
      include: { items: true },
    });

    return res.json(updatedCart);
  } catch (error) {
    console.error("Error deleting item from cart:", error);
    return res.status(500).json({ error: "Error deleting item from cart" });
  }
});





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


// >>>>>>>>>>>>>>>>>>>>>>>>
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

import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
config();

const prisma = new PrismaClient();
const router = Router();

router.get('/orders', async (req: Request, res: Response) => {
    try {
      const orders = await prisma.order.findMany({
        include: {
          items: true, // Include related items
        },
      });
      return res.status(200).json(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      return res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });
  
  
  
  router.get('/orders/:clientId', async (req, res) => {
    const { clientId } = req.params;
  
    try {
        const orders = await prisma.order.findMany({
            where: { clientId: parseInt(clientId) },
            include: { items: true }, // Include items in the order
        });
        return res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        return res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });
  
  router.patch('/orders/:orderId/status', async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const { status } = req.body;
  
    // Validate status value
    const validStatuses = ['completed', 'pending', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid order status' });
    }
  
    try {
      const updatedOrder = await prisma.order.update({
        where: { id: Number(orderId) },
        data: { status }, // Update only the status field
      });
  
      return res.status(200).json(updatedOrder);
    } catch (error) {
      console.error('Error updating order status:', error);
      return res.status(500).json({ error: 'Failed to update order status' });
    }
  });
  
export default router;
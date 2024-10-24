import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
const prisma = new PrismaClient();


const isAdmin = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    // const clientId = req.body.clientId || req.headers['client-id'];

    console.log('Request Body:', req.body);
    console.log('Request Headers:', req.headers);
    console.log('Request Query:', req.query); // Log query parameters
    
  const clientId = 1
    if (!clientId) {
        

        return res.status(401).json({ message: "Client ID is required" });
        
    }

    try {
        const client = await prisma.client.findUnique({ where: { id: clientId } });

        if (!client) {
            console.log('Client not found for ID:', clientId);
            return res.status(404).json({ message: "Client not found" });
        }

        if (!client.isAdmin) {
            return res.status(403).json({ message: "Not authorized as an admin", client });
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

  export default isAdmin;
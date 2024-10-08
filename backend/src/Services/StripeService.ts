
import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();
import Stripe from 'stripe';


// const stripe = new Stripe(process.env.REACT_APP_STRIPE_PUBLISH_KEY as string);

const stripe = new Stripe(process.env.REACT_APP_STRIPE_SECRET_KEY_TEST as string);
console.log(process.env.REACT_APP_STRIPE_SECRET_KEY)
console.log(process.env.REACT_APP_STRIPE_PUBLISH_KEY)
// const stripe = require('stripe')('');

// const paymentIntent = await stripe.paymentIntents.create({
//   amount: 2000,
//   currency: 'usd',
//   automatic_payment_methods: {
//     enabled: true,
//   },
// });
router.get('/config', async (req: Request, res: Response) => {
    res.send({
        stripePublishKey: process.env.REACT_APP_STRIPE_PUBLISH_KEY_TEST,
    })
})

router.post('/create-payment-intent', async (req: Request, res: Response) => {
    try {
        const { amount, address,customerId } = req.body;
        console.log('post amount :',amount)
        console.log('address: ' ,address)
        console.log('customer > ',customerId)
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'BRL',
            customer: customerId, 
            automatic_payment_methods: {
                enabled: true,
            },  
            metadata: {
                address_city: address.city,
                address_country: address.country,
                address_line1: address.line1, 
                address_line2: address.line2 || '', 
                address_postal_code: address.postal_code,
                address_state: address.state,
                customer_name: `${address.firstName} ${address.lastName}`, 
                customer_email: address.email || '', 
                customer_phone: address.phone || '', 
            },
        });
        return res.send({ clientSecret: paymentIntent.client_secret });

    } catch (e: any) {
        return res.status(400).send({
            error: {
                message: e.message,
            },
        });

    }
})
router.post('/create-customer/:clientId', async (req: Request, res: Response) => {
    const { clientId } = req.params;
    const { email, name, phone,address} = req.body;
    try {
        const client = await prisma.client.findUnique({
            where: {
                id: parseInt(clientId, 10),
            },
        });

        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }

        // Create a Stripe customer using the client's email
        const customer = await stripe.customers.create({
            email: email,
            name: name,
            phone: phone,
            address: {  // Include address here
                line1: address.line1,
                line2: address.line2 || '',
                city: address.city,
                state: address.state || '', // Optional, if applicable
                postal_code: address.postal_code,
                country: address.country,
            },
        });
        
        // await prisma.client.update({
        //     where: { id: client.id },
        //     data: { stripeCustomerId: customer.id }, // Assuming you have this field in your client model
        // });

        console.log('Stripe customer created:', customer);
        console.log('address post > ',address)
        return res.json({ customerId: customer.id });

    } catch (error) {
        console.error('Error creating Stripe customer:', error);
        return res.status(500).json({ error: 'Error creating Stripe customer' });
    }
});


// // Example usage (in your client or testing tool)
// const createCardToken = async () => {
//     const clientId = 95;
//     const response = await fetch(`http://localhost:3000/create-card-token/${clientId}`, { // Replace 1 with actual clientId
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//             number: '4242424242424242',
//             exp_month: 12,
//             exp_year: 25,
//             cvc: '123',
//         }),
//     });

//     const data = await response.json();
//     console.log(data);
// };

// createCardToken()
export default router;
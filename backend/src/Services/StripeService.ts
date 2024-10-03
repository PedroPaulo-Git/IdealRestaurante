
import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();
import Stripe from 'stripe';


// const stripe = new Stripe(process.env.REACT_APP_STRIPE_PUBLISH_KEY as string);

const stripe = new Stripe(process.env.REACT_APP_STRIPE_SECRET_KEY_TEST as string);
console.log(process.env.REACT_APP_STRIPE_SECRET_KEY_TEST)
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
        stripePublishKey: process.env.REACT_APP_STRIPE_PUBLISH_KEY,
    })
})
router.post('/create-payment-intent', async (req: Request, res: Response) => {
    try {
        const { amount } = req.body;
        console.log('post amount :',amount)
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true,
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
            email: client.email,
            description: 'test customer',
            name: `${client.firstName} ${client.lastName}`,
            phone: client.phone,
            address: {
                line1: client.address,
                city: client.city,
                state: client.state,
                postal_code: client.zipcode
            }
        });

        // Optionally, you can store the Stripe customer ID in your database
        // await prisma.client.update({
        //     where: { id: client.id },
        //     data: { stripeCustomerId: customer.id }, // Assuming you have this field in your client model
        // });

        console.log('Stripe customer created:', customer);
        return res.json({ customer });// Return Stripe customer ID

    } catch (error) {
        console.error('Error creating Stripe customer:', error);
        return res.status(500).json({ error: 'Error creating Stripe customer' });
    }
});
router.post('/create-card-token/:clientId', async (req: Request, res: Response) => {
    const { number, exp_month, exp_year, cvc } = req.body;
    const { clientId } = req.params;
    console.log(number, exp_month, exp_year, cvc)
    console.log(clientId)
    try {
        const token = await stripe.tokens.create({
            card: {
                number,
                exp_month,
                exp_year,
                cvc,
            },
        });

        console.log('Card token created:', clientId, token);
        return res.json({ token });
    } catch (error) {
        console.error('Error creating card token:', error);
        return res.status(500).json({ error: 'Error creating card token' });
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
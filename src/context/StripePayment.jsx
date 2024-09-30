import React from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const StripePayment = () => {
    const stripe = useStripe();
    const elements = useElements();


    const handleStripePayment = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return; // Stripe.js has not yet loaded.
        }

        const cardElement = elements.getElement(CardElement);
        const { paymentMethod, error } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            console.log(error.message);
            //setSuccess('');
        } else {
            // Send paymentMethod.id to your server to create a PaymentIntent
            const response = await fetch(`http://localhost:3000/api/create-payment-intent${clientId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    payment_method: paymentMethod.id,
                    amount: 20, // Amount in cents ($20.00)
                    currency: 'usd',
                }),
            });

            const paymentResult = await response.json();

            if (paymentResult.error) {
                //setError(paymentResult.error);
                //setSuccess('');
                console.log(paymentResult)
            } else {
                // setSuccess('Payment successful! PaymentIntent ID: ' + paymentResult.paymentIntent.id);
                // setError('');
                console.log('Payment successful! PaymentIntent ID: ' + paymentResult.paymentIntent.id)
            }
        }
    };
    return (
        <div>
            <form onSubmit={handleStripePayment}>
                <CardElement />
                <button type="submit" disabled={!stripe}>
                    Pay
                </button>
            </form>
        </div>
    )
}
export default StripePayment;
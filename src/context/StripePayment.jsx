import {useState} from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { PaymentElement } from '@stripe/react-stripe-js';
const StripePayment = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [showSuccessMessage, setShowSuccessMessage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(null);


    const sucessMessage = () => {
        setIsEditing(false)
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(null);
        }, 2000);
      }


    const handleStripePayment = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return; // Stripe.js has not yet loaded.
        }

        const cardElement = elements.getElement(CardElement);
        
    };
    return (
        <div>
            <form onSubmit={handleStripePayment}> 
                <PaymentElement/>
                <button className='cart-total-details-button' type="submit" disabled={!stripe}>
                    {isProcessing ? 'Processando...': 'Completar Pagamento'}
                </button>
            </form>
        </div>
    )
}
export default StripePayment;
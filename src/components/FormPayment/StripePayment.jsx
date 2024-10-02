import { useState } from 'react'
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
            return; 
        }

       setIsProcessing(true)
        const error = await stripe.confirmPayment({
            elements,
            confirmParams:{
                return_url: `${window.location.origin}/completion`
            },
        })
        if(error){
            setShowSuccessMessage(error.message)
        }
        setIsProcessing(false)
    };
    return (
        <div>
            <form id='form-payment-stripe' onSubmit={handleStripePayment}>
                <PaymentElement />
                <button className='cart-total-details-button' type="submit" disabled={isProcessing}>
                    {isProcessing ? 'Processando...' : 'Completar Pagamento'}
                </button>
            </form>
            {showSuccessMessage && <div>{showSuccessMessage}</div>}
        </div>
    )
}
export default StripePayment;
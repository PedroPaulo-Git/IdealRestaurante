import { useState,useContext,useEffect} from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { PaymentElement } from '@stripe/react-stripe-js';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
const StripePayment = ({ handlePayment }) => {

    const stripe = useStripe();
    const elements = useElements();
    const [showSuccessMessage, setShowSuccessMessage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(null);
    const navigate = useNavigate();
    const {clearCart} = useContext(StoreContext);
    
    useEffect(() => {
        // Check if Stripe and elements are initialized
        console.log('Stripe:', stripe); 
        console.log('Elements:', elements);
        
        if (!stripe) {
            console.error('Stripe.js has not loaded properly.');
        }
        if (!elements) {
            console.error('Stripe elements have not loaded properly.');
        }
    }, [stripe, elements]);
    const handleStripePayment = async (event) => {
        event.preventDefault();

        setIsProcessing(true);

        try {
            // Ensure handlePayment is awaited
            await handlePayment();

            if (!stripe || !elements) {
                console.error('Stripe or elements not loaded');
                return;
            }

            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/completion`,
                },
                redirect: 'if_required',
            });

            if (error) {
                console.error('Payment error:', error.message);
                setShowSuccessMessage(error.message);
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                console.log('Payment succeeded:', paymentIntent.status);
                setShowSuccessMessage('Pagamento concluído com sucesso !');
                setTimeout(() => {
                    setShowSuccessMessage(null);
                    clearCart(); // Clear cart after success
                    navigate('/');
                }, 2000);
            } else {
                console.error('Unexpected error during payment');
                setShowSuccessMessage('Erro inesperado...');
            }
        } catch (err) {
            console.error('Error during handlePayment:', err);
        } finally {
            setIsProcessing(false); // Ensure this runs even if there's an error
        }
    };

    
    return (
        <div>
            <form id='form-payment-stripe' onSubmit={handleStripePayment}>
                <h1>Formas de Pagamento</h1>
                <PaymentElement />
                <button className='cart-total-details-button' type="submit" >
                    {isProcessing ? 'Processando...' : 'Concluir Pagamento'}a
                </button>
                {showSuccessMessage && <div className="addressEdited-success" >{showSuccessMessage}</div>}
            </form>
        </div>
    )
}
export default StripePayment;
import { useState, useContext, useEffect } from 'react'
import './StripePayment.css'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { PaymentElement } from '@stripe/react-stripe-js';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { FaLessThanEqual } from 'react-icons/fa6';
const StripePayment = ({ handlePayment }) => {

    const stripe = useStripe();
    const elements = useElements();
    const [showPaymentMessage, setShowPaymentMessage] = useState(false);
    const [isSuccessMessage, setIsSuccessMessage] = useState('');
    const [isFailureMessage, setIsFailureMessage] = useState('');

    const [isProcessing, setIsProcessing] = useState(null);
    const navigate = useNavigate();
    const { clearCart } = useContext(StoreContext);

    useEffect(() => {
        // Check if Stripe and elements are initialized
        console.log('Stripe:', stripe);
        console.log('Elements:', elements);
        console.log(isFailureMessage)
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
                setIsFailureMessage(error.message);
                setShowPaymentMessage(true)
                setTimeout(() => {
                    setShowPaymentMessage(false)
                }, 2000);
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                console.log('Payment succeeded:', paymentIntent.status);
                setIsSuccessMessage('Pagamento concluído com sucesso !');
                setShowPaymentMessage(true)
                setTimeout(() => {
                    setShowPaymentMessage(false);
                    clearCart(); // Clear cart after success
                    navigate('/');
                }, 2000);
            } else {
                console.error('Unexpected error during payment');
                setShowPaymentMessage('Erro inesperado...');
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
                    {isProcessing ? 'Processando...' : 'Concluir Pagamento'}
                </button>
                {showPaymentMessage && <div className={showPaymentMessage
                    ?
                    'payment-message-error' : 'payment-message-successful'} >
                    {showPaymentMessage ?

                        <div> {isFailureMessage} </div>

                        :

                        <div>{isSuccessMessage}</div>}
                </div>}
            </form>
        </div>
    )
}
export default StripePayment;
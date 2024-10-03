import { useState,useContext } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { PaymentElement } from '@stripe/react-stripe-js';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
const StripePayment = () => {

    const stripe = useStripe();
    const elements = useElements();
    const [showSuccessMessage, setShowSuccessMessage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(null);
    const navigate = useNavigate();
    const {clearCart} = useContext(StoreContext);

    const handleStripePayment = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }
      
        setIsProcessing(true)
        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/completion`
            },
            redirect: 'if_required',
        })
        if (error) {
            setShowSuccessMessage(error.message)
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            console.log(paymentIntent.status)
            setShowSuccessMessage('Pagamento concluído com sucesso !  ');
            clearCart()
            setTimeout(() => {
                setShowSuccessMessage(null);
                navigate('/');
            }, 2000);
        } else {
            setShowSuccessMessage('Erro inesperado...')
        }
        setIsProcessing(false)
    };
    return (
        <div>
            <form id='form-payment-stripe' onSubmit={handleStripePayment}>
                <h1>Formas de Pagamento</h1>
                <PaymentElement />
                <button className='cart-total-details-button' type="submit" disabled={isProcessing}>
                    {isProcessing ? 'Processando...' : 'Concluir Pagamento'}
                </button>
                {showSuccessMessage && <div className="addressEdited-success" >{showSuccessMessage}</div>}
            </form>
        </div>
    )
}
export default StripePayment;
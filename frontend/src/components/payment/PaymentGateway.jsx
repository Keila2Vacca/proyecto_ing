import { useState } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Mock Stripe promise - en producción, usa tu clave pública real
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_your_stripe_test_key');

const CheckoutForm = ({ amount, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      return;
    }

    try {
      // En una aplicación real, aquí crearías un payment intent en tu servidor
      // Por ahora, simularemos un pago exitoso
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulamos un pago exitoso
      const { paymentMethod, error: stripeError } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (stripeError) {
        throw stripeError;
      }

      // En una app real, confirmarías el pago en tu servidor
      console.log('PaymentMethod:', paymentMethod);
      onSuccess({
        id: 'mock_payment_' + Math.random().toString(36).substr(2, 9),
        status: 'succeeded'
      });
    } catch (err) {
      console.error('Error en el pago:', err);
      setError(err.message || 'Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#1f2937',
                '::placeholder': {
                  color: '#9ca3af',
                },
              },
              invalid: {
                color: '#ef4444',
              },
            },
          }}
        />
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
        >
          {loading ? 'Procesando...' : `Pagar $${amount.toLocaleString()}`}
        </button>
      </div>
    </form>
  );
};

const PaymentGateway = ({ amount = 0, onSuccess, onCancel }) => {
  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Método de Pago</h2>
      <p className="text-gray-600 mb-6">Complete los detalles de pago a continuación</p>
      
      <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-400">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Modo de prueba activo:</strong> Usa 4242 4242 4242 4242 para una tarjeta de prueba exitosa.
            </p>
          </div>
        </div>
      </div>

      <Elements stripe={stripePromise}>
        <CheckoutForm 
          amount={amount} 
          onSuccess={onSuccess} 
          onCancel={onCancel} 
        />
      </Elements>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-between text-base font-medium text-gray-900">
          <p>Total a pagar</p>
          <p>${amount.toLocaleString()}</p>
        </div>
        <p className="mt-1 text-sm text-gray-500">Los cargos aparecerán como "HACARITAMA" en tu estado de cuenta.</p>
      </div>
    </div>
  );
};

export default PaymentGateway;

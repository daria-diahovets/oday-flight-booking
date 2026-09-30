import { useEffect, useState } from 'react';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { stripePromise } from '../lib/stripe';
import { ordersApi, type ConfirmOrderResult } from '../api/orders.api';
import type { Passenger } from '../schemas/booking.schema';
import Loading from './UI/Loading.tsx';
import Button from './UI/Button.tsx';
import classes from '../styles/PaymentCard.module.scss';

const elementStyle = {
  style: {
    base: {
      fontSize: '18px',
      fontFamily: 'Montserrat, sans-serif',
      color: '#2b2b67',
      '::placeholder': { color: 'rgba(43, 43, 103, 0.75)' },
    },
    invalid: { color: '#d61c1c' },
  },
};

interface PaymentCardProps {
  flightId: string;
  adults: Passenger[];
  children: Passenger[];
  onSuccess: (order: ConfirmOrderResult) => void;
  onFailure: () => void;
}

const PaymentForm = ({
  flightId,
  adults,
  children,
  clientSecret,
  onSuccess,
  onFailure,
}: PaymentCardProps & { clientSecret: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [ownerName, setOwnerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    cardNumber?: string;
    cardExpiry?: string;
    cardCvc?: string;
  }>({});
  const [fieldsComplete, setFieldsComplete] = useState({
    cardNumber: false,
    cardExpiry: false,
    cardCvc: false,
  });

  const handleFieldChange =
    (field: 'cardNumber' | 'cardExpiry' | 'cardCvc') =>
    (event: { complete: boolean; error?: { message: string } }) => {
      setFieldErrors((prev) => ({ ...prev, [field]: event.error?.message }));
      setFieldsComplete((prev) => ({ ...prev, [field]: event.complete }));
    };

  const isFormValid =
    fieldsComplete.cardNumber &&
    fieldsComplete.cardExpiry &&
    fieldsComplete.cardCvc &&
    !fieldErrors.cardNumber &&
    !fieldErrors.cardExpiry &&
    !fieldErrors.cardCvc;

  const handleSubmit = async () => {
    const cardNumberElement = elements?.getElement(CardNumberElement);
    if (!stripe || !elements || !cardNumberElement || !isFormValid) return;

    setIsSubmitting(true);

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardNumberElement,
          billing_details: { name: ownerName },
        },
      }
    );

    if (error || paymentIntent?.status !== 'succeeded') {
      setIsSubmitting(false);
      onFailure();
      return;
    }

    try {
      const order = await ordersApi.confirm({
        flightId,
        adults,
        children,
        paymentIntentId: paymentIntent.id,
      });
      onSuccess(order);
    } catch {
      onFailure();
    }
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.cardVisual}></div>

      <div className={`${classes.form} block`}>
        <div>
          <div className={`input ${classes.stripeField}`}>
            <CardNumberElement
              options={{
                ...elementStyle,
                placeholder: 'Card Number',
                disableLink: true,
              }}
              onChange={handleFieldChange('cardNumber')}
            />
          </div>
          {fieldErrors.cardNumber && (
            <p className="error">{fieldErrors.cardNumber}</p>
          )}
        </div>

        <input
          className="input"
          placeholder="Owner's Name"
          maxLength={26}
          value={ownerName}
          onChange={(e) => setOwnerName(e.target.value)}
        />

        <div>
          <div className={classes.row}>
            <div className={`input ${classes.stripeField}`}>
              <CardExpiryElement
                options={{ ...elementStyle, placeholder: 'Validity Period' }}
                onChange={handleFieldChange('cardExpiry')}
              />
            </div>
            <div className={`input ${classes.stripeField}`}>
              <CardCvcElement
                options={{ ...elementStyle, placeholder: 'CVV' }}
                onChange={handleFieldChange('cardCvc')}
              />
            </div>
          </div>
          {fieldErrors.cardExpiry && (
            <p className="error">{fieldErrors.cardExpiry}</p>
          )}
          {fieldErrors.cardCvc && (
            <p className="error">{fieldErrors.cardCvc}</p>
          )}
        </div>

        <Button
          type="button"
          disabled={isSubmitting || !isFormValid}
          onClick={handleSubmit}
        >
          CONFIRM
        </Button>
      </div>
    </div>
  );
};

const PaymentCard = (props: PaymentCardProps) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    ordersApi
      .createIntent({
        flightId: props.flightId,
        adults: props.adults,
        children: props.children,
      })
      .then(({ clientSecret }) => setClientSecret(clientSecret))
      .catch(() => props.onFailure());
  }, []);

  if (!clientSecret) return <Loading />;

  return (
    <Elements
      stripe={stripePromise}
      options={{
        locale: 'en',
        fonts: [
          {
            cssSrc:
              'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap',
          },
        ],
      }}
    >
      <PaymentForm {...props} clientSecret={clientSecret} />
    </Elements>
  );
};

export default PaymentCard;

import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router';
import { flightsApi } from '../api/flights.api';
import type { ConfirmOrderResult } from '../api/orders.api';
import type { Flight } from '../types/flight';
import type { BookingFormValues } from '../schemas/booking.schema';
import Loading from '../components/UI/Loading.tsx';
import PassengerPanel from '../components/PassengerPanel.tsx';
import FlightSummaryPanel from '../components/FlightSummaryPanel.tsx';
import PaymentCard from '../components/PaymentCard.tsx';
import PaymentSuccess from '../components/PaymentSuccess.tsx';
import PaymentFailed from '../components/PaymentFailed.tsx';

import classes from '../styles/BookingConfirm.module.scss';

interface LocationState {
  adults?: number;
  children?: number;
}

const BookingConfirm = () => {
  const { flightId } = useParams<{ flightId: string }>();
  const location = useLocation();

  const adultsCount = (location.state as LocationState | null)?.adults ?? 1;
  const childrenCount = (location.state as LocationState | null)?.children ?? 0;

  const [flight, setFlight] = useState<Flight | null>(null);
  const [isEditing, setIsEditing] = useState(true);
  const [savedValues, setSavedValues] = useState<BookingFormValues | null>(
    null
  );
  const [step, setStep] = useState<'booking' | 'payment' | 'success' | 'error'>(
    'booking'
  );
  const [orderResult, setOrderResult] = useState<ConfirmOrderResult | null>(
    null
  );

  useEffect(() => {
    if (!flightId) return;
    flightsApi
      .getById(flightId)
      .then(setFlight)
      .catch(() => setFlight(null));
  }, [flightId]);

  if (!flight) return <Loading />;

  const totalPrice =
    adultsCount * Number(flight.price_adult) +
    childrenCount * Number(flight.price_child);

  if (step === 'payment' && savedValues && flightId) {
    return (
      <div className={classes['booking-confirm']}>
        <PaymentCard
          flightId={flightId}
          adults={savedValues.adults}
          children={savedValues.children}
          onSuccess={(order) => {
            setOrderResult(order);
            setStep('success');
          }}
          onFailure={() => setStep('error')}
        />
      </div>
    );
  }

  if (step === 'success' && orderResult) {
    return (
      <div className={classes['booking-confirm']}>
        <PaymentSuccess
          orderId={orderResult.orderId}
          totalPrice={orderResult.totalPrice}
          createdAt={orderResult.createdAt}
        />
      </div>
    );
  }

  if (step === 'error') {
    return (
      <div className={classes['booking-confirm']}>
        <PaymentFailed />
      </div>
    );
  }

  return (
    <div className={classes['booking-confirm']}>
      <h1 className="title">Confirm your payment</h1>

      <div className={classes.flex}>
        <PassengerPanel
          adultsCount={adultsCount}
          childrenCount={childrenCount}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          savedValues={savedValues}
          onSave={setSavedValues}
        />

        <FlightSummaryPanel
          flight={flight}
          adultsCount={adultsCount}
          childrenCount={childrenCount}
          totalPrice={totalPrice}
          isEditing={isEditing}
          onConfirm={() => setStep('payment')}
        />
      </div>
    </div>
  );
};

export default BookingConfirm;

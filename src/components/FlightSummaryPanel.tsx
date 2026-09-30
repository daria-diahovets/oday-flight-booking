import type { Flight } from '../types/flight';
import Button from './UI/Button.tsx';

import classes from '../styles/BookingConfirm.module.scss';
import pointOutline from '../assets/icons/point-outline.svg';
import pointFilled from '../assets/icons/point-filled.svg';
import passengers from '../assets/icons/passengers.svg';
import ticket from '../assets/icons/ticket.svg';
import seat from '../assets/icons/seat.svg';

function formatFlightDateTime(iso: string): string {
  const d = new Date(iso);
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const date = d.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    weekday: 'long',
  });
  return `${time}, ${date}`;
}

interface FlightSummaryPanelProps {
  flight: Flight;
  adultsCount: number;
  childrenCount: number;
  totalPrice: number;
  isEditing: boolean;
  onConfirm: () => void;
}

const FlightSummaryPanel = ({
  flight,
  adultsCount,
  childrenCount,
  totalPrice,
  isEditing,
  onConfirm,
}: FlightSummaryPanelProps) => {
  return (
    <div className={classes.aside}>
      <div className={`${classes.info} block`}>
        <h2>About the flight:</h2>
        <hr className="divider" />
        <div className={classes['info-wrapper']}>
          <div className={classes.origin}>
            <img src={pointOutline} alt="" />
            <strong>{flight.origin_city}</strong>
            <span>{formatFlightDateTime(flight.departure_time)}</span>
            <span>Airline: {flight.airline_name}</span>
          </div>
          <div>
            <img src={pointFilled} alt="" />
            <strong>{flight.destination_city}</strong>
            <span>{formatFlightDateTime(flight.arrival_time)}</span>
            <span>Airline: {flight.airline_name}</span>
          </div>
          <div>
            <img id={classes.passengers} src={passengers} alt="" />
            <strong>Passengers:</strong>
            <span>
              {adultsCount} adults, {childrenCount} child
            </span>
          </div>
          <div>
            <img id={classes.seat} src={seat} alt="" />
            <strong>Available Seats:</strong>
            <span>
              {flight.seats_available}/{flight.seats_total}
            </span>
          </div>
          <div>
            <img id={classes.ticket} src={ticket} alt="" />
            <strong>Price:</strong>
            <span>
              per Adult Ticket: €{Number(flight.price_adult).toFixed(2)}
            </span>
            <span>
              per Child Ticket: €{Number(flight.price_child).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className={`${classes.total} block`}>
        <div>
          Total Price: <strong>€{totalPrice.toFixed(2)}</strong>
        </div>
        <Button type="button" disabled={isEditing} onClick={onConfirm}>
          CONFIRM
        </Button>
      </div>
    </div>
  );
};

export default FlightSummaryPanel;

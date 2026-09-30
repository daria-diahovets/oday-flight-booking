import type { Flight } from '../types/flight';
import classes from '../styles/FlightCard.module.scss';

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

const MS_IN_HOUR = 60 * 60 * 1000; // 3 600 000
const MS_IN_MINUTE = 60 * 1000; // 60 000

function formatDuration(start: string, end: string): string {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  const hours = Math.floor(ms / MS_IN_HOUR);
  const minutes = Math.round((ms % MS_IN_HOUR) / MS_IN_MINUTE);
  return `${hours}hr ${minutes}min`;
}

interface FlightCardProps {
  flight: Flight;
  onSelect?: (flight: Flight) => void;
}

const FlightCard = ({ flight, onSelect }: FlightCardProps) => {
  return (
    <div className={`${classes.card} block`}>
      <div className={classes.route}>
        <div className={classes.point}>
          <strong>{flight.origin_city}</strong>
          <div className={classes.time}>
            {formatTime(flight.departure_time)}
          </div>
          <div>{formatDate(flight.departure_time)}</div>
        </div>

        <span className={classes.duration}>
          {formatDuration(flight.departure_time, flight.arrival_time)}
        </span>

        <div className={classes.point}>
          <strong>{flight.destination_city}</strong>
          <div className={classes.time}>{formatTime(flight.arrival_time)}</div>
          <div>{formatDate(flight.arrival_time)}</div>
        </div>
      </div>

      <div className={classes.footer}>
        <span className={classes.price}>
          €{Number(flight.price_adult).toFixed(2)}
        </span>
        <button
          className={`button ${classes.btn} bounce-hover`}
          type="button"
          onClick={() => onSelect?.(flight)}
        >
          SELECT
        </button>
      </div>
    </div>
  );
};

export default FlightCard;

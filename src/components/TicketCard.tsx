import { useState } from 'react';
import type { OrderSummary } from '../types/order';
import { ordersApi } from '../api/orders.api';
import classes from '../styles/TicketCard.module.scss';
import downloadIcon from '../assets/icons/download.svg';

function formatDateTime(iso: string): string {
  const date = new Date(iso);
  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
  const time = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  return `${day} ${month} ${weekday} ${time}`;
}

function formatDuration(start: string, end: string): string {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  const hours = Math.floor(ms / 3_600_000);
  const minutes = Math.round((ms % 3_600_000) / 60_000);
  return `${hours}hr ${minutes} min`;
}

interface TicketCardProps {
  order: OrderSummary;
}

const TicketCard = ({ order }: TicketCardProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const [{ pdf }, { default: TicketPdf }, detail] = await Promise.all([
        import('@react-pdf/renderer'),
        import('./TicketPdf.tsx'),
        ordersApi.getById(order.id),
      ]);
      const blob = await pdf(<TicketPdf order={detail} />).toBlob();
      window.open(URL.createObjectURL(blob), '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className={`${classes.card} block`}>
      <div className={classes.route}>
        <strong>{order.origin_city}</strong>
        <span className={classes.duration}>
          {formatDuration(order.departure_time, order.arrival_time)}
        </span>
        <strong>{order.destination_city}</strong>
      </div>

      <p>
        Passengers: {order.adults_count} adults, {order.children_count} child
      </p>
      <p>
        {formatDateTime(order.departure_time)} -{' '}
        {formatDateTime(order.arrival_time)}
      </p>
      <p>
        Total Price: <strong>€{Number(order.total_price).toFixed(2)}</strong>
      </p>

      <button
        className={`button ${classes.download} bounce-hover`}
        type="button"
        disabled={isDownloading}
        onClick={handleDownload}
      >
        DOWNLOAD
        <img src={downloadIcon} alt="" />
      </button>
    </div>
  );
};

export default TicketCard;

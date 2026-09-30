import { useNavigate } from 'react-router';
import Button from './UI/Button.tsx';
import classes from '../styles/PaymentSuccess.module.scss';
import successCircle from '../assets/icons/success-circle.svg';

interface PaymentSuccessProps {
  orderId: string;
  totalPrice: number;
  createdAt: string;
}

function formatPayDate(iso: string): string {
  const date = new Date(iso);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}.${month}.${date.getFullYear()}`;
}

const PaymentSuccess = ({
  orderId,
  totalPrice,
  createdAt,
}: PaymentSuccessProps) => {
  const navigate = useNavigate();

  return (
    <div className={classes.wrapper}>
      <div className={`${classes.panel} block`}>
        <div className={classes.ticket}>
          <img className={classes.circle} src={successCircle} alt="" />
          <p className={classes.great}>Great!</p>
          <h2>Payment Success</h2>

          <div className={classes.rows}>
            <div>
              <span>Order ID:</span>
              <strong>#{orderId.slice(0, 8)}</strong>
            </div>
            <div>
              <span>Pay:</span>
              <strong>€{totalPrice.toFixed(2)}</strong>
            </div>
            <div>
              <span>Pay Date:</span>
              <strong>{formatPayDate(createdAt)}</strong>
            </div>
          </div>

          <hr className={classes.dashed} />

          <p className={classes.totalLabel}>Total Pay</p>
          <p className={classes.totalValue}>€{totalPrice.toFixed(2)}</p>
        </div>
        <Button type="button" onClick={() => navigate('/personal-cabinet')}>
          GO TO MY TICKETS
        </Button>
      </div>
    </div>
  );
};

export default PaymentSuccess;

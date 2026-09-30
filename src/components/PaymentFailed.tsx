import { useNavigate } from 'react-router';
import Button from './UI/Button.tsx';
import classes from '../styles/PaymentFailed.module.scss';
import failedCircle from '../assets/icons/failed-circle.svg';

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className={`${classes.panel} block`}>
      <img src={failedCircle} alt="" />
      <h2>Payment Failed</h2>
      <p>Please try again later!</p>
      <Button type="button" onClick={() => navigate('/')}>
        BACK TO MAIN PAGE
      </Button>
    </div>
  );
};

export default PaymentFailed;

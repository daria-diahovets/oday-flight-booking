import { useNavigate } from 'react-router';
import Button from '../components/UI/Button.tsx';
import classes from '../styles/NotFound.module.scss';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <section className={`${classes.wrapper} full-height`}>
      <div className={`${classes.panel} block`}>
        <h1>404</h1>
        <p>Not found this page</p>
        <Button type="button" onClick={() => navigate('/')}>
          BACK TO MAIN PAGE
        </Button>
      </div>
    </section>
  );
};

export default NotFound;

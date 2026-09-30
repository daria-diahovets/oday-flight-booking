import { Outlet } from 'react-router';
import logo from '../../assets/icons/logo.svg';

const AuthLayout = () => {
  return (
    <section className="ordinary-bg">
      <header className="header block just-cont-center">
        <img src={logo} alt="Oday Logo" />
      </header>
      <main className="container full-height">
        <Outlet />
      </main>
    </section>
  );
};

export default AuthLayout;

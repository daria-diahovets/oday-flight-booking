import { Link, Outlet } from 'react-router';
import { useAuthStore } from '../../store/authStore.ts';
import logo from '../../assets/icons/logo.svg';

const Layout = () => {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  return (
    <section className="shaded-bg">
      <header className="header block just-cont-space-between">
        <Link to="/">
          <img src={logo} alt="Oday Logo" />
        </Link>
        <div>
          <Link to="/personal-cabinet">
            <h4>
              {user?.firstName} {user?.lastName}
            </h4>
          </Link>
          <span> | </span>
          <button onClick={logout}>Log out</button>
        </div>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </section>
  );
};

export default Layout;

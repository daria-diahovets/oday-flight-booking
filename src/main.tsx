import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import './index.scss';
import AuthLayout from './components/layouts/AuthLayout.tsx';
import RequireAuth from './components/guards/RequireAuth.tsx';
import RequireGuest from './components/guards/RequireGuest.tsx';
import Home from './pages/Home.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import BookingConfirm from './pages/BookingConfirm.tsx';
import PersonalCabinet from './pages/PersonalCabinet.tsx';
import NotFound from './pages/NotFound.tsx';
import Layout from './components/layouts/Layout.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="booking/:flightId" element={<BookingConfirm />} />
            <Route path="personal-cabinet" element={<PersonalCabinet />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>

        <Route element={<RequireGuest />}>
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

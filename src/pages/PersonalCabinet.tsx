import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { ordersApi } from '../api/orders.api';
import type { OrderSummary } from '../types/order';
import Loading from '../components/UI/Loading.tsx';
import TicketCard from '../components/TicketCard.tsx';
import Pagination from '../components/UI/Pagination.tsx';

const PAGE_SIZE = 3;

const PersonalCabinet = () => {
  const user = useAuthStore((state) => state.user);
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );

  useEffect(() => {
    ordersApi
      .getMy()
      .then((data) => {
        setOrders(data);
        setStatus('success');
      })
      .catch(() => {
        setOrders([]);
        setStatus('error');
      });
  }, []);

  const totalPages = Math.ceil((orders?.length ?? 0) / PAGE_SIZE);
  const pageOrders = orders?.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  let content;

  if (status === 'loading') {
    content = <Loading />;
  } else if (status === 'error') {
    content = <p className="no-found">Something went wrong, try again later</p>;
  } else if (orders?.length === 0) {
    content = <p className="no-found">You haven't bought tickets yet</p>;
  } else {
    content = (
      <>
        {pageOrders?.map((order) => (
          <TicketCard key={order.id} order={order} />
        ))}
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </>
    );
  }

  return (
    <section className="flight-catalog">
      <h2 className="title">
        Hello, {user?.firstName} {user?.lastName}! It's your tickets:
      </h2>
      {content}
    </section>
  );
};

export default PersonalCabinet;

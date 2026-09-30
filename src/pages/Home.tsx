import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { flightsApi } from '../api/flights.api';
import type { FlightSearchParams } from '../api/flights.api';
import type { Flight } from '../types/flight';
import type { TravellersValue } from '../components/TravellersPopup.tsx';
import SearchForm from '../components/SearchForm.tsx';
import FlightCard from '../components/FlightCard.tsx';
import Pagination from '../components/UI/Pagination.tsx';

const PAGE_SIZE = 6;

const Home = () => {
  const navigate = useNavigate();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useState<FlightSearchParams>({});
  const [destination, setDestination] = useState('');
  const [travellers, setTravellers] = useState<TravellersValue>({
    adults: 1,
    children: 0,
  });

  useEffect(() => {
    flightsApi
      .search({
        ...searchParams,
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE,
      })
      .then(({ flights, total }) => {
        setFlights(flights);
        setTotal(total);

        const pages = Math.ceil(total / PAGE_SIZE);
        if (pages > 0 && page > pages) setPage(pages);
      })
      .catch(() => {
        setFlights([]);
        setTotal(0);
      });
  }, [searchParams, page]);

  const handleSearch = (params: FlightSearchParams) => {
    setDestination(params.to ?? '');
    setSearchParams(params);
    setPage(1);
  };

  const title = destination
    ? `Flights to ${destination.charAt(0).toUpperCase()}${destination.slice(1).toLowerCase()}`
    : 'Upcoming flights';
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handleSelect = (flight: Flight) => {
    navigate(`/booking/${flight.id}`, {
      state: { adults: travellers.adults, children: travellers.children },
    });
  };

  return (
    <section className="flight-catalog">
      <SearchForm
        onSearch={handleSearch}
        travellers={travellers}
        onTravellersChange={setTravellers}
      />
      <h2 className="title">{title}</h2>
      <section className="flight-list">
        {flights.length === 0 ? (
          <p className="no-found">No flights found</p>
        ) : null}
        {flights.map((flight) => (
          <FlightCard key={flight.id} flight={flight} onSelect={handleSelect} />
        ))}
      </section>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </section>
  );
};

export default Home;

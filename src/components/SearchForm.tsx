import { useState } from 'react';
import Input from './UI/Input.tsx';
import Button from './UI/Button.tsx';
import DateInput from './DateInput.tsx';
import TravellersPopup, { type TravellersValue } from './TravellersPopup.tsx';
import type { FlightSearchParams } from '../api/flights.api';
import classes from '../styles/SearchForm.module.scss';
import airplaneFrom from '../assets/icons/airplane-from.svg';
import airplaneTo from '../assets/icons/airplane-to.svg';
import swap from '../assets/icons/vice-versa.svg';
import clear from '../assets/icons/delete.svg';
import person from '../assets/icons/user.svg';

interface SearchFormProps {
  onSearch: (params: FlightSearchParams) => void;
  travellers: TravellersValue;
  onTravellersChange: (value: TravellersValue) => void;
}

function formatTravellers({ adults, children }: TravellersValue): string {
  const parts = [`${adults} adult${adults !== 1 ? 's' : ''}`];
  if (children > 0)
    parts.push(`${children} ${children !== 1 ? 'kids' : 'child'}`);
  return parts.join(', ');
}

function toIsoDate(displayDate: string): string | undefined {
  const [day, month, year] = displayDate.split('.').map(Number);
  if (!day || !month || !year) return undefined;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

const SearchForm = ({
  onSearch,
  travellers,
  onTravellersChange,
}: SearchFormProps) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [isPopupOpen, setPopupOpen] = useState(false);

  const isFiltered =
    Boolean(from || to || date) ||
    travellers.adults !== 1 ||
    travellers.children !== 0;

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const handleSearch = () => {
    onSearch({
      from: from || undefined,
      to: to || undefined,
      date: date ? toIsoDate(date) : undefined,
    });
  };

  const handleClear = () => {
    setFrom('');
    setTo('');
    setDate('');
    onTravellersChange({ adults: 1, children: 0 });
    onSearch({});
  };

  return (
    <>
      {isPopupOpen && (
        <div className={classes.backdrop} onClick={() => setPopupOpen(false)} />
      )}
      <div className={`${classes['search-form']} block`}>
        <Input
          icon={airplaneFrom}
          placeholder="Leaving from"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />

        <button
          className={classes.swap}
          type="button"
          onClick={handleSwap}
          aria-label="Swap origin and destination"
        >
          <img src={swap} alt="" />
        </button>

        <Input
          icon={airplaneTo}
          placeholder="Going to"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />

        <DateInput value={date} onChange={setDate} />

        <div className={classes.travellers}>
          <button type="button" onClick={() => setPopupOpen((prev) => !prev)}>
            <img src={person} alt="" />
            {formatTravellers(travellers)}
          </button>
          {isPopupOpen && (
            <TravellersPopup
              value={travellers}
              onDone={onTravellersChange}
              onClose={() => setPopupOpen(false)}
            />
          )}
        </div>

        <Button
          className={`${classes['search-btn']} bounce-hover`}
          type="button"
          onClick={handleSearch}
        >
          SEARCH
        </Button>
        <Button
          className={`${!isFiltered ? classes.hidden : ''} ${classes['clear-filter']} bounce-hover`}
          type="button"
          onClick={handleClear}
        >
          <img src={clear} alt="" />
        </Button>
      </div>
    </>
  );
};

export default SearchForm;

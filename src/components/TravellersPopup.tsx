import { useState } from 'react';
import classes from '../styles/TravellersPopup.module.scss';
import plus from '../assets/icons/plus.svg';
import minus from '../assets/icons/minus.svg';

export interface TravellersValue {
  adults: number;
  children: number;
}

interface TravellersPopupProps {
  value: TravellersValue;
  onDone: (value: TravellersValue) => void;
  onClose: () => void;
}

const TravellersPopup = ({ value, onDone, onClose }: TravellersPopupProps) => {
  const [draft, setDraft] = useState<TravellersValue>(value);

  const update = (key: keyof TravellersValue, delta: number) => {
    setDraft((prev) => {
      const min = key === 'adults' ? 1 : 0;
      const next = { ...prev, [key]: Math.max(min, prev[key] + delta) };

      const total = next.adults + next.children;
      if (total > 9) return prev;

      return next;
    });
  };

  return (
    <div className={`block ${classes.popup}`}>
      <div className={classes.row}>
        <span>Adults</span>
        <div className={classes.counter}>
          <button
            className="bounce-hover"
            type="button"
            onClick={() => update('adults', -1)}
          >
            <img src={minus} alt="" />
          </button>
          <span>{draft.adults}</span>
          <button
            className="bounce-hover"
            type="button"
            onClick={() => update('adults', 1)}
          >
            <img src={plus} alt="" />
          </button>
        </div>
      </div>

      <div className={classes.row}>
        <span>Children</span>
        <div className={classes.counter}>
          <button
            className="bounce-hover"
            type="button"
            onClick={() => update('children', -1)}
          >
            <img src={minus} alt="" />
          </button>
          <span>{draft.children}</span>
          <button
            className="bounce-hover"
            type="button"
            onClick={() => update('children', 1)}
          >
            <img src={plus} alt="" />
          </button>
        </div>
      </div>

      <button
        className={`${classes.btn} bounce-hover`}
        type="button"
        onClick={() => {
          onDone(draft);
          onClose();
        }}
      >
        Done
      </button>
    </div>
  );
};

export default TravellersPopup;

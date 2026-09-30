import { useEffect, useState, type ChangeEvent, type JSX } from 'react';
import classes from '../styles/DateInput.module.scss';
import calendar from '../assets/icons/calendar.svg';

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function parseDate(value: string): Date | null {
  const [day, month, year] = value.split('.').map(Number);
  if (!day || !month || !year) return null;
  return new Date(year, month - 1, day);
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  minYear?: number;
  maxYear?: number;
  placeholder?: string;
}

const DateInput = ({
  value,
  onChange,
  minYear = new Date().getFullYear(),
  maxYear = new Date().getFullYear() + 3,
  placeholder = 'Travel dates',
}: DateInputProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [draftDate, setDraftDate] = useState<Date>(
    () => parseDate(value) ?? new Date()
  );
  const [year, setYear] = useState(draftDate.getFullYear());
  const [month, setMonth] = useState(draftDate.getMonth());
  const [dates, setDates] = useState<JSX.Element[]>([]);

  const yearArray = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => minYear + i
  );

  useEffect(() => {
    displayDates();
  }, [year, month, draftDate]);

  function close() {
    setIsVisible(false);
  }

  function toggleDatepicker() {
    if (!isVisible) {
      const parsed = parseDate(value) ?? new Date();
      setDraftDate(parsed);
      setYear(parsed.getFullYear());
      setMonth(parsed.getMonth());
      setIsVisible(true);
    } else {
      close();
    }
  }

  function handleCancel() {
    close();
  }

  function handleApply() {
    onChange(formatDate(draftDate));
    close();
  }

  function handlePrevMonth() {
    if (month === 0) {
      setYear((prev) => prev - 1);
      setMonth(11);
    } else {
      setMonth((prev) => prev - 1);
    }
  }

  function handleNextMonth() {
    if (month === 11) {
      setYear((prev) => prev + 1);
      setMonth(0);
    } else {
      setMonth((prev) => prev + 1);
    }
  }

  function handleMonthChange(e: ChangeEvent<HTMLSelectElement>) {
    setMonth(parseInt(e.target.value));
  }

  function handleYearChange(e: ChangeEvent<HTMLSelectElement>) {
    setYear(parseInt(e.target.value));
  }

  function handleDateClick(day: number) {
    setDraftDate(new Date(year, month, day));
  }

  function displayDates() {
    const days: JSX.Element[] = [];

    const prevMonthDaysCount = new Date(year, month, 1).getDay();
    const lastOfPrevMonth = new Date(year, month, 0);
    for (let i = 0; i < prevMonthDaysCount; i++) {
      const text = lastOfPrevMonth.getDate() - prevMonthDaysCount + 1 + i;
      days.push(
        <button key={`prev-${i}`} type="button" disabled>
          {text}
        </button>
      );
    }

    const lastOfMonth = new Date(year, month + 1, 0);
    for (let i = 1; i <= lastOfMonth.getDate(); i++) {
      const isSelected =
        draftDate.getDate() === i &&
        draftDate.getFullYear() === year &&
        draftDate.getMonth() === month;
      days.push(
        <button
          key={`current-${i}`}
          type="button"
          onClick={() => handleDateClick(i)}
          id={isSelected ? classes.selected : ''}
        >
          {i}
        </button>
      );
    }

    const firstOfNextMonth = new Date(year, month + 1, 1);
    const nextMonthDaysCount =
      firstOfNextMonth.getDay() === 0 ? 0 : 7 - firstOfNextMonth.getDay();
    for (let i = 0; i < nextMonthDaysCount; i++) {
      days.push(
        <button key={`next-${i}`} type="button" disabled>
          {i + 1}
        </button>
      );
    }

    setDates(days);
  }

  return (
    <div className={classes.wrapper}>
      <div
        className={`input-block ${classes.trigger}`}
        onClick={toggleDatepicker}
      >
        <img src={calendar} alt="" />
        <input
          className="input-icon input"
          readOnly
          value={value || placeholder}
          type="text"
          aria-label={placeholder}
        />
      </div>

      {isVisible && <div className={classes.backdrop} onClick={close} />}

      {isVisible && (
        <div className={`block ${classes.datepicker}`}>
          <div className={classes.header}>
            <button
              type="button"
              className={classes.navBtn}
              onClick={handlePrevMonth}
              aria-label="Previous month"
            >
              ‹
            </button>
            <select
              className={classes.select}
              value={month}
              onChange={handleMonthChange}
            >
              {monthNames.map((m, index) => (
                <option value={index} key={m}>
                  {m}
                </option>
              ))}
            </select>
            <select
              className={classes.select}
              value={year}
              onChange={handleYearChange}
            >
              {yearArray.map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
            <button
              type="button"
              className={classes.navBtn}
              onClick={handleNextMonth}
              aria-label="Next month"
            >
              ›
            </button>
          </div>

          <div className={classes.dayNames}>
            {dayNames.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className={classes.dates}>{dates}</div>

          <div className={classes.footer}>
            <button
              type="button"
              className={`${classes.cancel} bounce-hover`}
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="button"
              className={`${classes.apply} bounce-hover`}
              onClick={handleApply}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateInput;

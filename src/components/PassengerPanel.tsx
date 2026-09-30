import { Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../store/authStore';
import {
  bookingSchema,
  type BookingFormValues,
  type Passenger,
} from '../schemas/booking.schema';
import PassengerFieldset from './PassengerFieldset.tsx';
import classes from '../styles/BookingConfirm.module.scss';
import edit from '../assets/icons/edit.svg';

const emptyPassenger: Passenger = {
  firstName: '',
  lastName: '',
  sex: 'male',
  dateOfBirth: '',
};

interface PassengerPanelProps {
  adultsCount: number;
  childrenCount: number;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  savedValues: BookingFormValues | null;
  onSave: (data: BookingFormValues) => void;
}

const PassengerPanel = ({
  adultsCount,
  childrenCount,
  isEditing,
  setIsEditing,
  savedValues,
  onSave,
}: PassengerPanelProps) => {
  const user = useAuthStore((state) => state.user);

  const defaultValues: BookingFormValues = {
    adults: Array.from({ length: adultsCount }, (_, i) =>
      i === 0
        ? {
            ...emptyPassenger,
            firstName: user?.firstName ?? '',
            lastName: user?.lastName ?? '',
          }
        : { ...emptyPassenger }
    ),
    children: Array.from({ length: childrenCount }, () => ({
      ...emptyPassenger,
    })),
    agree: false,
  };

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues,
  });

  const handleSave = (data: BookingFormValues) => {
    onSave(data);
    setIsEditing(false);
  };

  const handleCancel = handleSubmit(() => {
    if (!savedValues) return;
    reset(savedValues);
    setIsEditing(false);
  });

  return (
    <div className={`${classes['passengers-panel']} block`}>
      <div className={classes.header}>
        <h2>Passenger information{isEditing ? ' - Edit mode' : ''}</h2>
        {!isEditing && (
          <button
            className="bounce-hover"
            type="button"
            onClick={() => setIsEditing(true)}
            aria-label="Edit passengers"
          >
            <img src={edit} alt="" />
          </button>
        )}
      </div>
      <hr className="divider" />
      {isEditing ? (
        <form onSubmit={handleSubmit(handleSave)}>
          {Array.from({ length: adultsCount }, (_, i) => (
            <Fragment key={`adult-${i}`}>
              <PassengerFieldset
                kind="adults"
                index={i}
                label="Adult"
                register={register}
                control={control}
                errors={errors}
              />
              {i !== adultsCount - 1 && <hr className="divider" />}
            </Fragment>
          ))}

          {Array.from({ length: childrenCount }, (_, i) => (
            <Fragment key={`child-${i}`}>
              <hr className="divider" />
              <PassengerFieldset
                kind="children"
                index={i}
                label="Child"
                register={register}
                control={control}
                errors={errors}
              />
            </Fragment>
          ))}

          <div className={classes.checkbox}>
            <div>
              <input id="checkbox" type="checkbox" hidden {...register('agree')} />
              <label className="block" htmlFor="checkbox"></label>
              <p>I agree to the processing of my personal data</p>
            </div>
            {errors.agree && <p className="error">{errors.agree.message}</p>}
          </div>

          <div className={classes.btns}>
            <button className="button bounce-hover" type="submit">
              Save
            </button>
            <button
              className="button bounce-hover"
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div>
          {savedValues?.adults.map((p, i) => (
            <div className={classes.group} key={`adult-view-${i}`}>
              <h3>{i + 1} Adult:</h3>
              <p>
                <strong>Fullname:</strong> {p.firstName} {p.lastName}
              </p>
              <p>
                <strong>Sex:</strong> {p.sex}
              </p>
              <p>
                <strong>DateOfBirth:</strong> {p.dateOfBirth}
              </p>
              {i === 0 && (
                <p>
                  <strong>Email:</strong> {user?.email}
                </p>
              )}
              {savedValues?.adults.length - 1 !== i ? (
                <hr className="divider" />
              ) : null}
            </div>
          ))}
          {savedValues?.children.map((p, i) => (
            <div className={classes.group} key={`child-view-${i}`}>
              <hr className="divider" />
              <h3>{i + 1} Child:</h3>
              <p>
                <strong>Fullname:</strong> {p.firstName} {p.lastName}
              </p>
              <p>
                <strong>Sex:</strong> {p.sex}
              </p>
              <p>
                <strong>DateOfBirth:</strong> {p.dateOfBirth}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PassengerPanel;

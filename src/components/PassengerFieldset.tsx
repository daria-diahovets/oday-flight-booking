import { Controller } from 'react-hook-form';
import type {
  Control,
  FieldErrors,
  Path,
  UseFormRegister,
} from 'react-hook-form';
import type { BookingFormValues, Passenger } from '../schemas/booking.schema';
import Input from './UI/Input.tsx';
import DateInput from './DateInput.tsx';
import classes from '../styles/PassengerFieldset.module.scss';

type PassengerKind = 'adults' | 'children';

interface PassengerFieldsetProps {
  kind: PassengerKind;
  index: number;
  label: string;
  register: UseFormRegister<BookingFormValues>;
  control: Control<BookingFormValues>;
  errors: FieldErrors<BookingFormValues>;
}

const currentYear = new Date().getFullYear();

const PassengerFieldset = ({
  kind,
  index,
  label,
  register,
  control,
  errors,
}: PassengerFieldsetProps) => {
  const passengerErrors = errors[kind]?.[index];

  const fieldName = <F extends keyof Passenger>(field: F) =>
    `${kind}.${index}.${field}` as Path<BookingFormValues>;

  return (
    <fieldset className={classes.fieldset}>
      <legend>
        {index + 1} {label}:
      </legend>

      <label>Fullname:</label>
      <div className={classes['d-flex']}>
        <div>
          <Input
            placeholder="First Name"
            {...register(fieldName('firstName'))}
          />
          {passengerErrors?.firstName && (
            <p className="error">{passengerErrors.firstName.message}</p>
          )}
        </div>
        <div>
          <Input placeholder="Last Name" {...register(fieldName('lastName'))} />

          {passengerErrors?.lastName && (
            <p className="error">{passengerErrors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className={classes['d-flex']}>
        <div>
          <label>Sex:</label>
          <div className="select-wrapper">
            <select
              className={`${classes.select} input`}
              {...register(fieldName('sex'))}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          {passengerErrors?.sex && (
            <p className="error">{passengerErrors.sex.message}</p>
          )}
        </div>

        <div className={classes['date-of-birth']}>
          <label>Date Of Birth:</label>
          <Controller
            control={control}
            name={fieldName('dateOfBirth')}
            render={({ field }) => (
              <DateInput
                value={field.value as string}
                onChange={field.onChange}
                minYear={1950}
                maxYear={currentYear}
                placeholder="Date of birth"
              />
            )}
          />
          {passengerErrors?.dateOfBirth && (
            <p className="error">{passengerErrors.dateOfBirth.message}</p>
          )}
        </div>
      </div>
    </fieldset>
  );
};

export default PassengerFieldset;

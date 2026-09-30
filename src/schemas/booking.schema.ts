import { z } from 'zod';

const ADULT_MIN_AGE = 18;

function getAge(dateOfBirth: string): number | null {
  const [day, month, year] = dateOfBirth.split('.').map(Number);
  if (!day || !month || !year) return null;

  const birthDate = new Date(year, month - 1, day);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const isBirthdayPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
  if (!isBirthdayPassed) age--;

  return age;
}

export const passengerSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  sex: z.enum(['male', 'female'], { message: 'Select sex' }),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
});

const adultPassengerSchema = passengerSchema.refine(
  (passenger) => {
    const age = getAge(passenger.dateOfBirth);
    return age === null || age >= ADULT_MIN_AGE;
  },
  { message: 'You are too young for an adult', path: ['dateOfBirth'] }
);

const childPassengerSchema = passengerSchema.refine(
  (passenger) => {
    const age = getAge(passenger.dateOfBirth);
    return age === null || age < ADULT_MIN_AGE;
  },
  { message: 'You are too old for a child', path: ['dateOfBirth'] }
);

export const bookingSchema = z.object({
  adults: z.array(adultPassengerSchema).min(1),
  children: z.array(childPassengerSchema),
  agree: z.boolean().refine((value) => value, {
    message: 'You must agree to the processing of your personal data',
  }),
});

export type Passenger = z.infer<typeof passengerSchema>;
export type BookingFormValues = z.infer<typeof bookingSchema>;

import { z } from 'zod';

const passengerSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  sex: z.enum(['male', 'female']),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
});

export const orderRequestSchema = z.object({
  flightId: z.string().uuid(),
  adults: z.array(passengerSchema).min(1),
  children: z.array(passengerSchema),
});

export type OrderRequestInput = z.infer<typeof orderRequestSchema>;

export const confirmOrderSchema = orderRequestSchema.extend({
  paymentIntentId: z.string().min(1),
});

export type ConfirmOrderInput = z.infer<typeof confirmOrderSchema>;

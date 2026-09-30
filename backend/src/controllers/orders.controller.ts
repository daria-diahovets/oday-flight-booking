import type { Response } from 'express';
import { pool } from '../db/pool.js';
import { stripe } from '../utils/stripe.js';
import type { AuthRequest } from '../middleware/auth.middleware.js';
import type {
  OrderRequestInput,
  ConfirmOrderInput,
} from '../schemas/orders.schema.js';

export async function getUserOrders(req: AuthRequest, res: Response) {
  try {
    const result = await pool.query(
      `SELECT
         orders.id,
         orders.total_price,
         orders.created_at,
         origin.name AS origin_city,
         destination.name AS destination_city,
         flights.departure_time,
         flights.arrival_time,
         airlines.name AS airline_name,
         COUNT(*) FILTER (WHERE tickets.passenger_type = 'adult')::int AS adults_count,
         COUNT(*) FILTER (WHERE tickets.passenger_type = 'child')::int AS children_count
       FROM orders
       JOIN tickets ON tickets.order_id = orders.id
       JOIN flights ON flights.id = tickets.flight_id
       JOIN cities origin ON origin.id = flights.origin_city_id
       JOIN cities destination ON destination.id = flights.destination_city_id
       JOIN airlines ON airlines.id = flights.airline_id
       WHERE orders.user_id = $1 AND orders.status = 'paid'
       GROUP BY
         orders.id, origin.name, destination.name,
         flights.departure_time, flights.arrival_time, airlines.name
       ORDER BY orders.created_at DESC`,
      [req.userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Get user orders error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getOrderById(req: AuthRequest, res: Response) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT
         orders.id,
         orders.total_price,
         orders.created_at,
         origin.name AS origin_city,
         destination.name AS destination_city,
         flights.departure_time,
         flights.arrival_time,
         airlines.name AS airline_name,
         tickets.passenger_first_name,
         tickets.passenger_last_name,
         tickets.passenger_type,
         tickets.price
       FROM orders
       JOIN tickets ON tickets.order_id = orders.id
       JOIN flights ON flights.id = tickets.flight_id
       JOIN cities origin ON origin.id = flights.origin_city_id
       JOIN cities destination ON destination.id = flights.destination_city_id
       JOIN airlines ON airlines.id = flights.airline_id
       WHERE orders.id = $1 AND orders.user_id = $2
       ORDER BY
         CASE tickets.passenger_type WHEN 'adult' THEN 0 ELSE 1 END,
         tickets.created_at`,
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const first = result.rows[0];
    res.json({
      id: first.id,
      total_price: first.total_price,
      created_at: first.created_at,
      origin_city: first.origin_city,
      destination_city: first.destination_city,
      departure_time: first.departure_time,
      arrival_time: first.arrival_time,
      airline_name: first.airline_name,
      tickets: result.rows.map((row) => ({
        first_name: row.passenger_first_name,
        last_name: row.passenger_last_name,
        type: row.passenger_type,
        price: row.price,
      })),
    });
  } catch (err) {
    console.error('Get order error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createOrderIntent(req: AuthRequest, res: Response) {
  const { flightId, adults, children } = req.body as OrderRequestInput;
  const totalPassengers = adults.length + children.length;

  try {
    const flightResult = await pool.query(
      `SELECT price_adult, price_child, seats_available FROM flights WHERE id = $1`,
      [flightId]
    );

    const flight = flightResult.rows[0];
    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }

    if (flight.seats_available < totalPassengers) {
      return res.status(409).json({ error: 'Not enough seats available' });
    }

    const totalPrice =
      adults.length * Number(flight.price_adult) +
      children.length * Number(flight.price_child);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100),
      currency: 'eur',
      payment_method_types: ['card'],
      metadata: { flightId, userId: req.userId ?? '' },
    });

    res.json({ clientSecret: paymentIntent.client_secret, totalPrice });
  } catch (err) {
    console.error('Create order intent error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function confirmOrder(req: AuthRequest, res: Response) {
  const { flightId, adults, children, paymentIntentId } =
    req.body as ConfirmOrderInput;
  const totalPassengers = adults.length + children.length;

  let paymentIntent;
  try {
    paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  } catch (err) {
    console.error('Retrieve payment intent error:', err);
    return res.status(400).json({ error: 'Invalid payment' });
  }

  if (paymentIntent.status !== 'succeeded') {
    return res.status(402).json({ error: 'Payment was not completed' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const flightResult = await client.query(
      `SELECT price_adult, price_child, seats_available
       FROM flights
       WHERE id = $1
       FOR UPDATE`,
      [flightId]
    );

    const flight = flightResult.rows[0];
    if (!flight) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Flight not found' });
    }

    if (flight.seats_available < totalPassengers) {
      await client.query('ROLLBACK');
      await stripe.refunds.create({ payment_intent: paymentIntentId });
      return res.status(409).json({
        error: 'Not enough seats available, payment has been refunded',
      });
    }

    const totalPrice =
      adults.length * Number(flight.price_adult) +
      children.length * Number(flight.price_child);

    const orderResult = await client.query(
      `INSERT INTO orders (user_id, status, total_price)
       VALUES ($1, 'paid', $2)
       RETURNING id, created_at`,
      [req.userId, totalPrice]
    );
    const order = orderResult.rows[0];

    for (const passenger of adults) {
      await client.query(
        `INSERT INTO tickets
           (order_id, flight_id, passenger_first_name, passenger_last_name, passenger_type, price)
         VALUES ($1, $2, $3, $4, 'adult', $5)`,
        [
          order.id,
          flightId,
          passenger.firstName,
          passenger.lastName,
          flight.price_adult,
        ]
      );
    }

    for (const passenger of children) {
      await client.query(
        `INSERT INTO tickets
           (order_id, flight_id, passenger_first_name, passenger_last_name, passenger_type, price)
         VALUES ($1, $2, $3, $4, 'child', $5)`,
        [
          order.id,
          flightId,
          passenger.firstName,
          passenger.lastName,
          flight.price_child,
        ]
      );
    }

    await client.query(
      `UPDATE flights SET seats_available = seats_available - $1 WHERE id = $2`,
      [totalPassengers, flightId]
    );

    await client.query('COMMIT');

    res.status(201).json({
      orderId: order.id,
      totalPrice,
      createdAt: order.created_at,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Confirm order error:', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
}

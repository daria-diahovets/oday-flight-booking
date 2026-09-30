import type { Request, Response } from 'express';
import { pool } from '../db/pool.js';

export async function getFlightById(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT
         flights.id,
         origin.name AS origin_city,
         destination.name AS destination_city,
         flights.departure_time,
         flights.arrival_time,
         flights.price_adult,
         flights.price_child,
         flights.seats_available,
         flights.seats_total,
         airlines.name AS airline_name
       FROM flights
              JOIN cities origin ON origin.id = flights.origin_city_id
              JOIN cities destination ON destination.id = flights.destination_city_id
              JOIN airlines ON airlines.id = flights.airline_id
       WHERE flights.id = $1`,
      [id]
    );

    const flight = result.rows[0];
    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }

    res.json(flight);
  } catch (err) {
    console.error('Get flight error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function listFlights(req: Request, res: Response) {
  const { from, to, date, limit, offset } = req.query as {
    from?: string;
    to?: string;
    date?: string;
    limit?: string;
    offset?: string;
  };

  const conditions: string[] = ['flights.seats_available > 0'];
  const values: unknown[] = [];

  if (from) {
    values.push(`%${from}%`);
    conditions.push(`origin.name ILIKE $${values.length}`);
  }
  if (to) {
    values.push(`%${to}%`);
    conditions.push(`destination.name ILIKE $${values.length}`);
  }
  if (date) {
    values.push(date);
    conditions.push(`flights.departure_time::date = $${values.length}::date`);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(' AND ')}`
    : '';

  const resultLimit = Number(limit) || 8;
  const resultOffset = Number(offset) || 0;
  values.push(resultLimit);
  const limitIndex = values.length;
  values.push(resultOffset);
  const offsetIndex = values.length;

  try {
    const result = await pool.query(
      `SELECT
         flights.id,
         origin.name AS origin_city,
         destination.name AS destination_city,
         flights.departure_time,
         flights.arrival_time,
         flights.price_adult,
         flights.price_child,
         airlines.name AS airline_name,
         COUNT(*) OVER() AS total_count
       FROM flights
       JOIN cities origin ON origin.id = flights.origin_city_id
       JOIN cities destination ON destination.id = flights.destination_city_id
       JOIN airlines ON airlines.id = flights.airline_id
       ${whereClause}
       ORDER BY flights.departure_time ASC
       LIMIT $${limitIndex} OFFSET $${offsetIndex}`,
      values
    );

    const total = result.rows[0] ? Number(result.rows[0].total_count) : 0;
    const flights = result.rows.map(
      ({ total_count: _totalCount, ...flight }) => flight
    );

    res.json({ flights, total });
  } catch (err) {
    console.error('List flights error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

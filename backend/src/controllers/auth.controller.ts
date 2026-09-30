import type { Request, Response } from 'express';
import { pool } from '../db/pool.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';
import { env } from '../config/env.js';
import type { RegisterInput, LoginInput } from '../schemas/auth.schema.js';
import type { AuthRequest } from '../middleware/auth.middleware.js';

const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function setAuthCookie(res: Response, userId: string) {
  const token = signToken({ userId });
  res.cookie('token', token, AUTH_COOKIE_OPTIONS);
}

export async function register(req: Request, res: Response) {
  const { firstName, lastName, email, password } = req.body as RegisterInput;

  try {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [
      email,
    ]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await hashPassword(password);

    const result = await pool.query(
      `INSERT INTO users (first_name, last_name, email, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING id, first_name, last_name, email`,
      [firstName, lastName, email, passwordHash]
    );

    const user = result.rows[0];
    setAuthCookie(res, user.id);

    res.status(201).json({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as LoginInput;

  try {
    const result = await pool.query(
      `SELECT id, first_name, last_name, email, password_hash
       FROM users WHERE email = $1`,
      [email]
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatches = await comparePassword(password, user.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    setAuthCookie(res, user.id);

    res.json({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function me(req: AuthRequest, res: Response) {
  try {
    const result = await pool.query(
      `SELECT id, first_name, last_name, email FROM users WHERE id = $1`,
      [req.userId]
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
    });
  } catch (err) {
    console.error('Me error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export function logout(_req: Request, res: Response) {
  res.clearCookie('token', AUTH_COOKIE_OPTIONS);
  res.status(204).send();
}

import pool from './index';
import { User } from '../models/user';

// Interface for user update data
export interface UpdateUserData {
  name?: string;
  email?: string;
  picture?: string;
}

export async function findByGoogleId(googleId: string): Promise<User | null> {
  const res = await pool.query('SELECT * FROM users WHERE google_id = $1', [googleId]);
  return res.rows[0] || null;
}

export async function findByEmail(email: string): Promise<User | null> {
  const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return res.rows[0] || null;
}

export async function createUser(user: Omit<User, "id">): Promise<User> {
  const res = await pool.query(
    'INSERT INTO users (name, email, picture, google_id, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [user.name, user.email, user.picture, user.googleId, user.createdAt]
  );
  return res.rows[0];
}

export async function findById(id: number): Promise<User | null> {
  const res = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return res.rows[0] || null;
}

// Get all users with pagination
export async function getAllUsers(limit: number = 10, offset: number = 0): Promise<User[]> {
  const res = await pool.query(
    'SELECT * FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
    [limit, offset]
  );
  return res.rows;
}

// Update user information
export async function updateUser(id: number, updateData: UpdateUserData): Promise<User> {
  const fields: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  if (updateData.name !== undefined) {
    fields.push(`name = $${paramCount}`);
    values.push(updateData.name);
    paramCount++;
  }

  if (updateData.email !== undefined) {
    fields.push(`email = $${paramCount}`);
    values.push(updateData.email);
    paramCount++;
  }

  if (updateData.picture !== undefined) {
    fields.push(`picture = $${paramCount}`);
    values.push(updateData.picture);
    paramCount++;
  }

  if (fields.length === 0) {
    throw new Error('No fields to update');
  }

  values.push(id);
  const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
  
  const res = await pool.query(query, values);
  if (res.rows.length === 0) {
    throw new Error('User not found');
  }
  
  return res.rows[0];
}

// Delete user by ID
export async function deleteUser(id: number): Promise<void> {
  const res = await pool.query('DELETE FROM users WHERE id = $1', [id]);
  if (res.rowCount === 0) {
    throw new Error('User not found');
  }
}

// Get user count for pagination
export async function getUserCount(): Promise<number> {
  const res = await pool.query('SELECT COUNT(*) FROM users');
  return parseInt(res.rows[0].count);
}
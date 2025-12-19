import { sql } from '@vercel/postgres';

/**
 * Database utility functions for Vercel Postgres
 * 
 * This module provides helper functions to interact with the Vercel Postgres database.
 * The connection is automatically configured using environment variables.
 */

/**
 * Execute a raw SQL query
 * @param query - SQL query string
 * @param params - Query parameters
 * @returns Query result
 */
export async function query(query: string, params?: unknown[]) {
  try {
    const result = await sql.query(query, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * Initialize database tables
 * This is an example function that creates initial tables
 */
export async function initDatabase() {
  try {
    // Example: Create a users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

/**
 * Example: Get all users
 */
export async function getUsers() {
  try {
    const { rows } = await sql`SELECT * FROM users`;
    return rows;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

/**
 * Example: Create a new user
 */
export async function createUser(name: string, email: string) {
  try {
    const { rows } = await sql`
      INSERT INTO users (name, email)
      VALUES (${name}, ${email})
      RETURNING *
    `;
    return rows[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

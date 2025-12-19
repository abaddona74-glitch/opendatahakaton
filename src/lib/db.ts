import { createClient as createVercelClient, sql as vercelSql } from '@vercel/postgres';

// Prefer a direct (non-pooling) connection string when available in development
// to avoid DNS/resolution issues with pooler endpoints in some environments.
let sql = vercelSql;
if (process.env.POSTGRES_URL_NON_POOLING) {
  try {
    const client = createVercelClient({ connectionString: process.env.POSTGRES_URL_NON_POOLING });
    sql = client.sql.bind(client) as typeof vercelSql;
  } catch (e) {
    // If creating a direct client fails, fall back to the default proxy `vercelSql`.
    // The error will surface when queries run.
    console.warn('Failed to create direct Postgres client, falling back to pooled client.', e);
  }
}

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

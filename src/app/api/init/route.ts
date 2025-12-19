import { NextResponse } from 'next/server';
import { initDatabase } from '@/lib/db';

/**
 * GET /api/init
 * Initialize the database with required tables
 */
export async function GET() {
  try {
    await initDatabase();
    return NextResponse.json(
      { message: 'Database initialized successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Database initialization error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize database' },
      { status: 500 }
    );
  }
}

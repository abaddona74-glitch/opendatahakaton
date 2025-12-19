import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Dynamically import the seed script to run it (seed.ts self-invokes main()).
    // WARNING: For production this is not recommended; this route is for local/dev use.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    await import('../../../../prisma/seed');
    return NextResponse.json({ ok: true, message: 'Seed executed (check logs)' });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
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

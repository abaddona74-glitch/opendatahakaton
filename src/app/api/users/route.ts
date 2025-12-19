import { NextResponse } from 'next/server';
import { getUsers, createUser } from '@/lib/prisma';

/**
 * GET /api/users
 * Fetch all users from the database
 */
export async function GET() {
  try {
    const users = await getUsers();
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/users
 * Create a new user
 * Body: { name: string, email: string }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    const user = await createUser(name, email);
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data.users || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    try {
      setSubmitting(true);
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      setName('');
      setEmail('');
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-8 font-sans dark:bg-black">
      <main className="w-full max-w-4xl">
        <div className="mb-8 text-center">
          <Image
            className="dark:invert mx-auto mb-4"
            src="/next.svg"
            alt="Next.js logo"
            width={150}
            height={30}
            priority
          />
          <h1 className="text-4xl font-bold text-black dark:text-white mb-2">
            OpenData Hakaton
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Next.js Frontend & Backend with Vercel Postgres
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
            Add New User
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-zinc-400 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Adding...' : 'Add User'}
            </button>
          </form>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
            Users List
          </h2>
          {loading ? (
            <p className="text-zinc-600 dark:text-zinc-400">Loading users...</p>
          ) : error ? (
            <div className="text-red-600 dark:text-red-400">
              <p className="font-medium">Error: {error}</p>
              <p className="text-sm mt-2">
                Make sure your database is configured. Visit{' '}
                <a href="/api/init" className="underline">
                  /api/init
                </a>{' '}
                to initialize the database.
              </p>
            </div>
          ) : users.length === 0 ? (
            <p className="text-zinc-600 dark:text-zinc-400">
              No users yet. Add one using the form above!
            </p>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="border border-zinc-200 dark:border-zinc-700 rounded-md p-4"
                >
                  <p className="font-medium text-black dark:text-white">{user.name}</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{user.email}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
                    Joined: {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <a
            href="https://nextjs.org/docs"
            className="text-blue-600 dark:text-blue-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Next.js Documentation
          </a>
          {' | '}
          <a
            href="https://vercel.com/docs/storage/vercel-postgres"
            className="text-blue-600 dark:text-blue-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vercel Postgres Documentation
          </a>
        </div>
      </main>
    </div>
  );
}

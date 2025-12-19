'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

const MapView = dynamic(() => import('../../components/MapView'), { ssr: false });

export default function MapPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <header className="sticky top-0 z-10 bg-white/90 dark:bg-zinc-900/90 backdrop-blur border-b border-zinc-200 dark:border-zinc-800">
        <div className="px-4 h-14 flex items-center justify-between">
          <h1 className="text-base sm:text-lg font-semibold text-black dark:text-white">
            OpenData Hakaton — Full Map
          </h1>
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
            ← Back
          </Link>
        </div>
      </header>

      <main className="p-0">
        <MapView className="h-[calc(100vh-56px)] w-full" />
      </main>
    </div>
  );
}

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-8 dark:bg-zinc-900">
      <main className="text-center">
        <h1 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Grandparent Med Tracker
        </h1>
        <p className="mb-6 text-zinc-600 dark:text-zinc-400">
          Test the Vision Hack to extract prescriptions.
        </p>
        <Link
          href="/test-vision"
          className="inline-block rounded-lg bg-zinc-900 px-6 py-3 text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Test Vision Hack
        </Link>
      </main>
    </div>
  );
}

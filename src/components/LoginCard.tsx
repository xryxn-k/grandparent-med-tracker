"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

export default function LoginCard(): React.ReactElement {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    // UI only – no auth logic yet
  }

  return (
    <div className="rounded-2xl border border-glass bg-glass p-8 shadow-diffuse backdrop-blur-md">
      <h1 className="mb-2 text-2xl font-bold text-graphite-olive">Sign in</h1>
      <p className="mb-6 text-sm text-graphite-slate">
        Sign in to manage medication schedules for your family.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="login-email"
            className="mb-1.5 block text-sm font-medium text-graphite-slate"
          >
            Email
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className="w-full rounded-xl border border-glass bg-white/60 px-3 py-2.5 text-graphite-olive placeholder-graphite-muted backdrop-blur-md focus:border-graphite-slate focus:outline-none focus:ring-1 focus:ring-graphite-slate"
            required
          />
        </div>
        <div>
          <label
            htmlFor="login-password"
            className="mb-1.5 block text-sm font-medium text-graphite-slate"
          >
            Password
          </label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            className="w-full rounded-xl border border-glass bg-white/60 px-3 py-2.5 text-graphite-olive placeholder-graphite-muted backdrop-blur-md focus:border-graphite-slate focus:outline-none focus:ring-1 focus:ring-graphite-slate"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-2 w-full rounded-xl bg-graphite-olive px-4 py-2.5 text-sm font-medium text-white shadow-soft transition-colors hover:bg-graphite-slate focus:outline-none focus:ring-2 focus:ring-graphite-slate focus:ring-offset-2 focus:ring-offset-background"
        >
          Sign in
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-graphite-slate">
        New here?{" "}
        <Link
          href="/join"
          className="font-medium text-graphite-olive hover:underline"
        >
          Join with us
        </Link>
      </p>
    </div>
  );
}

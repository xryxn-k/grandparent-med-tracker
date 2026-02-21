"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const SIGNED_IN_KEY = "medcare-signed-in";

export function isSignedIn(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(SIGNED_IN_KEY) === "1";
}

export function setSignedIn(value: boolean): void {
  if (typeof window === "undefined") return;
  if (value) window.localStorage.setItem(SIGNED_IN_KEY, "1");
  else window.localStorage.removeItem(SIGNED_IN_KEY);
}

export default function LandingHeader(): React.ReactElement {
  const [signedIn, setSignedInState] = useState(false);

  useEffect(() => {
    setSignedInState(isSignedIn());
  }, []);

  if (signedIn) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard"
          className="rounded-xl border border-glass bg-glass px-4 py-2 text-sm font-medium text-foreground shadow-soft backdrop-blur-md hover:bg-primary/10"
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="rounded-xl border border-glass bg-glass px-4 py-2 text-sm font-medium text-foreground/80 shadow-soft backdrop-blur-md hover:bg-primary/10"
      >
        Log In
      </Link>
      <Link
        href="/login?tab=signup"
        className="rounded-xl border border-glass bg-primary/30 px-4 py-2 text-sm font-medium text-foreground shadow-soft backdrop-blur-md hover:bg-primary/50"
      >
        Sign Up
      </Link>
    </div>
  );
}

import Link from "next/link";
import { Suspense } from "react";
import LoginCard from "@/components/LoginCard";

export default function LoginPage(): React.ReactElement {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-block text-3xl font-bold tracking-tight text-foreground mb-2"
          >
            MedCare
          </Link>
          <p className="text-muted-foreground">
            Care for your loved ones, one dose at a time
          </p>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <LoginCard />
        </Suspense>
      </div>
    </div>
  );
}
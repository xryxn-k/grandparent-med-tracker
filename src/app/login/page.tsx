import { Suspense } from "react";
import LoginCard from "@/components/LoginCard";

export const metadata = {
  title: "Log In | MedCare",
  description: "Log in or sign up to manage medication schedules for your family.",
};

function LoginCardFallback(): React.ReactElement {
  return (
    <div className="rounded-2xl border border-glass bg-glass p-8 shadow-diffuse backdrop-blur-md">
      <div className="h-10 w-48 animate-pulse rounded-lg bg-graphite-muted/30" />
      <div className="mt-6 h-24 w-full animate-pulse rounded-xl bg-graphite-muted/20" />
      <div className="mt-4 h-24 w-full animate-pulse rounded-xl bg-graphite-muted/20" />
    </div>
  );
}

export default function LoginPage(): React.ReactElement {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 font-sans">
      <div className="absolute inset-0 bg-background" />
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 10v40M10 30h40' stroke='%237CB342' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
        }}
      />

      <main className="relative z-10 w-full max-w-md">
        <Suspense fallback={<LoginCardFallback />}>
          <LoginCard />
        </Suspense>
      </main>
    </div>
  );
}

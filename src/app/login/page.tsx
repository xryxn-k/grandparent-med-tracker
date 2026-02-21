import Link from "next/link";
import LoginCard from "@/components/LoginCard";

export const metadata = {
  title: "Sign in | MedCare",
  description: "Sign in to your MedCare caregiver account.",
};

export default function LoginPage(): React.ReactElement {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden font-sans px-4">
      <div className="absolute inset-0 bg-background" />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 10v40M10 30h40' stroke='%236b6559' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
        }}
      />

      <main className="relative z-10 w-full max-w-md">
        <Link
          href="/dashboard"
          className="mb-8 inline-block text-sm font-medium text-graphite-slate hover:text-graphite-olive"
        >
          ← Back to dashboard
        </Link>
        <LoginCard />
      </main>
    </div>
  );
}

import Link from "next/link";
import FloatingFeatures from "@/components/FloatingFeatures";
import JoinCTA from "@/components/JoinCTA";

export default function Home(): React.ReactElement {
  return (
    <div className="relative min-h-screen overflow-hidden font-sans">
      {/* Med-care background */}
      <div className="absolute inset-0 bg-background" />
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 10v40M10 30h40' stroke='%236b6559' stroke-width='1.5' fill='none'/%3E%3Cpath d='M25 15l10 10 10-10M25 45l10-10 10 10' stroke='%236b6559' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-graphite-blush/25 via-transparent to-graphite-blush/15" />

      <main className="relative z-10 mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 py-4">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-graphite-olive"
          >
            MedCare
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="rounded-xl border border-glass bg-glass px-3 py-2 text-sm font-medium text-graphite-slate shadow-soft backdrop-blur-md hover:bg-white/60"
            >
              Dashboard
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-glass bg-glass px-4 py-2 text-sm font-medium text-graphite-olive shadow-soft backdrop-blur-md hover:bg-white/60"
            >
              Sign in
            </Link>
          </div>
        </header>

        {/* Hero */}
        <section className="py-16 text-center sm:py-24">
          <h1
            className="animate-fade-in-up mx-auto max-w-3xl text-4xl font-bold leading-tight text-graphite-olive sm:text-5xl lg:text-6xl"
            style={{ animationDelay: "0.1s" }}
          >
            Care for your grandparents, one dose at a time
          </h1>
          <p
            className="animate-fade-in-up mx-auto mt-6 max-w-xl text-lg text-graphite-slate"
            style={{ animationDelay: "0.25s" }}
          >
            Upload a prescription or add medicines manually. Our AI helps you
            keep track and never miss a reminder.
          </p>
          <div
            className="animate-fade-in-up mt-12 flex justify-center"
            style={{ animationDelay: "0.4s" }}
          >
            <JoinCTA />
          </div>
        </section>

        {/* Floating feature tags */}
        <section className="relative">
          <FloatingFeatures />
        </section>

        {/* Feature grid */}
        <section className="grid gap-6 py-16 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "AI prescription scan",
              desc: "Upload a photo and we extract medicines, dosage and timings automatically.",
              icon: "📋",
            },
            {
              title: "Manual entry",
              desc: "Prefer to type? Add medicine names, dosage and times in seconds.",
              icon: "✏️",
            },
            {
              title: "Smart reminders",
              desc: "Schedules synced so your family stays on top of every dose.",
              icon: "⏰",
            },
          ].map((item, i) => (
            <div
              key={item.title}
              className="animate-fade-in-up rounded-2xl border border-glass bg-glass p-6 shadow-soft backdrop-blur-md"
              style={{ animationDelay: `${0.5 + i * 0.1}s` }}
            >
              <span className="text-2xl" aria-hidden>
                {item.icon}
              </span>
              <h3 className="mt-3 font-semibold text-graphite-olive">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-graphite-slate">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* Bottom CTA */}
        <section className="py-16 text-center">
          <p className="text-graphite-slate">Ready to get started?</p>
          <div className="mt-4">
            <JoinCTA />
          </div>
        </section>
      </main>
    </div>
  );
}

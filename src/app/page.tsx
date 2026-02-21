import Link from "next/link";
import FloatingFeatures from "@/components/FloatingFeatures";
import LandingHeader from "@/components/LandingHeader";

export default function Home(): React.ReactElement {
  return (
    <div className="relative min-h-screen overflow-hidden font-sans">
      <div className="absolute inset-0 bg-background" />
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 10v40M10 30h40' stroke='%237CB342' stroke-width='1' fill='none'/%3E%3Cpath d='M25 15l10 10 10-10M25 45l10-10 10 10' stroke='%237CB342' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-senior-green/5 via-transparent to-senior-blue/5" />

      {/* Triangular design element in upper right corner */}
      <div className="absolute top-0 right-0 w-full h-1/2 overflow-hidden">
        <div
          className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-bl from-calm-blue via-soft-beige to-warm-gray"
          style={{
            clipPath: 'polygon(100% 0%, 100% 100%, 0% 0%)'
          }}
        >
          {/* Elderly person taking medicine image */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-80 h-80 rounded-full overflow-hidden shadow-2xl border-4 border-white/50">
              <img
                src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Elderly person taking medicine"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-senior-green/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>

      <main className="relative z-10 w-full px-4 py-12 sm:px-6 lg:px-8 lg:pr-[25%]">
        <header className="flex flex-wrap items-center justify-between gap-4 py-4">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-foreground"
          >
            MedCare
          </Link>
          <LandingHeader />
        </header>

        <section className="flex flex-col items-center py-16 text-center sm:py-24 lg:pr-8">
          <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
            Care for your grandparents, one dose at a time
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-foreground/80">
            Upload a prescription or add medicines manually. Our AI helps you
            keep track and never miss a reminder.
          </p>
          <Link
            href="/login"
            className="mt-10 inline-flex rounded-2xl border border-senior-green/30 bg-senior-green/20 px-8 py-4 text-lg font-semibold text-foreground shadow-soft backdrop-blur-md transition-colors hover:bg-senior-green/30"
          >
            Get started
          </Link>
        </section>

        <section className="relative">
          <FloatingFeatures />
        </section>

        <section id="about" className="scroll-mt-24 py-16">
          <h2 className="mb-6 text-2xl font-bold text-foreground">
            About Us
          </h2>
          <div className="rounded-2xl border border-primary/20 bg-glass p-8 shadow-soft backdrop-blur-md">
            <p className="leading-relaxed text-foreground/80">
              MedCare helps families keep their grandparents on track with
              medications. Upload a prescription for AI-powered extraction, or
              add medicines and times manually. View and manage schedules by
              person in your caregiver dashboard, and never miss a dose.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

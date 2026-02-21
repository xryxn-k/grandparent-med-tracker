import Link from "next/link";
import FloatingFeatures from "@/components/FloatingFeatures";
import LandingHeader from "@/components/LandingHeader";

export default function Home(): React.ReactElement {
  return (
    <div className="relative min-h-screen overflow-hidden font-sans bg-gradient-to-br from-background via-background to-background">
      {/* Hero Image Section */}
      <div className="relative w-full h-[70vh] overflow-hidden rounded-br-[4rem] rounded-bl-[2rem] shadow-warm">
        <img
          src="/images/hero-bot-care.jpg"
          alt="An old man receiving medicine from a friendly medical robot"
          className="w-full h-full object-cover"
          style={{
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 85%, 85% 100%, 0% 100%)' // Organic, asymmetrical cutout
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
      </div>

      {/* Overlapping CTA Card */}
      <div className="relative z-20 -mt-16 mx-auto max-w-md bg-card rounded-3xl p-8 shadow-warm border border-border">
        <h2 className="text-2xl font-bold text-foreground mb-4">Get Started</h2>
        <p className="text-muted-foreground mb-6">Upload a prescription or add medicines manually.</p>
        <Link
          href="/login"
          className="inline-flex w-full justify-center rounded-full bg-secondary px-8 py-4 text-lg font-semibold text-secondary-foreground shadow-warm transition-colors hover:bg-primary"
        >
          Start Now
        </Link>
      </div>

      <main className="relative z-10 w-full px-4 py-12 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 py-4">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-foreground"
          >
            MedCare
          </Link>
          <LandingHeader />
        </header>

        <section className="flex flex-col items-center py-16 text-center sm:py-24">
          <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
            Care for your grandparents, one dose at a time
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-foreground/80">
            Upload a prescription or add medicines manually. Our AI helps you
            keep track and never miss a reminder.
          </p>
        </section>

        <section className="relative">
          <FloatingFeatures />
        </section>

        <section id="about" className="scroll-mt-24 py-16">
          <h2 className="mb-6 text-2xl font-bold text-foreground">
            About Us
          </h2>
          <div className="rounded-3xl bg-card p-8 shadow-warm border border-border">
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
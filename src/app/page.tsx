import Link from "next/link";
import Image from "next/image";
import FloatingFeatures from "@/components/FloatingFeatures";

export default function Home(): React.ReactElement {
  return (
    <div className="relative min-h-screen overflow-hidden font-sans bg-gradient-to-br from-background via-background to-background">
      {/* Hero Image Section */}
      <div className="relative w-full h-[70vh] overflow-hidden rounded-br-[4rem] rounded-bl-[2rem] shadow-warm">
        <Image
          src="/images/hero-bot-care.jpg"
          alt="An old man receiving medicine from a friendly medical robot"
          fill
          className="object-cover"
          style={{
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 85%, 85% 100%, 0% 100%)' // Organic, asymmetrical cutout
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
        {/* Overlay Header */}
        <header className="absolute top-0 left-0 right-0 z-30 flex flex-wrap items-center justify-between gap-4 p-6">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-3xl font-bold tracking-tight text-white drop-shadow-lg"
            >
              MedCare
            </Link>
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white shadow-soft backdrop-blur-md hover:bg-white/20"
              >
                Log In
              </Link>
              <Link
                href="/login?tab=signup"
                className="rounded-xl border border-white/20 bg-white/20 px-4 py-2 text-sm font-medium text-white shadow-soft backdrop-blur-md hover:bg-white/30"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </header>
      </div>

      {/* Overlapping CTA Card */}
      <div className="relative z-20 -mt-20 mx-auto max-w-2xl bg-card/95 backdrop-blur-md rounded-3xl p-10 shadow-2xl border border-border/50">
        <h2 className="text-4xl font-bold text-foreground mb-6 text-center">Get Started</h2>
        <p className="text-muted-foreground mb-10 text-center text-lg">Upload a prescription or add medicines manually to start caring for your loved ones.</p>
        <div className="flex justify-center">
          <Link
            href="/login"
            className="inline-flex justify-center rounded-full bg-primary px-12 py-4 text-xl font-semibold text-primary-foreground shadow-warm transition-all hover:bg-primary/90 hover:scale-105"
          >
            Get Started
          </Link>
        </div>
      </div>

      <main className="relative z-10 w-full px-4 py-20 sm:px-6 lg:px-8">

        <section className="flex flex-col items-center py-20 text-center sm:py-28">
          <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-tight text-foreground sm:text-6xl lg:text-7xl mb-6">
            Care for your grandparents, one dose at a time
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-foreground/80 leading-relaxed">
            Upload a prescription or add medicines manually. Our AI helps you
            keep track and never miss a reminder.
          </p>
        </section>

        <section className="relative mb-16">
          <FloatingFeatures />
        </section>

        <section id="about" className="scroll-mt-24 py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-3xl font-bold text-foreground text-center">
              About MedCare
            </h2>
            <div className="rounded-3xl bg-card p-10 shadow-warm border border-border">
              <p className="leading-relaxed text-foreground/80 text-lg text-center">
                MedCare helps families keep their grandparents on track with
                medications. Upload a prescription for AI-powered extraction, or
                add medicines and times manually. View and manage schedules by
                person in your caregiver dashboard, and never miss a dose.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
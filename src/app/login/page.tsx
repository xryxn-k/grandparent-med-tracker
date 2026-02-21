import Link from "next/link";
import FloatingFeatures from "@/components/FloatingFeatures";
import LandingHeader from "@/components/LandingHeader";

export default function Home(): React.ReactElement {
  return (
    <div className="relative min-h-screen overflow-hidden font-sans bg-gradient-to-br from-background via-background to-background">
      {/* Fixed Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-amber-50/90 backdrop-blur-md border-b border-amber-200/50 shadow-sm">
        <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-foreground"
          >
            MedCare
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-6 py-2 rounded-full bg-peach-100 text-peach-800 border border-peach-200 hover:bg-peach-200 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </header>

      {/* Hero Image Section */}
      <div className="relative w-full h-[70vh] overflow-hidden rounded-br-[4rem] rounded-bl-[2rem] shadow-warm mt-16">
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
      <div className="relative z-20 -mt-16 mx-auto max-w-md bg-white rounded-[2rem] shadow-xl p-8 border border-amber-100">
        <h2 className="text-2xl font-bold text-foreground mb-4">Get Started</h2>
        <p className="text-muted-foreground mb-6">Upload a prescription or add medicines manually.</p>
        <Link
          href="/login"
          className="inline-flex w-full justify-center rounded-full bg-amber-500 px-8 py-4 text-lg font-semibold text-white shadow-warm transition-colors hover:bg-amber-600"
        >
          Start Now
        </Link>
      </div>

      <main className="relative z-10 w-full px-4 py-12 sm:px-6 lg:px-8 space-y-16">
        <section className="flex flex-col items-center text-center">
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

        <section id="about" className="py-16">
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
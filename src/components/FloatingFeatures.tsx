const FEATURES = [
  "Prescription scan with AI",
  "Smart medication reminders",
  "Care for your loved ones",
  "Simple upload, instant schedule",
  "Never miss a dose",
  "Doctor-approved extraction",
];

const DELAYS = ["0s", "0.5s", "1s", "1.5s", "2s", "2.5s"];

export default function FloatingFeatures(): React.ReactElement {
  return (
    <div className="relative flex flex-wrap items-center justify-center gap-x-6 gap-y-4 py-8">
      {FEATURES.map((text, i) => (
        <span
          key={text}
          className="animate-float rounded-xl border border-glass bg-glass px-4 py-2 text-sm font-medium text-graphite-olive shadow-soft backdrop-blur-md"
          style={{
            animationDelay: DELAYS[i % DELAYS.length],
            animationDuration: `${5 + (i % 3)}s`,
          }}
        >
          {text}
        </span>
      ))}
    </div>
  );
}

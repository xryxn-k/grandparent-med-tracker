const FEATURES = [
  "Prescription scan with AI",
  "Smart medication reminders",
  "Care for your loved ones",
  "Simple upload, instant schedule",
];

const ROW_TINTS = [
  "bg-row-sage",
  "bg-row-lavender",
  "bg-row-peach",
  "bg-row-sky",
] as const;

export default function FloatingFeatures(): React.ReactElement {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-8">
      {FEATURES.map((text, i) => (
        <div
          key={text}
          className={`w-full rounded-2xl border border-glass px-6 py-5 text-center text-lg font-medium text-foreground shadow-soft backdrop-blur-md ${ROW_TINTS[i % ROW_TINTS.length]}`}
        >
          {text}
        </div>
      ))}
    </div>
  );
}

import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import UploadForm from "@/components/UploadForm";
import ManualMedicationForm from "@/components/ManualMedicationForm";
import type { MedicationScheduleRow } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const ROW_TINTS = [
  "bg-row-sage",
  "bg-row-lavender",
  "bg-row-peach",
  "bg-row-sky",
  "bg-row-mint",
  "bg-row-blush",
] as const;

export const metadata = {
  title: "Join | MedCare",
  description: "Upload a prescription or add medicines manually.",
};

export default async function JoinPage(): Promise<React.ReactElement> {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data: schedules, error } = await supabase
    .from("medication_schedules")
    .select("*")
    .order("time_due", { ascending: true });

  if (error) {
    console.error("Supabase error:", error);
  }

  const medications: MedicationScheduleRow[] = (schedules ?? []).map(
    (row: Record<string, unknown>) => ({
      id: row.id as string | undefined,
      medication_name: row.medication_name as string | undefined,
      dosage: row.dosage as string | undefined,
      patient_phone_number: row.patient_phone_number as string | undefined,
      patient_name: row.patient_name as string | undefined,
      time_due: row.time_due as string | undefined,
      taken: row.taken as boolean | undefined,
    })
  );

  return (
    <div className="relative min-h-screen overflow-hidden font-sans">
      <div className="absolute inset-0 bg-background" />
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 10v40M10 30h40' stroke='%237CB342' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-senior-green/5 via-transparent to-senior-blue/5" />

      <main className="relative z-10 w-full px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-foreground"
          >
            MedCare
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="rounded-xl border border-glass bg-glass px-3 py-2 text-sm font-medium text-foreground/80 shadow-soft backdrop-blur-md hover:bg-primary/10"
            >
              Dashboard
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-glass bg-glass px-3 py-2 text-sm font-medium text-foreground shadow-soft backdrop-blur-md hover:bg-primary/10"
            >
              Sign in
            </Link>
          </div>
        </header>

        <h1 className="mb-2 text-2xl font-bold text-graphite-olive">
          Join with us
        </h1>
        <p className="mb-8 text-graphite-slate">
          Upload a prescription for AI extraction, or add medicines and times
          manually.
        </p>

        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <section className="space-y-6">
            <div className="rounded-2xl border border-glass bg-glass p-6 shadow-soft backdrop-blur-md">
              <UploadForm />
            </div>
            <ManualMedicationForm />
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-graphite-olive">
              Scheduled medications
            </h2>
            {medications.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-glass bg-glass p-8 text-center shadow-soft backdrop-blur-md">
                <p className="text-graphite-slate">
                  No medications scheduled yet. Upload a prescription or add
                  medicines above.
                </p>
              </div>
            ) : (
              <ul className="flex flex-col gap-0 overflow-hidden rounded-2xl border border-glass shadow-soft">
                {medications.map((row, index) => (
                  <li
                    key={
                      row.id ??
                      `${row.patient_phone_number}-${row.time_due}-${row.medication_name}-${index}`
                    }
                    className={`flex w-full flex-wrap items-center gap-4 border-b border-glass px-4 py-4 last:border-b-0 ${ROW_TINTS[index % ROW_TINTS.length]}`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground">
                        {row.medication_name ?? "—"}
                      </p>
                      <p className="text-sm text-foreground/80">
                        {row.dosage ?? "—"}
                      </p>
                    </div>
                    <div className="shrink-0 text-right text-sm text-foreground/80">
                      {row.patient_phone_number ?? row.patient_name ?? "—"}
                    </div>
                    <div className="shrink-0 text-sm font-medium text-foreground">
                      Due: {row.time_due ?? "—"}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

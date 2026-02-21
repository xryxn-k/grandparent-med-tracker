import { createClient } from "@supabase/supabase-js";
import UploadForm from "@/components/UploadForm";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export default async function Home() {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data: schedules, error } = await supabase
    .from("medication_schedules")
    .select("*")
    .order("time_due", { ascending: true });

  if (error) {
    console.error("Supabase error:", error);
  }

  const medications = schedules ?? [];

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-zinc-950">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Medication tracker
        </h1>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,380px)_1fr]">
          <section className="lg:min-w-0">
            <UploadForm />
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Scheduled medications
            </h2>
            {medications.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
                <p className="text-zinc-500 dark:text-zinc-400">
                  No medications scheduled yet. Upload a prescription to add
                  reminders.
                </p>
              </div>
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {medications.map((row: {
                  id?: string;
                  medication_name?: string;
                  dosage?: string;
                  patient_phone_number?: string;
                  time_due?: string;
                }) => (
                  <li
                    key={row.id ?? `${row.patient_phone_number}-${row.time_due}-${row.medication_name}`}
                    className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <p className="font-medium text-zinc-900 dark:text-zinc-50">
                      {row.medication_name ?? "—"}
                    </p>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {row.dosage ?? "—"}
                    </p>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">
                      {row.patient_phone_number ?? "—"}
                    </p>
                    <p className="mt-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      Due: {row.time_due ?? "—"}
                    </p>
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

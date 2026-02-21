import { createClient } from "@supabase/supabase-js";
import type { MedicationScheduleRow } from "@/types";
import CaregiverDashboard from "@/components/CaregiverDashboard";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const metadata = {
  title: "Dashboard | MedCare",
  description: "Manage medication schedules for your family.",
};

export default async function DashboardPage(): Promise<React.ReactElement> {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data: schedules, error } = await supabase
    .from("medication_schedules")
    .select("*")
    .order("time_due", { ascending: true });

  if (error) {
    console.error("Supabase error:", error);
  }

  const rows: MedicationScheduleRow[] = (schedules ?? []).map(
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

  return <CaregiverDashboard schedules={rows} />;
}

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

  // Add mock data if no real data exists
  const mockData: MedicationScheduleRow[] = [
    {
      id: "mock-1",
      medication_name: "Lisinopril",
      dosage: "10mg",
      patient_name: "Grandma Mary",
      patient_phone_number: "555-0123",
      time_due: "08:00",
      taken: false,
    },
    {
      id: "mock-2",
      medication_name: "Metformin",
      dosage: "500mg",
      patient_name: "Grandma Mary",
      patient_phone_number: "555-0123",
      time_due: "12:00",
      taken: true,
    },
    {
      id: "mock-3",
      medication_name: "Aspirin",
      dosage: "81mg",
      patient_name: "Grandpa John",
      patient_phone_number: "555-0456",
      time_due: "09:00",
      taken: false,
    },
    {
      id: "mock-4",
      medication_name: "Vitamin D3",
      dosage: "2000 IU",
      patient_name: "Grandpa John",
      patient_phone_number: "555-0456",
      time_due: "18:00",
      taken: false,
    },
    {
      id: "mock-5",
      medication_name: "Omega-3 Fish Oil",
      dosage: "1000mg",
      patient_name: "Grandma Mary",
      patient_phone_number: "555-0123",
      time_due: "20:00",
      taken: true,
    },
  ];

  const finalSchedules = rows.length > 0 ? rows : mockData;

  return <CaregiverDashboard schedules={finalSchedules} />;
}

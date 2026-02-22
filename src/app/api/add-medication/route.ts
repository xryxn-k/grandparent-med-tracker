import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body = await request.json();
    const patient_name = (body.patient_name as string)?.trim();
    const patient_phone_number = (body.patient_phone_number as string)?.trim();
    const medications = body.medications as Array<{ medication_name?: string; dosage?: string; time_due?: string }> | undefined;

    if (!patient_phone_number) {
      return Response.json(
        { message: "Patient phone number is required." },
        { status: 400 }
      );
    }
    if (!Array.isArray(medications) || medications.length === 0) {
      return Response.json(
        { message: "At least one medication is required." },
        { status: 400 }
      );
    }

    if (!supabaseUrl || !supabaseKey) {
      return Response.json(
        { message: "Server configuration error." },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const rows = medications.map((m) => ({
      patient_name: patient_name || null,
      patient_phone_number,
      medication_name: (m.medication_name as string)?.trim() ?? null,
      dosage: (m.dosage as string)?.trim() || null,
      time_due: (m.time_due as string)?.trim() ?? null,
    }));

    const { error } = await supabase.from("medication_schedules").insert(rows);

    if (error) {
      console.error("add-medication insert error:", error);
      return Response.json(
        { message: error.message ?? "Failed to save." },
        { status: 500 }
      );
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}

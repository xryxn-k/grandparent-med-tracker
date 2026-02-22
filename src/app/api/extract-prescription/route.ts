import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const formData = await request.formData();
    const patient_name = (formData.get("patient_name") as string)?.trim() ?? "";
    const phone = (formData.get("phone") as string)?.trim() ?? "";
    const image = formData.get("image") as File | null;

    if (!phone) {
      return Response.json(
        { message: "Phone number is required." },
        { status: 400 }
      );
    }
    if (!image || !image.size) {
      return Response.json(
        { message: "Prescription image is required." },
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

    // Placeholder: in production you would run OCR/AI on image and extract medications.
    // For now insert one placeholder row so the flow works.
    const { error } = await supabase.from("medication_schedules").insert({
      patient_name: patient_name || null,
      patient_phone_number: phone,
      medication_name: "From prescription (extract in production)",
      dosage: null,
      time_due: "09:00",
    });

    if (error) {
      console.error("extract-prescription insert error:", error);
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

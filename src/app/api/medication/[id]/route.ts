import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id } = await params;
  if (!id) {
    return Response.json({ message: "Missing id" }, { status: 400 });
  }
  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey);
    await supabase.from("medication_schedules").delete().eq("id", id);
  }
  return new Response(null, { status: 204 });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id } = await params;
  if (!id) {
    return Response.json({ message: "Missing id" }, { status: 400 });
  }
  const body = await request.json();
  const updates: Record<string, unknown> = {};
  if (body.medication_name !== undefined) updates.medication_name = body.medication_name;
  if (body.dosage !== undefined) updates.dosage = body.dosage;
  if (body.time_due !== undefined) updates.time_due = body.time_due;
  if (body.patient_name !== undefined) updates.patient_name = body.patient_name;
  if (body.patient_phone_number !== undefined) updates.patient_phone_number = body.patient_phone_number;
  if (body.taken !== undefined) updates.taken = body.taken;
  if (Object.keys(updates).length === 0) {
    return Response.json({ message: "No fields to update" }, { status: 400 });
  }
  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { error } = await supabase.from("medication_schedules").update(updates).eq("id", id);
    if (error) {
      return Response.json({ message: error.message }, { status: 500 });
    }
  }
  return Response.json({ success: true });
}

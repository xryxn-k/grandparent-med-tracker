import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { patient_name, patient_phone_number, medications } = body;

    // 1. Strict Payload Validation
    if (!patient_name || !patient_phone_number || !medications || !Array.isArray(medications)) {
      console.error('[INGESTION ERROR] Invalid payload from Frontend');
      return NextResponse.json({ error: 'Invalid payload structure' }, { status: 400 });
    }

    // 2. Map the array into individual Supabase rows
    const rowsToInsert = medications.map((med: any) => ({
      patient_name,
      patient_phone_number,
      medication_name: med.medication_name,
      dosage: med.dosage,
      // Ensure the frontend sends time in 'HH:MM' format. Postgres will append the ':00' seconds.
      time_due: med.time_due, 
      call_status: 'pending'
    }));

    console.log(`[SYSTEM] Ingesting ${rowsToInsert.length} medications for ${patient_name}...`);

    // 3. Batch Insert (One network request for max speed)
    const { data, error } = await supabase
      .from('medication_schedules')
      .insert(rowsToInsert)
      .select();

    if (error) {
      console.error('[DB ERROR] Failed to insert medications:', error);
      throw error;
    }

    return NextResponse.json({ success: true, inserted: data.length }, { status: 200 });

  } catch (error) {
    console.error('[FATAL] Error in add-medications route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type MedicationInput = {
  medication_name?: string;
  dosage?: string;
  time_due?: string;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { patient_name, patient_phone_number, medications } = body as {
      patient_name?: string;
      patient_phone_number?: string;
      medications?: MedicationInput[];
    };
    // Support legacy "phone" key
    const phone = patient_phone_number ?? (body as { phone?: string }).phone;

    if (!phone || !Array.isArray(medications) || medications.length === 0) {
      return NextResponse.json(
        { error: 'Missing patient_phone_number or medications. Expected: { patient_name, patient_phone_number, medications }' },
        { status: 400 }
      );
    }

    const toTimeDue = (t: string) => (t?.includes(':') && t.split(':').length === 2 ? `${t}:00` : t || '08:00:00');

    const insertData = medications.map((med: MedicationInput) => ({
      patient_phone_number: phone,
      patient_name: patient_name ?? 'Patient',
      medication_name: med.medication_name ?? '',
      dosage: med.dosage ?? '',
      time_due: toTimeDue(med.time_due ?? '08:00'),
    }));

    const { error: dbError } = await supabase
      .from('medication_schedules')
      .insert(insertData);

    if (dbError) throw dbError;

    return NextResponse.json({ success: true, inserted: insertData.length }, { status: 200 });
  } catch (error: unknown) {
    console.error('Insert Medications Error:', error);
    const err = error as { message?: string; details?: string };
    if (err?.message?.includes('Invalid supabaseUrl')) {
      return NextResponse.json(
        {
          error:
            'Supabase credentials misconfigured. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY',
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to insert medications', details: err?.message },
      { status: 500 }
    );
  }
}

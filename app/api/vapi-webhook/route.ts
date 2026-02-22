// import { NextResponse } from 'next/server';
// import { createClient } from '@supabase/supabase-js';

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );

// export async function POST(req: Request) {
//   try {
//     const { phone_number, result } = await req.json();

//     if (!phone_number || typeof result !== 'boolean') {
//       return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
//     }

//     console.log(`[VAPI SIGNAL] Call ended for ${phone_number}. Medication taken: ${result}`);

//     // Update the most recent 'processed' medications for this patient
//     const { error } = await supabase
//       .from('medication_schedules')
//       .update({ medication_taken: result })
//       .eq('patient_phone_number', phone_number)
//       .eq('call_status', 'processed')
//       .is('medication_taken', null); // Only lock rows we haven't answered yet

//     if (error) throw error;

//     return NextResponse.json({ success: true }, { status: 200 });

//   } catch (error) {
//     console.error('[FATAL] Error in vapi-webhook:', error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('[DEBUG] Raw webhook payload received:', body);

    // const phone_number = body.phone_number;
    // const taken = body.taken;
    // Ensure we are only processing the final end-of-call report
if (body.message?.type !== 'end-of-call-report') {
  return NextResponse.json({ received: true }); 
}

// // Dig into Vapi's nested payload
// const phone_number = body.message.customer?.number || body.message.call?.customer?.number;
// const taken = body.message.analysis?.structuredData?.took_medication; // The boolean you setup earlier!

// Dig into Vapi's nested payload
const phone_number = body.message.customer?.number || body.message.call?.customer?.number;

// NEW EXTRACTION LOGIC: Search through the UUIDs to find our boolean
let taken: boolean | null = null;
const structuredData = body.message.analysis?.structuredData;

if (structuredData) {
  // Loop through Vapi's random UUID keys to find the one we named 'took_medication'
  for (const key in structuredData) {
    if (structuredData[key].name === 'took_medication') {
      taken = structuredData[key].result;
      break;
    }
  }
}

    // Strict validation
    if (!phone_number || typeof taken !== 'boolean') {
      console.error(`[DEBUG] Validation failed -> Phone: ${phone_number} | Taken: ${taken} | Type of Taken: ${typeof taken}`);
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    console.log(`[VAPI SIGNAL] Call ended for ${phone_number}. Medication taken: ${taken}`);

    // Update the database
    const { error } = await supabase
      .from('medication_schedules')
      .update({ medication_taken: taken })
      .eq('patient_phone_number', phone_number)
      .eq('call_status', 'processed')
      .is('medication_taken', null); // Only update rows that haven't been answered yet

    if (error) {
      console.error('[DB ERROR] Failed to lock boolean:', error);
      throw error;
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('[FATAL] Error in vapi-webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
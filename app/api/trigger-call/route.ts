// import { NextResponse } from 'next/server';
// import { createClient } from '@supabase/supabase-js';

// // Initialize Supabase client
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );

// export async function POST(req: Request) {
//   try {
//     // 1. Get the current time in HH:MM:00 format
//     const now = new Date();
//     const currentTimeString = now.toTimeString().split(' ')[0]; 

//     // 2. Query Supabase for any medications due right now
//     const { data: schedules, error } = await supabase
//       .from('medication_schedules')
//       .select('*')
//       // Note: In a production app, handle timezones. For the hackathon, keep it simple.
//       .eq('time_due', currentTimeString);

//     if (error) throw error;
//     if (!schedules || schedules.length === 0) {
//       return NextResponse.json({ message: 'No medications due right now.' }, { status: 200 });
//     }

//     // 3. Laptop 3 will inject the Vapi phone call logic here!
//     console.log(`Found ${schedules.length} medications due. Triggering calls...`);
//     // ... Vapi SDK code goes here ...

//     return NextResponse.json({ success: true, callsTriggered: schedules.length }, { status: 200 });

//   } catch (error) {
//     console.error('Error triggering calls:', error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }
// the above code is day code

// import { NextResponse } from 'next/server';
// import { createClient } from '@supabase/supabase-js';

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );

// // Helper function to add minutes to a time string safely
// function getFutureTimeIST(minutesToAdd: number): string {
//   const date = new Date();
//   date.setMinutes(date.getMinutes() + minutesToAdd);
//   const formatter = new Intl.DateTimeFormat('en-IN', {
//     timeZone: 'Asia/Kolkata', hour12: false, hour: '2-digit', minute: '2-digit'
//   });
//   return `${formatter.format(date)}:00`;
// }

// export async function POST(req: Request) {
//   try {
//     const timeNow = getFutureTimeIST(0); // Current time in IST (HH:MM:00)
//     const timeWindowEnd = getFutureTimeIST(30); // Current time + 30 mins in IST

//     console.log(`[SYSTEM] Cron firing. Checking Trigger Window: ${timeNow}`);

//     // STEP 1: Find medications due EXACTLY right now that haven't been called
//     const { data: triggerMeds, error: triggerError } = await supabase
//       .from('medication_schedules')
//       .select('patient_phone_number')
//       .eq('time_due', timeNow)
//       .eq('call_status', 'pending');

//     if (triggerError) throw triggerError;
//     if (!triggerMeds || triggerMeds.length === 0) {
//       return NextResponse.json({ message: 'No trigger medications due.' }, { status: 200 });
//     }

//     // Extract unique phone numbers that need calls right now
//     const phoneNumbersToCall = [...new Set(triggerMeds.map(m => m.patient_phone_number))];

//     // STEP 2: The Sweep. Get ALL medications for these patients in the next 30 mins
//     const { data: groupedMeds, error: sweepError } = await supabase
//       .from('medication_schedules')
//       .select('*')
//       .in('patient_phone_number', phoneNumbersToCall)
//       .eq('call_status', 'pending')
//       .gte('time_due', timeNow)
//       .lte('time_due', timeWindowEnd);

//     if (sweepError) throw sweepError;

//     // STEP 3: Structure the payload for Laptop 3 (Voice Engineer)
//     const callsToMake = phoneNumbersToCall.map(phone => {
//       const patientMeds = groupedMeds!.filter(m => m.patient_phone_number === phone);
//       return {
//         patient_name: patientMeds[0].patient_name,
//         phone_number: phone,
//         medications: patientMeds.map(m => ({
//           name: m.medication_name,
//           dosage: m.dosage,
//           time: m.time_due
//         }))
//       };
//     });

//     console.log(`[SIGNAL] Generated ${callsToMake.length} grouped call payloads.`);
//     console.log(JSON.stringify(callsToMake, null, 2));

//     // STEP 4: Lock the rows to prevent duplicate calls later
//     const scheduledMedIds = groupedMeds!.map(m => m.id);
//     await supabase
//       .from('medication_schedules')
//       .update({ call_status: 'processed' })
//       .in('id', scheduledMedIds);

//     // ... Laptop 3 injects Vapi SDK loop here, iterating over `callsToMake` array ...

//     return NextResponse.json({ success: true, calls: callsToMake }, { status: 200 });

//   } catch (error) {
//     console.error('[FATAL] Error in trigger-call route:', error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }


// --------- last change from adit
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function getFutureTimeIST(minutesToAdd: number): string {
  const date = new Date();
  date.setMinutes(date.getMinutes() + minutesToAdd);
  const formatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata', hour12: false, hour: '2-digit', minute: '2-digit'
  });
  return `${formatter.format(date)}:00`;
}

export async function POST(req: Request) {
  try {
    const timeNow = getFutureTimeIST(0);
    const timeWindowEnd = getFutureTimeIST(30);

    console.log(`[SYSTEM] Cron firing. Checking Trigger Window: ${timeNow}`);

    // STEP 1: Find medications due EXACTLY right now
    const { data: triggerMeds, error: triggerError } = await supabase
      .from('medication_schedules')
      .select('patient_phone_number')
      .eq('time_due', timeNow)
      .eq('call_status', 'pending');

    if (triggerError) throw triggerError;
    if (!triggerMeds || triggerMeds.length === 0) {
      return NextResponse.json({ message: 'No trigger medications due.' }, { status: 200 });
    }

    const phoneNumbersToCall = [...new Set(triggerMeds.map(m => m.patient_phone_number))];

    // STEP 2: The Sweep
    const { data: groupedMeds, error: sweepError } = await supabase
      .from('medication_schedules')
      .select('*')
      .in('patient_phone_number', phoneNumbersToCall)
      .eq('call_status', 'pending')
      .gte('time_due', timeNow)
      .lte('time_due', timeWindowEnd);

    if (sweepError) throw sweepError;

    // STEP 3: Structure the payload
    const callsToMake = phoneNumbersToCall.map(phone => {
      const patientMeds = groupedMeds!.filter(m => m.patient_phone_number === phone);
      return {
        patient_name: patientMeds[0].patient_name,
        phone_number: phone,
        medications: patientMeds.map(m => ({
          name: m.medication_name,
          dosage: m.dosage,
          time: m.time_due
        }))
      };
    });

    console.log(`[SIGNAL] Generated ${callsToMake.length} grouped call payloads.`);

    // STEP 4: Lock the rows
    const scheduledMedIds = groupedMeds!.map(m => m.id);
    await supabase
      .from('medication_schedules')
      .update({ call_status: 'processed' })
      .in('id', scheduledMedIds);

    // ==========================================
    // STEP 5: THE VAPI INJECTION (LAPTOP 3 CODE)
    // ==========================================
    for (const call of callsToMake) {
      // THE FIX: Translate Laptop 1's objects into your Hinglish string!
      const medString = call.medications
        .map(m => `${m.dosage} ${m.name}`)
        .join(', aur ');

      const vapiPayload = {
        assistantId: process.env.VAPI_ASSISTANT_ID,
        phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID,
        customer: { number: call.phone_number },
        assistantOverrides: {
          variableValues: {
            patient_name: call.patient_name,
            medications_list: medString 
          }
        }
      };

      try {
        await fetch('https://api.vapi.ai/call/phone', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.VAPI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(vapiPayload)
        });
        console.log(`[VAPI SUCCESS] Fired call to ${call.patient_name} (${call.phone_number})`);
      } catch (vapiErr) {
        console.error(`[VAPI ERROR] Failed to call ${call.phone_number}:`, vapiErr);
      }
    }
    // ==========================================

    return NextResponse.json({ success: true, calls: callsToMake }, { status: 200 });

  } catch (error) {
    console.error('[FATAL] Error in trigger-call route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
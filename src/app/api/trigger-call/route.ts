import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Catch Laptop 1's new grouped payload
    const { phone_number, patient_name, medications } = await request.json();

    if (!phone_number || !patient_name || !medications) {
      return NextResponse.json(
        { error: 'Missing phone_number, patient_name, or medications array' },
        { status: 400 }
      );
    }

    // Convert the medications array into a single spoken string for the AI
    // Example output: "1 Pill of Aspirin, aur 2 Pills of Metformin"
    const medicationsList = Array.isArray(medications) 
      ? medications.join(', aur ') 
      : medications;

    // Construct the updated Vapi Payload
    const payload = {
      assistantId: process.env.VAPI_ASSISTANT_ID,
      phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID,
      customer: {
        number: phone_number, 
      },
      assistantOverrides: {
        variableValues: {
          patient_name: patient_name,
          medications_list: medicationsList, // Passing the formatted string
        }
      }
    };

    const response = await fetch('https://api.vapi.ai/call/phone', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.VAPI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: 'Failed', details: errorData }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ success: true, callId: data.id });

  } catch (error) {
    console.error('Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
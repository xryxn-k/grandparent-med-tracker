import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

// Initialize Clients
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    // 1. Grab the uploaded image and the patient's phone number from the form
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const phoneNumber = formData.get('phone') as string;

    if (!file || !phoneNumber) {
      return NextResponse.json({ error: 'Missing file or phone number' }, { status: 400 });
    }

    // 2. Convert the image to a base64 string for the OpenAI API
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');

    // 3. The Master Prompt: Force GPT-4o to act as a medical OCR engine and return JSON
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are an expert at reading messy Indian doctor handwritten prescriptions. 
          Extract the medications and return a strictly formatted JSON object with a "medications" array. 
          Each object in the array must have:
          - "medication_name" (string)
          - "dosage" (string)
          - "time_due" (string in HH:MM:00 24-hour format)`
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Extract the schedule from this prescription." },
            { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
          ]
        }
      ]
    });

    // 4. Parse the AI's JSON response
    const aiContent = response.choices[0].message.content;
    if (!aiContent) throw new Error("No response from AI");
    const { medications } = JSON.parse(aiContent);

    // 5. Format the data and insert it into Laptop 1's Supabase database
    const insertData = medications.map((med: any) => ({
      patient_phone_number: phoneNumber,
      medication_name: med.medication_name,
      dosage: med.dosage,
      time_due: med.time_due
    }));

    const { error: dbError } = await supabase
      .from('medication_schedules')
      .insert(insertData);

    if (dbError) throw dbError;

    return NextResponse.json({ success: true, inserted: insertData.length }, { status: 200 });

  } catch (error) {
    console.error('Vision API Error:', error);
    return NextResponse.json({ error: 'Failed to process prescription' }, { status: 500 });
  }
}

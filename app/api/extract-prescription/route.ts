import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';

// Initialize Clients
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    // 1. Grab the uploaded image and the patient's phone number from the form
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const patientPhoneNumber = (formData.get('patient_phone_number') as string) || (formData.get('phone') as string);
    const patientName = (formData.get('patient_name') as string) || 'Patient';

    if (!file || !patientPhoneNumber) {
      return NextResponse.json({ error: 'Missing file or patient_phone_number' }, { status: 400 });
    }

    // 2. Convert the image to a base64 string for the Gemini API
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');
    // Gemini rejects application/octet-stream; infer from filename or default to jpeg
    let mimeType = file.type || '';
    if (!mimeType || mimeType === 'application/octet-stream') {
      const name = (file.name || '').toLowerCase();
      mimeType = name.endsWith('.png') ? 'image/png' : 'image/jpeg';
    }

    // 3. The Master Prompt: Force Gemini to act as a medical OCR engine and return JSON
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType,
                data: base64Image,
              },
            },
            {
              text: `You are an expert at reading messy Indian doctor handwritten prescriptions.
Extract the medications and return a strictly formatted JSON object with a "medications" array.
Each object in the array must have:
- "medication_name" (string)
- "dosage" (string, e.g. "1 Pill", "500mg")
- "time_due" (string in HH:MM 24-hour format, e.g. "08:00", "14:00")

Extract the schedule from this prescription. Return ONLY valid JSON, no other text.`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    // 4. Parse the AI's JSON response
    const aiContent = response.text;
    if (!aiContent) throw new Error('No response from AI');

    // Extract JSON from response (handle possible markdown code blocks)
    let jsonStr = aiContent.trim();
    const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) jsonStr = jsonMatch[1].trim();

    const parsed = JSON.parse(jsonStr);
    const medications = parsed.medications ?? parsed;

    if (!Array.isArray(medications)) {
      throw new Error('AI did not return a medications array');
    }

    // 5. Format the data and insert it into Laptop 1's Supabase database
    const toTimeDue = (t: string) => (t?.includes(':') && t.split(':').length === 2 ? `${t}:00` : t || '08:00:00');

    const insertData = medications.map((med: { medication_name?: string; dosage?: string; time_due?: string }) => ({
      patient_phone_number: patientPhoneNumber,
      patient_name: patientName,
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
    console.error('Vision API Error:', error);
    const err = error as { status?: number; statusCode?: number; code?: string; message?: string };
    if (err?.status === 401 || err?.statusCode === 401 || err?.code === 'invalid_api_key') {
      return NextResponse.json(
        { error: 'Gemini API key is invalid or expired. Check GEMINI_API_KEY in .env.local' },
        { status: 500 }
      );
    }
    if (err?.message?.includes('Invalid supabaseUrl')) {
      return NextResponse.json(
        {
          error:
            'Supabase credentials misconfigured. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY',
        },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: 'Failed to process prescription' }, { status: 500 });
  }
}

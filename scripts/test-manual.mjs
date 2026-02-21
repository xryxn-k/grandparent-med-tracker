/**
 * Test MANUAL input: submits medication data directly (no image).
 * Tests: /api/insert-medications (Supabase insert only)
 */

const payload = {
  patient_name: 'Rajesh Kumar',
  patient_phone_number: '+919876543210',
  medications: [
    { medication_name: 'Aspirin', dosage: '1 Pill', time_due: '08:00' },
    { medication_name: 'Metformin', dosage: '2 Pills', time_due: '08:15' },
    { medication_name: 'Vitamin D', dosage: '1 Pill', time_due: '14:00' },
  ],
};

console.log('=== Manual Input Test ===');
console.log('Endpoint: POST /api/insert-medications');
console.log('Payload:', JSON.stringify(payload, null, 2));
console.log('');

const res = await fetch('http://localhost:3000/api/insert-medications', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});

const text = await res.text();
let data;
try {
  data = JSON.parse(text);
} catch {
  data = { raw: text };
}

console.log('Status:', res.status);
console.log('Response:', JSON.stringify(data, null, 2));

if (!res.ok) {
  console.error('\n--- Troubleshooting ---');
  if (data.error?.includes('supabase')) {
    console.error('Check .env.local: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  process.exit(1);
}

console.log('\n✓ Manual insert OK');
process.exit(0);

/**
 * Test IMAGE input: uploads prescription image for AI extraction.
 * Tests: /api/extract-prescription (Gemini vision + Supabase insert)
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const testImagePath = join(projectRoot, 'public', 'test-prescription.png');

if (!existsSync(testImagePath)) {
  console.error('Test image not found at', testImagePath);
  process.exit(1);
}

console.log('=== Image Input Test ===');
console.log('Endpoint: POST /api/extract-prescription');
console.log('Sending: image + phone');
console.log('');

const formData = new FormData();
formData.append('patient_name', 'Rajesh Kumar');
formData.append('patient_phone_number', '+919876543210');
formData.append('file', new Blob([readFileSync(testImagePath)]), 'test-prescription.png');

const res = await fetch('http://localhost:3000/api/extract-prescription', {
  method: 'POST',
  body: formData,
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
  if (data.error?.includes('API key')) {
    console.error('Gemini API key may be invalid. Get a new key at https://aistudio.google.com/apikey');
  }
  if (data.error?.includes('supabase')) {
    console.error('Check .env.local: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  process.exit(1);
}

console.log('\n✓ Image extraction OK');
process.exit(0);

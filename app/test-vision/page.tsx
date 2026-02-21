'use client';

import { useState, useEffect } from 'react';

type Mode = 'manual' | 'image';

type Medication = { medication_name: string; dosage: string; time_due: string };

const defaultMedications: Medication[] = [
  { medication_name: 'Aspirin', dosage: '1 Pill', time_due: '08:00' },
  { medication_name: 'Metformin', dosage: '2 Pills', time_due: '08:15' },
  { medication_name: 'Vitamin D', dosage: '1 Pill', time_due: '14:00' },
];

export default function TestVisionPage() {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<Mode>('manual');
  const [patientName, setPatientName] = useState('Rajesh Kumar');

  useEffect(() => setMounted(true), []);
  const [patientPhoneNumber, setPatientPhoneNumber] = useState('+919876543210');
  const [file, setFile] = useState<File | null>(null);
  const [medications, setMedications] = useState<Medication[]>(defaultMedications);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!patientPhoneNumber || medications.length === 0) {
      setMessage('Enter patient phone and at least one medication.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/insert-medications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_name: patientName,
          patient_phone_number: patientPhoneNumber,
          medications,
        }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Request failed');

      setMessage(`Success! Inserted ${data.inserted} medication(s).`);
      setStatus('success');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to insert');
      setStatus('error');
    }
  }

  async function handleImageSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !patientPhoneNumber) {
      setMessage('Select an image and enter patient phone number.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('patient_name', patientName);
    formData.append('patient_phone_number', patientPhoneNumber);

    try {
      const res = await fetch('/api/extract-prescription', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Request failed');

      setMessage(`Success! Inserted ${data.inserted} medication(s) from image.`);
      setStatus('success');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to process prescription');
      setStatus('error');
    }
  }

  function updateMed(i: number, field: keyof Medication, value: string) {
    setMedications((prev) =>
      prev.map((m, j) => (j === i ? { ...m, [field]: value } : m))
    );
  }

  if (!mounted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-8 dark:bg-zinc-900">
        <main className="w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
          <h1 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Vision Hack – Test
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading…</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-8 dark:bg-zinc-900">
      <main className="w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <h1 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Vision Hack – Test
        </h1>

        {/* Mode tabs */}
        <div className="mb-6 flex gap-2 border-b border-zinc-200 dark:border-zinc-600">
          <button
            type="button"
            onClick={() => setMode('manual')}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition ${
              mode === 'manual'
                ? 'border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100'
                : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400'
            }`}
          >
            Manual input
          </button>
          <button
            type="button"
            onClick={() => setMode('image')}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition ${
              mode === 'image'
                ? 'border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100'
                : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400'
            }`}
          >
            Image input
          </button>
        </div>

        {mode === 'manual' ? (
          <form onSubmit={handleManualSubmit} className="flex flex-col gap-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Submit medication data directly (no AI). Tests Supabase insert.
            </p>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Patient name
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Rajesh Kumar"
                className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Patient phone (E.164)
              </label>
              <input
                type="tel"
                value={patientPhoneNumber}
                onChange={(e) => setPatientPhoneNumber(e.target.value)}
                placeholder="+919876543210"
                className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Medications
              </label>
              {medications.map((med, i) => (
                <div key={i} className="mb-2 flex flex-wrap gap-2">
                  <input
                    type="text"
                    placeholder="Name"
                    value={med.medication_name}
                    onChange={(e) => updateMed(i, 'medication_name', e.target.value)}
                    className="flex-1 min-w-[100px] rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-700"
                  />
                  <input
                    type="text"
                    placeholder="Dosage"
                    value={med.dosage}
                    onChange={(e) => updateMed(i, 'dosage', e.target.value)}
                    className="w-24 rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-700"
                  />
                  <input
                    type="text"
                    placeholder="HH:MM"
                    value={med.time_due}
                    onChange={(e) => updateMed(i, 'time_due', e.target.value)}
                    className="w-24 rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-700"
                  />
                </div>
              ))}
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {status === 'loading' ? 'Inserting...' : 'Insert manually'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleImageSubmit} className="flex flex-col gap-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Upload a prescription image. Gemini extracts medications and saves to Supabase.
            </p>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Prescription image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Patient name
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Rajesh Kumar"
                className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Patient phone (E.164)
              </label>
              <input
                type="tel"
                value={patientPhoneNumber}
                onChange={(e) => setPatientPhoneNumber(e.target.value)}
                placeholder="+919876543210"
                className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {status === 'loading' ? 'Processing...' : 'Extract & save'}
            </button>
          </form>
        )}

        {message && (
          <div
            className={`mt-4 rounded-lg p-3 text-sm ${
              status === 'success'
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                : 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300'
            }`}
          >
            {message}
          </div>
        )}

        <p className="mt-6 text-xs text-zinc-500 dark:text-zinc-400">
          Manual: <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-700">/api/insert-medications</code>
          {' · '}
          Image: <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-700">/api/extract-prescription</code> (Gemini)
        </p>
      </main>
    </div>
  );
}

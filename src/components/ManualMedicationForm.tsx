"use client";

import { useState, FormEvent } from "react";

type MedicationEntry = {
  medication_name: string;
  dosage: string;
  time_due: string;
};

export default function ManualMedicationForm(): React.ReactElement {
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [medications, setMedications] = useState<MedicationEntry[]>([
    { medication_name: "", dosage: "", time_due: "" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function addRow() {
    setMedications((prev) => [...prev, { medication_name: "", dosage: "", time_due: "" }]);
  }

  function removeRow(i: number) {
    if (medications.length <= 1) return;
    setMedications((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateRow(i: number, field: keyof MedicationEntry, value: string) {
    setMedications((prev) =>
      prev.map((row, idx) => (idx === i ? { ...row, [field]: value } : row))
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const valid = medications.filter(
      (m) => m.medication_name.trim() && m.time_due.trim()
    );
    if (valid.length === 0) {
      setError("Add at least one medicine with name and time.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/add-medication", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_name: patientName.trim() || undefined,
          patient_phone_number: phone,
          medications: valid.map((m) => ({
            medication_name: m.medication_name.trim(),
            dosage: (m.dosage || "").trim() || undefined,
            time_due: m.time_due.trim(),
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || res.statusText || "Failed to add.");
      }

      setSuccess(true);
      setPatientName("");
      setPhone("");
      setMedications([{ medication_name: "", dosage: "", time_due: "" }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-glass bg-white/60 p-6 shadow-soft backdrop-blur-md">
      <h2 className="mb-4 text-lg font-semibold text-graphite-olive">
        Add medicines manually
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="manual-patient-name"
            className="mb-1.5 block text-sm font-medium text-graphite-slate"
          >
            Patient name
          </label>
          <input
            id="manual-patient-name"
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="e.g. Grandpa Anil"
            className="w-full rounded-xl border border-glass bg-white/60 px-3 py-2 text-graphite-olive placeholder-graphite-muted backdrop-blur-md focus:border-graphite-slate focus:outline-none focus:ring-1 focus:ring-graphite-slate"
          />
        </div>
        <div>
          <label
            htmlFor="manual-phone"
            className="mb-1.5 block text-sm font-medium text-graphite-slate"
          >
            Grandparent&apos;s Phone (+91...)
          </label>
          <input
            id="manual-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            className="w-full rounded-xl border border-glass bg-white/60 px-3 py-2 text-graphite-olive placeholder-graphite-muted backdrop-blur-md focus:border-graphite-slate focus:outline-none focus:ring-1 focus:ring-graphite-slate"
            required
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-graphite-slate">
              Medicines & times
            </span>
            <button
              type="button"
              onClick={addRow}
              className="rounded-lg bg-graphite-blush/50 px-3 py-1.5 text-xs font-medium text-graphite-olive hover:bg-graphite-blush/70"
            >
              + Add row
            </button>
          </div>
          {medications.map((row, i) => (
            <div
              key={i}
              className="flex flex-wrap items-end gap-2 rounded-xl border border-glass bg-white/50 p-3 backdrop-blur-sm"
            >
              <input
                type="text"
                placeholder="Medicine name"
                value={row.medication_name}
                onChange={(e) => updateRow(i, "medication_name", e.target.value)}
                className="min-w-[120px] flex-1 rounded-lg border border-glass bg-white/60 px-2 py-1.5 text-sm text-graphite-olive placeholder-graphite-muted focus:border-graphite-slate focus:outline-none"
              />
              <input
                type="text"
                placeholder="Dosage"
                value={row.dosage}
                onChange={(e) => updateRow(i, "dosage", e.target.value)}
                className="w-24 rounded-lg border border-glass bg-white/60 px-2 py-1.5 text-sm text-graphite-olive placeholder-graphite-muted focus:border-graphite-slate focus:outline-none"
              />
              <input
                type="time"
                value={row.time_due}
                onChange={(e) => updateRow(i, "time_due", e.target.value)}
                className="rounded-lg border border-glass bg-white/60 px-2 py-1.5 text-sm text-graphite-olive focus:border-graphite-slate focus:outline-none"
              />
              <button
                type="button"
                onClick={() => removeRow(i)}
                disabled={medications.length === 1}
                className="rounded-lg p-1.5 text-graphite-slate hover:bg-graphite-muted/50 disabled:opacity-40"
                aria-label="Remove row"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {success && (
          <p className="text-sm text-graphite-olive">
            Medicines added successfully.
          </p>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center rounded-xl bg-graphite-olive px-4 py-2.5 text-sm font-medium text-white shadow-soft transition-colors hover:bg-graphite-slate disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <span className="mr-2 size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Saving…
            </>
          ) : (
            "Save schedule"
          )}
        </button>
      </form>
    </div>
  );
}

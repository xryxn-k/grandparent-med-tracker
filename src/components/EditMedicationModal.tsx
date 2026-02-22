"use client";

import { useState, FormEvent } from "react";
import type { MedicationScheduleRow } from "@/types";

interface EditMedicationModalProps {
  row: MedicationScheduleRow;
  onClose: () => void;
  onSaved: () => void;
}

export default function EditMedicationModal({
  row,
  onClose,
  onSaved,
}: EditMedicationModalProps): React.ReactElement {
  const [medication_name, setMedicationName] = useState(row.medication_name ?? "");
  const [dosage, setDosage] = useState(row.dosage ?? "");
  const [time_due, setTimeDue] = useState(row.time_due ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    if (!row.id) {
      setError("This row cannot be edited.");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch(`/api/medication/${row.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          medication_name: medication_name.trim(),
          dosage: dosage.trim() || null,
          time_due: time_due.trim(),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { message?: string }).message || "Update failed.");
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl border border-glass bg-glass p-6 shadow-diffuse backdrop-blur-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-4 text-lg font-semibold text-foreground">Edit medication</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground/80">Medicine name</label>
            <input
              type="text"
              value={medication_name}
              onChange={(e) => setMedicationName(e.target.value)}
              className="w-full rounded-xl border border-glass bg-light-gray px-3 py-2 text-foreground focus:border-senior-green focus:outline-none focus:ring-1 focus:ring-senior-green"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground/80">Dosage</label>
            <input
              type="text"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              className="w-full rounded-xl border border-glass bg-light-gray px-3 py-2 text-foreground focus:border-senior-green focus:outline-none focus:ring-1 focus:ring-senior-green"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground/80">Time due</label>
            <input
              type="time"
              value={time_due}
              onChange={(e) => setTimeDue(e.target.value)}
              className="w-full rounded-xl border border-glass bg-light-gray px-3 py-2 text-foreground focus:border-senior-green focus:outline-none focus:ring-1 focus:ring-senior-green"
              required
            />
          </div>
          {error && <p className="text-sm text-accent" role="alert">{error}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-glass bg-light-gray px-4 py-2 text-sm font-medium text-foreground/80 hover:bg-medium-gray"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-xl bg-senior-green px-4 py-2 text-sm font-medium text-white hover:bg-senior-green/90 disabled:opacity-60"
            >
              {isLoading ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

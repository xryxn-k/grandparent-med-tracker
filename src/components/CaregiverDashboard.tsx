"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { MedicationScheduleRow, PatientProfile } from "@/types";
import UploadForm from "./UploadForm";
import BotWidget from "./BotWidget";

const ROW_TINTS = [
  "bg-row-sage",
  "bg-row-lavender",
  "bg-row-peach",
  "bg-row-sky",
  "bg-row-mint",
  "bg-row-blush",
] as const;

function getPatientId(row: MedicationScheduleRow): string {
  return row.patient_name?.trim() || row.patient_phone_number || "unknown";
}

function getPatientDisplayName(row: MedicationScheduleRow): string {
  if (row.patient_name?.trim()) return row.patient_name.trim();
  const phone = row.patient_phone_number ?? "";
  const last4 = phone.slice(-4);
  return last4 ? `Grandparent (…${last4})` : "Unknown";
}

interface CaregiverDashboardProps {
  schedules: MedicationScheduleRow[];
}

export default function CaregiverDashboard({
  schedules,
}: CaregiverDashboardProps): React.ReactElement {
  const patients: PatientProfile[] = useMemo(() => {
    const byId = new Map<string, PatientProfile>();
    for (const row of schedules) {
      const id = getPatientId(row);
      if (id === "unknown") continue;
      if (!byId.has(id)) {
        byId.set(id, {
          id,
          displayName: getPatientDisplayName(row),
          phone: row.patient_phone_number,
        });
      }
    }
    return Array.from(byId.values());
  }, [schedules]);

  const [selectedPatientId, setSelectedPatientId] = useState<string | "all">(
    patients.length > 0 ? patients[0].id : "all"
  );

  const filteredSchedules = useMemo(() => {
    if (selectedPatientId === "all") return schedules;
    return schedules.filter((row) => getPatientId(row) === selectedPatientId);
  }, [schedules, selectedPatientId]);

  return (
    <div className="relative min-h-screen overflow-hidden font-sans">
      <div className="absolute inset-0 bg-background" />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 10v40M10 30h40' stroke='%236b6559' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
        }}
      />

      <main className="relative z-10 mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-graphite-olive"
          >
            MedCare
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-xl border border-glass bg-glass px-3 py-2 text-sm font-medium text-graphite-slate shadow-soft backdrop-blur-md hover:bg-white/60"
            >
              Home
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-glass bg-glass px-4 py-2 text-sm font-medium text-graphite-olive shadow-soft backdrop-blur-md hover:bg-white/60"
            >
              Sign in
            </Link>
          </div>
        </header>

        <h1 className="mb-6 text-2xl font-bold text-graphite-olive">
          Caregiver dashboard
        </h1>

        {/* Profile selection */}
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-graphite-slate">
            Whose schedule
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedPatientId("all")}
              className={`rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
                selectedPatientId === "all"
                  ? "border-graphite-olive bg-graphite-olive/15 text-graphite-olive"
                  : "border-glass bg-glass text-graphite-slate shadow-soft backdrop-blur-md hover:bg-white/60"
              }`}
            >
              All
            </button>
            {patients.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPatientId(p.id)}
                className={`rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
                  selectedPatientId === p.id
                    ? "border-graphite-olive bg-graphite-olive/15 text-graphite-olive"
                    : "border-glass bg-glass text-graphite-slate shadow-soft backdrop-blur-md hover:bg-white/60"
                }`}
              >
                {p.displayName}
              </button>
            ))}
            {patients.length === 0 && (
              <p className="text-sm text-graphite-slate">
                Add a prescription or medicines to see profiles here.
              </p>
            )}
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,400px)_1fr]">
          {/* Upload form + BotWidget */}
          <section className="relative lg:min-w-0">
            <div className="relative rounded-2xl border border-glass bg-glass p-6 shadow-soft backdrop-blur-md pb-14">
              <UploadForm />
              <div className="absolute bottom-3 right-3">
                <BotWidget />
              </div>
            </div>
          </section>

          {/* Static row-based schedule */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-graphite-olive">
              Scheduled medications
            </h2>
            {filteredSchedules.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-glass bg-glass p-8 text-center shadow-soft backdrop-blur-md">
                <p className="text-graphite-slate">
                  {schedules.length === 0
                    ? "No medications scheduled yet. Upload a prescription or add medicines to get started."
                    : "No medications for this person. Select another or add new entries."}
                </p>
              </div>
            ) : (
              <ul className="flex flex-col gap-0 overflow-hidden rounded-2xl border border-glass shadow-soft">
                {filteredSchedules.map((row, index) => (
                  <li
                    key={
                      row.id ??
                      `${row.patient_phone_number}-${row.time_due}-${row.medication_name}-${index}`
                    }
                    className={`flex w-full flex-wrap items-center gap-4 border-b border-glass px-4 py-4 last:border-b-0 ${ROW_TINTS[index % ROW_TINTS.length]}`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-graphite-olive">
                        {row.medication_name ?? "—"}
                      </p>
                      <p className="text-sm text-graphite-slate">
                        {row.dosage ?? "—"}
                      </p>
                    </div>
                    <div className="shrink-0 text-right text-sm text-graphite-slate">
                      {row.patient_phone_number ?? row.patient_name ?? "—"}
                    </div>
                    <div className="shrink-0 text-sm font-medium text-graphite-olive">
                      Due: {row.time_due ?? "—"}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

"use client";

import { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MedicationScheduleRow, PatientProfile } from "@/types";
import UploadForm from "./UploadForm";
import ManualMedicationForm from "./ManualMedicationForm";
import FamilyMemberForm from "./FamilyMemberForm";
import EditMedicationModal from "./EditMedicationModal";

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

function getRowKey(row: MedicationScheduleRow, index: number): string {
  return row.id ?? `${row.patient_phone_number}-${row.time_due}-${row.medication_name}-${index}`;
}

type DashboardTab = "add-data" | "preview-schedule";

interface CaregiverDashboardProps {
  schedules: MedicationScheduleRow[];
}

export default function CaregiverDashboard({
  schedules,
}: CaregiverDashboardProps): React.ReactElement {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<DashboardTab>("add-data");
  const [editingRow, setEditingRow] = useState<MedicationScheduleRow | null>(null);

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

  const [deletedIds, setDeletedIds] = useState<Set<string>>(() => new Set());

  const filteredSchedules = useMemo(() => {
    let list = selectedPatientId === "all" ? schedules : schedules.filter((row) => getPatientId(row) === selectedPatientId);
    list = list.filter((row, index) => !deletedIds.has(getRowKey(row, index)));
    return list;
  }, [schedules, selectedPatientId, deletedIds]);

  const handleDelete = useCallback(async (row: MedicationScheduleRow, index: number) => {
    const key = getRowKey(row, index);
    setDeletedIds((prev) => new Set(prev).add(key));
    if (row.id) {
      try {
        await fetch(`/api/medication/${row.id}`, { method: "DELETE" });
        router.refresh();
      } catch {
        // Ignore; UI already updated
      }
    }
  }, [router]);

  const handleToggleTaken = useCallback(async (row: MedicationScheduleRow) => {
    if (!row.id) return;
    try {
      const newTakenStatus = !row.taken;
      await fetch(`/api/medication/${row.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taken: newTakenStatus }),
      });
      router.refresh();
    } catch {
      // Ignore; UI already updated
    }
  }, [router]);

  const handleEditSaved = useCallback(() => {
    router.refresh();
  }, [router]);

  return (
    <div className="relative min-h-screen overflow-hidden font-sans">
      <div className="pointer-events-none absolute inset-0 bg-background" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 10v40M10 30h40' stroke='%237CB342' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-senior-green/5 via-transparent to-senior-blue/5" />
      {editingRow && (
        <EditMedicationModal
          row={editingRow}
          onClose={() => setEditingRow(null)}
          onSaved={handleEditSaved}
        />
      )}

      <main className="relative z-10 w-full px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-foreground"
          >
            MedCare
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-xl border border-glass bg-glass px-3 py-2 text-sm font-medium text-foreground/80 shadow-soft backdrop-blur-md hover:bg-primary/10"
            >
              Home
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-glass bg-primary/30 px-4 py-2 text-sm font-medium text-foreground shadow-soft backdrop-blur-md hover:bg-primary/50"
            >
              Sign in
            </Link>
          </div>
        </header>

        <h1 className="mb-6 text-2xl font-bold text-foreground">
          Caregiver dashboard
        </h1>

        {/* Tabs */}
        <div className="mb-8 flex gap-2 rounded-xl border border-glass bg-glass p-1.5 shadow-soft backdrop-blur-md">
          <button
            type="button"
            onClick={() => setActiveTab("add-data")}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === "add-data"
                ? "bg-primary/40 text-foreground"
                : "text-foreground/80 hover:bg-foreground/5"
            }`}
          >
            Add Data
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview-schedule")}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === "preview-schedule"
                ? "bg-primary/40 text-foreground"
                : "text-foreground/80 hover:bg-foreground/5"
            }`}
          >
            Preview schedule
          </button>
        </div>

        {activeTab === "add-data" && (
          <section className="space-y-6">
            <div className="rounded-2xl border border-glass bg-glass p-6 shadow-soft backdrop-blur-md">
              <UploadForm onSuccess={() => router.refresh()} />
            </div>
            <ManualMedicationForm onSuccess={() => router.refresh()} />
            <FamilyMemberForm onSuccess={() => router.refresh()} />
          </section>
        )}

        {activeTab === "preview-schedule" && (
          <section className="space-y-6">
            <div className="rounded-2xl border border-glass bg-glass p-6 shadow-soft backdrop-blur-md">
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                Whose schedule is this?
              </h2>
              <p className="mb-4 text-sm text-foreground/80">
                {selectedPatientId === "all"
                  ? "Viewing all patients."
                  : `Viewing schedule for ${patients.find((p) => p.id === selectedPatientId)?.displayName ?? "this person"}.`}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPatientId("all")}
                  className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                    selectedPatientId === "all"
                      ? "border-primary/50 bg-primary/20 text-foreground"
                      : "border-glass bg-light-gray/10 text-foreground/80 shadow-soft backdrop-blur-md hover:bg-primary/10"
                  }`}
                >
                  All
                </button>
                {patients.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPatientId(p.id)}
                    className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                      selectedPatientId === p.id
                        ? "border-primary/50 bg-primary/20 text-foreground"
                        : "border-glass bg-light-gray/10 text-foreground/80 shadow-soft backdrop-blur-md hover:bg-primary/10"
                    }`}
                  >
                    {p.displayName}
                  </button>
                ))}
                {patients.length === 0 && (
                  <p className="text-sm text-foreground/80">
                    Add a prescription or medicines to see profiles here.
                  </p>
                )}
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                Existing schedule
              </h2>
              {filteredSchedules.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-glass bg-glass p-8 text-center shadow-soft backdrop-blur-md">
                  <p className="text-foreground/80">
                    {schedules.length === 0
                      ? "No medications scheduled yet. Use Add Data to upload a prescription or add medicines."
                      : "No medications for this person, or none left after deletions. Select another or add new entries."}
                  </p>
                </div>
              ) : (
                <ul className="flex flex-col gap-0 overflow-hidden rounded-2xl border border-glass shadow-soft">
                  {filteredSchedules.map((row, index) => {
                    const rowKey = getRowKey(row, index);
                    return (
                      <li
                        key={rowKey}
                        className={`flex w-full flex-wrap items-center gap-4 border-b border-glass px-4 py-4 last:border-b-0 ${ROW_TINTS[index % ROW_TINTS.length]}`}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-foreground">
                            {row.medication_name ?? "—"}
                          </p>
                          <p className="text-sm text-foreground/80">
                            {row.dosage ?? "—"}
                          </p>
                        </div>
                        <div className="shrink-0 text-sm text-foreground/80">
                          {row.patient_phone_number ?? row.patient_name ?? "—"}
                        </div>
                        <div className="shrink-0 text-sm font-medium text-foreground">
                          Due: {row.time_due ?? "—"}
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleTaken(row)}
                            className={`rounded-lg px-2 py-1 text-sm font-bold transition-colors ${
                              row.taken
                                ? "text-secondary hover:bg-secondary/20"
                                : "text-accent hover:bg-accent/20"
                            }`}
                            title={row.taken ? "Mark as not taken" : "Mark as taken"}
                          >
                            {row.taken ? "✓" : "✗"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingRow(row)}
                            className="rounded-lg border border-glass bg-primary/30 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-primary/50"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(row, index)}
                            className="rounded-lg border border-glass bg-accent/40 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent/60"
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

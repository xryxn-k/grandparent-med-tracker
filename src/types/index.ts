export interface MedicationScheduleRow {
  id?: string;
  medication_name?: string;
  dosage?: string;
  patient_phone_number?: string;
  patient_name?: string;
  time_due?: string;
  taken?: boolean;
}

export type PatientId = string;

export interface PatientProfile {
  id: PatientId;
  displayName: string;
  phone?: string;
}

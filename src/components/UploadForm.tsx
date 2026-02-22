"use client";

import { useState, FormEvent } from "react";

interface UploadFormProps {
  onSuccess?: () => void;
}

export default function UploadForm({ onSuccess }: UploadFormProps): React.ReactElement {
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!file) {
      setError("Please select an image.");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("patient_name", patientName.trim());
      formData.append("phone", phone);
      formData.append("image", file);

      const res = await fetch("/api/extract-prescription", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          (data as { message?: string }).message || res.statusText || "Upload failed."
        );
      }

      setSuccess(true);
      setPatientName("");
      setPhone("");
      setFile(null);
      const form = e.target as HTMLFormElement;
      if (typeof form.reset === "function") form.reset();
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <h2 className="mb-4 text-lg font-semibold text-foreground">
        Upload prescription
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="patient-name"
            className="mb-1.5 block text-sm font-medium text-foreground/80"
          >
            Patient name
          </label>
          <input
            id="patient-name"
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="e.g. Grandma Sita"
            className="w-full rounded-xl border border-glass bg-light-gray px-3 py-2 text-foreground placeholder-foreground/60 backdrop-blur-md focus:border-tata-green focus:outline-none focus:ring-1 focus:ring-tata-green"
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="mb-1.5 block text-sm font-medium text-foreground/80"
          >
            Grandparent&apos;s Phone (+91...)
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            className="w-full rounded-xl border border-glass bg-light-gray px-3 py-2 text-foreground placeholder-foreground/60 backdrop-blur-md focus:border-tata-green focus:outline-none focus:ring-1 focus:ring-tata-green"
            required
          />
        </div>
        <div>
          <label
            htmlFor="image"
            className="mb-1.5 block text-sm font-medium text-foreground/80"
          >
            Prescription image
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full rounded-xl border border-glass bg-light-gray px-3 py-2 text-sm text-foreground/80 file:mr-3 file:rounded-lg file:border-0 file:bg-senior-green file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-senior-green/90 focus:border-senior-green focus:outline-none focus:ring-1 focus:ring-senior-green"
            required
          />
        </div>
        {error && (
          <p className="text-sm text-accent" role="alert">
            {error}
          </p>
        )}
        {success && (
          <p className="text-sm text-secondary">
            Prescription uploaded successfully.
          </p>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center rounded-xl bg-senior-green px-4 py-2.5 text-sm font-medium text-white shadow-soft transition-colors hover:bg-senior-green/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <span className="mr-2 size-4 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
              Uploading…
            </>
          ) : (
            "Upload"
          )}
        </button>
      </form>
    </>
  );
}

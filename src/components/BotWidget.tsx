"use client";

import { useState } from "react";

export default function BotWidget(): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((p) => !p)}
        className="flex size-10 items-center justify-center rounded-full bg-graphite-olive/90 text-white shadow-soft transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-graphite-slate"
        aria-label={isOpen ? "Close helper" : "Open helper"}
      >
        <span className="text-lg" aria-hidden>💬</span>
      </button>
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-64 rounded-xl bg-glass border border-glass p-3 shadow-diffuse">
          <p className="text-sm text-graphite-olive">
            Need help? I can guide you through uploading a prescription or adding
            medicines.
          </p>
        </div>
      )}
    </div>
  );
}

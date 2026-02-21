export default function DoctorBot(): React.ReactElement {
  return (
    <div
      className="doctor-bob pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full opacity-0 transition-all duration-300 group-hover:opacity-100"
      aria-hidden
    >
      <div className="relative -top-2 shadow-diffuse">
        <svg
          width="80"
          height="100"
          viewBox="0 0 80 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="block"
        >
          {/* Head – theme skin/blush */}
          <circle cx="40" cy="28" r="18" fill="#e8e4df" stroke="#6b6559" strokeWidth="1.5" />
          {/* Face - eyes */}
          <circle cx="34" cy="25" r="2.5" fill="#6b6559" />
          <circle cx="46" cy="25" r="2.5" fill="#6b6559" />
          {/* Smile */}
          <path d="M 32 32 Q 40 38 48 32" stroke="#6b6559" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          {/* Stethoscope – slate */}
          <circle cx="40" cy="50" r="8" fill="none" stroke="#7a8594" strokeWidth="3" />
          <path d="M 40 58 L 40 75 L 28 85 M 40 75 L 52 85" stroke="#7a8594" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <circle cx="28" cy="85" r="4" fill="#7a8594" />
          <circle cx="52" cy="85" r="4" fill="#7a8594" />
          {/* Body / lab coat */}
          <path d="M 22 48 L 22 88 L 58 88 L 58 48 L 40 42 Z" fill="#e8e4df" stroke="#6b6559" strokeWidth="1.5" />
          <line x1="40" y1="42" x2="40" y2="88" stroke="#b5b0a8" strokeWidth="1" strokeDasharray="2 2" />
          {/* Collar – blush */}
          <path d="M 32 48 L 40 44 L 48 48" fill="none" stroke="#e2d5d2" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-graphite-olive px-2 py-0.5 text-[10px] font-medium text-white shadow-soft">
          AI Care
        </span>
      </div>
    </div>
  );
}

import Link from "next/link";
import DoctorBot from "./DoctorBot";

export default function JoinCTA(): React.ReactElement {
  return (
    <div className="group relative inline-block">
      <DoctorBot />
      <Link
        href="/join"
        className="relative inline-flex items-center gap-2 rounded-2xl bg-graphite-olive px-8 py-4 text-lg font-semibold text-white shadow-diffuse transition-all duration-300 hover:bg-graphite-slate hover:shadow-soft hover:scale-[1.02]"
      >
        Join with us
      </Link>
    </div>
  );
}

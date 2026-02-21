import type { Metadata } from "next";
import "../src/app/globals.css";

export const metadata: Metadata = {
  title: "Grandparent Med Tracker",
  description: "Medication reminder for grandparents",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

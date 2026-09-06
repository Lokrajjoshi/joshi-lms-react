import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Joshi LMS | Build skills with direction",
  description: "A modern learning management system built with Next.js, TypeScript and MongoDB.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

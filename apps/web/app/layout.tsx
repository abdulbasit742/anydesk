import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RemoteDesk",
  description: "Secure remote access for teams and support desks."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

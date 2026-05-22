import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Grants For Me",
  description: "Find and manage your grant opportunities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

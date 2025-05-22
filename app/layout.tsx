`use client`;

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Storyworth Voice Call Demo",
  description: "Sean Conrad's deployment of the Storyworth Voice Call Demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased text-[#042A21]`}>{children}</body>
    </html>
  );
}

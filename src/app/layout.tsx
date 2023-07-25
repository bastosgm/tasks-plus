"use client";

import "./globals.css";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Header from "../components/header";
import { AuthProvider } from "../components/Providers/AuthProvider";

// export const metadata: Metadata = {
//   title: "Tasks+ | A complete todo app",
//   description: "A complete todo app",
// };

const roboto = Roboto({
  weight: ["100", "300", "500", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-roboto",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={roboto.className}>
      <head />
      <body>
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

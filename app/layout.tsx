import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { AgeGateModal } from "@/components/public/age-gate-modal";
import { AGE_GATE_COOKIE } from "@/lib/age-gate";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "eudromiac club",
  description: "Club cannábico de socios — acceso por invitación.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const ageOk = cookieStore.has(AGE_GATE_COOKIE);

  return (
    <html lang="es" className={inter.variable}>
      <body>
        {!ageOk && <AgeGateModal />}
        {children}
      </body>
    </html>
  );
}

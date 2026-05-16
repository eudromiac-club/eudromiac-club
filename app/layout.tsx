import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import { cookies } from "next/headers";
import { AgeGateModal } from "@/components/public/age-gate-modal";
import { Topbar } from "@/components/layout/topbar";
import { AGE_GATE_COOKIE } from "@/lib/age-gate";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT"],
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
    <html lang="es" className={`${inter.variable} ${fraunces.variable}`}>
      <body>
        {!ageOk && <AgeGateModal />}
        <Topbar />
        {children}
      </body>
    </html>
  );
}

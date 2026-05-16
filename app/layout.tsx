import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
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

const cinzel = Cinzel({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "EUDROMIA CLUB · La alquimia del bienestar",
  description:
    "Curaduría botánica y guía privada para el viaje hacia el equilibrio. Acceso restringido por invitación.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const ageOk = cookieStore.has(AGE_GATE_COOKIE);

  return (
    <html lang="es" className={`dark ${inter.variable} ${cinzel.variable}`}>
      <body>
        {!ageOk && <AgeGateModal />}
        <Topbar />
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/dal';

export const metadata: Metadata = {
  title: 'Admin · EUDROMIA CLUB',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <>
      <nav
        aria-label="Secciones del admin"
        className="border-b border-border/60 bg-muted/30"
      >
        <div className="mx-auto flex max-w-6xl items-center gap-6 overflow-x-auto px-6 py-3 text-sm">
          <Link href="/admin" className="font-medium hover:text-foreground">
            Panel
          </Link>
          <Link href="/admin/invitations" className="text-muted-foreground hover:text-foreground">
            Invitaciones
          </Link>
          <span className="cursor-not-allowed text-muted-foreground/50">Socios</span>
          <span className="cursor-not-allowed text-muted-foreground/50">Genéticas</span>
        </div>
      </nav>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </>
  );
}

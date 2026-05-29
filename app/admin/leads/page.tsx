import { listLeads } from '@/lib/leads/server';
import { formatDate } from '@/lib/orders/labels';
import { toggleLeadContactedAction } from './actions';

export const metadata = {
  title: 'Interesados · Admin · EUDROMIA CLUB',
};

export default async function AdminLeadsPage() {
  const rows = await listLeads();
  const pending = rows.filter((r) => !r.contacted).length;

  return (
    <div className="space-y-10">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Admin · Captación
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium uppercase tracking-[0.1em] sm:text-4xl">
          <span className="text-brand">Interesados</span>.
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Personas que dejaron sus datos en el sitio para recibir más información.
          {pending > 0 && (
            <span className="ml-1 font-mono text-[11px] uppercase tracking-widest text-brand">
              · {pending} sin contactar
            </span>
          )}
        </p>
      </header>

      {rows.length === 0 ? (
        <div className="border border-dashed border-border p-10 text-center">
          <p className="text-sm text-muted-foreground">Todavía no hay interesados.</p>
        </div>
      ) : (
        <ul className="divide-y border border-border bg-card">
          {rows.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center gap-4 p-5">
              <span
                className={`inline-flex shrink-0 rounded-full border px-3 py-0.5 text-[10px] uppercase tracking-[0.2em] ${
                  r.contacted
                    ? 'border-border text-muted-foreground'
                    : 'border-brand text-brand'
                }`}
              >
                {r.contacted ? '● Contactado' : '○ Nuevo'}
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-sm">{r.name ?? '—'}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  <a href={`mailto:${r.email}`} className="hover:text-foreground">
                    {r.email}
                  </a>
                  <span className="mx-2">·</span>
                  <a href={`tel:${r.phone}`} className="hover:text-foreground">
                    {r.phone}
                  </a>
                </p>
              </div>

              <div className="text-xs">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Origen
                </p>
                <p className="mt-0.5">{r.source}</p>
              </div>

              <div className="text-xs">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Fecha
                </p>
                <p className="mt-0.5">{formatDate(r.createdAt)}</p>
              </div>

              <form action={toggleLeadContactedAction}>
                <input type="hidden" name="id" value={r.id} />
                <input type="hidden" name="contacted" value={(!r.contacted).toString()} />
                <button
                  type="submit"
                  className="border border-border px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
                >
                  {r.contacted ? 'Marcar sin contactar' : 'Marcar contactado'}
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

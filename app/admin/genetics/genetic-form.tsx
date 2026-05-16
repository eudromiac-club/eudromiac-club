'use client';

import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { upsertGeneticAction, type GeneticFormState } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Genetic = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  type: 'sativa' | 'indica' | 'hybrid' | 'cbd';
  thcPercent: string | null;
  cbdPercent: string | null;
  priceCents: number;
  stock: number;
  maxPerOrderGrams: string | null;
  images: string[];
  active: boolean;
};

const TYPE_OPTIONS: Array<{ value: Genetic['type']; label: string }> = [
  { value: 'sativa', label: 'Sativa' },
  { value: 'indica', label: 'Indica' },
  { value: 'hybrid', label: 'Híbrida' },
  { value: 'cbd', label: 'CBD' },
];

function labelClass() {
  return 'mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground';
}

export function GeneticForm({ initial }: { initial?: Genetic }) {
  const router = useRouter();
  const [state, action, isPending] = useActionState<GeneticFormState, FormData>(
    upsertGeneticAction,
    undefined,
  );
  const errors = state && !state.ok ? state.errors : undefined;
  const formError = state && !state.ok ? state.form : undefined;
  const priceArs = initial ? initial.priceCents / 100 : '';

  useEffect(() => {
    if (state?.ok) {
      router.push('/admin/genetics');
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={action} className="space-y-8">
      {initial && <input type="hidden" name="id" value={initial.id} />}

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass()}>
            Nombre
          </label>
          <Input id="name" name="name" required defaultValue={initial?.name ?? ''} maxLength={120} />
          {errors?.name && <p className="mt-1 text-xs text-destructive">{errors.name[0]}</p>}
        </div>
        <div>
          <label htmlFor="slug" className={labelClass()}>
            Slug (opcional)
          </label>
          <Input
            id="slug"
            name="slug"
            placeholder="se genera automáticamente"
            defaultValue={initial?.slug ?? ''}
            maxLength={120}
          />
          {errors?.slug && <p className="mt-1 text-xs text-destructive">{errors.slug[0]}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="description" className={labelClass()}>
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={initial?.description ?? ''}
          className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <label htmlFor="type" className={labelClass()}>
            Tipo
          </label>
          <select
            id="type"
            name="type"
            required
            defaultValue={initial?.type ?? 'hybrid'}
            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
          >
            {TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="thcPercent" className={labelClass()}>
            THC %
          </label>
          <Input
            id="thcPercent"
            name="thcPercent"
            type="number"
            step="0.01"
            min="0"
            max="99.99"
            defaultValue={initial?.thcPercent ?? ''}
            placeholder="—"
          />
          {errors?.thcPercent && <p className="mt-1 text-xs text-destructive">{errors.thcPercent[0]}</p>}
        </div>
        <div>
          <label htmlFor="cbdPercent" className={labelClass()}>
            CBD %
          </label>
          <Input
            id="cbdPercent"
            name="cbdPercent"
            type="number"
            step="0.01"
            min="0"
            max="99.99"
            defaultValue={initial?.cbdPercent ?? ''}
            placeholder="—"
          />
        </div>
        <div>
          <label htmlFor="maxPerOrderGrams" className={labelClass()}>
            Máx por pedido (g)
          </label>
          <Input
            id="maxPerOrderGrams"
            name="maxPerOrderGrams"
            type="number"
            step="0.5"
            min="0"
            defaultValue={initial?.maxPerOrderGrams ?? ''}
            placeholder="sin cap"
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="priceArs" className={labelClass()}>
            Precio (ARS)
          </label>
          <Input
            id="priceArs"
            name="priceArs"
            type="number"
            step="100"
            min="0"
            required
            defaultValue={priceArs}
          />
          {errors?.priceArs && <p className="mt-1 text-xs text-destructive">{errors.priceArs[0]}</p>}
        </div>
        <div>
          <label htmlFor="stock" className={labelClass()}>
            Stock disponible (g)
          </label>
          <Input
            id="stock"
            name="stock"
            type="number"
            step="1"
            min="0"
            required
            defaultValue={initial?.stock ?? 0}
          />
        </div>
      </div>

      <div>
        <label htmlFor="imageUrl" className={labelClass()}>
          URL de imagen
        </label>
        <Input
          id="imageUrl"
          name="imageUrl"
          type="url"
          placeholder="https://..."
          defaultValue={initial?.images?.[0] ?? ''}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Pegá un link directo a una imagen (Unsplash, Imgur, tu hosting). Por ahora no soportamos
          subir archivos desde tu PC — eso llega en otra fase.
        </p>
      </div>

      <label className="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          name="active"
          defaultChecked={initial?.active ?? true}
          className="h-4 w-4 rounded border-input"
        />
        <span>Activa (visible en el dispensario)</span>
      </label>

      {formError && (
        <p role="alert" className="text-sm text-destructive">
          {formError}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <Button
          type="submit"
          disabled={isPending}
          className="rounded-none px-6 py-5 text-[11px] uppercase tracking-[0.25em]"
        >
          {isPending ? 'Guardando…' : initial ? 'Guardar cambios' : 'Crear genética'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/genetics')}
          className="rounded-none px-6 py-5 text-[11px] uppercase tracking-[0.25em]"
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}

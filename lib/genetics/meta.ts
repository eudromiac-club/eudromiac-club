export type GeneticMeta = {
  description: string;
  cross: string | null;
  terpenes: number | null;
};

// El description en DB tiene formato:
//   <texto>\n---\n<key>::<value>|<key>::<value>...
// El script reset-genetics guarda cross y terpenes ahí para no extender el schema.
export function parseGeneticDescription(raw: string | null): GeneticMeta {
  if (!raw) return { description: '', cross: null, terpenes: null };
  const parts = raw.split('\n---\n');
  if (parts.length < 2) return { description: raw, cross: null, terpenes: null };
  const description = parts[0];
  const map = new Map<string, string>();
  for (const pair of parts[1].split('|')) {
    const [k, v] = pair.split('::');
    if (k && v) map.set(k, v);
  }
  return {
    description,
    cross: map.get('cross') ?? null,
    terpenes: map.has('terpenes') ? Number(map.get('terpenes')) : null,
  };
}

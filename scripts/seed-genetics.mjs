// Carga 5 genéticas de prueba en la tabla genetics.
// Idempotente por slug (ON CONFLICT DO NOTHING) — corré las veces que quieras.
// Uso: npm run db:seed-genetics
import pg from 'pg';

const ITEMS = [
  {
    slug: 'aurora-boreal',
    name: 'Aurora Boreal',
    description:
      'Sativa luminosa de notas cítricas y eucalipto. Apunta a la claridad mental y la creatividad matutina.',
    type: 'sativa',
    thc: 22.0,
    cbd: 0.5,
    priceArs: 18000,
    stock: 80,
    capGrams: 5,
    image: '/landing/flower-cannabis.jpg',
  },
  {
    slug: 'vespertina-atlas',
    name: 'Vespertina Atlas',
    description:
      'Indica nocturna de cuerpo resinoso. Pensada para el descanso profundo y la desconexión.',
    type: 'indica',
    thc: 19.5,
    cbd: 0.8,
    priceArs: 17000,
    stock: 65,
    capGrams: 5,
    image: null,
  },
  {
    slug: 'solstice-reverence',
    name: 'Solstice Reverence',
    description:
      'Híbrida balanceada de carácter herbáceo. Acompaña sin dominar — ideal para el día acotado.',
    type: 'hybrid',
    thc: 18.0,
    cbd: 1.2,
    priceArs: 16500,
    stock: 90,
    capGrams: 7,
    image: '/landing/flower-cannabis.jpg',
  },
  {
    slug: 'eudromia-no-1',
    name: 'Eudromia No. 1',
    description:
      'Nuestra firma. Híbrida de baja rotación, perfil cálido y tricomas densos. Selección limitada.',
    type: 'hybrid',
    thc: 24.0,
    cbd: 0.3,
    priceArs: 22000,
    stock: 45,
    capGrams: 4,
    image: null,
  },
  {
    slug: 'lumen-cbd',
    name: 'Lumen CBD',
    description:
      'Alta concentración de CBD, mínima de THC. Pensada para uso terapéutico durante el día.',
    type: 'cbd',
    thc: 0.4,
    cbd: 18.0,
    priceArs: 19000,
    stock: 70,
    capGrams: 8,
    image: null,
  },
];

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

try {
  let inserted = 0;
  let skipped = 0;
  for (const it of ITEMS) {
    const images = it.image ? [it.image] : [];
    const result = await pool.query(
      `INSERT INTO genetics (slug, name, description, type, thc_percent, cbd_percent, price_cents, stock, max_per_order_grams, images, active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true)
       ON CONFLICT (slug) DO NOTHING
       RETURNING id`,
      [
        it.slug,
        it.name,
        it.description,
        it.type,
        it.thc,
        it.cbd,
        Math.round(it.priceArs * 100),
        it.stock,
        it.capGrams,
        images,
      ],
    );
    if (result.rowCount > 0) {
      inserted++;
      console.log(`+ ${it.name}`);
    } else {
      skipped++;
      console.log(`= ${it.name} (ya existía)`);
    }
  }
  console.log(`\nResumen: ${inserted} nuevas · ${skipped} ya estaban.`);
  await pool.end();
} catch (e) {
  console.error('FAIL:', e.message);
  await pool.end();
  process.exit(1);
}

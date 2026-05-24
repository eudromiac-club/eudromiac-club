// Resetea el catálogo: borra todas las genéticas + carritos + pedidos previos
// y siembra las 3 genéticas del brief de mayo 2026 (Pusherman, Berry Blotto,
// Herb & Turf) con sus imágenes en /public/dispensario/.
//
// Uso: npm run db:reset-genetics
import pg from 'pg';

const ITEMS = [
  {
    slug: 'pusherman',
    name: 'Pusherman',
    cross: 'Dewberry × Push OG',
    description:
      'Indica dominante de presencia imponente, desarrollada para quienes reconocen calidad desde el primer aroma. Notas intensas de berries maduras con un refinado fondo gaseoso. Flores densas, estructura impecable y una capa de resina que refleja su potencia excepcional.',
    type: 'indica',
    thc: 29.0,
    cbd: null,
    terpenes: 4.0,
    priceArs: 22000,
    stock: 60,
    capGrams: 5,
    image: '/dispensario/pusherman.png',
  },
  {
    slug: 'berry-blotto',
    name: 'Berry Blotto',
    cross: 'Dewberry × Purple Haze',
    description:
      'Indica dominante de expresión profunda y sofisticada, con perfil aromático intenso a berries oscuras y especias cálidas. Flores completamente púrpuras, densas, resinosas y de humo excepcionalmente suave. Carácter sedativo y presencia premium.',
    type: 'indica',
    thc: 26.0,
    cbd: null,
    terpenes: null,
    priceArs: 20000,
    stock: 60,
    capGrams: 5,
    image: '/dispensario/berry-blotto.png',
  },
  {
    slug: 'herb-and-turf',
    name: 'Herb & Turf',
    cross: 'Sour Diesel × Wintry Fruit',
    description:
      'Sativa dominante expansiva, diseñada para máxima expresión aromática y producción sobresaliente. Notas intensas a sour, gas y vainilla, envueltas en una capa extrema de tricomas.',
    type: 'sativa',
    thc: null,
    cbd: null,
    terpenes: null,
    priceArs: 19000,
    stock: 60,
    capGrams: 5,
    image: '/dispensario/herb-and-turf.png',
  },
];

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

try {
  await pool.query('BEGIN');

  // Limpiar referencias FK primero (order_items y cart_items tienen restrict)
  await pool.query('DELETE FROM order_items');
  await pool.query('DELETE FROM orders');
  await pool.query('DELETE FROM cart_items');
  await pool.query('DELETE FROM carts');
  await pool.query('DELETE FROM genetics');

  for (const it of ITEMS) {
    // Guardamos el cross y los terpenos al final del description con un separador
    // simple — la página de detalle los parsea para mostrar como ficha técnica.
    const meta = [
      `cross::${it.cross}`,
      it.terpenes != null ? `terpenes::${it.terpenes}` : null,
    ]
      .filter(Boolean)
      .join('|');
    const description = `${it.description}\n---\n${meta}`;

    await pool.query(
      `INSERT INTO genetics
       (slug, name, description, type, thc_percent, cbd_percent, price_cents, stock, max_per_order_grams, images, active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true)`,
      [
        it.slug,
        it.name,
        description,
        it.type,
        it.thc,
        it.cbd,
        Math.round(it.priceArs * 100),
        it.stock,
        it.capGrams,
        [it.image],
      ],
    );
    console.log(`+ ${it.name}`);
  }

  await pool.query('COMMIT');
  console.log(`\nReset OK. ${ITEMS.length} genéticas activas.`);
} catch (e) {
  await pool.query('ROLLBACK');
  console.error('FAIL:', e.message);
  process.exit(1);
} finally {
  await pool.end();
}

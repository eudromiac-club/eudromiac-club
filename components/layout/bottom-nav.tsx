import { getCurrentUser } from '@/lib/auth/dal';
import { getCartCount } from '@/lib/cart/server';
import { BottomNavBar } from '@/components/layout/bottom-nav-bar';

// Barra de navegación inferior tipo app, solo mobile (md:hidden) y solo para
// usuarios logueados. Convive con el CartStickyCta (que se levanta en mobile
// para no pisarla). Server component: resuelve auth + contador de carrito y se
// los pasa a la barra cliente, que marca el item activo con usePathname.
export async function BottomNav() {
  const user = await getCurrentUser();
  if (!user) return null;

  const isActive = user.status === 'active';
  const cartCount = isActive ? await getCartCount(user.id) : 0;

  // Máximo 5 items para que entren cómodos en mobile. Admins tienen su propio
  // set (Inicio·Dispensario·Carrito·Admin); los socios ven Favoritos y Pedidos.
  const inicio = { href: '/cuenta', label: 'Inicio', icon: 'home' as const, match: '/cuenta', exact: true };
  const dispensario = { href: '/dispensario', label: 'Dispensario', icon: 'shop' as const, match: '/dispensario' };
  const carrito = { href: '/carrito', label: 'Carrito', icon: 'cart' as const, match: '/carrito', badge: cartCount };

  const items =
    user.role === 'admin'
      ? [
          inicio,
          dispensario,
          ...(isActive ? [carrito] : []),
          { href: '/admin', label: 'Admin', icon: 'admin' as const, match: '/admin' },
        ]
      : [
          inicio,
          dispensario,
          { href: '/cuenta/favoritos', label: 'Favoritos', icon: 'fav' as const, match: '/cuenta/favoritos' },
          ...(isActive ? [carrito] : []),
          { href: '/cuenta/pedidos', label: 'Pedidos', icon: 'orders' as const, match: '/cuenta/pedidos' },
        ];

  return (
    <>
      {/* Reserva de espacio para que el nav fijo no tape el final del contenido */}
      <div className="h-16 md:hidden" aria-hidden />
      <BottomNavBar items={items} />
    </>
  );
}

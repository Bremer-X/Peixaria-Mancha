import { useState, useEffect, useMemo } from 'react';
import DeliveryHeader from './components/delivery/DeliveryHeader';
import DeliveryMenuSection from './components/delivery/DeliveryMenuSection';
import DeliveryItemModal from './components/delivery/DeliveryItemModal';
import DeliveryCartDrawer from './components/delivery/DeliveryCartDrawer';
import DeliveryFloatingCart from './components/delivery/DeliveryFloatingCart';
import {
  DELIVERY_MENU_CATEGORIES,
  DELIVERY_RESTAURANT_INFO,
  DeliveryMenuItem,
  DeliveryCartItem,
} from './data/deliveryMenuData';
import { UtensilsCrossed, Check, PhoneCall, Instagram, CheckCircle2 } from 'lucide-react';

export default function DeliveryApp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState(DELIVERY_MENU_CATEGORIES[0].id);

  // Cart state persisted to localStorage
  const [cart, setCart] = useState<DeliveryCartItem[]>(() => {
    try {
      const saved = localStorage.getItem('peixaria_mancha_delivery_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [modalItem, setModalItem] = useState<{
    item: DeliveryMenuItem;
    defaultPortion?: '250g' | '500g';
  } | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('peixaria_mancha_delivery_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Toast auto-hide
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 2500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Scroll listener to update active category tab
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      for (const cat of DELIVERY_MENU_CATEGORIES) {
        const el = document.getElementById(`delivery-section-${cat.id}`);
        if (el) {
          const top = el.offsetTop - 120;
          const bottom = top + el.offsetHeight;
          if (scrollY >= top && scrollY < bottom) {
            setActiveCategoryId(cat.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter categories and items based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return DELIVERY_MENU_CATEGORIES;

    const term = searchQuery.toLowerCase().trim();
    return DELIVERY_MENU_CATEGORIES.map((category) => {
      const matchingItems = category.items.filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          (item.description && item.description.toLowerCase().includes(term)) ||
          (item.badge && item.badge.toLowerCase().includes(term))
      );
      return {
        ...category,
        items: matchingItems,
      };
    }).filter((category) => category.items.length > 0);
  }, [searchQuery]);

  const handleSelectCategory = (id: string) => {
    setActiveCategoryId(id);
    const element = document.getElementById(`delivery-section-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenItem = (item: DeliveryMenuItem, defaultPortion?: '250g' | '500g') => {
    setModalItem({ item, defaultPortion });
  };

  const handleAddToCart = (newItem: DeliveryCartItem) => {
    setCart((prev) => {
      // Check for same item and portion and notes
      const existingIdx = prev.findIndex(
        (i) => i.menuItemId === newItem.menuItemId && i.portion === newItem.portion && i.notes === newItem.notes
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += newItem.quantity;
        return updated;
      }
      return [...prev, newItem];
    });

    setToastMessage(`✓ ${newItem.name} adicionado ao pedido!`);
  };

  const handleUpdateQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartValue = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-[var(--color-natural)] text-[var(--color-river)] flex flex-col items-center selection:bg-[var(--color-forest)] selection:text-white">
      <div className="w-full max-w-2xl flex flex-col min-h-screen relative bg-[var(--color-natural)]">
        {/* Header with Search and Cart info */}
        <DeliveryHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          cartItemCount={totalCartCount}
          cartTotal={totalCartValue}
          onOpenCart={() => setIsCartOpen(true)}
        />

        {/* Sticky Horizontal Categories Pill Navigation */}
        <div className="sticky top-0 z-30 bg-[var(--color-natural)]/95 backdrop-blur-md py-2 px-3 sm:px-4 border-y border-stone-200/80 shadow-2xs">
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-0.5">
            {DELIVERY_MENU_CATEGORIES.map((category) => {
              const isActive = activeCategoryId === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => handleSelectCategory(category.id)}
                  className={`inline-flex items-center gap-1.5 whitespace-nowrap px-4 py-2 min-h-[42px] rounded-full font-montserrat font-bold text-xs tracking-wide transition-all uppercase cursor-pointer ${
                    isActive
                      ? 'bg-[var(--color-forest)] text-white shadow-xs ring-2 ring-[var(--color-forest)]/20'
                      : 'bg-white text-[var(--color-river)] hover:border-[var(--color-forest)] border border-stone-200 shadow-2xs'
                  }`}
                >
                  <span>{category.title}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/25 text-white' : 'bg-stone-100 text-stone-500'
                  }`}>
                    {category.items.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 px-3 sm:px-4 py-3 space-y-3">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-stone-200 shadow-xs">
              <UtensilsCrossed className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="font-bebas text-2xl uppercase text-[var(--color-river)]">
                Nenhum prato encontrado
              </h3>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                Não encontramos nenhum item correspondente a "{searchQuery}".
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-4 bg-[var(--color-tucuma)] hover:opacity-95 active:scale-95 text-white text-xs font-montserrat font-bold px-5 py-2.5 min-h-[44px] rounded-full shadow-xs cursor-pointer transition-all"
              >
                Ver Cardápio Completo
              </button>
            </div>
          ) : (
            filteredCategories.map((category) => (
              <DeliveryMenuSection
                key={category.id}
                category={category}
                onSelectItem={handleOpenItem}
              />
            ))
          )}
        </main>

        {/* Footer */}
        <footer className="w-full max-w-2xl mx-auto px-3 sm:px-4 pb-24 pt-3 space-y-3 text-center">
          {/* Fresh fish guarantee */}
          <div className="bg-[var(--color-forest)] text-white py-4 px-5 rounded-3xl shadow-xs border border-[var(--color-acai-gold)]/30">
            <div className="flex items-center justify-center gap-1.5 mb-0.5">
              <CheckCircle2 className="w-4 h-4 text-[var(--color-acai-gold)]" />
              <h3 className="font-bebas text-lg sm:text-xl tracking-tight uppercase font-extrabold text-[var(--color-sand)]">
                {DELIVERY_RESTAURANT_INFO.freshFishBadge}
              </h3>
            </div>
            <p className="text-xs font-montserrat text-white/90 font-medium">
              {DELIVERY_RESTAURANT_INFO.qualityGuarantee}
            </p>
          </div>

          {/* WhatsApp & Social Media Contacts */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-stone-200/90 space-y-3">
            <span className="font-montserrat font-black text-xs uppercase tracking-widest text-[var(--color-tucuma)] block">
              ATENDIMENTO & PEDIDOS
            </span>
            <h3 className="font-bebas text-2xl sm:text-3xl font-extrabold text-[var(--color-river)] tracking-tight uppercase leading-tight">
              DELIVERY RÁPIDO E SEGURO
            </h3>

            <div className="pt-1 flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto">
              <a
                href={`https://wa.me/${DELIVERY_RESTAURANT_INFO.whatsapp}?text=Olá!%20Gostaria%20de%20fazer%20um%20pedido.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[var(--color-tucuma)] hover:opacity-95 active:scale-98 text-white py-3 px-5 min-h-[48px] rounded-2xl font-montserrat font-bold text-sm tracking-wide shadow-xs transition-all group"
              >
                <PhoneCall className="w-4 h-4 fill-white group-hover:rotate-12 transition-transform" />
                <span>{DELIVERY_RESTAURANT_INFO.phoneFormatted}</span>
              </a>

              <a
                href={DELIVERY_RESTAURANT_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[var(--color-forest)] hover:opacity-95 active:scale-98 text-white py-3 px-5 min-h-[48px] rounded-2xl font-montserrat font-bold text-sm tracking-wide shadow-xs transition-all"
              >
                <Instagram className="w-4 h-4" />
                <span>{DELIVERY_RESTAURANT_INFO.instagram}</span>
              </a>
            </div>

            <p className="text-xs text-stone-500 font-medium max-w-md mx-auto pt-1">
              Peça online pelo cardápio ou fale diretamente conosco no WhatsApp!
            </p>
          </div>

          <div className="pt-2 text-stone-500">
            <p className="font-montserrat font-bold text-xs uppercase tracking-wider">
              Peixaria Mancha • Belém - PA
            </p>
          </div>
        </footer>

        {/* Floating Cart Button */}
        <DeliveryFloatingCart
          cart={cart}
          onOpenCart={() => setIsCartOpen(true)}
        />

        {/* Item customization modal */}
        <DeliveryItemModal
          item={modalItem?.item || null}
          defaultPortion={modalItem?.defaultPortion}
          onClose={() => setModalItem(null)}
          onAddToCart={handleAddToCart}
        />

        {/* Cart Drawer Checkout */}
        <DeliveryCartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
        />

        {/* Success Toast Notification */}
        {toastMessage && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#125c34] text-white text-xs sm:text-sm font-montserrat font-bold py-2 px-4 rounded-full shadow-xl flex items-center gap-1.5 animate-bounce">
            <Check className="w-4 h-4 text-emerald-300" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}

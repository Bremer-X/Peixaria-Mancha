import { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import CategoryNav from './components/CategoryNav';
import MenuSection from './components/MenuSection';
import ItemModal from './components/ItemModal';
import CartDrawer from './components/CartDrawer';
import FloatingCartButton from './components/FloatingCartButton';
import FooterBanner from './components/FooterBanner';
import { MENU_CATEGORIES } from './data/menuData';
import { MenuItem, CartItem } from './types';
import { Check, UtensilsCrossed } from 'lucide-react';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState(MENU_CATEGORIES[0].id);

  // Cart state persisted to localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('peixaria_mancha_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [modalItem, setModalItem] = useState<{
    item: MenuItem;
    defaultPortion?: '2P' | '4P';
    isExecutivo?: boolean;
  } | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('peixaria_mancha_cart', JSON.stringify(cart));
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

  // Intersection observer or scroll listener to update active category tab
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      for (const cat of MENU_CATEGORIES) {
        const el = document.getElementById(`section-${cat.id}`);
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
    if (!searchQuery.trim()) return MENU_CATEGORIES;

    const term = searchQuery.toLowerCase().trim();
    return MENU_CATEGORIES.map((category) => {
      const matchingItems = category.items.filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          (item.description && item.description.toLowerCase().includes(term)) ||
          (item.preparation && item.preparation.toLowerCase().includes(term))
      );
      return {
        ...category,
        items: matchingItems,
      };
    }).filter((category) => category.items.length > 0);
  }, [searchQuery]);

  const handleSelectCategory = (id: string) => {
    setActiveCategoryId(id);
    const element = document.getElementById(`section-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenItem = (item: MenuItem, defaultPortion?: '2P' | '4P') => {
    // Check if item belongs to Executivo to offer side options
    const isExecutivo = MENU_CATEGORIES.find((c) => c.id === 'executivo')?.items.some(
      (i) => i.id === item.id
    );
    setModalItem({ item, defaultPortion, isExecutivo });
  };

  const handleAddToCart = (newItem: CartItem) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((i) => i.id === newItem.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += newItem.quantity;
        return updated;
      }
      return [...prevCart, newItem];
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
    <div className="min-h-screen bg-[#f0ba35] text-stone-900 flex flex-col items-center">
      {/* Container simulating the authentic physical printed cardápio flyer proportions */}
      <div className="w-full max-w-3xl flex flex-col min-h-screen relative shadow-2xl bg-[#f0ba35]">
        {/* Header with Logo, Title and Search */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          cartItemCount={totalCartCount}
          cartTotal={totalCartValue}
          onOpenCart={() => setIsCartOpen(true)}
        />

        {/* Sticky Horizontal Categories Pill Navigation */}
        <CategoryNav
          categories={MENU_CATEGORIES}
          activeCategoryId={activeCategoryId}
          onSelectCategory={handleSelectCategory}
        />

        {/* Main Content Area */}
        <main className="flex-1 px-3 sm:px-4 py-4 space-y-4">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-16 px-4 bg-[#fffdec] rounded-2xl border border-[#ecd596] shadow-sm">
              <UtensilsCrossed className="w-12 h-12 text-stone-400 mx-auto mb-3" />
              <h3 className="font-bebas text-2xl uppercase text-stone-800">
                Nenhum item encontrado
              </h3>
              <p className="text-xs text-stone-600 mt-1 max-w-xs mx-auto">
                Não encontramos nenhum prato correspondente a "{searchQuery}".
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-4 bg-[#b21818] text-white text-xs font-montserrat font-bold px-4 py-2 rounded-full shadow-sm"
              >
                Ver Cardápio Completo
              </button>
            </div>
          ) : (
            filteredCategories.map((category) => (
              <MenuSection
                key={category.id}
                category={category}
                onSelectItem={handleOpenItem}
              />
            ))
          )}
        </main>

        {/* Bottom Banner, WhatsApp Order CTA, and Drink Responsibly disclaimer */}
        <FooterBanner />

        {/* Floating Cart Button (visible when cart has items) */}
        <FloatingCartButton
          cart={cart}
          onOpenCart={() => setIsCartOpen(true)}
        />

        {/* Quick Item Customization & Add Modal */}
        <ItemModal
          item={modalItem?.item || null}
          defaultPortion={modalItem?.defaultPortion}
          isExecutivo={modalItem?.isExecutivo}
          onClose={() => setModalItem(null)}
          onAddToCart={handleAddToCart}
        />

        {/* Cart / Checkout Drawer */}
        <CartDrawer
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

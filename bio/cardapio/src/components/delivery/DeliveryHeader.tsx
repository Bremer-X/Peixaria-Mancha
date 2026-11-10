import { useState, useEffect } from 'react';
import { Search, ShoppingBag, PhoneCall, X, Sparkles, Clock, MapPin, ArrowLeft } from 'lucide-react';
import logoImg from '../../assets/logo.png';
import { DELIVERY_RESTAURANT_INFO, getDeliveryAvailability } from '../../data/deliveryMenuData';

interface DeliveryHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cartItemCount: number;
  cartTotal: number;
  onOpenCart: () => void;
}

export default function DeliveryHeader({
  searchQuery,
  onSearchChange,
  cartItemCount,
  cartTotal,
  onOpenCart,
}: DeliveryHeaderProps) {
  const [availability, setAvailability] = useState(getDeliveryAvailability);

  useEffect(() => {
    const interval = setInterval(() => {
      setAvailability(getDeliveryAvailability());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full pt-3 pb-2 text-center relative z-20">
      {/* Top Floating Utility Bar */}
      <div className="max-w-2xl mx-auto px-3 sm:px-4 mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <a
            id="delivery-back-bio"
            href="../index.html"
            className="inline-flex items-center gap-1.5 bg-white hover:bg-[var(--color-sand)]/40 text-[var(--color-river)] text-xs font-montserrat font-bold px-3.5 py-2 min-h-[42px] rounded-full border border-stone-200/80 transition-all active:scale-95 shadow-xs"
            title="Voltar para o site"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[var(--color-forest)]" />
            <span>Início</span>
          </a>

          <a
            id="delivery-header-whatsapp"
            href={`https://wa.me/${DELIVERY_RESTAURANT_INFO.whatsapp}?text=Olá!%20Gostaria%20de%20fazer%20um%20pedido.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-[var(--color-forest)]/10 hover:bg-[var(--color-forest)]/15 text-[var(--color-forest)] text-xs font-montserrat font-bold px-3.5 py-2 min-h-[42px] rounded-full border border-[var(--color-forest)]/25 transition-all active:scale-95 shadow-xs"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[var(--color-forest)]" />
            <span className="hidden xs:inline">WhatsApp</span>
          </a>
        </div>

        {cartItemCount > 0 && (
          <button
            id="delivery-header-cart-btn"
            onClick={onOpenCart}
            className="inline-flex items-center gap-2 bg-[var(--color-tucuma)] hover:opacity-95 text-white px-4 py-2 min-h-[42px] rounded-full font-montserrat font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>
              {cartItemCount} {cartItemCount === 1 ? 'item' : 'itens'} • R${' '}
              {cartTotal.toFixed(2).replace('.', ',')}
            </span>
          </button>
        )}
      </div>

      {/* Main Brand Card / Hero Section */}
      <div className="max-w-2xl mx-auto px-3 sm:px-4">
        <div className="bg-white border border-stone-200/90 rounded-3xl p-4 sm:p-5 shadow-sm text-center relative overflow-hidden">
          {/* Subtle Ambient Decorative Gradient Glow */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--color-sand)]/50 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[var(--color-forest)]/10 rounded-full blur-2xl pointer-events-none" />

          {/* Restaurant Live Status Pill */}
          {availability.isOpen ? (
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-[var(--color-forest)] border border-emerald-200/70 text-[11px] sm:text-xs font-montserrat font-bold px-3.5 py-1.5 rounded-full mb-2.5 shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>{availability.statusText}</span>
              <span className="text-emerald-300">•</span>
              <span className="inline-flex items-center gap-1 text-[var(--color-forest)]">
                <Clock className="w-3 h-3 text-emerald-600" />
                {availability.subText}
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 bg-[var(--color-sand)]/40 text-[var(--color-river)] border border-[var(--color-acai-gold)]/50 text-[11px] sm:text-xs font-montserrat font-bold px-3.5 py-1.5 rounded-full mb-2.5 shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-tucuma)]"></span>
              </span>
              <span className="text-[var(--color-river)]">{availability.statusText}</span>
              <span className="text-stone-400">•</span>
              <span className="inline-flex items-center gap-1 text-[var(--color-forest)] font-extrabold">
                <Clock className="w-3 h-3 text-[var(--color-forest)]" />
                {availability.subText}
              </span>
            </div>
          )}

          {/* Logo & Brand Identity */}
          <div className="flex flex-col items-center justify-center">
            <img
              src={logoImg}
              alt="Peixaria Mancha"
              className="h-20 sm:h-24 w-auto object-contain drop-shadow-sm hover:scale-105 transition-transform"
            />
            <div className="mt-1">
              <h1
                id="delivery-main-title"
                className="font-bebas text-3xl sm:text-4xl font-extrabold text-[var(--color-forest)] tracking-tight uppercase leading-tight"
              >
                Cardápio Delivery
              </h1>
              <p className="font-montserrat font-semibold text-xs sm:text-sm text-[var(--color-river)]/80 mt-0.5">
                {DELIVERY_RESTAURANT_INFO.tagline}
              </p>
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[var(--color-river)]/70 font-medium mt-1 flex-wrap">
                <MapPin className="w-3 h-3 text-[var(--color-tucuma)]" />
                <span>{DELIVERY_RESTAURANT_INFO.location}</span>
                <span className="text-stone-300">•</span>
                <span className="inline-flex items-center gap-1 text-[var(--color-forest)] font-bold">
                  <Sparkles className="w-3 h-3 text-[var(--color-acai-gold)]" />
                  {DELIVERY_RESTAURANT_INFO.freshFishBadge}
                </span>
              </div>
            </div>
          </div>

          {/* Modern Search Bar */}
          <div className="mt-4 max-w-lg mx-auto">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                id="delivery-search-input"
                type="text"
                placeholder="Buscar filhote, dourada, tambaqui, porções..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-10 py-3 min-h-[48px] bg-[var(--color-natural)] focus:bg-white text-[var(--color-river)] placeholder:text-stone-400 text-sm rounded-2xl border border-stone-200 focus:border-[var(--color-forest)] focus:ring-2 focus:ring-[var(--color-forest)]/15 shadow-inner transition-all outline-none"
              />
              {searchQuery && (
                <button
                  id="delivery-clear-search"
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[var(--color-river)] p-1.5 cursor-pointer"
                  title="Limpar busca"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

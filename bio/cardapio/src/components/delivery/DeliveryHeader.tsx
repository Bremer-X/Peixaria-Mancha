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
    // Check every 30 seconds so state stays real-time
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
            href="https://engrenebio.com.br/peixaria-mancha"
            className="inline-flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-montserrat font-bold px-3 py-1.5 rounded-full border border-stone-200/80 transition-all active:scale-95 shadow-xs"
            title="Voltar para a Bio"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-stone-600" />
            <span>Bio</span>
          </a>

          <a
            id="delivery-header-whatsapp"
            href={`https://wa.me/${DELIVERY_RESTAURANT_INFO.whatsapp}?text=Olá,%20gostaria%20de%20fazer%20um%20pedido%20no%20Delivery%20da%20Peixaria%20Mancha!`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] text-xs font-montserrat font-bold px-3 py-1.5 rounded-full border border-[#25D366]/30 transition-all active:scale-95 shadow-xs"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#25D366]" />
            <span className="hidden xs:inline">WhatsApp</span>
          </a>
        </div>

        {cartItemCount > 0 && (
          <button
            id="delivery-header-cart-btn"
            onClick={onOpenCart}
            className="inline-flex items-center gap-2 bg-[#b21818] hover:bg-[#8c1010] text-white px-3.5 py-1.5 rounded-full font-montserrat font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
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
        <div className="bg-gradient-to-b from-amber-50/70 via-white to-white border border-[#ecd596]/60 rounded-3xl p-4 sm:p-5 shadow-sm text-center relative overflow-hidden">
          {/* Subtle Ambient Decorative Gradient Glow */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-200/40 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-red-100/50 rounded-full blur-2xl pointer-events-none" />

          {/* Restaurant Live Status Pill */}
          {availability.isOpen ? (
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200/70 text-[11px] sm:text-xs font-montserrat font-bold px-3 py-1 rounded-full mb-2.5 shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>{availability.statusText}</span>
              <span className="text-emerald-300">•</span>
              <span className="inline-flex items-center gap-1 text-emerald-700">
                <Clock className="w-3 h-3 text-emerald-600" />
                {availability.subText}
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 bg-amber-50/90 text-amber-950 border border-amber-300/80 text-[11px] sm:text-xs font-montserrat font-bold px-3 py-1 rounded-full mb-2.5 shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="text-stone-800">{availability.statusText}</span>
              <span className="text-amber-300">•</span>
              <span className="inline-flex items-center gap-1 text-amber-800 font-extrabold">
                <Clock className="w-3 h-3 text-amber-700" />
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
                className="font-bebas text-4xl sm:text-5xl font-black text-[#b21818] tracking-wider uppercase leading-none drop-shadow-xs"
              >
                CARDÁPIO DELIVERY
              </h1>
              <p className="font-montserrat font-semibold text-xs sm:text-sm text-stone-700 mt-0.5">
                {DELIVERY_RESTAURANT_INFO.tagline}
              </p>
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500 font-medium mt-1">
                <MapPin className="w-3 h-3 text-[#d97706]" />
                <span>{DELIVERY_RESTAURANT_INFO.location}</span>
                <span className="text-stone-300">•</span>
                <span className="inline-flex items-center gap-1 text-[#b21818] font-bold">
                  <Sparkles className="w-3 h-3 text-[#f59e0b]" />
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
                className="w-full pl-10 pr-10 py-2.5 bg-stone-50/90 focus:bg-white text-stone-900 placeholder:text-stone-400 text-xs sm:text-sm rounded-full border border-stone-200 focus:border-[#b21818] focus:ring-2 focus:ring-[#b21818]/15 shadow-inner transition-all outline-none"
              />
              {searchQuery && (
                <button
                  id="delivery-clear-search"
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
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


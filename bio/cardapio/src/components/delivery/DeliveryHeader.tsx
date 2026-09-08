import { Search, ShoppingBag, PhoneCall, X, Flame } from 'lucide-react';
import logoImg from '../../assets/logo.png';
import { DELIVERY_RESTAURANT_INFO } from '../../data/deliveryMenuData';

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
  return (
    <header className="w-full pt-6 pb-2 text-center relative z-20">
      {/* Top Floating Actions Bar */}
      <div className="max-w-3xl mx-auto px-4 mb-4 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <a
            id="delivery-back-bio"
            href="../bio/index.html"
            className="inline-flex items-center gap-1 bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-full shadow transition-transform active:scale-95"
            title="Voltar para a Bio"
          >
            <span>← Bio</span>
          </a>

          <a
            id="delivery-header-whatsapp"
            href={`https://wa.me/${DELIVERY_RESTAURANT_INFO.whatsapp}?text=Olá,%20gostaria%20de%20fazer%20um%20pedido%20no%20Delivery%20da%20Peixaria%20Mancha!`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-bold px-3 py-1.5 rounded-full shadow transition-transform active:scale-95"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{DELIVERY_RESTAURANT_INFO.phoneFormatted}</span>
            <span className="sm:hidden">WhatsApp</span>
          </a>
        </div>

        {cartItemCount > 0 && (
          <button
            id="delivery-header-cart-btn"
            onClick={onOpenCart}
            className="inline-flex items-center gap-2 bg-[#ff5e00] hover:bg-[#e05200] text-white px-4 py-1.5 rounded-full font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 animate-pulse cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>
              {cartItemCount} {cartItemCount === 1 ? 'item' : 'itens'} • R${' '}
              {cartTotal.toFixed(2).replace('.', ',')}
            </span>
          </button>
        )}
      </div>

      {/* Flame / Fresh Fish Badge */}
      <div className="flex justify-center mb-2">
        <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#b21818] via-[#e54500] to-[#ff6b00] text-white font-montserrat font-black text-[11px] sm:text-xs px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md">
          <Flame className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>{DELIVERY_RESTAURANT_INFO.freshFishBadge}</span>
        </div>
      </div>

      {/* Main Brand Logo */}
      <div className="flex justify-center mb-3">
        <img
          src={logoImg}
          alt="Peixaria Mancha"
          className="h-24 sm:h-28 md:h-32 w-auto object-contain drop-shadow-md hover:scale-105 transition-transform"
        />
      </div>

      {/* Large CARDÁPIO DELIVERY Heading */}
      <h1
        id="delivery-main-title"
        className="font-bebas text-5xl sm:text-6xl md:text-7xl font-black text-[#b21818] tracking-wider uppercase leading-none drop-shadow-sm select-none"
      >
        DELIVERY
      </h1>

      {/* Subtitle & Tagline */}
      <div className="space-y-0.5 mt-1 px-4">
        <p className="font-montserrat font-black text-xs sm:text-sm md:text-base text-stone-900 uppercase tracking-widest">
          {DELIVERY_RESTAURANT_INFO.subtitle}
        </p>
        <p className="font-montserrat font-medium text-[11px] sm:text-xs text-stone-700 italic">
          "{DELIVERY_RESTAURANT_INFO.tagline}"
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto px-4 mt-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
          <input
            id="delivery-search-input"
            type="text"
            placeholder="Buscar peixe frito, assado ou acompanhamento..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-white/95 focus:bg-white text-stone-900 placeholder:text-stone-500 text-sm rounded-full shadow-inner border border-[#d8a832] focus:outline-none focus:ring-2 focus:ring-[#ff5e00]"
          />
          {searchQuery && (
            <button
              id="delivery-clear-search"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

import { Search, PhoneCall, X, ArrowLeft, Utensils, Bike, Sparkles } from 'lucide-react';
import logoImg from '../assets/logo.png';
import { RESTAURANT_INFO } from '../data/menuData';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Header({
  searchQuery,
  onSearchChange,
}: HeaderProps) {
  const deliveryAppUrl =
    typeof window !== 'undefined' &&
    window.location.port === '3000' &&
    !window.location.pathname.includes('cardapio-restaurante')
      ? './index2.html'
      : '../cardapio-delivery/index.html';

  return (
    <header className="w-full pt-3 pb-2 text-center relative z-20">
      {/* Top Floating Utility Bar */}
      <div className="max-w-3xl mx-auto px-3 sm:px-4 mb-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <a
            id="back-to-bio-link"
            href="../index.html"
            className="inline-flex items-center gap-1.5 bg-white hover:bg-[var(--color-sand)]/40 text-[var(--color-river)] text-xs font-montserrat font-bold px-3.5 py-2 min-h-[42px] rounded-full border border-stone-200/80 transition-all active:scale-95 shadow-2xs"
            title="Voltar para o site"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[var(--color-forest)]" />
            <span>Início</span>
          </a>

          <a
            id="direct-whatsapp-link"
            href={`https://wa.me/${RESTAURANT_INFO.whatsapp}?text=Olá!%20Gostaria%20de%20conhecer%20o%20cardápio.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-[var(--color-forest)]/10 hover:bg-[var(--color-forest)]/15 text-[var(--color-forest)] text-xs font-montserrat font-bold px-3.5 py-2 min-h-[42px] rounded-full border border-[var(--color-forest)]/25 transition-all active:scale-95 shadow-2xs"
            title="Tirar dúvida no WhatsApp"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[var(--color-forest)]" />
            <span className="hidden sm:inline">{RESTAURANT_INFO.phoneFormatted}</span>
            <span className="sm:hidden">WhatsApp</span>
          </a>
        </div>

        {/* Link to Delivery for customers browsing from home */}
        <a
          id="link-to-delivery"
          href={deliveryAppUrl}
          className="inline-flex items-center gap-1.5 bg-[var(--color-tucuma)] hover:opacity-95 text-white text-xs font-montserrat font-bold px-4 py-2 min-h-[42px] rounded-full transition-all active:scale-95 shadow-xs cursor-pointer group"
          title="Ir para o Cardápio Delivery"
        >
          <Bike className="w-3.5 h-3.5 text-white group-hover:scale-110 transition-transform" />
          <span>Pedir Delivery</span>
        </a>
      </div>

      {/* Main Brand Card / Hero Section */}
      <div className="max-w-3xl mx-auto px-3 sm:px-4">
        <div className="bg-white border border-stone-200/90 rounded-3xl p-4 sm:p-6 shadow-2xs text-center relative overflow-hidden">
          {/* Subtle Ambient Decorative Glow */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--color-sand)]/50 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[var(--color-forest)]/10 rounded-full blur-2xl pointer-events-none" />

          {/* Restaurant Hall Badge (Contexto Explícito do Salão) */}
          <div className="inline-flex items-center gap-1.5 bg-[var(--color-sand)]/50 text-[var(--color-forest)] border border-[var(--color-acai-gold)]/40 text-[11px] sm:text-xs font-montserrat font-extrabold px-3.5 py-1.5 rounded-full mb-3 shadow-2xs">
            <Utensils className="w-3.5 h-3.5 text-[var(--color-forest)]" />
            <span>Cardápio do Salão • Consumo no Restaurante</span>
          </div>

          {/* Logo & Brand Identity */}
          <div className="flex flex-col items-center justify-center">
            <img
              src={logoImg}
              alt="Peixaria Mancha"
              className="h-20 sm:h-24 w-auto object-contain drop-shadow-xs hover:scale-105 transition-transform"
            />

            <div className="mt-2">
              <h1
                id="menu-main-title"
                className="font-bebas text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--color-forest)] tracking-tight uppercase leading-tight select-none"
              >
                Cardápio do Restaurante
              </h1>

              <p className="font-montserrat font-bold text-[var(--color-river)]/80 tracking-wide text-xs sm:text-sm uppercase mt-1">
                {RESTAURANT_INFO.tagline}
              </p>

              <div className="flex items-center justify-center gap-1.5 text-xs text-[var(--color-river)]/70 font-medium mt-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[var(--color-forest)] font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--color-acai-gold)]" />
                  {RESTAURANT_INFO.freshFishBadge}
                </span>
                <span className="text-stone-300">•</span>
                <span>O sabor da Amazônia, preparado na hora</span>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto mt-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                id="menu-search-input"
                type="text"
                placeholder="Buscar prato, caldeirada, camarão ou bebida..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-10 py-3 min-h-[48px] bg-[var(--color-natural)] focus:bg-white text-[var(--color-river)] placeholder:text-stone-400 text-sm font-montserrat rounded-2xl border border-stone-200 focus:border-[var(--color-forest)] focus:ring-2 focus:ring-[var(--color-forest)]/15 outline-none transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  id="clear-search-button"
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

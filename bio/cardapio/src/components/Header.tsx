import { Search, PhoneCall, X, ArrowLeft, Utensils, Bike, Sparkles, MapPin } from 'lucide-react';
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
  return (
    <header className="w-full pt-3 pb-2 text-center relative z-20">
      {/* Top Floating Utility Bar */}
      <div className="max-w-3xl mx-auto px-3 sm:px-4 mb-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <a
            id="back-to-bio-link"
            href="https://engrenebio.com.br/peixaria-mancha"
            className="inline-flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-montserrat font-bold px-3 py-1.5 rounded-full border border-stone-200/80 transition-all active:scale-95 shadow-2xs"
            title="Voltar para a Bio"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-stone-600" />
            <span>Bio</span>
          </a>

          <a
            id="direct-whatsapp-link"
            href={`https://wa.me/${RESTAURANT_INFO.whatsapp}?text=Olá,%20estou%20na%20mesa%20do%20restaurante%20e%20gostaria%20de%20tirar%20uma%20dúvida!`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] text-xs font-montserrat font-bold px-3 py-1.5 rounded-full border border-[#25D366]/30 transition-all active:scale-95 shadow-2xs"
            title="Tirar dúvida no WhatsApp"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#25D366]" />
            <span className="hidden sm:inline">{RESTAURANT_INFO.phoneFormatted}</span>
            <span className="sm:hidden">WhatsApp</span>
          </a>
        </div>

        {/* Link to Delivery for customers browsing from home */}
        <a
          id="link-to-delivery"
          href="./index2.html"
          className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-montserrat font-bold px-3.5 py-1.5 rounded-full transition-all active:scale-95 shadow-xs cursor-pointer group"
          title="Ir para o Cardápio Delivery"
        >
          <Bike className="w-3.5 h-3.5 text-white group-hover:scale-110 transition-transform" />
          <span>Pedir Delivery</span>
        </a>
      </div>

      {/* Main Brand Card / Hero Section */}
      <div className="max-w-3xl mx-auto px-3 sm:px-4">
        <div className="bg-gradient-to-b from-amber-50/70 via-white to-white border border-stone-200/90 rounded-3xl p-4 sm:p-5 shadow-2xs text-center relative overflow-hidden">
          {/* Subtle Ambient Decorative Glow */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-200/30 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-red-100/40 rounded-full blur-2xl pointer-events-none" />

          {/* Restaurant Hall Badge (Contexto Explícito do Salão) */}
          <div className="inline-flex items-center gap-1.5 bg-red-50 text-[#b21818] border border-red-200/80 text-[11px] sm:text-xs font-montserrat font-extrabold px-3 py-1 rounded-full mb-2 shadow-2xs">
            <Utensils className="w-3.5 h-3.5 text-[#b21818]" />
            <span>Cardápio do Salão • Consumo no Restaurante</span>
          </div>

          {/* Logo & Brand Identity */}
          <div className="flex flex-col items-center justify-center">
            <img
              src={logoImg}
              alt="Peixaria Mancha"
              className="h-20 sm:h-24 w-auto object-contain drop-shadow-xs hover:scale-105 transition-transform"
            />

            <div className="mt-1">
              <h1
                id="menu-main-title"
                className="font-bebas text-4xl sm:text-5xl md:text-6xl font-black text-[#b21818] tracking-wider uppercase leading-none drop-shadow-2xs select-none"
              >
                CARDÁPIO DO RESTAURANTE
              </h1>

              <p className="font-montserrat font-extrabold text-stone-700 tracking-wide text-xs sm:text-sm uppercase mt-0.5">
                {RESTAURANT_INFO.tagline}
              </p>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500 font-medium mt-1 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[#b21818] font-bold">
                  <Sparkles className="w-3 h-3 text-[#d97706]" />
                  {RESTAURANT_INFO.freshFishBadge}
                </span>
                <span className="text-stone-300">•</span>
                <span>Atendimento presencial na mesa</span>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto mt-3.5">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                id="menu-search-input"
                type="text"
                placeholder="Buscar prato, caldeirada, camarão ou bebida..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-stone-50 focus:bg-white text-stone-900 placeholder:text-stone-400 text-xs sm:text-sm font-montserrat rounded-2xl border border-stone-200 focus:border-[#b21818] focus:ring-2 focus:ring-[#b21818]/15 outline-none transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  id="clear-search-button"
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

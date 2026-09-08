import { Search, PhoneCall, X } from 'lucide-react';
import FishLogo from './FishLogo';
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
    <header className="w-full pt-6 pb-2 text-center relative z-20">
      {/* Top Floating Actions Bar for Mobile & Desktop */}
      <div className="max-w-3xl mx-auto px-4 mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <a
            id="back-to-bio-link"
            href="../bio/index.html"
            className="inline-flex items-center gap-1 bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-full shadow transition-transform active:scale-95"
            title="Voltar para os links da Bio"
          >
            <span>← Bio</span>
          </a>

          <a
            id="direct-whatsapp-link"
            href={`https://wa.me/${RESTAURANT_INFO.whatsapp}?text=Olá,%20gostaria%20de%20fazer%20um%20pedido%20na%20Peixaria%20Mancha!`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-[#0f5132] hover:bg-[#0c4128] text-white text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full shadow transition-transform active:scale-95"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{RESTAURANT_INFO.phoneFormatted}</span>
            <span className="sm:hidden">WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Main Brand Oval Logo */}
      <div className="flex justify-center mb-3">
        <FishLogo />
      </div>

      {/* Large CARDÁPIO Heading */}
      <h1
        id="menu-main-title"
        className="font-bebas text-5xl sm:text-6xl md:text-7xl font-black text-[#b21818] tracking-wider uppercase leading-none drop-shadow-sm select-none"
      >
        CARDÁPIO
      </h1>

      {/* Subtitle */}
      <p className="font-montserrat font-extrabold text-stone-900 tracking-wide sm:tracking-widest text-xs sm:text-sm md:text-base uppercase mt-1 px-4">
        {RESTAURANT_INFO.tagline}
      </p>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto px-4 mt-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
          <input
            id="menu-search-input"
            type="text"
            placeholder="Buscar prato, peixe, camarão ou bebida..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-white/90 focus:bg-white text-stone-900 placeholder:text-stone-500 text-sm rounded-full shadow-inner border border-[#d8a832] focus:outline-none focus:ring-2 focus:ring-[#b21818]"
          />
          {searchQuery && (
            <button
              id="clear-search-button"
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

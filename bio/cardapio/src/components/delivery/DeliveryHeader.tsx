import { useState, useEffect } from 'react';
import { Search, X, Clock, MapPin, Bike, ChevronRight } from 'lucide-react';
import logoImg from '../../assets/logo.png';
import { DELIVERY_HOURS, DELIVERY_RESTAURANT_INFO, getDeliveryAvailability } from '../../data/deliveryMenuData';

interface DeliveryHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenProfile?: () => void;
  catalogRevision?: number;
}

export default function DeliveryHeader({
  searchQuery,
  onSearchChange,
  onOpenProfile,
  catalogRevision,
}: DeliveryHeaderProps) {
  const [availability, setAvailability] = useState(getDeliveryAvailability);

  useEffect(() => {
    setAvailability(getDeliveryAvailability());
    const interval = setInterval(() => {
      setAvailability(getDeliveryAvailability());
    }, 15000);
    return () => clearInterval(interval);
  }, [catalogRevision]);

  return (
    <header className="w-full relative z-20">
      {/* Banner Superior Laranja com Identidade Peixaria Mancha */}
      <div className="relative bg-gradient-to-br from-[#C83B00] via-[#FF5000] to-[#FF6E26] pt-5 pb-12 px-4 overflow-hidden">
        <div className="absolute -top-12 -right-12 w-44 h-44 bg-white/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-[#FFD166]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-2xl mx-auto flex items-center gap-3.5 relative z-10">
          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-white p-1.5 shadow-lg border-2 border-white/90 flex-shrink-0 flex items-center justify-center">
            <img
              src={logoImg}
              alt="Peixaria Mancha"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="min-w-0 text-left">
            <h1
              id="delivery-main-title"
              className="font-heading text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-tight truncate"
            >
              Peixaria Mancha
            </h1>
            <p className="text-xs sm:text-sm font-medium text-orange-100 truncate mt-0.5">
              {DELIVERY_RESTAURANT_INFO.tagline || 'Cardápio Digital & Delivery'}
            </p>
          </div>
        </div>
      </div>

      {/* Card Flutuante de Endereço, Tempo e Status */}
      <div className="max-w-2xl mx-auto px-3 sm:px-4 -mt-7 relative z-20">
        <div className="bg-white rounded-2xl border border-[#E8D8B8]/70 shadow-md overflow-hidden">
          <div className="px-4 py-3 flex items-center justify-between gap-2 border-b border-stone-100">
            <div className="flex items-center gap-2 min-w-0">
              <MapPin className="w-4 h-4 text-[#FF5000] flex-shrink-0" />
              <span className="text-xs sm:text-sm font-bold text-[#172B35] truncate">
                {DELIVERY_RESTAURANT_INFO.location}
              </span>
            </div>
            <button
              type="button"
              onClick={onOpenProfile}
              className="inline-flex items-center gap-0.5 text-xs font-bold text-[#FF5000] hover:text-[#C83B00] transition-colors cursor-pointer flex-shrink-0"
            >
              <span>Alterar</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="px-4 py-2.5 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-[#172B35]/80">
              <Bike className="w-4 h-4 text-[#FF5000] flex-shrink-0" />
              <span>
                Entrega em até <strong className="text-[#172B35]">{DELIVERY_HOURS.estimatedTime || DELIVERY_RESTAURANT_INFO.deliveryTime}</strong>
              </span>
            </div>

            <div className="flex items-center gap-1.5 font-bold flex-shrink-0">
              <Clock className={`w-3.5 h-3.5 ${availability.isOpen ? 'text-[#FF5000]' : 'text-red-600'}`} />
              <span className={availability.isOpen ? 'text-[#FF5000]' : 'text-red-600'}>
                {availability.statusText}
              </span>
              <span className={`w-2 h-2 rounded-full ${availability.isOpen ? 'bg-emerald-500' : 'bg-red-500'}`} />
            </div>
          </div>
        </div>

        {/* Barra de Busca Limpa */}
        <div className="mt-3.5">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              id="delivery-search-input"
              type="text"
              placeholder="Buscar no cardápio..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-white text-[#172B35] placeholder:text-stone-400 text-sm rounded-2xl border border-stone-200/90 focus:border-[#FF5000] focus:ring-2 focus:ring-[#FF5000]/15 shadow-2xs transition-all outline-none"
            />
            {searchQuery && (
              <button
                id="delivery-clear-search"
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#172B35] p-1.5 cursor-pointer"
                title="Limpar busca"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

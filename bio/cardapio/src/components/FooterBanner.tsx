import { CheckCircle2 } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

export default function FooterBanner() {
  return (
    <footer className="w-full max-w-3xl mx-auto px-4 pb-12 pt-4 space-y-4 text-center">
      {/* Red/Golden Fresh Fish Banner */}
      <div
        id="fresh-fish-banner"
        className="bg-[#b21818] text-white py-3.5 px-4 rounded-2xl shadow-sm border border-[#911313]"
      >
        <div className="flex items-center justify-center gap-1.5 mb-0.5">
          <CheckCircle2 className="w-4 h-4 text-amber-300" />
          <h3 className="font-bebas text-xl sm:text-2xl tracking-wider uppercase font-bold text-amber-200">
            {RESTAURANT_INFO.freshFishBadge}
          </h3>
        </div>
        <p className="text-xs sm:text-sm font-montserrat text-white/95 font-medium">
          {RESTAURANT_INFO.freshFishDesc}
        </p>
      </div>

      {/* Alcohol Warning & Legal Notice */}
      <div className="pt-2 text-stone-900/80">
        <p className="font-montserrat font-black text-xs uppercase tracking-wider">
          DEVASSA • PEGA LEVE NA BEBIDA :)
        </p>
        <p className="text-[11px] text-stone-800/80 mt-0.5">
          Venda e consumo proibidos para menores de 18 anos (+18).
        </p>
      </div>
    </footer>
  );
}

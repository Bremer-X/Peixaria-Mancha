import { CheckCircle2, PhoneCall } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

export default function FooterBanner() {
  return (
    <footer className="w-full max-w-3xl mx-auto px-3 sm:px-4 pb-12 pt-2 space-y-3.5 text-center">
      {/* Red/Golden Fresh Fish Banner */}
      <div
        id="fresh-fish-banner"
        className="bg-gradient-to-r from-[#b21818] via-[#c42812] to-[#d97706] text-white py-3.5 px-4 rounded-2xl shadow-2xs border border-white/20"
      >
        <div className="flex items-center justify-center gap-1.5 mb-0.5">
          <CheckCircle2 className="w-4 h-4 text-amber-300" />
          <h3 className="font-bebas text-xl sm:text-2xl tracking-wider uppercase font-bold text-amber-100">
            {RESTAURANT_INFO.freshFishBadge}
          </h3>
        </div>
        <p className="text-xs sm:text-sm font-montserrat text-white/95 font-medium">
          {RESTAURANT_INFO.freshFishDesc}
        </p>
      </div>

      {/* WhatsApp Table Help Button */}
      <div>
        <a
          href={`https://wa.me/${RESTAURANT_INFO.whatsapp}?text=Olá,%20estou%20na%20mesa%20do%20restaurante%20e%20gostaria%20de%20tirar%20uma%20dúvida!`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-50 border border-stone-200/90 text-stone-800 text-xs sm:text-sm font-montserrat font-bold py-2.5 px-4 rounded-2xl shadow-2xs transition-all active:scale-95 cursor-pointer w-full max-w-md"
        >
          <PhoneCall className="w-4 h-4 text-[#25D366]" />
          <span>Dúvidas sobre o cardápio? Fale no WhatsApp</span>
        </a>
      </div>

      {/* Alcohol Warning & Legal Notice */}
      <div className="pt-2 text-stone-500">
        <p className="font-montserrat font-bold text-[11px] sm:text-xs uppercase tracking-wider text-stone-700">
          DEVASSA • PEGA LEVE NA BEBIDA :)
        </p>
        <p className="text-[10px] sm:text-[11px] text-stone-500 mt-0.5">
          Venda e consumo de bebidas alcoólicas proibidos para menores de 18 anos (+18).
        </p>
        <p className="text-[10px] text-stone-400 mt-1 font-montserrat">
          © Peixaria Mancha • Todos os direitos reservados
        </p>
      </div>
    </footer>
  );
}

import { CheckCircle2, PhoneCall } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

export default function FooterBanner() {
  return (
    <footer className="w-full max-w-3xl mx-auto px-3 sm:px-4 pb-12 pt-2 space-y-3.5 text-center">
      {/* Forest/Gold Fresh Fish Banner */}
      <div
        id="fresh-fish-banner"
        className="bg-[var(--color-forest)] text-white py-4 px-5 rounded-2xl shadow-2xs border border-[var(--color-acai-gold)]/30"
      >
        <div className="flex items-center justify-center gap-2 mb-1">
          <CheckCircle2 className="w-4 h-4 text-[var(--color-acai-gold)]" />
          <h3 className="font-bebas text-lg sm:text-xl tracking-tight uppercase font-extrabold text-[var(--color-sand)]">
            {RESTAURANT_INFO.freshFishBadge}
          </h3>
        </div>
        <p className="text-xs sm:text-sm font-montserrat text-white/90 font-medium">
          {RESTAURANT_INFO.freshFishDesc}
        </p>
      </div>

      {/* WhatsApp Table Help Button */}
      <div>
        <a
          href={`https://wa.me/${RESTAURANT_INFO.whatsapp}?text=Olá!%20Gostaria%20de%20conhecer%20o%20cardápio.`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-[var(--color-tucuma)] hover:opacity-95 text-white text-xs sm:text-sm font-montserrat font-bold py-3 px-5 min-h-[48px] rounded-2xl shadow-xs transition-all active:scale-95 cursor-pointer w-full max-w-md"
        >
          <PhoneCall className="w-4 h-4 text-white" />
          <span>Dúvidas ou pedidos? Fale no WhatsApp</span>
        </a>
      </div>

      {/* Alcohol Warning & Legal Notice */}
      <div className="pt-2 text-[var(--color-river)]/70">
        <p className="font-montserrat font-bold text-[11px] sm:text-xs uppercase tracking-wider text-[var(--color-forest)]">
          DEVASSA • PEGA LEVE NA BEBIDA :)
        </p>
        <p className="text-[10px] sm:text-[11px] text-[var(--color-river)]/60 mt-0.5">
          Venda e consumo de bebidas alcoólicas proibidos para menores de 18 anos (+18).
        </p>
        <p className="text-[10px] text-stone-400 mt-1 font-montserrat">
          © Peixaria Mancha • Todos os direitos reservados
        </p>
      </div>
    </footer>
  );
}

import { CheckCircle2, PhoneCall } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

export default function FooterBanner() {
  const whatsappUrl = `https://wa.me/${RESTAURANT_INFO.whatsapp}?text=Olá,%20gostaria%20de%20fazer%20um%20pedido%20na%20Peixaria%20Mancha!`;

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

      {/* WhatsApp Call to Action Box */}
      <div
        id="delivery-card-box"
        className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border-2 border-[#ecd596] space-y-3"
      >
        <div>
          <span className="font-montserrat font-black text-xs uppercase tracking-widest text-stone-700 block">
            PEÇA AGORA!
          </span>
          <h3 className="font-bebas text-3xl sm:text-4xl text-stone-900 tracking-wide uppercase leading-tight">
            DELIVERY OU RETIRADA
          </h3>
        </div>

        {/* WhatsApp Green Action Button */}
        <div className="pt-1">
          <a
            id="footer-whatsapp-cta"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full max-w-md mx-auto inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] active:scale-98 text-white py-3.5 px-6 rounded-full font-montserrat font-black text-base sm:text-lg tracking-wide shadow-md transition-all group"
          >
            {/* WhatsApp Phone Icon */}
            <PhoneCall className="w-5 h-5 fill-white group-hover:rotate-12 transition-transform" />
            <span>{RESTAURANT_INFO.phoneFormatted}</span>
          </a>
        </div>

        <p className="text-xs sm:text-sm text-stone-600 font-medium max-w-md mx-auto pt-1">
          Peça já pelo WhatsApp para receber em casa ou retirar no local!
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

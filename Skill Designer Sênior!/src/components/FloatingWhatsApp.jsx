import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { clinicInfo } from '../data/clinicData';

export default function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(true);

  const defaultMessage = encodeURIComponent(
    "Olá! Gostaria de informações sobre os procedimentos e agendamento de avaliação na Clínica Sorriso & Arte."
  );

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-end gap-3 pointer-events-auto">
      {/* Contextual VIP tooltip bubble */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-porcelain px-4 py-2.5 rounded-2xl shadow-luxury border border-gold-300 text-xs text-obsidian-900 animate-bounce duration-1000">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>Dúvidas? Fale com nossa <strong>Concierge VIP</strong></span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-warmgray-400 hover:text-obsidian-900 ml-1 cursor-pointer"
            aria-label="Fechar dica"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={`https://wa.me/${clinicInfo.whatsappNumber}?text=${defaultMessage}`}
        target="_blank"
        rel="noreferrer"
        className="whatsapp-pulse w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-luxury hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
        aria-label="Falar no WhatsApp com a Clínica Sorriso & Arte"
      >
        <MessageCircle className="w-7 h-7 fill-white" />
      </a>
    </div>
  );
}

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { faqList } from '../data/clinicData';

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState(0);

  const toggle = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 sm:py-28 bg-silk/30 border-t border-warmgray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-porcelain border border-gold-300 text-xs font-semibold uppercase tracking-widest text-gold-700 shadow-subtle">
            <HelpCircle className="w-3.5 h-3.5 text-gold-600" />
            <span>Transparência Clínica</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-obsidian-900 tracking-tight">
            Perguntas Frequentes
          </h2>
          <p className="text-sm sm:text-base text-warmgray-600">
            Esclareça suas principais dúvidas sobre procedimentos, simulação 3D e conforto durante o atendimento.
          </p>
        </div>

        <div className="space-y-4">
          {faqList.map((faq, idx) => (
            <div 
              key={idx}
              className="bg-porcelain rounded-2xl border border-warmgray-200/90 overflow-hidden shadow-subtle transition-all duration-200"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
              >
                <span className="font-serif text-base sm:text-lg font-semibold text-obsidian-900">
                  {faq.question}
                </span>
                <span className="text-gold-600 shrink-0">
                  {openIdx === idx ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </span>
              </button>

              {openIdx === idx && (
                <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-warmgray-600 leading-relaxed border-t border-warmgray-100">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

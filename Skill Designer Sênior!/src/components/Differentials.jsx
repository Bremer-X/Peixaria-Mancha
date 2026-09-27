import React, { useState } from 'react';
import { 
  Scan, Sparkles, ShieldCheck, Clock, Award, KeyRound, 
  Check, ArrowRight, Shield 
} from 'lucide-react';
import { clinicInfo, differentials } from '../data/clinicData';

const iconMap = {
  Scan: Scan,
  Sparkles: Sparkles,
  ShieldCheck: ShieldCheck,
  Clock: Clock,
  Award: Award,
  KeyRound: KeyRound,
};

export default function Differentials({ onOpenAppointment }) {
  const [activeHighlight, setActiveHighlight] = useState(0);

  const pillars = [
    {
      title: "Planejamento 3D & Previsibilidade",
      detail: "Antes de tocar em qualquer dente, você experimenta o mockup físico diretamente no espelho, com aprovação milimétrica da nova curvatura e luminosidade."
    },
    {
      title: "Biossegurança & Sala Spa VIP",
      detail: "Consultórios individuais com filtragem de ar de nível hospitalar, aromaterapia calmante, fones de cancelamento de ruído e poltronas ergonômicas de couro com massagem."
    },
    {
      title: "Sedação Consciente Sem Medo",
      detail: "Protocolo supervisionado por médico anestesiologista para pacientes com ansiedade, trauma odontológico prévio ou procedimentos mais longos."
    }
  ];

  return (
    <section id="diferenciais" className="py-24 sm:py-32 bg-silk/40 border-y border-warmgray-200/80 relative overflow-hidden">
      
      {/* Decorative ambient gradient */}
      <div className="absolute top-1/2 left-0 w-96 h-96 rounded-full bg-gold-200/30 blur-3xl -translate-y-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16 sm:mb-20">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-porcelain border border-gold-300 text-xs font-semibold uppercase tracking-widest text-gold-700 shadow-subtle">
              <Award className="w-3.5 h-3.5 text-gold-600" />
              <span>O Padrão Sorriso & Arte</span>
            </div>
            
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-obsidian-900 tracking-tight">
              A sofisticação de uma clínica boutique aliada à{' '}
              <span className="italic font-normal text-gold-600">medicina de precisão.</span>
            </h2>
          </div>

          <div className="lg:col-span-4">
            <p className="text-sm sm:text-base text-warmgray-600 font-normal leading-relaxed">
              Eliminamos todo o desconforto e o estresse associados à odontologia tradicional. Aqui, cada detalhe foi concebido para o seu bem-estar absoluto.
            </p>
          </div>
        </div>

        {/* 6 Key Differentials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {differentials.map((item, index) => {
            const IconComponent = iconMap[item.icon] || Sparkles;
            return (
              <div 
                key={index}
                className="bg-porcelain rounded-2xl p-8 border border-warmgray-200 shadow-subtle hover:shadow-luxury hover:border-gold-300/80 transition-all duration-300 group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-alabaster border border-warmgray-200 flex items-center justify-center text-gold-600 group-hover:bg-gold-50 group-hover:border-gold-300 transition-colors">
                    <IconComponent className="w-6 h-6" />
                  </div>

                  <h3 className="font-serif text-xl font-bold text-obsidian-900 group-hover:text-gold-700 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-sm text-warmgray-600 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-warmgray-100 flex items-center justify-between text-xs text-warmgray-400 font-medium">
                  <span>Padrão Internacional</span>
                  <span className="text-gold-500">✦</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Showcase Banner: 3D Studio & Clinical Experience */}
        <div className="mt-16 rounded-3xl bg-obsidian-900 text-alabaster p-8 sm:p-12 border border-gold-400/30 shadow-luxury relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            <div className="lg:col-span-7 space-y-6">
              <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-gold-400/20 text-gold-300 border border-gold-400/40">
                Studio Digital Exclusivo
              </span>

              <h3 className="font-serif text-2xl sm:text-4xl font-bold text-alabaster tracking-tight">
                Você nunca mais precisará imaginar como seu sorriso vai ficar.
              </h3>

              <div className="space-y-4">
                {pillars.map((pillar, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gold-400/20 border border-gold-400/40 flex items-center justify-center shrink-0 mt-0.5 text-gold-300">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-semibold text-alabaster">
                        {pillar.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-warmgray-300 font-normal mt-0.5 leading-relaxed">
                        {pillar.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onOpenAppointment()}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wide bg-gold-400 text-obsidian-900 hover:bg-gold-300 transition-all duration-200 cursor-pointer shadow-md"
                >
                  <span>Agendar Minha Simulação 3D</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right side image or experience snippet */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden border border-gold-300/30 shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=700&q=80" 
                  alt="Clínica Sorriso & Arte - Sala de Atendimento VIP"
                  className="w-full h-80 object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-porcelain text-obsidian-900 p-4 rounded-xl shadow-lg border border-warmgray-200 max-w-[240px] text-xs">
                <p className="font-semibold text-obsidian-900">
                  Lounge VIP com Valet
                </p>
                <p className="text-warmgray-500 text-[11px] mt-0.5">
                  Estacionamento privativo com manobrista cortesia na Faria Lima.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

import React from 'react';
import { Calendar, ArrowRight, ShieldCheck, Sparkles, CheckCircle2, Star, Award, ChevronRight } from 'lucide-react';
import { clinicInfo } from '../data/clinicData';

export default function Hero({ onOpenAppointment }) {
  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
      {/* Background ambient lighting - Warm Alabaster + Soft Gold whisper */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] pointer-events-none opacity-40">
        <div className="absolute top-12 left-1/4 w-96 h-96 rounded-full bg-gold-200/50 blur-3xl"></div>
        <div className="absolute top-36 right-1/4 w-[28rem] h-[28rem] rounded-full bg-amber-100/40 blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            {/* Exclusive status badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-porcelain border border-gold-300/60 shadow-subtle">
              <span className="flex h-2 w-2 rounded-full bg-gold-500"></span>
              <span className="text-xs font-semibold tracking-wider uppercase text-gold-700">
                Atendimento VIP & Consultas Sob Medida
              </span>
              <span className="text-warmgray-300">|</span>
              <span className="text-xs font-medium text-warmgray-600 hidden sm:inline">
                Itaim Bibi • São Paulo
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-[4rem] font-bold text-obsidian-900 tracking-tight leading-[1.12]">
              A perfeita harmonia entre a precisão científica e a{' '}
              <span className="italic font-normal text-gold-600 underline decoration-gold-300/50 decoration-1 underline-offset-8">
                arte do sorriso natural.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-warmgray-600 font-normal leading-relaxed max-w-2xl">
              Especialistas em <strong className="text-obsidian-800 font-semibold">Lentes de Contato em Porcelana Alemã</strong>,{' '}
              <strong className="text-obsidian-800 font-semibold">Harmonização Orofacial</strong> e{' '}
              <strong className="text-obsidian-800 font-semibold">Odontologia 3D Digital</strong>. Criamos sorrisos únicos, iluminados e sem aspecto artificial em um ambiente exclusivo de clínica spa.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-y-2 gap-x-4 text-xs sm:text-sm text-obsidian-800 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-gold-600" />
                <span>Escaneamento 3D sem moldagem</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-gold-600" />
                <span>Simulação prévia do resultado</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-gold-600" />
                <span>Sedação consciente opcional</span>
              </div>
            </div>

            {/* Conversion CTA Group */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={() => onOpenAppointment()}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base font-semibold tracking-wide bg-obsidian-900 text-alabaster border border-gold-400 hover:bg-obsidian-800 hover:shadow-luxury hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 cursor-pointer shadow-md group"
              >
                <Calendar className="w-5 h-5 text-gold-400 group-hover:scale-110 transition-transform" />
                <span>Agendar Avaliação Personalizada</span>
                <ArrowRight className="w-4 h-4 text-gold-300 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#procedimentos"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-medium text-obsidian-800 bg-porcelain/80 border border-warmgray-200 hover:border-gold-300 hover:bg-porcelain transition-all duration-200 cursor-pointer"
              >
                <span>Ver Procedimentos</span>
                <ChevronRight className="w-4 h-4 text-warmgray-500" />
              </a>
            </div>

            {/* Doctor seal signature */}
            <div className="pt-4 border-t border-warmgray-200/70 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gold-300/80 shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=160&q=80" 
                  alt="Dr. Rafael de Silveira"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-xs">
                <p className="font-semibold text-obsidian-900 text-sm">
                  {clinicInfo.technicalDirector}
                </p>
                <p className="text-warmgray-500">
                  {clinicInfo.directorTitle}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Card with High Agency Polish */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Decorative Image Frame */}
              <div className="relative rounded-3xl overflow-hidden bg-obsidian-900 border border-gold-300/40 shadow-luxury group">
                <img
                  src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=900&q=85"
                  alt="Tratamento Odontológico Estético de Alta Precisão"
                  className="w-full h-[460px] sm:h-[520px] object-cover object-center opacity-85 group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900 via-obsidian-900/40 to-transparent"></div>

                {/* Floating Top Badge: 3D Precision */}
                <div className="absolute top-5 left-5 right-5 flex justify-between items-center">
                  <div className="bg-obsidian-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-gold-400/40 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                    <span className="text-xs font-semibold text-gold-200 uppercase tracking-wider">
                      Design Digital do Sorriso
                    </span>
                  </div>

                  <div className="bg-porcelain/95 backdrop-blur-md px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 text-xs font-semibold text-obsidian-900">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>5.0 • 800+ avaliações</span>
                  </div>
                </div>

                {/* Bottom Overlay Card */}
                <div className="absolute bottom-5 left-5 right-5 bg-obsidian-900/95 backdrop-blur-md p-5 rounded-2xl border border-gold-400/30 text-alabaster space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[11px] font-semibold tracking-widest uppercase text-gold-400">
                        Tecnologia Exclusiva
                      </span>
                      <h4 className="font-serif text-lg font-bold text-alabaster">
                        Scanner iTero Element 5D & CAD/CAM
                      </h4>
                    </div>
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-emerald-deep text-emerald-100 border border-emerald-500/40">
                      Alta Precisão
                    </span>
                  </div>
                  <p className="text-xs text-warmgray-300 font-normal leading-relaxed">
                    Visualização instantânea da anatomia do seu novo sorriso antes de qualquer intervenção clínica.
                  </p>
                  <div className="pt-1 flex items-center justify-between text-xs text-gold-300 font-medium border-t border-obsidian-700">
                    <span>Sem desgaste desnecessário</span>
                    <span>Previsibilidade 100%</span>
                  </div>
                </div>
              </div>

              {/* Floating Testimonial Pill */}
              <div className="absolute -bottom-6 -left-4 sm:-left-8 bg-porcelain p-4 rounded-2xl shadow-luxury border border-warmgray-200/90 max-w-[280px] hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-800 font-serif font-bold text-sm shrink-0 border border-emerald-200">
                    HA
                  </div>
                  <div>
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs font-semibold text-obsidian-900 mt-0.5">
                      "Transformou minha autoestima"
                    </p>
                    <p className="text-[10px] text-warmgray-500">
                      Helena V. • Lentes em Porcelana
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Stats Bar */}
        <div className="mt-16 sm:mt-24 pt-10 border-t border-warmgray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {clinicInfo.stats.map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="font-serif text-3xl sm:text-4xl font-bold text-obsidian-900 tracking-tight flex items-baseline gap-1">
                  <span>{stat.value}</span>
                  <span className="text-gold-500 text-lg">✦</span>
                </div>
                <div className="text-sm font-semibold text-obsidian-800">
                  {stat.label}
                </div>
                <div className="text-xs text-warmgray-500">
                  {stat.detail}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

import React, { useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle, ShieldCheck, HeartHandshake } from 'lucide-react';
import { testimonials } from '../data/clinicData';

export default function Testimonials({ onOpenAppointment }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const current = testimonials[activeIndex];

  return (
    <section id="depoimentos" className="py-24 sm:py-32 bg-alabaster relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-porcelain border border-gold-300 text-xs font-semibold uppercase tracking-widest text-gold-700 shadow-subtle">
            <HeartHandshake className="w-3.5 h-3.5 text-gold-600" />
            <span>Resultados que Inspiram</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-obsidian-900 tracking-tight">
            A transformação vivida por quem{' '}
            <span className="italic font-normal text-gold-600">confiou em nossa arte.</span>
          </h2>

          <p className="text-base sm:text-lg text-warmgray-600 font-normal">
            Histórias reais de pacientes exigentes que encontraram na Sorriso & Arte a união entre discrição, excelência técnica e conforto absoluto.
          </p>
        </div>

        {/* Featured Testimonial Card */}
        <div className="max-w-4xl mx-auto bg-porcelain rounded-3xl border border-warmgray-200/90 p-8 sm:p-14 shadow-luxury relative overflow-hidden">
          
          {/* Subtle gold quote watermark */}
          <div className="absolute top-6 right-8 text-gold-100 pointer-events-none opacity-60">
            <Quote className="w-24 h-24" />
          </div>

          <div className="relative z-10 space-y-8">
            
            {/* Star Rating and Verification */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-1">
                {[...Array(current.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-2 text-xs font-semibold text-obsidian-900">5.0 / 5.0</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>{current.verified}</span>
                <span className="text-emerald-400">•</span>
                <span className="text-emerald-700">{current.date}</span>
              </div>
            </div>

            {/* Testimonial Quote */}
            <blockquote className="font-serif text-xl sm:text-2xl lg:text-3xl text-obsidian-900 font-medium leading-relaxed italic">
              "{current.quote}"
            </blockquote>

            {/* Patient Info */}
            <div className="pt-6 border-t border-warmgray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <img
                  src={current.avatar}
                  alt={current.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-gold-300"
                />
                <div>
                  <h4 className="font-serif text-lg font-bold text-obsidian-900">
                    {current.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-warmgray-500 font-normal">
                    {current.role} • {current.city}
                  </p>
                  <p className="text-xs font-semibold text-gold-700 mt-0.5">
                    ✦ Tratamento: {current.treatment}
                  </p>
                </div>
              </div>

              {/* Navigation Arrows */}
              <div className="flex items-center gap-3 self-end sm:self-center">
                <button
                  onClick={prevSlide}
                  className="p-3 rounded-full border border-warmgray-200 bg-porcelain hover:bg-gold-50 hover:border-gold-300 text-obsidian-800 transition-colors cursor-pointer"
                  aria-label="Depoimento anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="text-xs font-semibold text-warmgray-500">
                  {activeIndex + 1} de {testimonials.length}
                </div>
                <button
                  onClick={nextSlide}
                  className="p-3 rounded-full border border-warmgray-200 bg-porcelain hover:bg-gold-50 hover:border-gold-300 text-obsidian-800 transition-colors cursor-pointer"
                  aria-label="Próximo depoimento"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Small Review Cards Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-4xl mx-auto">
          {testimonials.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setActiveIndex(idx)}
              className={`p-4 rounded-2xl text-left transition-all duration-200 border cursor-pointer ${
                activeIndex === idx 
                  ? 'bg-porcelain border-gold-400 shadow-md' 
                  : 'bg-porcelain/60 border-warmgray-200 hover:border-warmgray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <img 
                  src={item.avatar} 
                  alt={item.name} 
                  className="w-10 h-10 rounded-full object-cover shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-obsidian-900 truncate">
                    {item.name}
                  </p>
                  <p className="text-[11px] text-warmgray-500 truncate">
                    {item.treatment}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Post-Testimonial Conversion Banner */}
        <div className="mt-16 text-center max-w-xl mx-auto space-y-4">
          <p className="text-sm font-medium text-obsidian-800">
            Deseja vivenciar uma transformação semelhante com total conforto e discrição?
          </p>
          <button
            onClick={() => onOpenAppointment()}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold tracking-wide bg-obsidian-900 text-alabaster border border-gold-400 hover:bg-obsidian-800 hover:shadow-luxury transition-all duration-300 cursor-pointer"
          >
            <span>Iniciar Minha Avaliação Exclusiva</span>
          </button>
        </div>

      </div>
    </section>
  );
}

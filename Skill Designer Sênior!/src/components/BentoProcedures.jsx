import React, { useState } from 'react';
import { Sparkles, Scan, ArrowUpRight, CheckCircle2, Shield, Eye, HeartPulse, Zap } from 'lucide-react';
import { bentoProcedures } from '../data/clinicData';

export default function BentoProcedures({ onSelectProcedure }) {
  const [activeTab, setActiveTab] = useState('todos');

  return (
    <section id="procedimentos" className="py-24 sm:py-32 bg-alabaster relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-porcelain border border-gold-300/80 text-xs font-semibold uppercase tracking-widest text-gold-700 shadow-subtle">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span>Excelência Clínica & Estética</span>
          </div>
          
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-obsidian-900 tracking-tight">
            Procedimentos Personalizados em{' '}
            <span className="italic font-normal text-gold-600">Bento Grid</span>
          </h2>
          
          <p className="text-base sm:text-lg text-warmgray-600 font-normal leading-relaxed">
            Cada tratamento é planejado sob medida, unindo a biologia do seu rosto à arquitetura do seu sorriso. Sem soluções padronizadas ou resultados artificiais.
          </p>
        </div>

        {/* Bento Grid Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">

          {/* CARD 1: Lentes de Contato em Porcelana (Featured Large Obsidian Bento) */}
          <div className="lg:col-span-8 rounded-3xl bg-obsidian-900 text-alabaster p-8 sm:p-10 border border-gold-400/40 relative overflow-hidden shadow-luxury group hover:border-gold-400 transition-all duration-300">
            {/* Ambient luxury light in the card */}
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-gold-500/10 blur-3xl pointer-events-none group-hover:bg-gold-500/20 transition-all duration-500"></div>

            <div className="relative z-10 flex flex-col justify-between h-full space-y-8">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-gold-400/20 text-gold-300 border border-gold-400/40">
                    Procedimento Assinatura
                  </span>
                  <span className="text-xs font-medium text-warmgray-400 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-gold-400" />
                    Garantia & Longevidade Clínica
                  </span>
                </div>

                <h3 className="font-serif text-2xl sm:text-4xl font-bold text-alabaster tracking-tight">
                  Lentes de Contato em Porcelana Alemã
                </h3>

                <p className="text-sm sm:text-base text-warmgray-300 leading-relaxed max-w-2xl font-normal">
                  Lâminas cerâmicas ultrafinas (a partir de 0.2mm) esculpidas com tecnologia CAD/CAM e acabamento manual por mestres ceramistas. Proporcionam luminosidade vítrea, textura anatômica idêntica ao dente natural e correção definitiva de manchas, diastemas e assimetrias.
                </p>
              </div>

              {/* Grid of details inside the card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-obsidian-700/80">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gold-300 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Diferenciais Exclusivos</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-warmgray-300">
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                      <span>Preservação biológica sem desgaste invasivo</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                      <span>Mockup 3D: veja na sua boca antes de cimentar</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gold-300 uppercase tracking-wider">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Materiais Nobres</span>
                  </div>
                  <p className="text-xs text-warmgray-300">
                    Dissilicato de Lítio (IPS e.max®) e Cerâmica Feldspática de alta fluorescência, resistentes a manchas e pigmentos.
                  </p>
                </div>
              </div>

              {/* Bottom CTA within card */}
              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="text-xs text-gold-400 font-medium">
                  ✦ Simulação fotográfica e teste funcional inclusos
                </div>
                <button
                  onClick={() => onSelectProcedure('Lentes de Contato em Porcelana')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold tracking-wide bg-gold-400 text-obsidian-900 hover:bg-gold-300 hover:shadow-gold-glow transition-all duration-200 cursor-pointer"
                >
                  <span>Agendar Consulta de Lentes</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* CARD 2: Harmonização Orofacial Full Face (Elegance Ivory & Gold) */}
          <div className="lg:col-span-4 rounded-3xl bg-porcelain p-8 sm:p-10 border border-warmgray-200/90 relative overflow-hidden shadow-luxury hover:border-gold-300 transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-5">
              <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-emerald-tint text-emerald-deep border border-emerald-subtle/30">
                Harmonia & Proporção Áurea
              </span>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-obsidian-900 tracking-tight">
                Harmonização Facial Full Face
              </h3>

              <p className="text-sm text-warmgray-600 leading-relaxed font-normal">
                Protocolo médico refinado que valoriza seus traços sem artificialismos. Restauramos o suporte facial perdido com precisão anatômica.
              </p>

              <div className="space-y-2.5 pt-2">
                <div className="text-xs font-semibold text-obsidian-800 uppercase tracking-wider">
                  Tratamentos Combinados:
                </div>
                <div className="flex flex-wrap gap-1.5 text-xs text-obsidian-700">
                  <span className="px-2.5 py-1 rounded-lg bg-warmgray-100 border border-warmgray-200">Preenchimento Labial Sutil</span>
                  <span className="px-2.5 py-1 rounded-lg bg-warmgray-100 border border-warmgray-200">Bioestimulador (Sculptra)</span>
                  <span className="px-2.5 py-1 rounded-lg bg-warmgray-100 border border-warmgray-200">Contorno Mandibular</span>
                  <span className="px-2.5 py-1 rounded-lg bg-warmgray-100 border border-warmgray-200">Toxina Botulínica Preventiva</span>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-warmgray-100 mt-6">
              <button
                onClick={() => onSelectProcedure('Harmonização Orofacial Full Face')}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold text-obsidian-900 bg-warmgray-100 hover:bg-gold-50 hover:text-gold-700 hover:border-gold-300 border border-warmgray-200 transition-all duration-200 cursor-pointer"
              >
                <span>Consultar Harmonização</span>
                <ArrowUpRight className="w-4 h-4 text-warmgray-500" />
              </button>
            </div>
          </div>

          {/* CARD 3: Scanner 3D Intraoral (Modern Tech Module) */}
          <div className="lg:col-span-4 rounded-3xl bg-porcelain p-7 sm:p-8 border border-warmgray-200/90 shadow-subtle hover:shadow-luxury hover:border-gold-300 transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
                <Scan className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[11px] font-semibold text-emerald-deep uppercase tracking-widest">
                  Tecnologia 3D Digital
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-obsidian-900 mt-1">
                  Scanner Intraoral 3D & Mockup
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-warmgray-600 leading-relaxed font-normal">
                Diga adeus às massas de moldagem. Captura digital milimétrica em 3 minutos, com visualização do futuro sorriso na tela antes de iniciar.
              </p>

              <div className="p-3 rounded-xl bg-warmgray-50 border border-warmgray-200/80 text-xs text-obsidian-800 space-y-1">
                <div className="font-semibold text-emerald-900 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  Precisão de 20 micrômetros
                </div>
                <div className="text-warmgray-500">
                  Simulação de oclusão e desgaste dental em tempo real.
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectProcedure('Scanner Intraoral 3D & Mockup')}
              className="mt-6 text-xs sm:text-sm font-semibold text-gold-700 hover:text-gold-800 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Saiba como funciona o escaneamento</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* CARD 4: Clareamento Dental Photo-Laser */}
          <div className="lg:col-span-4 rounded-3xl bg-porcelain p-7 sm:p-8 border border-warmgray-200/90 shadow-subtle hover:shadow-luxury hover:border-gold-300 transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gold-50 border border-gold-200 flex items-center justify-center text-gold-700">
                <Zap className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[11px] font-semibold text-gold-700 uppercase tracking-widest">
                  Brilho & Luminosidade
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-obsidian-900 mt-1">
                  Clareamento Photo-Ativado
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-warmgray-600 leading-relaxed font-normal">
                Protocolo exclusivo de consultório com proteção prévia de esmalte e dessensibilizante bioativo. Sorriso iluminado sem dor ou choque térmico.
              </p>

              <div className="p-3 rounded-xl bg-warmgray-50 border border-warmgray-200/80 text-xs text-obsidian-800 space-y-1">
                <div className="font-semibold text-gold-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-600" />
                  Até 6 tons mais claros
                </div>
                <div className="text-warmgray-500">
                  Sessão confortável de 60 minutos em sala privativa.
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectProcedure('Clareamento Photo-Ativado a Laser')}
              className="mt-6 text-xs sm:text-sm font-semibold text-gold-700 hover:text-gold-800 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Agendar sessão de clareamento</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* CARD 5: Implantes Guiados & Carga Imediata */}
          <div className="lg:col-span-4 rounded-3xl bg-porcelain p-7 sm:p-8 border border-warmgray-200/90 shadow-subtle hover:shadow-luxury hover:border-gold-300 transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-obsidian-900 text-gold-400 flex items-center justify-center">
                <HeartPulse className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[11px] font-semibold text-obsidian-700 uppercase tracking-widest">
                  Reabilitação Oral Avançada
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-obsidian-900 mt-1">
                  Implantes Guiados por Computador
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-warmgray-600 leading-relaxed font-normal">
                Cirurgia virtual prévia com guias 3D. Fixação rápida sem incisões extensas, possibilitando novo dente fixo no mesmo dia com segurança total.
              </p>

              <div className="p-3 rounded-xl bg-warmgray-50 border border-warmgray-200/80 text-xs text-obsidian-800 space-y-1">
                <div className="font-semibold text-obsidian-900 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-600" />
                  Implantes Straumann® (Suíça)
                </div>
                <div className="text-warmgray-500">
                  Opção de sedação consciente com anestesiologista.
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectProcedure('Implantes Guiados & Carga Imediata')}
              className="mt-6 text-xs sm:text-sm font-semibold text-gold-700 hover:text-gold-800 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Consultar reabilitação com implantes</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Bottom Assurance Note */}
        <div className="mt-12 p-6 rounded-2xl bg-porcelain border border-warmgray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <Shield className="w-6 h-6 text-gold-600 shrink-0 hidden sm:block" />
            <div>
              <p className="text-sm font-semibold text-obsidian-900">
                Não tem certeza de qual procedimento é o mais indicado para seu perfil?
              </p>
              <p className="text-xs text-warmgray-500">
                Nosso diagnóstico clínico inclui escaneamento digital 3D completo e análise facial proporcional.
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectProcedure('Avaliação Diagnóstica Completa')}
            className="shrink-0 px-6 py-2.5 rounded-xl bg-obsidian-900 text-alabaster text-xs font-semibold hover:bg-obsidian-800 transition-colors cursor-pointer"
          >
            Agendar Diagnóstico 3D
          </button>
        </div>

      </div>
    </section>
  );
}

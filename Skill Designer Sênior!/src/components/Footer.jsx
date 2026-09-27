import React from 'react';
import { 
  MapPin, Clock, Phone, Mail, ShieldCheck, 
  ArrowUp, Car, Sparkles 
} from 'lucide-react';
import { clinicInfo } from '../data/clinicData';

export default function Footer({ onOpenAppointment }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contato" className="bg-obsidian-900 text-alabaster pt-20 pb-12 border-t border-gold-400/20 relative overflow-hidden">
      
      {/* Ambient background light */}
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-gold-600/5 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-obsidian-700/80">
          
          {/* Brand Column (Col 1-4) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-obsidian-800 border border-gold-400/50 flex items-center justify-center">
                <span className="font-serif text-lg text-gold-300 font-semibold tracking-wider">S&A</span>
              </div>
              <div>
                <span className="block font-serif text-xl sm:text-2xl font-bold tracking-tight text-alabaster">
                  Sorriso <span className="text-gold-400 font-normal italic">&</span> Arte
                </span>
                <span className="block text-[10px] tracking-[0.2em] uppercase text-warmgray-400 font-medium">
                  Odontologia & Harmonização VIP
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-warmgray-400 leading-relaxed font-normal">
              {clinicInfo.slogan} Clínica boutique dedicada à excelência em lentes de contato em cerâmica, harmonização orofacial e reabilitação oral digital.
            </p>

            <div className="pt-2 p-4 rounded-2xl bg-obsidian-800/80 border border-gold-400/20 space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 text-gold-400 font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Responsabilidade Médica</span>
              </div>
              <p className="text-warmgray-300 font-medium">
                {clinicInfo.technicalDirector}
              </p>
              <p className="text-warmgray-400 text-[11px]">
                {clinicInfo.directorTitle}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-obsidian-800 border border-obsidian-700 hover:border-gold-400 text-warmgray-300 hover:text-gold-400 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Instagram da Clínica"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-obsidian-800 border border-obsidian-700 hover:border-gold-400 text-warmgray-300 hover:text-gold-400 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="LinkedIn da Clínica"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Procedimentos Rápidos (Col 5-7) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-semibold text-gold-400 uppercase tracking-widest">
              Tratamentos Principais
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-warmgray-400">
              <li>
                <a href="#procedimentos" className="hover:text-gold-300 transition-colors">
                  Lentes de Contato em Porcelana
                </a>
              </li>
              <li>
                <a href="#procedimentos" className="hover:text-gold-300 transition-colors">
                  Harmonização Facial Full Face
                </a>
              </li>
              <li>
                <a href="#procedimentos" className="hover:text-gold-300 transition-colors">
                  Scanner Intraoral 3D & Mockup
                </a>
              </li>
              <li>
                <a href="#procedimentos" className="hover:text-gold-300 transition-colors">
                  Clareamento Photo-Ativado a Laser
                </a>
              </li>
              <li>
                <a href="#procedimentos" className="hover:text-gold-300 transition-colors">
                  Implantes Guiados & Carga Imediata
                </a>
              </li>
              <li>
                <a href="#diferenciais" className="hover:text-gold-300 transition-colors">
                  Protocolo Sedação Consciente
                </a>
              </li>
            </ul>
          </div>

          {/* Horários de Atendimento (Col 8-9) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-semibold text-gold-400 uppercase tracking-widest flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Horários de Atendimento</span>
            </h4>
            
            <div className="space-y-3 text-xs sm:text-sm text-warmgray-300">
              {clinicInfo.hours.map((h, i) => (
                <div key={i} className="pb-2 border-b border-obsidian-800">
                  <span className="block text-gold-200/90 font-medium">{h.days}</span>
                  <span className="text-warmgray-400 text-xs">{h.time}</span>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-2 text-xs text-warmgray-400 pt-1">
              <Car className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
              <span>{clinicInfo.valet}</span>
            </div>
          </div>

          {/* Endereço & Contato (Col 10-12) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-semibold text-gold-400 uppercase tracking-widest flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>Localização VIP</span>
            </h4>

            <p className="text-xs text-warmgray-400 leading-relaxed">
              {clinicInfo.address}
            </p>

            <div className="space-y-2 pt-2 text-xs">
              <a 
                href={`tel:${clinicInfo.whatsappNumber}`} 
                className="block text-alabaster hover:text-gold-300 transition-colors font-medium"
              >
                Telefone: {clinicInfo.phoneDisplay}
              </a>
              <a 
                href={`https://wa.me/${clinicInfo.whatsappNumber}`} 
                target="_blank" 
                rel="noreferrer"
                className="block text-gold-400 hover:underline font-medium"
              >
                WhatsApp: {clinicInfo.whatsappDisplay}
              </a>
              <span className="block text-warmgray-400">
                {clinicInfo.email}
              </span>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onOpenAppointment()}
                className="w-full py-2.5 px-3 rounded-lg bg-gold-400 text-obsidian-900 text-xs font-semibold hover:bg-gold-300 transition-colors cursor-pointer"
              >
                Agendar Horário
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Micro Footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-warmgray-400">
          <p>
            © {new Date().getFullYear()} Clínica Sorriso & Arte Ltda. Todos os direitos reservados.
          </p>

          <div className="flex items-center gap-6">
            <span className="text-[11px] text-warmgray-400">
              Conformidade CFO / CRO-SP • Termos de Privacidade
            </span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-full bg-obsidian-800 hover:bg-obsidian-700 text-gold-400 transition-colors cursor-pointer"
              aria-label="Voltar ao topo"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}

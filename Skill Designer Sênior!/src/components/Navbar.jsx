import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Phone, Menu, X, ShieldCheck } from 'lucide-react';
import { clinicInfo } from '../data/clinicData';

export default function Navbar({ onOpenAppointment }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Procedimentos', href: '#procedimentos' },
    { label: 'Diferenciais & 3D', href: '#diferenciais' },
    { label: 'Depoimentos', href: '#depoimentos' },
    { label: 'Dúvidas', href: '#faq' },
    { label: 'Localização', href: '#contato' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      scrolled 
        ? 'bg-alabaster/95 backdrop-blur-md shadow-subtle border-b border-warmgray-200/80 py-3.5' 
        : 'bg-transparent py-5'
    }`}>
      {/* Top micro bar for CRO credentials */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
        scrolled ? 'hidden' : 'block pb-2 mb-2 border-b border-warmgray-200/50'
      }`}>
        <div className="flex justify-between items-center text-xs text-warmgray-500 font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-gold-500" />
            <span>Clínica de Odontologia Estética & Harmonização • {clinicInfo.technicalDirector}</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-obsidian-800">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              Consultas Exclusivas por Agendamento
            </span>
            <span>|</span>
            <a 
              href={`tel:${clinicInfo.whatsappNumber}`} 
              className="hover:text-gold-600 transition-colors flex items-center gap-1"
            >
              <Phone className="w-3 h-3 text-gold-500" />
              {clinicInfo.phoneDisplay}
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-obsidian-900 border border-gold-400/40 flex items-center justify-center shadow-subtle group-hover:border-gold-400 transition-colors">
              <span className="font-serif text-lg text-gold-300 font-semibold tracking-wider">S&A</span>
            </div>
            <div>
              <span className="block font-serif text-xl sm:text-2xl font-bold tracking-tight text-obsidian-900">
                Sorriso <span className="text-gold-500 font-normal italic">&</span> Arte
              </span>
              <span className="block text-[10px] sm:text-[11px] tracking-[0.18em] uppercase text-warmgray-500 font-medium -mt-0.5">
                Odontologia & Harmonização
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-obsidian-800">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative py-1 text-obsidian-700 hover:text-gold-600 transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-gold-500 hover:after:w-full after:transition-all after:duration-300"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action Button */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => onOpenAppointment()}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide bg-obsidian-900 text-alabaster border border-gold-400/30 hover:border-gold-400 hover:bg-obsidian-800 hover:shadow-luxury transition-all duration-300 cursor-pointer group"
            >
              <Calendar className="w-4 h-4 text-gold-400 group-hover:scale-110 transition-transform" />
              <span>Agendar Avaliação VIP</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => onOpenAppointment()}
              className="p-2 rounded-full bg-obsidian-900 text-gold-300"
              aria-label="Agendar"
            >
              <Calendar className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-obsidian-800 hover:bg-warmgray-200/50 transition-colors"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-alabaster border-b border-warmgray-200 px-4 pt-3 pb-6 space-y-3 mt-3 shadow-lg">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-obsidian-800 border-b border-warmgray-100"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAppointment();
              }}
              className="w-full py-3 rounded-xl bg-obsidian-900 text-gold-300 font-semibold text-sm flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Agendar Avaliação VIP
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

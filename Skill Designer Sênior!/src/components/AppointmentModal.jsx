import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, CheckCircle2, Shield, Phone, Sparkles, MessageSquare } from 'lucide-react';
import { clinicInfo } from '../data/clinicData';

export default function AppointmentModal({ isOpen, onClose, initialProcedure = '' }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    procedure: initialProcedure || 'Lentes de Contato em Porcelana',
    preferredShift: 'Tarde (13h às 18h)',
    notes: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (initialProcedure) {
      setFormData((prev) => ({ ...prev, procedure: initialProcedure }));
    }
  }, [initialProcedure]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleOpenWhatsAppDirectly = () => {
    const text = encodeURIComponent(
      `Olá! Gostaria de agendar uma avaliação na Clínica Sorriso & Arte.\n\n*Nome:* ${formData.name}\n*Procedimento de Interesse:* ${formData.procedure}\n*Horário de Preferência:* ${formData.preferredShift}\n*Observações:* ${formData.notes || 'Nenhuma'}`
    );
    window.open(`https://wa.me/${clinicInfo.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-obsidian-900/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        className="bg-porcelain w-full max-w-lg rounded-3xl border border-gold-300/80 shadow-2xl overflow-hidden relative"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-obsidian-900 text-alabaster p-6 sm:p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-warmgray-400 hover:text-alabaster hover:bg-obsidian-800 transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-gold-400 uppercase tracking-widest mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Atendimento Personalizado</span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-alabaster">
            Agendar Avaliação VIP
          </h3>

          <p className="text-xs sm:text-sm text-warmgray-300 mt-1 font-normal">
            Preencha seus dados para receber o contato da nossa concierge em até 30 minutos.
          </p>
        </div>

        {/* Content Form */}
        <div className="p-6 sm:p-8">
          {isSubmitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h4 className="font-serif text-2xl font-bold text-obsidian-900">
                Solicitação Recebida com Sucesso!
              </h4>

              <p className="text-sm text-warmgray-600 leading-relaxed max-w-xs mx-auto">
                Olá, <strong>{formData.name}</strong>! Nossa equipe entrará em contato pelo número <strong>{formData.phone}</strong> para confirmar seu horário ideal e preparar sua recepção no lounge VIP.
              </p>

              <div className="pt-4 flex flex-col gap-3">
                <button
                  onClick={handleOpenWhatsAppDirectly}
                  className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-alabaster text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Acelerar Atendimento via WhatsApp</span>
                </button>

                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    onClose();
                  }}
                  className="text-xs text-warmgray-500 hover:text-obsidian-800 underline transition-colors cursor-pointer"
                >
                  Fechar Janela
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-obsidian-800 uppercase tracking-wider mb-1.5">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Dra. Juliana Silveira"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-warmgray-200 text-sm text-obsidian-900 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all bg-alabaster/60"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-obsidian-800 uppercase tracking-wider mb-1.5">
                  WhatsApp com DDD *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="(11) 99999-9999"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-warmgray-200 text-sm text-obsidian-900 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all bg-alabaster/60"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-obsidian-800 uppercase tracking-wider mb-1.5">
                  Procedimento de Interesse
                </label>
                <select
                  value={formData.procedure}
                  onChange={(e) => setFormData({ ...formData, procedure: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-warmgray-200 text-sm text-obsidian-900 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all bg-alabaster/60"
                >
                  <option value="Lentes de Contato em Porcelana">Lentes de Contato em Porcelana</option>
                  <option value="Harmonização Orofacial Full Face">Harmonização Orofacial Full Face</option>
                  <option value="Scanner Intraoral 3D & Mockup">Scanner Intraoral 3D & Mockup</option>
                  <option value="Clareamento Photo-Ativado a Laser">Clareamento Photo-Ativado a Laser</option>
                  <option value="Implantes Guiados & Carga Imediata">Implantes Guiados & Carga Imediata</option>
                  <option value="Avaliação Diagnóstica Completa">Avaliação Diagnóstica Completa</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-obsidian-800 uppercase tracking-wider mb-1.5">
                  Período de Preferência
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {['Manhã', 'Tarde', 'Noite'].map((period) => (
                    <button
                      type="button"
                      key={period}
                      onClick={() => setFormData({ ...formData, preferredShift: period })}
                      className={`py-2 px-3 rounded-lg border text-center font-medium transition-colors cursor-pointer ${
                        formData.preferredShift === period
                          ? 'bg-obsidian-900 text-gold-300 border-obsidian-900'
                          : 'bg-warmgray-50 text-obsidian-800 border-warmgray-200 hover:border-warmgray-300'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-obsidian-800 uppercase tracking-wider mb-1.5">
                  Alguma sensibilidade ou pedido especial? (Opcional)
                </label>
                <textarea
                  rows="2"
                  placeholder="Ex: Gostaria de saber sobre sedação consciente / teste de simulação 3D."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-warmgray-200 text-sm text-obsidian-900 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all bg-alabaster/60"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-obsidian-900 text-alabaster border border-gold-400 font-semibold text-sm hover:bg-obsidian-800 hover:shadow-luxury transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-gold-400" />
                  <span>Confirmar e Solicitar Horário VIP</span>
                </button>
              </div>

              <p className="text-[11px] text-center text-warmgray-500 pt-1">
                🔒 Seus dados são protegidos por sigilo médico absoluto. Sem spam.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

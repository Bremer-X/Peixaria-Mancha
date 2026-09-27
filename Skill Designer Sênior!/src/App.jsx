import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BentoProcedures from './components/BentoProcedures';
import Differentials from './components/Differentials';
import Testimonials from './components/Testimonials';
import FaqSection from './components/FaqSection';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import AppointmentModal from './components/AppointmentModal';

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProcedure, setSelectedProcedure] = useState('');

  const handleOpenAppointment = (procedureName = '') => {
    setSelectedProcedure(procedureName);
    setModalOpen(true);
  };

  const handleCloseAppointment = () => {
    setModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-alabaster text-obsidian flex flex-col selection:bg-gold-200 selection:text-obsidian-900">
      {/* Fixed Luxury Header */}
      <Navbar onOpenAppointment={() => handleOpenAppointment()} />

      {/* Main Content Flow */}
      <main className="flex-grow">
        {/* 1. Hero with Clear Value Proposition & Appointment Action */}
        <Hero onOpenAppointment={() => handleOpenAppointment()} />

        {/* 2. Modern Bento Grid Procedures */}
        <BentoProcedures onSelectProcedure={(proc) => handleOpenAppointment(proc)} />

        {/* 4. Clinic Differentials (3D Tech, Spa Comfort, Sedation) */}
        <Differentials onOpenAppointment={() => handleOpenAppointment()} />

        {/* 3. Social Proof with Real Patient Testimonials */}
        <Testimonials onOpenAppointment={() => handleOpenAppointment()} />

        {/* Clinical Transparency FAQ */}
        <FaqSection />
      </main>

      {/* 5. Complete Footer with Hours & Legal Info */}
      <Footer onOpenAppointment={() => handleOpenAppointment()} />

      {/* 5. Floating WhatsApp Button */}
      <FloatingWhatsApp />

      {/* Interactive Appointment VIP Drawer / Modal */}
      <AppointmentModal 
        isOpen={modalOpen} 
        onClose={handleCloseAppointment}
        initialProcedure={selectedProcedure}
      />
    </div>
  );
}

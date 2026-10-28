import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Problem from './components/Problem';
import Services from './components/Services';
import Process from './components/Process';
import EngineeringTech from './components/EngineeringTech';
import CostEstimator from './components/CostEstimator';
import About from './components/About';
import WhyChooseUs from './components/WhyChooseUs';
import Projects from './components/Projects';
import BeforeAfter from './components/BeforeAfter';
import Gallery from './components/Gallery';
import VideoSection from './components/VideoSection';
import Testimonials from './components/Testimonials';
import Certifications from './components/Certifications';
import FAQ from './components/FAQ';
import CTA from './components/CTA';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ConsultationModal from './components/ConsultationModal';
import { Phone, MessageCircle, X } from 'lucide-react';
import { companyInfo } from './data/companyData';

export default function App() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [consultationPreFill, setConsultationPreFill] = useState(null);
  const [contactMenuOpen, setContactMenuOpen] = useState(false);

  const handleOpenConsultation = (data = null) => {
    setConsultationPreFill(data);
    setIsConsultationOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-[#F5F5F0] flex flex-col font-sans selection:bg-brand-accent selection:text-white">
      {/* Sticky Minimal Editorial Navbar */}
      <Navbar onOpenConsultation={() => handleOpenConsultation()} />

      {/* Main Content Sections - Strictly Unified Dark Theme */}
      <main className="flex-grow">
        <Hero onOpenConsultation={() => handleOpenConsultation()} />
        <Problem onOpenConsultation={() => handleOpenConsultation()} />
        <Services onOpenConsultation={() => handleOpenConsultation()} />
        <Process onOpenConsultation={() => handleOpenConsultation()} />
        <EngineeringTech />
        <CostEstimator onOpenConsultationWithData={(data) => handleOpenConsultation(data)} />
        <About onOpenConsultation={() => handleOpenConsultation()} />
        <WhyChooseUs onOpenConsultation={() => handleOpenConsultation()} />
        <Projects onOpenConsultation={() => handleOpenConsultation()} />
        <BeforeAfter onOpenConsultation={() => handleOpenConsultation()} />
        <Gallery />
        <VideoSection />
        <Testimonials />
        <Certifications />
        <FAQ onOpenConsultation={() => handleOpenConsultation()} />
        <CTA onOpenConsultation={() => handleOpenConsultation()} />
        <Contact initialData={consultationPreFill} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Single Unified Floating Contact System */}
      <aside aria-label="Direct Engineer Contact" className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
        {contactMenuOpen && (
          <div className="mb-3 bg-[#141414] border border-[#2A2A2A] p-3 shadow-2xl flex flex-col gap-2 min-w-[220px] animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-[#2A2A2A] text-[10px] font-mono uppercase tracking-wider text-[#A0A0A0]">
              <span>Direct Inquiries</span>
              <button 
                onClick={() => setContactMenuOpen(false)}
                className="text-[#707070] hover:text-[#F5F5F0]"
                aria-label="Close contact options"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* WhatsApp */}
            <a
              href={companyInfo.contact.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 p-2 bg-[#1A1A1A] hover:bg-brand-accent text-[#F5F5F0] hover:text-white text-xs font-mono font-semibold tracking-wider transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="flex flex-col text-left">
                <span className="text-[9px] text-[#A0A0A0] uppercase">WhatsApp Video/Plan</span>
                <span>+91 94417 70000</span>
              </div>
            </a>

            {/* Call Now */}
            <a
              href={`tel:${companyInfo.contact.primaryPhone.replace(/\s+/g, '')}`}
              className="flex items-center gap-2.5 p-2 bg-[#1A1A1A] hover:bg-brand-accent text-[#F5F5F0] hover:text-white text-xs font-mono font-semibold tracking-wider transition-colors"
            >
              <Phone className="w-4 h-4 text-brand-accent shrink-0" />
              <div className="flex flex-col text-left">
                <span className="text-[9px] text-[#A0A0A0] uppercase">Direct Call (24x7)</span>
                <span>{companyInfo.contact.primaryPhone}</span>
              </div>
            </a>
          </div>
        )}

        {/* Single Primary Toggle Button */}
        <button
          onClick={() => setContactMenuOpen(!contactMenuOpen)}
          className="flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 bg-[#080808] border border-[#2A2A2A] text-[#F5F5F0] hover:border-brand-accent hover:bg-[#141414] transition-all shadow-2xl group"
          aria-label="Contact Engineer"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-mono text-xs font-bold uppercase tracking-wider">
            Contact Engineer
          </span>
          <Phone className="w-3.5 h-3.5 text-brand-accent group-hover:rotate-12 transition-transform" />
        </button>
      </aside>

      {/* Global Consultation Modal */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        initialData={consultationPreFill}
        onClose={() => {
          setIsConsultationOpen(false);
          setConsultationPreFill(null);
        }}
      />
    </div>
  );
}

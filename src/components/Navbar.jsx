import React, { useState, useEffect } from 'react';
import { Phone, Menu, X } from 'lucide-react';
import { companyInfo } from '../data/companyData';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Process', href: '#process' },
    { name: 'Technology', href: '#technology' },
    { name: 'Estimator', href: '#estimator' },
    { name: 'Projects', href: '#projects' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        {/* Top single-line information strip */}
        <div className={`transition-all duration-300 ${
          isScrolled 
            ? 'h-0 opacity-0 overflow-hidden py-0' 
            : 'bg-[#080808]/95 backdrop-blur-md border-b border-[#2A2A2A] py-1.5'
        }`}>
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-[11px] font-mono tracking-wider text-[#A0A0A0] whitespace-nowrap overflow-hidden">
            {/* Left strip items */}
            <div className="flex items-center space-x-2 sm:space-x-3 truncate">
              <span className="text-[#F5F5F0] font-semibold">TDBD Engineering Works Pvt. Ltd.</span>
              <span className="text-[#555555]">/</span>
              <span className="text-brand-accent font-semibold">Est. 1999</span>
              <span className="text-[#555555] hidden md:inline">/</span>
              <span className="hidden md:inline text-[#CCCCCC]">HQ: Yamunanagar, Haryana</span>
              <span className="text-[#555555] hidden xl:inline">/</span>
              <span className="hidden xl:inline text-[#A0A0A0] uppercase">Pan-India Execution</span>
            </div>

            {/* Right strip items */}
            <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
              <a 
                href={`tel:${companyInfo.contact.primaryPhone.replace(/\s+/g, '')}`} 
                className="text-[#CCCCCC] hover:text-brand-accent transition-colors font-medium flex items-center gap-1"
              >
                <span>Ph:</span>
                <span className="text-[#F5F5F0] font-semibold">{companyInfo.contact.primaryPhone}</span>
              </a>
              <span className="text-[#555555] hidden lg:inline">/</span>
              <a 
                href={`mailto:${companyInfo.contact.email}`}
                className="hidden lg:inline text-[#A0A0A0] hover:text-[#F5F5F0] transition-colors"
              >
                {companyInfo.contact.email}
              </a>
            </div>
          </div>
        </div>

        {/* Main Minimal Editorial Navbar */}
        <nav className={`transition-all duration-300 ${
          isScrolled
            ? 'bg-[#080808]/95 backdrop-blur-xl py-3 border-b border-[#2A2A2A] shadow-2xl'
            : 'bg-gradient-to-b from-[#080808]/95 to-[#080808]/60 backdrop-blur-sm py-4 border-b border-[#2A2A2A]/40'
        }`}>
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* Left: Logo & Minimal Wordmark */}
            <a href="#home" className="flex items-center gap-3 group shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center shrink-0">
                <img
                  src="/images/tdbd_logo.png"
                  alt="TDBD Engineering Works Logo"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  className="w-full h-full object-contain filter drop-shadow group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-black text-base sm:text-lg text-[#F5F5F0] tracking-widest leading-none">
                  TDBD
                </span>
                <span className="text-[9px] font-mono tracking-ultra-wide text-[#A0A0A0] uppercase mt-0.5">
                  Engineering Works
                </span>
              </div>
            </a>

            {/* Center: Editorial Links */}
            <div className="hidden xl:flex items-center space-x-5 2xl:space-x-7">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-[11px] font-mono uppercase tracking-wider text-[#A0A0A0] hover:text-[#F5F5F0] hover:text-brand-accent transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Right: Call Now Minimal Link */}
            <div className="hidden sm:flex items-center">
              <a
                href={`tel:${companyInfo.contact.primaryPhone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-none border border-[#2A2A2A] bg-[#141414] text-xs font-mono font-bold tracking-wider text-[#F5F5F0] hover:border-brand-accent hover:text-white transition-all"
              >
                <Phone className="w-3.5 h-3.5 text-brand-accent" />
                <span>CALL NOW</span>
              </a>
            </div>

            {/* Mobile Actions: Call Icon + Menu Button */}
            <div className="flex items-center space-x-3 sm:hidden">
              <a
                href={`tel:${companyInfo.contact.primaryPhone.replace(/\s+/g, '')}`}
                className="p-2 text-[#F5F5F0] hover:text-brand-accent transition-colors"
                aria-label="Call TDBD Engineering"
              >
                <Phone className="w-4 h-4 text-brand-accent" />
              </a>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[#CCCCCC] hover:text-white transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#080808] flex flex-col justify-between pt-24 pb-8 px-6 overflow-y-auto animate-fade-in xl:hidden">
          <div className="flex flex-col space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-ultra-wide text-[#707070] pb-2 border-b border-[#2A2A2A]">
              Navigation Index
            </span>
            {navLinks.map((link, idx) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-baseline justify-between text-xl font-heading font-bold text-[#CCCCCC] hover:text-white uppercase tracking-tight py-2 border-b border-[#1A1A1A]"
              >
                <span>{link.name}</span>
                <span className="font-mono text-xs text-[#555555]">0{idx + 1}</span>
              </a>
            ))}
          </div>

          <div className="pt-6 border-t border-[#2A2A2A] flex flex-col space-y-3">
            <div className="text-[11px] font-mono text-[#A0A0A0]">
              Direct Engineering Consultation
            </div>
            <a
              href={`tel:${companyInfo.contact.primaryPhone.replace(/\s+/g, '')}`}
              className="w-full py-3 bg-brand-accent text-white text-center font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#EA580C] transition-colors"
            >
              Call {companyInfo.contact.primaryPhone}
            </a>
          </div>
        </div>
      )}
    </>
  );
}

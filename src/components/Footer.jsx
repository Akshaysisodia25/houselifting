import React from 'react';
import { ArrowUp, Phone, Mail, MapPin } from 'lucide-react';
import { companyInfo } from '../data/companyData';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#080808] text-[#F5F5F0] border-t border-[#2A2A2A] relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        
        {/* Upper Editorial Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-[#2A2A2A]">
          
          {/* Brand & Narrative */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center shrink-0">
                <img
                  src="/images/tdbd_logo.png"
                  alt="TDBD Engineering Works Logo"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  className="w-full h-full object-contain filter drop-shadow"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-black text-lg uppercase tracking-widest text-[#F5F5F0]">
                  TDBD Engineering Works
                </span>
                <span className="text-[10px] font-mono tracking-ultra-wide uppercase text-brand-accent">
                  Pvt. Ltd. • Est. 1999
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#A0A0A0] font-sans leading-relaxed max-w-md">
              Specialized civil engineering solutions in non-destructive house lifting, building elevation, and structural shifting. Protecting residential and commercial properties against road-level rise and rainwater waterlogging across India since 1999.
            </p>

            <div className="text-xs font-mono text-[#707070] space-y-0.5">
              <div>CIN: U45200HR2009PTC039641</div>
              <div>Trade Marks Registry Regd: Class 37</div>
              <div>Directors: Sushil Kumar Sisodia &amp; Pardeep Kumar Sisodia</div>
            </div>
          </div>

          {/* Solutions Column */}
          <div className="lg:col-span-3 space-y-4">
            <span className="text-[11px] font-mono uppercase tracking-ultra-wide text-[#CCCCCC] block font-semibold">
              Engineering Solutions
            </span>
            <ul className="space-y-2 text-xs font-mono uppercase tracking-wider text-[#A0A0A0]">
              <li><a href="#services" className="hover:text-brand-accent transition-colors">House Lifting (Residential)</a></li>
              <li><a href="#services" className="hover:text-brand-accent transition-colors">Building Lifting (Multi-Storey)</a></li>
              <li><a href="#services" className="hover:text-brand-accent transition-colors">Horizontal House Shifting</a></li>
              <li><a href="#services" className="hover:text-brand-accent transition-colors">Commercial Building Lifting</a></li>
              <li><a href="#services" className="hover:text-brand-accent transition-colors">Foundation Level Correction</a></li>
              <li><a href="#services" className="hover:text-brand-accent transition-colors">Stilt Parking Creation</a></li>
            </ul>
          </div>

          {/* Navigation & Direct Links */}
          <div className="lg:col-span-2 space-y-4">
            <span className="text-[11px] font-mono uppercase tracking-ultra-wide text-[#CCCCCC] block font-semibold">
              Index
            </span>
            <ul className="space-y-2 text-xs font-mono uppercase tracking-wider text-[#A0A0A0]">
              <li><a href="#about" className="hover:text-brand-accent transition-colors">About TDBD</a></li>
              <li><a href="#process" className="hover:text-brand-accent transition-colors">Lifting Process</a></li>
              <li><a href="#technology" className="hover:text-brand-accent transition-colors">Technology &amp; Jacks</a></li>
              <li><a href="#estimator" className="hover:text-brand-accent transition-colors">Cost Estimator</a></li>
              <li><a href="#projects" className="hover:text-brand-accent transition-colors">Project Archive</a></li>
              <li><a href="#gallery" className="hover:text-brand-accent transition-colors">Field Gallery</a></li>
              <li><a href="#testimonials" className="hover:text-brand-accent transition-colors">Client Reviews</a></li>
              <li><a href="#faq" className="hover:text-brand-accent transition-colors">Engineering FAQ</a></li>
              <li><a href="#contact" className="hover:text-brand-accent transition-colors">Contact Engineers</a></li>
            </ul>
          </div>

          {/* Direct Contact Column */}
          <div className="lg:col-span-2 space-y-4">
            <span className="text-[11px] font-mono uppercase tracking-ultra-wide text-[#CCCCCC] block font-semibold">
              Headquarters
            </span>
            <div className="text-xs font-mono text-[#A0A0A0] space-y-2">
              <p className="leading-relaxed">
                Village Farkpur, Jagadhri Workshop Road, Yamunanagar, Haryana – 135002, India
              </p>
              <div>
                <a href={`tel:${companyInfo.contact.primaryPhone.replace(/\s+/g, '')}`} className="text-[#F5F5F0] hover:text-brand-accent font-bold block">
                  {companyInfo.contact.primaryPhone}
                </a>
                <a href={`tel:${companyInfo.contact.secondaryPhone.replace(/\s+/g, '')}`} className="text-[#A0A0A0] hover:text-[#F5F5F0] block mt-0.5">
                  {companyInfo.contact.secondaryPhone}
                </a>
              </div>
              <a href={`mailto:${companyInfo.contact.email}`} className="text-[#A0A0A0] hover:text-[#F5F5F0] block break-all">
                {companyInfo.contact.email}
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Line Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-baseline sm:items-center justify-between text-[11px] font-mono text-[#707070] uppercase tracking-wider gap-4">
          <div>
            © {new Date().getFullYear()} TDBD Engineering Works Private Limited. All Rights Reserved.
          </div>
          <button
            onClick={scrollToTop}
            className="text-[#CCCCCC] hover:text-brand-accent flex items-center gap-1.5 transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 text-brand-accent" />
          </button>
        </div>

      </div>
    </footer>
  );
}

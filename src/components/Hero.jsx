import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Hero({ onOpenConsultation }) {
  return (
    <section id="home" className="relative min-h-[92vh] flex items-end pb-16 sm:pb-20 pt-32 overflow-hidden bg-[#080808] text-[#F5F5F0]">
      {/* Full-width High-Impact Image with Editorial Grading */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/slider_photo.jpg"
          alt="Structural House Lifting Engineering - TDBD"
          onError={(e) => { e.currentTarget.src = '/images/slider_photo2.jpg'; }}
          className="w-full h-full object-cover object-center filter brightness-[0.35] contrast-[1.15]"
        />
        {/* Subtle architectural vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/40 to-[#080808]/60"></div>
        <div className="absolute inset-0 bg-editorial-grid opacity-30"></div>
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-4xl space-y-6 sm:space-y-8">
          {/* Editorial Category Label */}
          <div className="inline-flex items-center gap-2">
            <span className="w-2 h-2 bg-brand-accent"></span>
            <span className="text-[11px] font-mono uppercase tracking-ultra-wide text-brand-accent font-semibold">
              Structural House &amp; Building Lifting Specialists • Est. 1999
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-heading font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[#F5F5F0] uppercase leading-[0.95]">
            Raising Buildings.
            <br />
            <span className="text-[#A0A0A0]">Restoring Possibilities.</span>
          </h1>

          {/* Punchy Editorial Description */}
          <p className="text-base sm:text-lg md:text-xl text-[#CCCCCC] max-w-2xl font-normal leading-relaxed font-sans">
            Specialized civil engineering solutions to raise residential houses, multi-storey buildings, and commercial structures safely above road level — preventing waterlogging without the massive expense of demolition.
          </p>

          {/* Editorial CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <button
              onClick={onOpenConsultation}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-brand-accent text-white font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#EA580C] transition-colors"
            >
              <span>Get a Free Consultation</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>

            <a
              href="#projects"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-[#2A2A2A] bg-[#111111]/80 text-[#F5F5F0] font-mono font-semibold text-xs uppercase tracking-wider hover:bg-[#1E1E1E] hover:border-brand-accent transition-colors"
            >
              <span>Explore Projects</span>
              <span className="text-[#A0A0A0] font-normal">→</span>
            </a>
          </div>
        </div>

        {/* Editorial Footnote Strip */}
        <div className="mt-14 sm:mt-16 pt-6 border-t border-[#2A2A2A] grid grid-cols-2 md:grid-cols-4 gap-4 text-[11px] font-mono text-[#A0A0A0] uppercase tracking-wider">
          <div>
            <span className="text-[#707070] block text-[9px]">01 / Track Record</span>
            <span className="text-[#F5F5F0] font-semibold">25+ Years Experience</span>
          </div>
          <div>
            <span className="text-[#707070] block text-[9px]">02 / Execution</span>
            <span className="text-[#F5F5F0] font-semibold">Pan-India Deployment</span>
          </div>
          <div>
            <span className="text-[#707070] block text-[9px]">03 / Technology</span>
            <span className="text-[#F5F5F0] font-semibold">Synchronized Hydraulics</span>
          </div>
          <div>
            <span className="text-[#707070] block text-[9px]">04 / Integrity</span>
            <span className="text-[#F5F5F0] font-semibold">Zero Demolition Required</span>
          </div>
        </div>
      </div>
    </section>
  );
}

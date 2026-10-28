import React from 'react';
import { whyChooseUs } from '../data/companyData';

export default function WhyChooseUs({ onOpenConsultation }) {
  return (
    <section className="py-24 sm:py-32 bg-[#080808] text-[#F5F5F0] relative border-b border-[#2A2A2A]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pb-16 border-b border-[#2A2A2A]">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-[11px] font-mono uppercase tracking-ultra-wide text-brand-accent font-semibold block">
              Proven Standards / 09
            </span>
            <h2 className="font-heading font-black text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight text-[#F5F5F0] leading-[0.95]">
              Why Property
              <br />
              Owners Trust TDBD.
            </h2>
          </div>
          <div className="lg:col-span-4 text-sm font-sans text-[#A0A0A0] leading-relaxed">
            We combine rigorous civil engineering calculations with seasoned ground execution, protecting structural integrity, time, and capital.
          </div>
        </div>

        {/* 8 Trust Pillars: Clean Grid with Thin Borders (#2A2A2A) and Subtle Hover */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-b border-[#2A2A2A]">
          {whyChooseUs.map((item, idx) => (
            <div 
              key={item.title}
              className="p-8 sm:p-10 border border-[#2A2A2A] -mt-[1px] -ml-[1px] hover:border-brand-accent hover:bg-[#121212] transition-all duration-300 group space-y-4"
            >
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-brand-accent font-bold">PILLAR 0{idx + 1}</span>
                <span className="text-[#707070] uppercase">Verified Standard</span>
              </div>
              <h3 className="font-heading font-bold text-xl uppercase tracking-tight text-[#F5F5F0] group-hover:text-white group-hover:translate-x-1 transition-all">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#A0A0A0] group-hover:text-[#CCCCCC] leading-relaxed font-sans transition-colors">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Editorial Callout */}
        <div className="mt-16 pt-6 flex flex-col sm:flex-row items-baseline justify-between text-xs font-mono text-[#A0A0A0] uppercase tracking-wider gap-4">
          <span>Zero structural fractures • 100% safety track record since 1999</span>
          <button
            onClick={onOpenConsultation}
            className="text-[#F5F5F0] hover:text-brand-accent font-bold flex items-center gap-1.5 transition-colors"
          >
            <span>Speak with Chief Structural Engineer</span>
            <span>→</span>
          </button>
        </div>

      </div>
    </section>
  );
}

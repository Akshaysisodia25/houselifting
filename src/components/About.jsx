import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { companyInfo } from '../data/companyData';

export default function About({ onOpenConsultation }) {
  return (
    <section id="about" className="py-24 sm:py-32 bg-[#080808] text-[#F5F5F0] relative border-b border-[#2A2A2A]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pb-16 border-b border-[#2A2A2A]">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-[11px] font-mono uppercase tracking-ultra-wide text-brand-accent font-semibold block">
              Institutional Heritage / 08
            </span>
            <h2 className="font-heading font-black text-4xl sm:text-6xl md:text-7xl text-[#F5F5F0] uppercase tracking-tight leading-[0.95]">
              Who We Are.
              <br />
              TDBD Engineering Works.
            </h2>
          </div>
          <div className="lg:col-span-4 text-sm font-sans text-[#A0A0A0] leading-relaxed">
            Specialized civil engineering solutions for lifting and shifting residential, multi-storey, and commercial structures across India. Operating since 1999.
          </div>
        </div>

        {/* Editorial Layout: Large Photography + Narrative Dossier */}
        <div className="py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start border-b border-[#2A2A2A]">
          
          {/* Image & Archival Frame */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative overflow-hidden bg-[#141414] border border-[#2A2A2A] aspect-[4/5] group">
              <img
                src="/images/pic2.jpg"
                alt="TDBD Engineering Founders Heritage Workshop"
                onError={(e) => { e.currentTarget.src = '/images/slider_photo.jpg'; }}
                className="w-full h-full object-cover object-center filter contrast-[1.08] brightness-90 group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/40 to-transparent"></div>
              
              <div className="absolute bottom-6 left-6 right-6 p-5 bg-[#121212]/95 backdrop-blur-md border border-[#2A2A2A] text-[#F5F5F0] space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-ultra-wide text-brand-accent block">
                  Roots Since 1999
                </span>
                <div className="font-heading font-bold text-lg uppercase tracking-tight text-[#F5F5F0]">
                  Tejo Devi &amp; Banarsi Das Legacy
                </div>
                <p className="text-xs text-[#A0A0A0] font-sans">
                  Originating in Farkpur, Yamunanagar, Haryana. Formally incorporated as TDBD Engineering Works Pvt. Ltd. in 2009.
                </p>
              </div>
            </div>

            {/* Factual Registration Metadata */}
            <div className="grid grid-cols-2 gap-4 text-xs font-mono border-t border-[#2A2A2A] pt-4">
              <div>
                <span className="text-[#707070] block text-[10px] uppercase">Directors</span>
                <span className="text-[#F5F5F0] font-bold block mt-0.5">Sushil Kumar Sisodia</span>
                <span className="text-[#F5F5F0] font-bold block">Pardeep Kumar Sisodia</span>
              </div>
              <div>
                <span className="text-[#707070] block text-[10px] uppercase">Corporate HQ</span>
                <span className="text-[#F5F5F0] font-bold block mt-0.5">Yamunanagar, Haryana</span>
                <span className="text-[#A0A0A0] block text-[11px]">Pin: 135002, India</span>
              </div>
            </div>
          </div>

          {/* Narrative Column */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-ultra-wide text-brand-accent block font-semibold">
                Foundational Mission
              </span>
              <h3 className="font-heading font-bold text-2xl sm:text-3xl text-[#F5F5F0] uppercase tracking-tight leading-snug">
                Preserving Built Architecture Without The Waste &amp; Expense Of Reconstruction.
              </h3>
              <p className="text-base text-[#CCCCCC] leading-relaxed font-sans">
                TDBD Engineering Works provides proprietary civil elevation and structural relocation services. When municipal roadway elevations or stormwater drainage failures leave properties in low-lying catchments, rebuilding from scratch is an unnecessary destruction of wealth.
              </p>
              <p className="text-sm text-[#A0A0A0] leading-relaxed font-sans">
                The name "TDBD" honors <strong>Tejo Devi &amp; Banarsi Das</strong>. Banarsi Das was born in 1930 in village Farkpur, Yamunanagar, Haryana. His principles of relentless discipline, structural integrity, and honest execution inspired the formalization of our enterprise in 1999.
              </p>
            </div>

            {/* 4 Pillars in Clean Editorial List */}
            <div className="border-t border-[#2A2A2A] pt-6 space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-ultra-wide text-[#707070] block">
                Operational Tenets
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-4 bg-[#111111] border border-[#2A2A2A] space-y-1 hover:border-brand-accent/50 transition-colors">
                  <div className="flex items-center gap-2 text-[#F5F5F0] font-heading font-bold uppercase text-sm">
                    <span className="text-brand-accent font-mono text-xs">01</span>
                    <span>Engineering Expertise</span>
                  </div>
                  <p className="text-xs text-[#A0A0A0] font-sans leading-relaxed">
                    Accurately calculated dead-load centers and continuous laser-guided elevation across all load-bearing lines.
                  </p>
                </div>

                <div className="p-4 bg-[#111111] border border-[#2A2A2A] space-y-1 hover:border-brand-accent/50 transition-colors">
                  <div className="flex items-center gap-2 text-[#F5F5F0] font-heading font-bold uppercase text-sm">
                    <span className="text-brand-accent font-mono text-xs">02</span>
                    <span>Specialized Equipment</span>
                  </div>
                  <p className="text-xs text-[#A0A0A0] font-sans leading-relaxed">
                    Custom-calibrated hydraulic cylinders, central pressure manifolds, and certified high-tensile rolled steel I-beams.
                  </p>
                </div>

                <div className="p-4 bg-[#111111] border border-[#2A2A2A] space-y-1 hover:border-brand-accent/50 transition-colors">
                  <div className="flex items-center gap-2 text-[#F5F5F0] font-heading font-bold uppercase text-sm">
                    <span className="text-brand-accent font-mono text-xs">03</span>
                    <span>Experienced Manpower</span>
                  </div>
                  <p className="text-xs text-[#A0A0A0] font-sans leading-relaxed">
                    Decades of field experience working in disciplined synchronization across every inch of structural travel.
                  </p>
                </div>

                <div className="p-4 bg-[#111111] border border-[#2A2A2A] space-y-1 hover:border-brand-accent/50 transition-colors">
                  <div className="flex items-center gap-2 text-[#F5F5F0] font-heading font-bold uppercase text-sm">
                    <span className="text-brand-accent font-mono text-xs">04</span>
                    <span>Safety Protocols</span>
                  </div>
                  <p className="text-xs text-[#A0A0A0] font-sans leading-relaxed">
                    Continuous mechanical locking cribbing supporting loads with dual physical fail-safes at every step.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={onOpenConsultation}
                className="px-7 py-3.5 bg-brand-accent text-white font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#EA580C] transition-colors flex items-center gap-2"
              >
                <span>Consult Our Senior Engineers</span>
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

import React from 'react';
import { ArrowRight, Phone } from 'lucide-react';
import { companyInfo } from '../data/companyData';

export default function CTA({ onOpenConsultation }) {
  return (
    <section className="relative py-28 sm:py-36 overflow-hidden bg-[#080808] text-[#F5F5F0] border-b border-[#2A2A2A]">
      {/* Background Architectural Construction Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/slider_photo4.jpg"
          alt="Heavy structural steel girders and hydraulic jacks - TDBD Engineering Works"
          onError={(e) => { e.currentTarget.src = '/images/slider_photo.jpg'; }}
          className="w-full h-full object-cover object-center filter brightness-[0.22] contrast-125"
        />
        <div className="absolute inset-0 bg-[#080808]/85 bg-editorial-grid"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-[#080808]"></div>
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl space-y-8">
          <div className="inline-flex items-center gap-2">
            <span className="w-2 h-2 bg-brand-accent"></span>
            <span className="text-[11px] font-mono uppercase tracking-ultra-wide text-brand-accent font-bold">
              Direct Engagement • No Obligation Initial Assessment
            </span>
          </div>

          <h2 className="font-heading font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[#F5F5F0] uppercase leading-[0.95]">
            Thinking About
            <br />
            Raising Your Property?
          </h2>

          <p className="text-base sm:text-xl text-[#CCCCCC] max-w-2xl font-normal leading-relaxed font-sans">
            Consult our senior civil engineers regarding foundation depth, road-level differential, and non-destructive elevation feasibility. Avoid demolition and protect your capital.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            <button
              onClick={onOpenConsultation}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-brand-accent text-white font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#EA580C] transition-colors"
            >
              <span>Get a Free Consultation</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>

            <a
              href={`tel:${companyInfo.contact.primaryPhone.replace(/\s+/g, '')}`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-[#2A2A2A] bg-[#111111]/80 text-[#F5F5F0] font-mono font-semibold text-xs uppercase tracking-wider hover:bg-[#1E1E1E] hover:border-brand-accent transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-brand-accent" />
              <span>Call: {companyInfo.contact.primaryPhone}</span>
            </a>
          </div>

          <div className="pt-10 border-t border-[#2A2A2A] flex flex-wrap items-center gap-6 text-[11px] font-mono uppercase tracking-wider text-[#A0A0A0]">
            <span>25+ Years Experience</span>
            <span className="text-[#555555]">/</span>
            <span>Zero Demolition Waste</span>
            <span className="text-[#555555]">/</span>
            <span>Registered Under Trade Marks Act 1999</span>
          </div>
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import { X, ArrowRight, Check } from 'lucide-react';

export default function ServiceModal({ service, onClose, onOpenConsultation }) {
  if (!service) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-[#080808]/95 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl bg-[#141414] border border-[#2A2A2A] shadow-2xl overflow-hidden my-auto text-[#F5F5F0]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-[#0A0A0A]">
          <img
            src={service.image}
            alt={service.title}
            onError={(e) => { e.currentTarget.src = '/images/slider_photo.jpg'; }}
            className="w-full h-full object-cover object-center filter brightness-[0.75] contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent"></div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 bg-[#080808]/80 border border-[#2A2A2A] text-[#F5F5F0] hover:bg-brand-accent hover:border-brand-accent transition-colors z-10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-6 left-6 right-6 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-ultra-wide text-brand-accent font-bold">
              Engineering Specification
            </span>
            <h3 className="font-heading font-black text-2xl sm:text-4xl uppercase tracking-tight text-[#F5F5F0]">
              {service.title}
            </h3>
            <p className="text-xs font-mono uppercase tracking-wider text-[#A0A0A0]">
              {service.subtitle}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <h4 className="text-[11px] font-mono font-bold text-[#A0A0A0] uppercase tracking-widest mb-2">
              Engineering Scope &amp; Methodology
            </h4>
            <p className="text-sm text-[#CCCCCC] leading-relaxed font-sans">
              {service.description}
            </p>
          </div>

          {/* Technical Specs Rows */}
          {service.specs && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-y border-[#2A2A2A] py-4 text-xs font-mono">
              <div className="p-3 bg-[#171717] border border-[#2A2A2A]">
                <span className="text-[9px] uppercase text-[#707070] block">Load Capacity</span>
                <span className="text-[#F5F5F0] font-bold">{service.specs.capacity}</span>
              </div>
              <div className="p-3 bg-[#171717] border border-[#2A2A2A]">
                <span className="text-[9px] uppercase text-[#707070] block">Duration</span>
                <span className="text-[#F5F5F0] font-bold">{service.specs.duration}</span>
              </div>
              <div className="p-3 bg-[#171717] border border-[#2A2A2A] col-span-2 sm:col-span-1">
                <span className="text-[9px] uppercase text-[#707070] block">Elevation Range</span>
                <span className="text-[#F5F5F0] font-bold">{service.specs.elevation || "Site Specific"}</span>
              </div>
            </div>
          )}

          {/* Core Engineered Features */}
          {service.features && (
            <div>
              <h4 className="text-[11px] font-mono font-bold text-[#A0A0A0] uppercase tracking-widest mb-3">
                Key Deliverables
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-[#CCCCCC]">
                {service.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Modal Actions */}
          <div className="pt-4 border-t border-[#2A2A2A] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <span className="text-xs font-mono text-[#A0A0A0]">
              Verified by registered civil engineers.
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2.5 border border-[#2A2A2A] text-[#F5F5F0] font-mono text-xs uppercase tracking-wider hover:bg-[#1E1E1E] transition-colors"
              >
                Close
              </button>
              <button
                onClick={onOpenConsultation}
                className="px-5 py-2.5 bg-brand-accent text-white font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#EA580C] transition-colors flex items-center gap-2"
              >
                <span>Request Quotation</span>
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

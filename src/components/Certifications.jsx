import React, { useState } from 'react';
import { certificationsData } from '../data/companyData';
import { X, ArrowUpRight, Check } from 'lucide-react';

export default function Certifications() {
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);

  return (
    <section className="py-24 sm:py-32 bg-[#080808] text-[#F5F5F0] relative border-b border-[#2A2A2A]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pb-16 border-b border-[#2A2A2A]">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-[11px] font-mono uppercase tracking-ultra-wide text-brand-accent font-semibold block">
              Regulatory Compliance / 13
            </span>
            <h2 className="font-heading font-black text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight text-[#F5F5F0] leading-[0.95]">
              Government Certified
              <br />
              Engineering Practice.
            </h2>
          </div>
          <div className="lg:col-span-4 text-sm font-sans text-[#A0A0A0] leading-relaxed">
            Officially registered trademark and corporate entity under the Trade Marks Act 1999 and Ministry of Corporate Affairs, Government of India.
          </div>
        </div>

        {/* Editorial Layout: Certificate Document + Legal Narrative */}
        <div className="py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center border-b border-[#2A2A2A]">
          
          {/* Certificate Frame */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <div 
              onClick={() => setIsCertificateModalOpen(true)}
              className="relative group cursor-pointer border border-[#2A2A2A] hover:border-brand-accent bg-[#141414] p-4 max-w-sm transition-colors"
            >
              <div className="aspect-[3/4] w-full overflow-hidden bg-white flex items-center justify-center">
                <img
                  src={certificationsData.trademarkImage}
                  alt="Government Trade Marks Registry Certificate - TDBD Engineering Works"
                  onError={(e) => { e.currentTarget.src = '/images/certificate_thumb.jpg'; }}
                  className="w-full h-full object-contain filter contrast-105 group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-between text-xs font-mono">
                <span className="text-[#F5F5F0] uppercase font-bold">Trade Marks Registry</span>
                <span className="text-brand-accent flex items-center gap-1 group-hover:underline">
                  <span>Enlarge Document</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            <span className="text-[10px] font-mono uppercase tracking-wider text-[#707070] mt-3 block">
              Government of India Trade Marks Registry • Class 37 Registered
            </span>
          </div>

          {/* Legal Credentials Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-ultra-wide text-brand-accent block font-bold">
                Statutory Authority
              </span>
              <h3 className="font-heading font-bold text-2xl sm:text-3xl uppercase tracking-tight text-[#F5F5F0]">
                {certificationsData.title}
              </h3>
              <p className="text-sm sm:text-base text-[#CCCCCC] leading-relaxed font-sans">
                {certificationsData.registrationText}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <span className="text-[10px] font-mono uppercase tracking-ultra-wide text-[#707070] block">
                Legal Guarantees
              </span>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#CCCCCC]">
                {certificationsData.points.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

      </div>

      {/* Certificate Lightbox Modal */}
      {isCertificateModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#080808]/95 backdrop-blur-md p-4 sm:p-6 animate-fade-in"
          onClick={() => setIsCertificateModalOpen(false)}
        >
          <div 
            className="relative max-w-2xl w-full bg-[#141414] border border-[#2A2A2A] p-6 my-auto text-[#F5F5F0]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#2A2A2A] text-xs font-mono uppercase tracking-wider text-[#A0A0A0]">
              <span>Trade Marks Registry • Government of India</span>
              <button
                onClick={() => setIsCertificateModalOpen(false)}
                className="p-1 text-[#F5F5F0] hover:text-brand-accent"
                aria-label="Close certificate"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-6 max-h-[70vh] overflow-y-auto bg-white p-4">
              <img
                src={certificationsData.trademarkImage}
                alt="Government Trade Marks Registry Certificate"
                className="w-full h-auto object-contain mx-auto"
              />
            </div>

            <div className="text-center text-xs font-mono text-[#A0A0A0]">
              TDBD Engineering Works Private Limited • Formally Certified
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

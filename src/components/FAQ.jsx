import React, { useState, useEffect } from 'react';
import { faqs as initialFaqs } from '../data/companyData';
import { fetchFaqs } from '../services/api';
import { ArrowRight } from 'lucide-react';

export default function FAQ({ onOpenConsultation }) {
  const [faqList, setFaqList] = useState(initialFaqs);
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    let mounted = true;
    fetchFaqs().then(data => {
      if (mounted && data && data.length > 0) {
        setFaqList(data);
      }
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 sm:py-32 bg-[#080808] text-[#F5F5F0] relative border-b border-[#2A2A2A]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pb-16 border-b border-[#2A2A2A]">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-[11px] font-mono uppercase tracking-ultra-wide text-brand-accent font-semibold block">
              Clarifications / 14
            </span>
            <h2 className="font-heading font-black text-4xl sm:text-6xl md:text-7xl text-[#F5F5F0] uppercase tracking-tight leading-[0.95]">
              Frequently Asked
              <br />
              Questions.
            </h2>
          </div>
          <div className="lg:col-span-4 text-sm font-sans text-[#A0A0A0] leading-relaxed">
            Essential engineering facts and realistic guidance on structural lifting feasibility, cost factors, safety measures, and site requirements.
          </div>
        </div>

        {/* Accordion List with Razor-thin Dividers */}
        <div className="max-w-4xl divide-y divide-[#2A2A2A] border-b border-[#2A2A2A] py-8">
          {faqList.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.id || index} className="py-6">
                <button
                  onClick={() => toggle(index)}
                  className="w-full text-left flex items-start justify-between gap-6 group"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-baseline gap-4">
                    <span className="text-xs font-mono font-bold text-[#666666] group-hover:text-brand-accent transition-colors">
                      0{index + 1}
                    </span>
                    <span className="font-heading font-bold text-lg sm:text-xl text-[#F5F5F0] uppercase tracking-tight group-hover:text-white transition-colors">
                      {faq.question}
                    </span>
                  </div>
                  <span className={`text-base font-mono font-bold shrink-0 pt-0.5 transition-colors ${
                    isOpen ? 'text-brand-accent' : 'text-[#888888] group-hover:text-white'
                  }`}>
                    {isOpen ? '—' : '+'}
                  </span>
                </button>

                {isOpen && (
                  <div className="pt-4 pl-8 sm:pl-10 text-sm sm:text-base text-[#A0A0A0] leading-relaxed font-sans animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Help Query */}
        <div className="mt-12 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono uppercase tracking-wider text-[#A0A0A0]">
          <span>Have a specific site query not covered above?</span>
          <button
            onClick={onOpenConsultation}
            className="text-[#F5F5F0] hover:text-brand-accent font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <span>Ask A Senior Lifting Engineer</span>
            <ArrowRight className="w-3.5 h-3.5 text-brand-accent" />
          </button>
        </div>

      </div>
    </section>
  );
}

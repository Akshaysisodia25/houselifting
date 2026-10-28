import React, { useState } from 'react';
import { testimonials } from '../data/companyData';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    setCurrentIndex((prevIdx) => (prevIdx === 0 ? testimonials.length - 1 : prevIdx - 1));
  };

  const next = () => {
    setCurrentIndex((prevIdx) => (prevIdx === testimonials.length - 1 ? 0 : prevIdx + 1));
  };

  const active = testimonials[currentIndex];

  return (
    <section id="testimonials" className="py-24 sm:py-32 bg-[#0B0B0B] text-[#F5F5F0] relative border-b border-[#2A2A2A]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pb-16 border-b border-[#2A2A2A]">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-[11px] font-mono uppercase tracking-ultra-wide text-brand-accent font-semibold block">
              Verified Reputation / 12
            </span>
            <h2 className="font-heading font-black text-4xl sm:text-6xl md:text-7xl text-[#F5F5F0] uppercase tracking-tight leading-[0.95]">
              Client Words
              <br />
              &amp; Experiences.
            </h2>
          </div>
          <div className="lg:col-span-4 text-sm font-sans text-[#A0A0A0] leading-relaxed">
            Real feedback from property owners across Haryana, Punjab, Kerala, and Delhi NCR whose homes were raised and protected without demolition.
          </div>
        </div>

        {/* Editorial Big Quote Showcase */}
        <div className="py-16 sm:py-20 border-b border-[#2A2A2A]">
          <div className="max-w-4xl space-y-8">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-accent">
                Verification Record 0{currentIndex + 1} of 0{testimonials.length}
              </span>
              <span className="text-[#555555]">/</span>
              <span className="text-xs font-mono text-[#A0A0A0] uppercase">
                {active.projectType}
              </span>
            </div>

            <blockquote className="font-heading font-bold text-2xl sm:text-4xl md:text-5xl text-[#F5F5F0] uppercase tracking-tight leading-snug">
              "{active.quote}"
            </blockquote>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-[#2A2A2A] text-xs font-mono uppercase tracking-wider">
              <div className="space-y-0.5">
                <span className="text-[#F5F5F0] font-bold block">{active.author}</span>
                <span className="text-[#A0A0A0] block">Location: {active.location}</span>
              </div>

              {active.outcome && (
                <div className="px-3 py-1.5 bg-[#171717] border border-brand-accent/40 text-brand-accent font-semibold">
                  Result: {active.outcome}
                </div>
              )}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3 pt-12">
            <button
              onClick={prev}
              className="p-3.5 bg-[#141414] border border-[#2A2A2A] text-[#F5F5F0] hover:bg-brand-accent hover:border-brand-accent hover:text-white transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-mono text-[#A0A0A0] px-3">
              0{currentIndex + 1} / 0{testimonials.length}
            </span>
            <button
              onClick={next}
              className="p-3.5 bg-[#141414] border border-[#2A2A2A] text-[#F5F5F0] hover:bg-brand-accent hover:border-brand-accent hover:text-white transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}

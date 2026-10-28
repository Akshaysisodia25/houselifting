import React, { useState } from 'react';
import { Play, X, ArrowUpRight } from 'lucide-react';
import { companyInfo } from '../data/companyData';

export default function VideoSection() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <section className="py-24 sm:py-32 bg-[#080808] text-[#F5F5F0] relative border-b border-[#2A2A2A]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-12 border-b border-[#2A2A2A] gap-6">
          <div className="space-y-4">
            <span className="text-[11px] font-mono uppercase tracking-ultra-wide text-brand-accent font-semibold block">
              Documentary Archive / 11
            </span>
            <h2 className="font-heading font-black text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight text-[#F5F5F0] leading-[0.95]">
              See House Lifting
              <br />
              In Action.
            </h2>
          </div>
          <div className="text-sm font-sans text-[#A0A0A0] max-w-md leading-relaxed">
            Authentic jobsite video documentation of hydraulic jack placement, synchronous pressure manifold control, and laser-guided elevation.
          </div>
        </div>

        {/* Video Hero Frame */}
        <div className="pt-12">
          <div className="relative overflow-hidden border border-[#2A2A2A] bg-[#0E0E0E] aspect-[16/9] sm:aspect-[21/9] max-h-[640px] group">
            <img
              src="/images/slider_photo2.jpg"
              alt="House Lifting Live Demonstration - TDBD Engineering Works"
              onError={(e) => { e.currentTarget.src = '/images/slider_photo.jpg'; }}
              className="w-full h-full object-cover object-center filter brightness-[0.7] contrast-110 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-[#080808]/40"></div>

            {/* Editorial Center Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-brand-accent text-white hover:bg-[#EA580C] hover:scale-105 transition-all group/btn shadow-2xl"
                aria-label="Play video demonstration"
              >
                <Play className="w-8 h-8 ml-1 fill-white text-white" />
              </button>
            </div>

            {/* Bottom Metadata */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-brand-accent block font-bold">
                  Live Execution Footage
                </span>
                <h3 className="font-heading font-black text-xl sm:text-2xl text-[#F5F5F0] uppercase tracking-tight">
                  Multi-Point Hydraulic Raising Demonstration
                </h3>
              </div>

              <a
                href={companyInfo.contact.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#080808]/90 border border-[#2A2A2A] text-xs font-mono uppercase tracking-wider text-[#F5F5F0] hover:text-brand-accent hover:border-brand-accent transition-colors"
              >
                <span>Visit Official YouTube Channel</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-brand-accent" />
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Video Lightbox Modal */}
      {isVideoModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#080808]/95 backdrop-blur-md p-4 sm:p-6 animate-fade-in"
          onClick={() => setIsVideoModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-4xl bg-[#141414] border border-[#2A2A2A] overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-[#2A2A2A] flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#A0A0A0]">
              <span>TDBD Engineering Works • Official Field Archive</span>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="p-1 text-[#F5F5F0] hover:text-brand-accent transition-colors"
                aria-label="Close video"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-[16/9] w-full bg-black">
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/videoseries?list=UUz6r9P7Z9hQ&autoplay=1"
                title="TDBD Engineering House Lifting Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <div className="p-4 bg-[#111111] flex items-center justify-between text-xs font-mono text-[#CCCCCC]">
              <span>Need site-specific engineering footage?</span>
              <a
                href={companyInfo.contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-accent hover:underline font-bold"
              >
                Request Video on WhatsApp →
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

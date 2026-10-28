import React, { useState } from 'react';
import { galleryImages } from '../data/companyData';
import LightboxModal from './LightboxModal';
import { ArrowUpRight } from 'lucide-react';

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState(null);

  const categories = ['All', 'Lifting', 'Commercial', 'Equipment', 'Process', 'Safety', 'Shifting'];

  const filteredImages = selectedCategory === 'All'
    ? galleryImages
    : galleryImages.filter(img => img.category === selectedCategory);

  return (
    <section id="gallery" className="py-24 sm:py-32 bg-[#080808] text-[#F5F5F0] relative border-b border-[#2A2A2A]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between pb-12 border-b border-[#2A2A2A] gap-8">
          <div className="space-y-4">
            <span className="text-[11px] font-mono uppercase tracking-ultra-wide text-brand-accent font-semibold block">
              Field Documentation / 10
            </span>
            <h2 className="font-heading font-black text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight text-[#F5F5F0] leading-[0.95]">
              On-Site Engineering
              <br />
              Gallery.
            </h2>
          </div>

          {/* Minimal Editorial Category Tabs */}
          <div className="flex flex-wrap gap-2 text-xs font-mono uppercase tracking-wider">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 transition-all border ${
                  selectedCategory === cat
                    ? 'bg-brand-accent text-white border-brand-accent font-bold'
                    : 'bg-[#141414] text-[#A0A0A0] hover:text-[#F5F5F0] border-[#2A2A2A] hover:border-[#404040]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Editorial Masonry Grid */}
        <div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[280px] sm:auto-rows-[320px]">
          {filteredImages.map((img, idx) => {
            // Creative editorial aspect pattern
            const isWide = idx === 0 || idx === 5 || idx === 8;
            const isTall = idx === 2 || idx === 7;
            const imageSrc = img.src || img.url || '/images/slider_photo.jpg';
            const imageTitle = img.title || img.caption || 'Structural Lifting Field View';

            return (
              <div
                key={img.id}
                onClick={() => setActiveLightboxIndex(idx)}
                className={`group relative overflow-hidden bg-[#141414] border border-[#2A2A2A] hover:border-brand-accent cursor-pointer transition-all duration-300 ${
                  isWide ? 'sm:col-span-2' : ''
                } ${isTall ? 'sm:row-span-2' : ''}`}
              >
                <img
                  src={imageSrc}
                  alt={imageTitle}
                  onError={(e) => { e.currentTarget.src = '/images/slider_photo.jpg'; }}
                  className="w-full h-full object-cover object-center filter contrast-[1.1] brightness-[0.88] group-hover:scale-105 group-hover:brightness-100 transition-all duration-700 ease-out"
                />
                
                {/* Dark Vignette Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/90 via-[#080808]/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity"></div>

                {/* Top Corner Minimal Label */}
                <div className="absolute top-4 left-4 px-2.5 py-1 bg-[#080808]/85 backdrop-blur-md border border-[#2A2A2A] text-[10px] font-mono uppercase tracking-wider text-[#F5F5F0]">
                  {img.category}
                </div>

                {/* Bottom Content: Slide-Up on Hover */}
                <div className="absolute bottom-0 inset-x-0 p-5 flex items-end justify-between gap-4">
                  <div className="space-y-1 max-w-[85%]">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-brand-accent block">
                      ARCHIVE #{String(img.id).padStart(2, '0')}
                    </span>
                    <h4 className="text-sm sm:text-base font-heading font-bold text-[#F5F5F0] leading-snug group-hover:text-white transition-colors">
                      {imageTitle}
                    </h4>
                  </div>
                  
                  {/* Arrow Indicator */}
                  <div className="p-2.5 bg-brand-accent text-white shrink-0 group-hover:scale-110 group-hover:bg-[#EA580C] transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footnote */}
        <div className="pt-4 border-t border-[#2A2A2A] flex items-center justify-between text-xs font-mono text-[#707070] uppercase">
          <span>{filteredImages.length} Certified Jobsite Photographs Loaded</span>
          <span>Click Any Image For High-Resolution Lightbox</span>
        </div>

      </div>

      {/* Lightbox Modal */}
      {activeLightboxIndex !== null && (
        <LightboxModal
          images={filteredImages}
          currentIndex={activeLightboxIndex}
          onClose={() => setActiveLightboxIndex(null)}
          onNavigate={(newIdx) => setActiveLightboxIndex(newIdx)}
        />
      )}
    </section>
  );
}

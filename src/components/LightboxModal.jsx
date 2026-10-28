import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function LightboxModal({ images, activeIndex, currentIndex, onClose, onNavigate }) {
  const index = activeIndex !== undefined && activeIndex !== null ? activeIndex : currentIndex;
  if (index === null || index === undefined || !images || !images[index]) return null;

  const current = images[index];
  const imageSrc = current.src || current.url || '/images/slider_photo.jpg';
  const imageTitle = current.title || current.caption || 'Structural Lifting Jobsite';

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNavigate((index + 1) % images.length);
      if (e.key === 'ArrowLeft') onNavigate((index - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [index, images.length, onClose, onNavigate]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#080808]/95 backdrop-blur-md p-4 sm:p-6 animate-fade-in"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 p-3 bg-[#171717] border border-[#2A2A2A] text-[#F5F5F0] hover:bg-brand-accent hover:border-brand-accent hover:text-white transition-colors"
        aria-label="Close lightbox"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Prev button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNavigate((index - 1 + images.length) % images.length);
        }}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 p-3 bg-[#171717] border border-[#2A2A2A] text-[#F5F5F0] hover:bg-brand-accent hover:border-brand-accent hover:text-white transition-colors"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Next button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNavigate((index + 1) % images.length);
        }}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 p-3 bg-[#171717] border border-[#2A2A2A] text-[#F5F5F0] hover:bg-brand-accent hover:border-brand-accent hover:text-white transition-colors"
        aria-label="Next image"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Main Image View */}
      <div 
        className="relative max-w-5xl max-h-[85vh] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative max-h-[75vh] overflow-hidden border border-[#2A2A2A] bg-[#111111] shadow-2xl">
          <img
            src={imageSrc}
            alt={imageTitle}
            onError={(e) => { e.currentTarget.src = '/images/slider_photo.jpg'; }}
            className="max-h-[75vh] w-auto max-w-full object-contain filter contrast-[1.05]"
          />
        </div>

        {/* Caption Panel */}
        <div className="mt-4 px-6 py-3 bg-[#141414] border border-[#2A2A2A] text-center max-w-xl">
          <span className="text-[10px] font-mono uppercase tracking-widest text-brand-accent block font-bold">
            {current.category} • {index + 1} of {images.length}
          </span>
          <p className="text-xs sm:text-sm font-heading font-bold text-[#F5F5F0] uppercase tracking-tight mt-1">
            {imageTitle}
          </p>
        </div>
      </div>
    </div>
  );
}

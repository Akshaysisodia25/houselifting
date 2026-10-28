import React, { useState, useRef, useCallback } from 'react';

export default function BeforeAfter({ onOpenConsultation }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let position = (x / rect.width) * 100;
    if (position < 2) position = 2;
    if (position > 98) position = 98;
    setSliderPosition(position);
  }, []);

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <section className="py-24 sm:py-32 bg-[#080808] text-[#F5F5F0] relative border-b border-[#2A2A2A]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Minimal Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-12 border-b border-[#2A2A2A] gap-6">
          <div className="space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-ultra-wide text-brand-accent font-semibold block">
              Physical Transformation / 07
            </span>
            <h2 className="font-heading font-black text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight text-[#F5F5F0] leading-[0.95]">
              From Low Level
              <br />
              To Safe Level.
            </h2>
          </div>
          <div className="text-xs font-mono uppercase tracking-wider text-[#A0A0A0]">
            Drag divider left / right to compare elevation
          </div>
        </div>

        {/* Large Powerful Comparison Slider */}
        <div className="pt-8">
          <div
            ref={containerRef}
            className="relative h-[420px] sm:h-[560px] md:h-[660px] overflow-hidden select-none cursor-ew-resize border border-[#2A2A2A] bg-[#0E0E0E]"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={() => setIsDragging(true)}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
          >
            {/* AFTER Image (Full background) */}
            <img
              src="/images/slider_photo.jpg"
              alt="House lifted safely above street level"
              onError={(e) => { e.currentTarget.src = '/images/slider_photo2.jpg'; }}
              className="absolute inset-0 w-full h-full object-cover object-center filter brightness-105 contrast-110 pointer-events-none"
            />
            <div className="absolute top-6 right-6 px-3.5 py-1.5 bg-[#080808]/90 backdrop-blur-md border border-[#2A2A2A] text-xs font-mono uppercase tracking-wider text-[#F5F5F0]">
              After: Elevated +3.5 Ft Above Road
            </div>

            {/* BEFORE Image (Clipped Left Layer) */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src="/images/house_lifting_12.jpg"
                alt="House sunken below road level before lifting"
                onError={(e) => { e.currentTarget.src = '/images/house_lifting_1.jpg'; }}
                className="absolute inset-0 w-full h-full object-cover object-center filter brightness-75 contrast-95 max-w-none"
                style={{
                  width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100%',
                  height: '100%'
                }}
              />
              <div className="absolute top-6 left-6 px-3.5 py-1.5 bg-[#080808]/90 backdrop-blur-md border border-[#2A2A2A] text-xs font-mono uppercase tracking-wider text-brand-accent">
                Before: Sunken 3.0 Ft Below Street
              </div>
            </div>

            {/* Minimal Laser Divider Line */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white pointer-events-none z-20 shadow-[0_0_15px_rgba(255,255,255,0.8)]"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-[#080808] border border-[#F5F5F0] flex items-center justify-center">
                <span className="text-[10px] font-mono font-bold text-white tracking-tighter">◀ ▶</span>
              </div>
            </div>
          </div>

          {/* Minimal Footnote */}
          <div className="flex flex-col sm:flex-row items-baseline justify-between pt-6 text-[11px] font-mono uppercase tracking-wider text-[#A0A0A0] gap-2">
            <span>Non-destructive hydraulic jacking • Zero slab cracking</span>
            <span>Documented Yamunanagar, Haryana project archive</span>
          </div>
        </div>

      </div>
    </section>
  );
}

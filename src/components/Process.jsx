import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

export default function Process({ onOpenConsultation }) {
  const [activeStep, setActiveStep] = useState(0);

  const processStages = [
    {
      num: '01',
      title: 'Site Survey & Substructure Needling',
      shortTitle: 'SUBSTRUCTURE PREPARATION',
      image: '/images/slider_photo3.jpg',
      desc: 'Excavation around foundation walls and precision needling openings to insert high-tensile structural rolled steel I-beams beneath load-bearing masonry.',
      deliverable: 'Topographical plinth survey, dead-load calculations, and excavated girder pockets.'
    },
    {
      num: '02',
      title: 'Steel Girder Cradle & Jack Placement',
      shortTitle: 'STEEL SUPPORT SYSTEM',
      image: '/images/house_lifting_2.jpg',
      desc: 'Interlocking cross-grid of heavy rolled steel I-beams configured under all primary walls, transferring 100% of the building dead load to the support frame.',
      deliverable: 'Engineered structural cradle seated on calibrated hydraulic cylinder bases.'
    },
    {
      num: '03',
      title: 'Controlled Hydraulic Jack Elevation',
      shortTitle: 'HYDRAULIC LIFTING',
      image: '/images/slider_photo.jpg',
      desc: 'Synchronized multi-cylinder lifting connected through centralized fluid manifolds, advancing the structure 1 to 2 inches per stroke with zero tilt or tension stress.',
      deliverable: 'Continuous millimeter elevation monitored by electronic deflection dial gauges.'
    },
    {
      num: '04',
      title: 'Mechanical Safety Locking & Cribbing',
      shortTitle: 'SAFETY LOCKING',
      image: '/images/house_lifting_3.jpg',
      desc: 'Dense structural hardwood and interlocking steel cribbing blocks advanced beneath the cradle with every single stroke as an absolute physical fail-safe.',
      deliverable: 'Dual physical locking ensuring 100% structural stability at all elevation heights.'
    },
    {
      num: '05',
      title: 'Reinforced Plinth & Foundation Rebuilding',
      shortTitle: 'FINAL FOUNDATION WORK',
      image: '/images/house_lifting_6.jpg',
      desc: 'Casting high-grade reinforced concrete grade beams, masonry infill, and seismic-tied foundation piers to permanently secure the raised building above road level.',
      deliverable: 'Monolithic new substructure tied seamlessly to the raised house plinth.'
    },
    {
      num: '06',
      title: 'De-Jacking, Load Release & Handover',
      shortTitle: 'FINAL CERTIFICATION',
      image: '/images/house_lifting_12.jpg',
      desc: 'Gradual load transfer from jacks onto the permanent foundation, removal of temporary steel girders, reconnection of municipal utilities, and engineering sign-off.',
      deliverable: 'Formal structural completion audit and lifetime elevation handover.'
    }
  ];

  const current = processStages[activeStep];

  return (
    <section id="process" className="py-24 sm:py-32 bg-[#080808] text-[#F5F5F0] relative border-b border-[#2A2A2A]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pb-16 border-b border-[#2A2A2A]">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-[11px] font-mono uppercase tracking-ultra-wide text-brand-accent font-semibold block">
              Methodology / 03
            </span>
            <h2 className="font-heading font-black text-4xl sm:text-6xl md:text-7xl text-[#F5F5F0] uppercase tracking-tight leading-[0.95]">
              How House
              <br />
              Lifting Works.
            </h2>
          </div>
          <div className="lg:col-span-4 text-sm font-sans text-[#A0A0A0] leading-relaxed">
            A systematic engineering sequence ensuring zero unintended load concentration, absolute structural integrity, and calibrated millimeter elevation.
          </div>
        </div>

        {/* Dual Layout: Large Image on Left + Interactive Process Sequence on Right */}
        <div className="py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left: Large Process Photography */}
          <div className="lg:col-span-6 space-y-4 sticky top-28">
            <div className="relative overflow-hidden bg-[#141414] border border-[#2A2A2A] aspect-[4/3] group">
              <img
                src={current.image}
                alt={current.title}
                onError={(e) => { e.currentTarget.src = '/images/slider_photo.jpg'; }}
                className="w-full h-full object-cover object-center filter contrast-[1.1] brightness-90 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent"></div>

              {/* Top Phase Badge */}
              <div className="absolute top-4 left-4 px-3 py-1.5 bg-[#080808]/90 backdrop-blur-md border border-[#2A2A2A] text-xs font-mono uppercase tracking-wider text-[#F5F5F0]">
                Stage {current.num} / 06 • Active View
              </div>

              {/* Bottom Caption */}
              <div className="absolute bottom-4 left-4 right-4 p-4 bg-[#121212]/95 backdrop-blur-md border border-[#2A2A2A] text-xs font-mono text-[#F5F5F0]">
                <span className="text-brand-accent uppercase block text-[10px] font-bold mb-1">
                  On-Site Execution Protocol
                </span>
                {current.desc}
              </div>
            </div>

            <div className="p-4 bg-[#141414] border border-[#2A2A2A] text-xs font-mono text-[#A0A0A0] flex items-center justify-between">
              <span>Verified Deliverable:</span>
              <span className="text-[#F5F5F0] font-semibold">{current.deliverable}</span>
            </div>
          </div>

          {/* Right: Process Sequence List */}
          <div className="lg:col-span-6 divide-y divide-[#2A2A2A] border-y border-[#2A2A2A]">
            {processStages.map((stage, idx) => {
              const isActive = activeStep === idx;
              return (
                <div
                  key={stage.num}
                  onClick={() => setActiveStep(idx)}
                  className={`py-8 cursor-pointer transition-all duration-200 group ${
                    isActive ? 'bg-[#141414]/80 px-6 -mx-6' : 'hover:bg-[#111111] px-2 -mx-2'
                  }`}
                >
                  <div className="flex items-start gap-5">
                    {/* Number */}
                    <span className={`font-heading font-black text-2xl sm:text-3xl transition-colors duration-200 ${
                      isActive ? 'text-brand-accent' : 'text-[#555555] group-hover:text-[#A0A0A0]'
                    }`}>
                      {stage.num}
                    </span>

                    {/* Content */}
                    <div className="space-y-2 flex-grow">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#707070]">
                          {stage.shortTitle}
                        </span>
                        {isActive && (
                          <span className="text-[10px] font-mono uppercase tracking-wider text-brand-accent font-bold">
                            ● In Progress
                          </span>
                        )}
                      </div>

                      <h3 className={`font-heading font-bold text-xl sm:text-2xl uppercase tracking-tight transition-colors ${
                        isActive ? 'text-[#F5F5F0]' : 'text-[#888888] group-hover:text-[#F5F5F0]'
                      }`}>
                        {stage.title}
                      </h3>

                      <p className={`text-xs sm:text-sm leading-relaxed transition-colors font-sans ${
                        isActive ? 'text-[#CCCCCC]' : 'text-[#666666] group-hover:text-[#A0A0A0]'
                      }`}>
                        {stage.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Action Footnote */}
        <div className="mt-12 pt-8 border-t border-[#2A2A2A] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-ultra-wide text-[#707070]">
              Site Evaluation
            </span>
            <div className="font-heading font-bold text-xl uppercase tracking-tight text-[#F5F5F0]">
              Begin Stage 01: On-Site Structural Reconnaissance
            </div>
          </div>
          <button
            onClick={onOpenConsultation}
            className="px-7 py-3.5 bg-brand-accent text-white font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#EA580C] transition-colors flex items-center gap-2 self-start sm:self-auto"
          >
            <span>Book Site Inspection</span>
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </button>
        </div>

      </div>
    </section>
  );
}

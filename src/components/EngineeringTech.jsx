import React from 'react';
import { engineeringFeatures } from '../data/companyData';

export default function EngineeringTech() {
  const stepsCad = [
    { num: '01', title: 'Substructure Excavation & Needling', desc: 'Precision pocket openings cut through plinth masonry to install continuous high-tensile rolled steel needle girders.' },
    { num: '02', title: 'Cross-Grid Load Cradle Assembly', desc: 'Primary and secondary steel I-beams interlocked to form a monolithic load-distribution cradle under all load-bearing walls.' },
    { num: '03', title: 'Synchronized Hydraulic Manifolding', desc: 'High-tonnage hydraulic cylinders interconnected through central pressure manifolds to guarantee uniform fluid displacement.' },
    { num: '04', title: 'Interlocked Cribbing Safety Chocks', desc: 'Hardwood and structural steel cribbing chocks advanced beneath the cradle with every 1-inch stroke as a physical fail-safe.' },
    { num: '05', title: 'Monolithic Reinforced Plinth Infill', desc: 'Upon reaching target elevation, high-strength RCC grade beams and engineered brick piers are cast to permanently seat the building.' }
  ];

  return (
    <section id="technology" className="py-24 sm:py-32 bg-[#0B0B0B] text-[#F5F5F0] relative border-b border-[#2A2A2A]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pb-16 border-b border-[#2A2A2A]">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-[11px] font-mono uppercase tracking-ultra-wide text-brand-accent font-semibold block">
              Technical Architecture / 04
            </span>
            <h2 className="font-heading font-black text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight text-[#F5F5F0] leading-[0.95]">
              Precision Engineering.
              <br />
              Controlled Lifting.
            </h2>
          </div>
          <div className="lg:col-span-4 text-sm font-sans text-[#A0A0A0] leading-relaxed">
            Structural lifting is an exacting civil science. We distribute thousands of tons of structural dead load across calibrated hydraulic networks and heavy rolled steel I-beams, lifting entire buildings with millimeter balance and zero foundation trauma.
          </div>
        </div>

        {/* Large Editorial Composition: Authentic Photography + Technical Cad Sequence */}
        <div className="py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start border-b border-[#2A2A2A]">
          {/* Large Engineering Photography */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative overflow-hidden bg-[#141414] border border-[#2A2A2A] aspect-[4/3] group">
              <img
                src="/images/house_lifting_1.jpg"
                alt="Hydraulic Jack Assemblies Under Elevated Structure"
                onError={(e) => { e.currentTarget.src = '/images/slider_photo.jpg'; }}
                className="w-full h-full object-cover object-center filter contrast-[1.1] brightness-[0.88] group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent"></div>
              
              <div className="absolute bottom-4 left-4 right-4 p-4 bg-[#121212]/95 backdrop-blur-md border border-[#2A2A2A] text-xs font-mono text-[#F5F5F0]">
                <span className="text-brand-accent uppercase block text-[10px] font-bold mb-1">
                  On-Site Technical Execution
                </span>
                Multi-point hydraulic jack assemblies and certified rolled steel I-beam cradle supporting residential structure during active elevation cycle.
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-[11px] font-mono uppercase text-[#A0A0A0] pt-2">
              <div className="p-3 bg-[#111111] border border-[#2A2A2A]">
                <span className="text-[#707070] block text-[9px]">Jack Sync</span>
                <span className="text-[#F5F5F0] font-semibold">Central Manifold</span>
              </div>
              <div className="p-3 bg-[#111111] border border-[#2A2A2A]">
                <span className="text-[#707070] block text-[9px]">Safety Lock</span>
                <span className="text-[#F5F5F0] font-semibold">Dual Cribbing</span>
              </div>
              <div className="p-3 bg-[#111111] border border-[#2A2A2A]">
                <span className="text-[#707070] block text-[9px]">Tolerance</span>
                <span className="text-[#F5F5F0] font-semibold">±1.0 mm Deflection</span>
              </div>
            </div>
          </div>

          {/* 5-Stage Engineering Cad Sequence */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] font-mono uppercase tracking-ultra-wide text-brand-accent block font-semibold">
              Elevation Engineering Sequence
            </span>
            <div className="divide-y divide-[#2A2A2A]">
              {stepsCad.map((step) => (
                <div key={step.num} className="py-5 flex items-start gap-5 group">
                  <span className="font-mono text-xs font-bold text-brand-accent pt-1">
                    {step.num}
                  </span>
                  <div className="space-y-1">
                    <h4 className="font-heading font-bold text-base sm:text-lg text-[#F5F5F0] uppercase tracking-tight group-hover:text-white transition-colors">
                      {step.title}
                    </h4>
                    <p className="text-xs text-[#A0A0A0] leading-relaxed font-sans">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 6 Engineering Highlight Pillars */}
        <div className="pt-16">
          <div className="mb-8">
            <span className="text-[10px] font-mono uppercase tracking-ultra-wide text-[#707070] block">
              Core Technical Standards
            </span>
            <h3 className="font-heading font-black text-2xl sm:text-3xl text-[#F5F5F0] uppercase tracking-tight mt-1">
              Safety-Focused Execution &amp; Specialized Equipment
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {engineeringFeatures.map((feat, idx) => (
              <div 
                key={feat.title}
                className="p-6 bg-[#111111] border border-[#2A2A2A] hover:border-brand-accent transition-colors space-y-3"
              >
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-brand-accent font-bold">SPEC 0{idx + 1}</span>
                  <span className="text-[#707070] uppercase">Verified</span>
                </div>
                <h4 className="font-heading font-bold text-lg text-[#F5F5F0] uppercase tracking-tight">
                  {feat.title}
                </h4>
                <p className="text-xs text-[#A0A0A0] leading-relaxed">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function CostEstimator({ onOpenConsultationWithData }) {
  const [propertyType, setPropertyType] = useState('double-storey');
  const [sqft, setSqft] = useState(1800);
  const [elevationHeight, setElevationHeight] = useState('3.5');
  const [roadDifference, setRoadDifference] = useState('3.0');

  const costPerSqft = {
    'single-storey': 220,
    'double-storey': 320,
    'multi-storey': 440,
    'commercial': 380
  };

  const rebuildCostPerSqft = {
    'single-storey': 1800,
    'double-storey': 2100,
    'multi-storey': 2600,
    'commercial': 2400
  };

  const estimatedLiftingCost = Math.round(sqft * (costPerSqft[propertyType] || 320) * (parseFloat(elevationHeight) / 3));
  const estimatedRebuildCost = Math.round(sqft * (rebuildCostPerSqft[propertyType] || 2100) + (sqft * 180));
  const estimatedSavings = estimatedRebuildCost - estimatedLiftingCost;
  const estimatedDays = Math.round(20 + (sqft / 250) + (parseFloat(elevationHeight) * 3));

  const handleConsultClick = () => {
    if (onOpenConsultationWithData) {
      onOpenConsultationWithData({
        propertyType,
        sqft,
        elevationHeight: `${elevationHeight} Feet`,
        roadDifference: `${roadDifference} Feet Below Road`
      });
    }
  };

  const formatLakhs = (val) => {
    return (val / 100000).toFixed(2);
  };

  return (
    <section id="estimator" className="py-24 sm:py-32 bg-[#0B0B0B] text-[#F5F5F0] relative border-b border-[#2A2A2A]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pb-16 border-b border-[#2A2A2A]">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-[11px] font-mono uppercase tracking-ultra-wide text-brand-accent font-semibold block">
              Feasibility Model / 05
            </span>
            <h2 className="font-heading font-black text-4xl sm:text-6xl md:text-7xl text-[#F5F5F0] uppercase tracking-tight leading-[0.95]">
              Lifting vs. Rebuild
              <br />
              Estimator.
            </h2>
          </div>
          <div className="lg:col-span-4 text-sm font-sans text-[#A0A0A0] leading-relaxed">
            Configure your property parameters to evaluate civil elevation viability, projected completion timeframe, and comparative capital preservation against demolition.
          </div>
        </div>

        {/* Estimator Engine: Dark Architectural Dual Column Layout */}
        <div className="py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Controls Column (Left) */}
          <div className="lg:col-span-6 space-y-8 p-6 sm:p-8 bg-[#111111] border border-[#2A2A2A]">
            <div className="flex items-center justify-between pb-3 border-b border-[#2A2A2A]">
              <span className="text-[11px] font-mono uppercase tracking-ultra-wide text-[#A0A0A0] font-semibold">
                Input Parameters
              </span>
              <span className="text-[10px] font-mono uppercase text-[#707070]">
                Civil Engineering Formulas
              </span>
            </div>

            {/* 01 / Structure Classification */}
            <div className="space-y-3">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#CCCCCC] block">
                01 / Structure Type
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'single-storey', label: 'Single Storey' },
                  { id: 'double-storey', label: 'Double Storey' },
                  { id: 'multi-storey', label: 'Multi-Storey RCC' },
                  { id: 'commercial', label: 'Commercial Hub' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPropertyType(item.id)}
                    className={`py-3 px-4 text-xs font-mono uppercase tracking-wider text-left transition-all border ${
                      propertyType === item.id
                        ? 'bg-brand-accent text-white border-brand-accent font-bold shadow-md'
                        : 'bg-[#171717] text-[#A0A0A0] border-[#2A2A2A] hover:border-[#404040] hover:text-[#F5F5F0]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 02 / Built-up Plinth Area */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-baseline">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#CCCCCC]">
                  02 / Total Plinth Area
                </label>
                <span className="font-mono text-base font-bold text-[#F5F5F0]">
                  {sqft.toLocaleString()} <span className="text-xs font-normal text-[#A0A0A0]">SQ FT</span>
                </span>
              </div>
              <input
                type="range"
                min="600"
                max="6000"
                step="100"
                value={sqft}
                onChange={(e) => setSqft(parseInt(e.target.value))}
                className="editorial-slider"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#707070]">
                <span>600 SQ FT</span>
                <span>3,000 SQ FT</span>
                <span>6,000 SQ FT</span>
              </div>
            </div>

            {/* 03 / Elevation Required */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-baseline">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#CCCCCC]">
                  03 / Target Elevation Height
                </label>
                <span className="font-mono text-base font-bold text-[#F5F5F0]">
                  {elevationHeight} <span className="text-xs font-normal text-[#A0A0A0]">FEET</span>
                </span>
              </div>
              <input
                type="range"
                min="1.5"
                max="7.0"
                step="0.5"
                value={elevationHeight}
                onChange={(e) => setElevationHeight(e.target.value)}
                className="editorial-slider"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#707070]">
                <span>1.5 FT</span>
                <span>3.5 FT (Standard Street)</span>
                <span>7.0 FT (Stilt Conversion)</span>
              </div>
            </div>

            {/* 04 / Road Level Discrepancy */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-baseline">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#CCCCCC]">
                  04 / Depth Below Municipal Street
                </label>
                <span className="font-mono text-base font-bold text-[#F5F5F0]">
                  {roadDifference} <span className="text-xs font-normal text-[#A0A0A0]">FEET</span>
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="5.0"
                step="0.5"
                value={roadDifference}
                onChange={(e) => setRoadDifference(e.target.value)}
                className="editorial-slider"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#707070]">
                <span>0.5 FT</span>
                <span>2.5 FT</span>
                <span>5.0 FT</span>
              </div>
            </div>
          </div>

          {/* Projection Calculation Output (Right) */}
          <div className="lg:col-span-6 bg-[#171717] p-8 sm:p-10 border border-[#2A2A2A] space-y-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#2A2A2A]">
              <span className="text-[10px] font-mono uppercase tracking-ultra-wide text-brand-accent font-semibold">
                Cost Comparison Result
              </span>
              <span className="text-[10px] font-mono uppercase text-[#A0A0A0] bg-[#111111] px-2.5 py-1 border border-[#2A2A2A]">
                Non-Binding Estimate
              </span>
            </div>

            <div className="space-y-6">
              {/* Estimated Lifting Cost */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#A0A0A0] block mb-1">
                  Estimated TDBD Hydraulic Lifting Cost
                </span>
                <div className="font-heading font-black text-4xl sm:text-5xl text-[#F5F5F0] tracking-tight">
                  ₹{formatLakhs(estimatedLiftingCost)} Lakhs
                </div>
                <span className="text-xs text-[#A0A0A0] font-mono mt-1.5 block">
                  Includes excavation, rolled steel girder lattice, hydraulic jacks &amp; masonry underpinning
                </span>
              </div>

              {/* Demolition & Rebuild Cost */}
              <div className="pt-4 border-t border-[#2A2A2A]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#707070] block mb-1">
                  Conventional Demolition + Cartage + Reconstruction
                </span>
                <div className="font-heading font-bold text-2xl text-[#666666] tracking-tight line-through">
                  ₹{formatLakhs(estimatedRebuildCost)} Lakhs
                </div>
              </div>

              {/* Capital Saved Highlight */}
              <div className="p-4 sm:p-5 bg-[#121212] border border-brand-accent/50 text-xs font-mono space-y-1">
                <span className="text-[10px] uppercase text-brand-accent font-bold block">
                  Projected Capital Preservation
                </span>
                <div className="text-xl sm:text-2xl font-black text-[#F5F5F0] font-heading">
                  Save ₹{formatLakhs(estimatedSavings)} Lakhs (~75% Savings)
                </div>
              </div>

              {/* Execution Duration */}
              <div className="grid grid-cols-2 gap-4 text-xs font-mono border-t border-[#2A2A2A] pt-4">
                <div>
                  <span className="text-[#707070] block text-[9px] uppercase">Lifting Timeline</span>
                  <span className="text-[#F5F5F0] font-bold text-sm">~{estimatedDays} Working Days</span>
                </div>
                <div>
                  <span className="text-[#707070] block text-[9px] uppercase">Demolition Timeline</span>
                  <span className="text-[#888888] font-bold text-sm">12 – 18 Months</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <button
                  onClick={handleConsultClick}
                  className="w-full py-4 bg-brand-accent text-white font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#EA580C] transition-colors flex items-center justify-center gap-2"
                >
                  <span>Request Feasibility Study for this Property</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>

              <p className="text-[10px] font-mono text-[#707070] text-center">
                * Indicative civil estimate based on average site soil and standard structural loads.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

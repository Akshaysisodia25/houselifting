import React, { useState } from 'react';
import { problems, comparisonData } from '../data/companyData';
import { ArrowRight, Check } from 'lucide-react';

export default function Problem({ onOpenConsultation }) {
  const [showMatrix, setShowMatrix] = useState(false);

  return (
    <section className="py-24 sm:py-32 bg-[#0B0B0B] text-[#F5F5F0] relative border-b border-[#2A2A2A]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pb-16 border-b border-[#2A2A2A]">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-[11px] font-mono uppercase tracking-ultra-wide text-brand-accent font-semibold block">
              Structural Diagnosis / 01
            </span>
            <h2 className="font-heading font-black text-4xl sm:text-5xl md:text-6xl text-[#F5F5F0] uppercase tracking-tight leading-[0.98]">
              When Rebuilding Isn't
              <br />
              The Only Solution.
            </h2>
          </div>
          <div className="lg:col-span-4 text-sm font-sans text-[#A0A0A0] leading-relaxed">
            Repeated civic road resurfacing raises municipal street levels by 2 to 5 feet over decades, converting previously elevated homes into sunken catchments. Demolishing and rebuilding is rarely necessary when certified hydraulic lifting can elevate the entire structure safely.
          </div>
        </div>

        {/* 6 Editorial Structural Problem Rows */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 lg:divide-x divide-[#2A2A2A] border-b border-[#2A2A2A]">
          {problems.map((prob, idx) => (
            <div 
              key={prob.id}
              className="py-10 px-0 md:px-8 first:pl-0 last:pr-0 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-mono font-bold text-[#A0A0A0] group-hover:text-brand-accent transition-colors">
                    0{idx + 1}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#707070]">
                    Structural Factor
                  </span>
                </div>
                <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#F5F5F0] uppercase tracking-tight">
                  {prob.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#A0A0A0] leading-relaxed">
                  {prob.desc}
                </p>
              </div>

              <div className="pt-8">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#707070] flex items-center gap-1 group-hover:text-[#F5F5F0] transition-colors">
                  <span>Engineered solution available</span>
                  <span>→</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Editorial Decision Specification Sheet: Demolition vs House Lifting */}
        <div className="mt-16 pt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-ultra-wide text-[#707070] block">
                Comparative Engineering Analysis
              </span>
              <h3 className="font-heading font-black text-2xl sm:text-3xl text-[#F5F5F0] uppercase tracking-tight mt-1">
                Demolition &amp; Rebuilding vs. Hydraulic Lifting
              </h3>
            </div>
            <button
              onClick={() => setShowMatrix(!showMatrix)}
              className="self-start sm:self-auto px-5 py-2.5 bg-[#171717] border border-[#2A2A2A] text-xs font-mono font-bold uppercase tracking-wider text-[#F5F5F0] hover:border-brand-accent hover:text-white transition-colors"
            >
              {showMatrix ? 'Collapse Full Matrix —' : 'View Full Decision Matrix +'}
            </button>
          </div>

          {/* High-Contrast Dark Editorial Table */}
          <div className="overflow-x-auto border border-[#2A2A2A] bg-[#111111]">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#2A2A2A] text-[11px] font-mono uppercase tracking-wider text-[#A0A0A0] bg-[#141414]">
                  <th className="py-3.5 px-5 font-semibold text-[#F5F5F0]">Metric Parameter</th>
                  <th className="py-3.5 px-5 font-normal text-[#888888]">Conventional Demolition &amp; Rebuild</th>
                  <th className="py-3.5 px-5 font-bold text-brand-accent bg-[#171717]">TDBD Hydraulic House Lifting</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2A2A]">
                {comparisonData.slice(0, showMatrix ? comparisonData.length : 3).map((row, i) => (
                  <tr key={i} className="hover:bg-[#171717] transition-colors">
                    <td className="py-4 px-5 font-semibold text-[#F5F5F0] font-heading uppercase tracking-wide">
                      {row.parameter}
                    </td>
                    <td className="py-4 px-5 text-[#888888]">
                      {row.demolition}
                    </td>
                    <td className="py-4 px-5 font-medium text-[#F5F5F0] bg-[#171717]/60">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-brand-accent">
                        <Check className="w-4 h-4 stroke-[2.5]" />
                        {row.lifting}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Consultation CTA Banner */}
          <div className="mt-12 p-8 sm:p-10 bg-[#141414] border border-[#2A2A2A] text-[#F5F5F0] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-ultra-wide text-brand-accent font-semibold block">
                Site Feasibility Evaluation
              </span>
              <h4 className="font-heading font-black text-xl sm:text-2xl uppercase tracking-tight text-[#F5F5F0]">
                Not sure if your property can be lifted?
              </h4>
              <p className="text-xs text-[#A0A0A0] max-w-xl font-sans">
                We inspect your foundation type, soil stratification, and road height discrepancy before drafting any contract.
              </p>
            </div>
            <button
              onClick={onOpenConsultation}
              className="px-6 py-3.5 bg-brand-accent text-white font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#EA580C] transition-colors shrink-0 flex items-center gap-2"
            >
              <span>Schedule Inspection</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}

import React from 'react';
import { X, ArrowRight, Check } from 'lucide-react';

export default function ProjectModal({ project, onClose, onOpenConsultation }) {
  if (!project) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-[#080808]/95 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-[#141414] border border-[#2A2A2A] shadow-2xl overflow-hidden my-auto text-[#F5F5F0]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Image Banner */}
        <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-[#0A0A0A]">
          <img
            src={project.image}
            alt={project.title}
            onError={(e) => { e.currentTarget.src = '/images/slider_photo.jpg'; }}
            className="w-full h-full object-cover object-center filter brightness-95 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/30 to-transparent"></div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 bg-[#080808]/80 border border-[#2A2A2A] text-[#F5F5F0] hover:bg-brand-accent hover:border-brand-accent transition-colors z-10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title and Specs on Image */}
          <div className="absolute bottom-6 left-6 right-6 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-ultra-wide text-brand-accent font-bold">
                Case Study / {project.category}
              </span>
              <span className="text-[#555555]">•</span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#F5F5F0] bg-[#080808]/85 px-2 py-0.5 border border-[#2A2A2A]">
                {project.liftHeight}
              </span>
            </div>
            <h3 className="font-heading font-black text-2xl sm:text-4xl text-[#F5F5F0] uppercase tracking-tight">
              {project.title}
            </h3>
            <div className="text-xs font-mono uppercase tracking-wider text-[#A0A0A0]">
              Location: {project.location}
            </div>
          </div>
        </div>

        {/* Modal Details Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Engineering Specifications Grid */}
          {project.specs && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-y border-[#2A2A2A] py-4 text-xs font-mono">
              <div className="p-3 bg-[#171717] border border-[#2A2A2A]">
                <span className="text-[9px] font-mono uppercase text-[#707070] block">Structural Load</span>
                <span className="font-bold text-[#F5F5F0] text-xs mt-0.5 block">{project.specs.load}</span>
              </div>
              <div className="p-3 bg-[#171717] border border-[#2A2A2A]">
                <span className="text-[9px] font-mono uppercase text-[#707070] block">Equipment Deployed</span>
                <span className="font-bold text-[#F5F5F0] text-xs mt-0.5 block">{project.specs.jacks}</span>
              </div>
              <div className="p-3 bg-[#171717] border border-[#2A2A2A]">
                <span className="text-[9px] font-mono uppercase text-[#707070] block">Execution Timeline</span>
                <span className="font-bold text-[#F5F5F0] text-xs mt-0.5 block">{project.specs.duration}</span>
              </div>
              <div className="p-3 bg-[#171717] border border-[#2A2A2A]">
                <span className="text-[9px] font-mono uppercase text-[#707070] block">Outcome Achieved</span>
                <span className="font-bold text-brand-accent text-xs mt-0.5 block">{project.specs.result}</span>
              </div>
            </div>
          )}

          {/* Problem vs Solution Editorial Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2 p-4 bg-[#111111] border border-[#2A2A2A]">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#A0A0A0] block font-bold">
                Pre-Lift Condition
              </span>
              <p className="text-xs sm:text-sm text-[#CCCCCC] leading-relaxed font-sans">
                {project.problem}
              </p>
            </div>

            <div className="space-y-2 p-4 bg-[#111111] border border-[#2A2A2A]">
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand-accent block font-bold">
                Engineered Solution
              </span>
              <p className="text-xs sm:text-sm text-[#CCCCCC] leading-relaxed font-sans">
                {project.solution}
              </p>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-[#2A2A2A] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <span className="text-xs font-mono text-[#A0A0A0]">
              Verified jobsite record • TDBD Engineering Works
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2.5 border border-[#2A2A2A] text-[#F5F5F0] font-mono text-xs uppercase tracking-wider hover:bg-[#1E1E1E] transition-colors"
              >
                Close
              </button>
              <button
                onClick={onOpenConsultation}
                className="px-5 py-2.5 bg-brand-accent text-white font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#EA580C] transition-colors flex items-center gap-2"
              >
                <span>Request Case Evaluation</span>
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

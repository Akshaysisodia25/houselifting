import React, { useState, useEffect } from 'react';
import { services as initialServices } from '../data/companyData';
import { fetchServices } from '../services/api';
import ServiceModal from './ServiceModal';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

export default function Services({ onOpenConsultation }) {
  const [serviceList, setServiceList] = useState(initialServices);
  const [activeModalService, setActiveModalService] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetchServices().then(data => {
      if (mounted && data && data.length > 0) {
        setServiceList(data);
      }
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  return (
    <section id="services" className="py-24 sm:py-32 bg-[#080808] text-[#F5F5F0] relative border-b border-[#2A2A2A]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-16 border-b border-[#2A2A2A] gap-6">
          <div className="space-y-4">
            <span className="text-[11px] font-mono uppercase tracking-ultra-wide text-brand-accent font-semibold block">
              Core Capabilities / 02
            </span>
            <h2 className="font-heading font-black text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight text-[#F5F5F0] leading-[0.95]">
              Engineering
              <br />
              Solutions.
            </h2>
          </div>
          <div className="text-sm font-sans text-[#A0A0A0] max-w-md leading-relaxed">
            Non-destructive hydraulic structural lifting, shifting, and level adjustment engineered for residential, commercial, and multi-storey structures across India.
          </div>
        </div>

        {/* Large Editorial Alternating Service Rows */}
        <div className="divide-y divide-[#2A2A2A]">
          {serviceList.map((service, idx) => {
            const isEven = idx % 2 === 1;
            return (
              <div 
                key={service.id}
                className="py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center group"
              >
                {/* Image Column */}
                <div className={`lg:col-span-7 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div 
                    onClick={() => setActiveModalService(service)}
                    className="relative overflow-hidden cursor-pointer bg-[#141414] border border-[#2A2A2A] group-hover:border-brand-accent transition-colors aspect-[16/10] sm:aspect-[16/9]"
                  >
                    <img
                      src={service.image || service.imageUrl || '/images/slider_photo.jpg'}
                      alt={service.title}
                      onError={(e) => {
                        if (!e.currentTarget.src.endsWith('/images/slider_photo.jpg')) {
                          e.currentTarget.src = '/images/slider_photo.jpg';
                        }
                      }}
                      className="w-full h-full object-cover object-center filter contrast-[1.1] brightness-[0.88] group-hover:scale-105 group-hover:brightness-100 transition-all duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/80 via-transparent to-transparent"></div>

                    {/* Corner Tag */}
                    <div className="absolute top-4 left-4 px-3 py-1 bg-[#080808]/85 backdrop-blur-md text-[10px] font-mono uppercase tracking-wider text-[#F5F5F0] border border-[#2A2A2A]">
                      Phase Capacity: {service.specs?.capacity || 'High Tonnage Hydraulic'}
                    </div>

                    <div className="absolute bottom-4 right-4 p-3 bg-brand-accent text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Content Column */}
                <div className={`lg:col-span-5 space-y-6 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="space-y-2">
                    <span className="text-xs font-mono font-bold text-brand-accent tracking-widest uppercase">
                      0{idx + 1} — Service Program
                    </span>
                    <h3 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-[#F5F5F0] leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-xs font-mono uppercase tracking-wider text-[#A0A0A0]">
                      {service.subtitle}
                    </p>
                  </div>

                  <p className="text-sm sm:text-base text-[#CCCCCC] leading-relaxed font-sans">
                    {service.description}
                  </p>

                  {/* Specification Snapshot */}
                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#2A2A2A] text-[11px] font-mono uppercase">
                    <div>
                      <span className="text-[#707070] block text-[9px]">Typical Elevation</span>
                      <span className="text-[#F5F5F0] font-semibold">{service.specs?.elevation || '1.0 to 6.0+ Ft'}</span>
                    </div>
                    <div>
                      <span className="text-[#707070] block text-[9px]">Duration Range</span>
                      <span className="text-[#F5F5F0] font-semibold">{service.specs?.duration || '25 - 45 Days'}</span>
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="pt-2 flex items-center gap-4">
                    <button
                      onClick={() => setActiveModalService(service)}
                      className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#F5F5F0] hover:text-brand-accent transition-colors group-hover:translate-x-1 duration-200"
                    >
                      <span>Explore Technical Dossier</span>
                      <ArrowRight className="w-4 h-4 text-brand-accent" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Technical Dossier Modal */}
      {activeModalService && (
        <ServiceModal
          service={activeModalService}
          onClose={() => setActiveModalService(null)}
          onOpenConsultation={() => {
            setActiveModalService(null);
            onOpenConsultation();
          }}
        />
      )}
    </section>
  );
}

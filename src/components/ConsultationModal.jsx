import React, { useState, useEffect } from 'react';
import { X, Check, ArrowRight, Loader2 } from 'lucide-react';
import { companyInfo } from '../data/companyData';
import { submitEnquiry } from '../services/api';

export default function ConsultationModal({ isOpen, onClose, initialData }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    serviceType: initialData?.propertyType || 'House Lifting',
    message: initialData 
      ? `Estimated Parameters: ${initialData.propertyType}, ${initialData.sqft} sq ft, ${initialData.elevationHeight} elevation, ${initialData.roadDifference}.`
      : ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        serviceType: initialData.propertyType || 'House Lifting',
        message: `Estimated Parameters: ${initialData.propertyType}, ${initialData.sqft} sq ft, ${initialData.elevationHeight} elevation, ${initialData.roadDifference}.`
      }));
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.location.trim()) {
      return;
    }
    setSubmitting(true);
    try {
      await submitEnquiry({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        city: formData.location,
        service: formData.serviceType,
        message: formData.message
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Submission error:', err);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#080808]/95 backdrop-blur-md p-4 sm:p-6 animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-[#141414] border border-[#2A2A2A] p-6 sm:p-8 shadow-2xl my-auto text-[#F5F5F0]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 bg-[#080808] border border-[#2A2A2A] text-[#F5F5F0] hover:bg-brand-accent hover:border-brand-accent transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 flex items-start gap-4">
          <div className="w-10 h-10 border border-[#2A2A2A] p-1 flex items-center justify-center shrink-0 bg-[#080808]">
            <img 
              src="/images/tdbd_logo.png" 
              alt="TDBD Engineering Logo" 
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
              className="w-full h-full object-contain filter drop-shadow" 
            />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-ultra-wide text-brand-accent font-bold block">
              Free Site Evaluation
            </span>
            <h3 className="font-heading font-black text-xl sm:text-2xl uppercase tracking-tight text-[#F5F5F0] mt-1">
              Schedule Feasibility Study
            </h3>
            <p className="text-xs text-[#A0A0A0] mt-0.5">
              Direct connection with TDBD senior structural lifting engineers.
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="p-6 bg-[#171717] border border-[#2A2A2A] text-center space-y-4">
            <div className="w-12 h-12 bg-[#1F1F1F] text-brand-accent border border-[#2A2A2A] flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h4 className="font-heading font-bold text-lg uppercase tracking-tight text-[#F5F5F0]">
              Consultation Request Received
            </h4>
            <p className="text-xs text-[#CCCCCC] font-sans leading-relaxed">
              Our engineering office will review your specifications and contact you at <strong>{formData.phone}</strong> today.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-brand-accent text-white font-mono text-xs uppercase font-bold tracking-wider hover:bg-[#EA580C] transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-wider text-[#A0A0A0]">
                Your Name *
              </label>
              <input
                type="text"
                required
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#0B0B0B] border border-[#2A2A2A] text-[#F5F5F0] placeholder-[#666666] text-xs sm:text-sm focus:border-brand-accent focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-[#A0A0A0]">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#0B0B0B] border border-[#2A2A2A] text-[#F5F5F0] placeholder-[#666666] text-xs sm:text-sm font-mono focus:border-brand-accent focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-[#A0A0A0]">
                  Property City / State *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Yamunanagar, Haryana"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#0B0B0B] border border-[#2A2A2A] text-[#F5F5F0] placeholder-[#666666] text-xs sm:text-sm focus:border-brand-accent focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-wider text-[#A0A0A0]">
                Service Type
              </label>
              <select
                value={formData.serviceType}
                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#0B0B0B] border border-[#2A2A2A] text-[#F5F5F0] text-xs sm:text-sm font-mono uppercase focus:border-brand-accent focus:outline-none"
              >
                <option value="House Lifting">House Lifting (Residential)</option>
                <option value="Building Lifting">Building Lifting (Multi-Storey)</option>
                <option value="House Shifting">House Shifting (Relocation)</option>
                <option value="Commercial Lifting">Commercial Building Lifting</option>
                <option value="Level Correction">Level Correction</option>
                <option value="Stilt Parking">Stilt Parking Creation</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-wider text-[#A0A0A0]">
                Notes / Dimensions / Road Depth
              </label>
              <textarea
                rows="3"
                placeholder="Mention depth below street, building dimensions, or existing cracks..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#0B0B0B] border border-[#2A2A2A] text-[#F5F5F0] placeholder-[#666666] text-xs sm:text-sm focus:border-brand-accent focus:outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-brand-accent text-white font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#EA580C] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Transmitting...</span>
                </>
              ) : (
                <>
                  <span>Submit Consultation Request</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <a
                href={`tel:${companyInfo.contact.primaryPhone.replace(/\s+/g, '')}`}
                className="text-[11px] font-mono text-[#A0A0A0] hover:text-[#F5F5F0]"
              >
                Or call directly: <span className="text-[#F5F5F0] font-bold">{companyInfo.contact.primaryPhone}</span>
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

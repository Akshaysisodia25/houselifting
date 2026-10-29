import React, { useState, useEffect } from 'react';
import { projects as initialProjects } from '../data/companyData';
import { fetchProjects } from '../services/api';
import ProjectModal from './ProjectModal';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

export default function Projects({ onOpenConsultation }) {
  const [projectList, setProjectList] = useState(initialProjects);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetchProjects().then(data => {
      if (mounted && data && data.length > 0) {
        setProjectList(data);
      }
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  const filterCategories = ['All', 'House Lifting', 'Building Lifting', 'House Shifting', 'Commercial'];

  const filteredProjects = activeFilter === 'All' 
    ? projectList 
    : projectList.filter(p => p.category === activeFilter);

  return (
    <section id="projects" className="py-24 sm:py-32 bg-[#080808] text-[#F5F5F0] relative border-b border-[#2A2A2A]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between pb-12 border-b border-[#2A2A2A] gap-8">
          <div className="space-y-4">
            <span className="text-[11px] font-mono uppercase tracking-ultra-wide text-brand-accent font-semibold block">
              Case Archive / 06
            </span>
            <h2 className="font-heading font-black text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight text-[#F5F5F0] leading-[0.95]">
              Projects That Speak
              <br />
              For Themselves.
            </h2>
          </div>

          {/* Minimal Editorial Category Filter Tabs */}
          <div className="flex flex-wrap gap-2 text-xs font-mono uppercase tracking-wider">
            {filterCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 transition-all border ${
                  activeFilter === cat
                    ? 'bg-brand-accent text-white border-brand-accent font-bold'
                    : 'bg-[#141414] text-[#A0A0A0] hover:text-[#F5F5F0] border-[#2A2A2A] hover:border-[#404040]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Editorial Project Grid: Large Images Dominate */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {filteredProjects.map((project, idx) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="group cursor-pointer flex flex-col space-y-4"
            >
              {/* Dominant Image Container */}
              <div className="relative overflow-hidden bg-[#141414] border border-[#2A2A2A] group-hover:border-brand-accent transition-colors aspect-[16/11]">
                <img
                  src={project.image}
                  alt={project.title}
                  onError={(e) => { e.currentTarget.src = '/images/slider_photo.jpg'; }}
                  className="w-full h-full object-cover object-center filter contrast-[1.1] brightness-[0.88] group-hover:scale-105 group-hover:brightness-100 transition-all duration-700 ease-out"
                />
                
                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/90 via-[#080808]/20 to-transparent opacity-75 group-hover:opacity-90 transition-opacity"></div>

                {/* Top Corner Badge */}
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#080808]/85 backdrop-blur-md text-[10px] font-mono uppercase tracking-wider text-[#F5F5F0] border border-[#2A2A2A]">
                  {project.liftHeight}
                </div>

                <div className="absolute bottom-3 right-3 p-2 bg-brand-accent text-white border border-[#2A2A2A] opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              {/* Minimal Editorial Captions */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#A0A0A0] uppercase tracking-wider">
                  <span>PROJECT 0{idx + 1} / {project.category}</span>
                  <span className="text-brand-accent font-medium">{project.location}</span>
                </div>
                <h3 className="font-heading font-bold text-lg sm:text-xl text-[#F5F5F0] uppercase tracking-tight group-hover:text-white transition-colors">
                  {project.title}
                </h3>
                <div className="pt-1 flex items-center gap-1 text-xs font-mono font-bold uppercase tracking-wider text-[#A0A0A0] group-hover:text-brand-accent transition-colors">
                  <span>View Project Case Study</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Project Case Study Lightbox Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onOpenConsultation={() => {
            setSelectedProject(null);
            onOpenConsultation();
          }}
        />
      )}
    </section>
  );
}

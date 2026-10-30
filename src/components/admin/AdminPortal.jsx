import React, { useState, useEffect } from 'react';
import {
  X, Lock, ShieldCheck, Mail, Key, LogOut, CheckCircle2, AlertCircle,
  Phone, MapPin, Calendar, Clock, Layers, FolderKanban, Image as ImageIcon,
  MessageSquare, HelpCircle, Inbox, Plus, Trash2, Edit3, ExternalLink, RefreshCw
} from 'lucide-react';
import api from '../../services/api';

export default function AdminPortal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [adminUser, setAdminUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState('enquiries'); // 'enquiries', 'projects', 'services', 'gallery', 'testimonials', 'faqs', 'system'

  // Auth state
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Data states
  const [loading, setLoading] = useState(false);
  const [enquiries, setEnquiries] = useState([]);
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState('ALL');
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [systemHealth, setSystemHealth] = useState(null);

  // Form modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [addFormType, setAddFormType] = useState('project'); // 'project', 'service', 'gallery', 'testimonial', 'faq'
  const [newItem, setNewItem] = useState({});

  // Verify authentication session on mount / modal open
  useEffect(() => {
    // Check for OAuth callback parameters in URL
    const params = new URLSearchParams(window.location.search);
    const authStatus = params.get('auth');
    const authErrorParam = params.get('error');
    const isExplicitAdminRoute = window.location.hash === '#admin';
    const hasOAuthParams = Boolean(authStatus || authErrorParam);
    const hasAdminCookie = typeof document !== 'undefined' && document.cookie.includes('tdbd_has_session=1');

    // Optimization: Do NOT trigger /api/auth/me requests for normal public visitors browsing the website!
    if (!isOpen && !isExplicitAdminRoute && !hasOAuthParams && !hasAdminCookie) {
      setCheckingAuth(false);
      return;
    }

    if (authErrorParam) {
      if (authErrorParam === 'unauthorized_email' || authErrorParam === 'access_denied') {
        setAuthError('Access Denied: Your Google account is not on the authorized administrator allowlist. Access to the Engineering Operations Portal is restricted.');
      } else if (authErrorParam === 'invalid_state') {
        setAuthError('Authentication security verification failed (invalid OAuth state). Please try again.');
      } else if (authErrorParam === 'missing_code_verifier') {
        setAuthError('OAuth session expired. Please attempt Google Sign-In again.');
      } else if (authErrorParam === 'server_configuration_error') {
        setAuthError('Server Configuration Error: JWT_SECRET environment variable is not configured in Vercel. Please add JWT_SECRET to your Vercel Project Environment Variables.');
      } else {
        setAuthError(`Authentication error: ${decodeURIComponent(authErrorParam)}`);
      }

      // CRITICAL: Explicitly clear any existing admin session state
      setAdminUser(null);
      setCheckingAuth(false);

      const cleanUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, document.title, cleanUrl);
      return; // STOP EXECUTION: Do not query admin profile when OAuth explicitly failed
    } else if (authStatus === 'success') {
      const cleanUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, document.title, cleanUrl);
    }

    setCheckingAuth(true);
    api.getAdminProfile()
      .then(res => {
        if (res?.data) {
          setAdminUser(res.data);
          loadAllData();
        } else {
          setAdminUser(null);
        }
      })
      .catch((err) => {
        setAdminUser(null);
        if (err.status === 403) {
          setAuthError('Access Denied: Your Google account is not on the authorized engineering administrator allowlist.');
        }
      })
      .finally(() => {
        setCheckingAuth(false);
      });
  }, [isOpen]);

  const loadEnquiries = async (showError = false) => {
    try {
      const enqRes = await api.fetchAdminEnquiries();
      if (enqRes && Array.isArray(enqRes.data)) {
        setEnquiries(enqRes.data);
      }
    } catch (err) {
      console.error('Failed to load enquiries from PostgreSQL:', err);
      if (showError) {
        alert(`Failed to load enquiries from PostgreSQL database: ${err.message}`);
      }
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [, projData, servData, gallData, testData, faqData] = await Promise.all([
        loadEnquiries(true),
        api.fetchProjects().catch(() => []),
        api.fetchServices().catch(() => []),
        api.fetchGallery().catch(() => []),
        api.fetchAllTestimonialsAdmin().catch(() => ({ data: [] })),
        api.fetchAllFaqsAdmin().catch(() => ({ data: [] }))
      ]);

      setProjects(Array.isArray(projData) ? projData : []);
      setServices(Array.isArray(servData) ? servData : []);
      setGallery(Array.isArray(gallData) ? gallData : []);
      setTestimonials(testData?.data || (Array.isArray(testData) ? testData : []));
      setFaqs(faqData?.data || (Array.isArray(faqData) ? faqData : []));

      // Fetch health check via centralized API client (same-origin /api/health in production)
      api.checkHealth()
        .then(d => setSystemHealth(d))
        .catch(() => setSystemHealth({ success: true, message: 'API Fallback Mode' }));
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Keep Admin Portal synchronized in real-time with PostgreSQL
  useEffect(() => {
    if (!isOpen || !adminUser) return;

    const handleEnquirySubmitted = () => {
      loadEnquiries(false);
    };

    const handleStorage = (e) => {
      if (e.key === 'tdbd_last_enquiry_time') {
        loadEnquiries(false);
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        loadEnquiries(false);
      }
    };

    // Auto-sync polling every 15 seconds to fetch new submissions from PostgreSQL
    const intervalId = setInterval(() => {
      loadEnquiries(false);
    }, 15000);

    window.addEventListener('tdbd_enquiry_submitted', handleEnquirySubmitted);
    window.addEventListener('storage', handleStorage);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('tdbd_enquiry_submitted', handleEnquirySubmitted);
      window.removeEventListener('storage', handleStorage);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [isOpen, adminUser]);

  const handleGoogleSignIn = () => {
    setAuthLoading(true);
    setAuthError('');
    api.loginWithGoogle();
  };

  const handleLogout = async () => {
    await api.logoutAdmin();
    setAdminUser(null);
    setAuthError('');
  };

  const handleStatusChange = async (enquiryId, newStatus) => {
    try {
      await api.updateEnquiryStatus(enquiryId, newStatus);
      setEnquiries(prev => prev.map(e => e.id === enquiryId ? { ...e, status: newStatus } : e));
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  const handleDeleteEnquiry = async (enquiryId) => {
    if (!window.confirm('Are you sure you want to delete this enquiry record?')) return;
    try {
      await api.deleteEnquiry(enquiryId);
      setEnquiries(prev => prev.filter(e => e.id !== enquiryId));
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleCreateItem = async (e) => {
    e.preventDefault();
    try {
      if (addFormType === 'project') {
        const res = await api.createProject(newItem);
        setProjects(prev => [res.data || newItem, ...prev]);
      } else if (addFormType === 'service') {
        const res = await api.createService(newItem);
        setServices(prev => [res.data || newItem, ...prev]);
      } else if (addFormType === 'gallery') {
        const res = await api.createGalleryImage(newItem);
        setGallery(prev => [res.data || newItem, ...prev]);
      } else if (addFormType === 'testimonial') {
        const res = await api.createTestimonial(newItem);
        setTestimonials(prev => [res.data || newItem, ...prev]);
      } else if (addFormType === 'faq') {
        const res = await api.createFaq(newItem);
        setFaqs(prev => [res.data || newItem, ...prev]);
      }
      setShowAddModal(false);
      setNewItem({});
      alert('Saved successfully!');
    } catch (err) {
      alert(`Creation failed: ${err.message}`);
    }
  };

  const filteredEnquiries = enquiryStatusFilter === 'ALL'
    ? enquiries
    : enquiries.filter(e => e.status === enquiryStatusFilter);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#080808]/95 backdrop-blur-md p-2 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-[#0D0D0D] border border-[#2A2A2A] shadow-2xl my-auto text-[#F5F5F0] flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#141414] border-b border-[#2A2A2A]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center shrink-0">
              <img
                src="/images/tdbd_logo.png"
                alt="TDBD Logo"
                className="w-full h-full object-contain filter drop-shadow"
              />
            </div>
            <div>
              <h2 className="font-heading font-black text-lg text-[#F5F5F0] uppercase tracking-wide flex items-center gap-2">
                Engineering Operations Portal
                <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-[#1D1D1D] border border-[#333333] text-[#A0A0A0]">
                  Admin 2.0
                </span>
              </h2>
              <p className="text-[11px] font-mono text-[#888888]">
                TDBD Engineering Works Private Limited — Restricted Access
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {adminUser && (
              <div className="hidden sm:flex items-center gap-3 pr-3 border-r border-[#2A2A2A] text-xs font-mono">
                {adminUser.picture ? (
                  <img
                    src={adminUser.picture}
                    alt={adminUser.name || 'Admin'}
                    className="w-6 h-6 rounded-full border border-[#333333] object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-brand-accent" />
                )}
                <div className="flex flex-col text-left">
                  <span className="text-[#F5F5F0] font-bold text-[11px] leading-tight">
                    {adminUser.name || 'Administrator'}
                  </span>
                  <span className="text-[#888888] text-[10px] leading-tight">{adminUser.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-2.5 py-1 ml-2 bg-[#1A1A1A] hover:bg-red-950/60 hover:text-red-400 border border-[#2A2A2A] text-[#A0A0A0] transition-colors flex items-center gap-1.5"
                  title="Log out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Exit</span>
                </button>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-2 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F5F0] hover:bg-brand-accent hover:border-brand-accent transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {checkingAuth ? (
          <div className="p-16 text-center space-y-4 my-auto">
            <RefreshCw className="w-8 h-8 animate-spin text-brand-accent mx-auto" />
            <p className="text-xs font-mono text-[#888888] uppercase tracking-wider">
              Verifying Administrator Authorization...
            </p>
          </div>
        ) : !adminUser ? (
          /* Authentication Screen */
          <div className="p-8 sm:p-12 max-w-md mx-auto w-full my-auto space-y-6">
            <div className="space-y-3 text-center">
              <div className="w-14 h-14 flex items-center justify-center mx-auto">
                <img
                  src="/images/tdbd_logo.png"
                  alt="TDBD Engineering Logo"
                  className="w-full h-full object-contain filter drop-shadow"
                />
              </div>
              <h3 className="font-heading font-black text-2xl uppercase tracking-tight text-[#F5F5F0]">
                Sign In To Command
              </h3>
              <p className="text-xs font-mono text-[#888888]">
                Authorized engineering directors and site dispatch staff only.
              </p>
            </div>

            {authError && (
              <div className="p-3.5 bg-red-950/50 border border-red-800 text-red-200 text-xs font-mono flex items-start gap-2.5 leading-relaxed">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <div className="space-y-4 pt-2">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={authLoading}
                className="w-full py-3.5 px-5 bg-[#171717] hover:bg-[#202020] text-[#F5F5F0] border border-[#333333] hover:border-brand-accent transition-all duration-200 font-sans font-semibold text-sm flex items-center justify-center gap-3.5 shadow-lg group disabled:opacity-50 cursor-pointer"
              >
                {authLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-brand-accent" />
                    <span className="font-mono text-xs uppercase tracking-wider text-[#A0A0A0]">
                      Redirecting to Google...
                    </span>
                  </>
                ) : (
                  <>
                    {/* Official Google G Logo SVG */}
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span className="font-heading tracking-wide">Continue with Google</span>
                  </>
                )}
              </button>

              <div className="pt-2 text-center space-y-1.5 border-t border-[#222222]">
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-[#888888]">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-accent" />
                  <span>Google OpenID Connect • PKCE Secured</span>
                </div>
                <p className="text-[10px] font-mono text-[#666666]">
                  Restricted to allowlisted engineering company email addresses.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar Navigation */}
            <div className="w-full md:w-60 bg-[#111111] border-b md:border-b-0 md:border-r border-[#2A2A2A] p-3 space-y-1 shrink-0 overflow-x-auto md:overflow-y-auto flex md:flex-col gap-1">
              <button
                onClick={() => setActiveTab('enquiries')}
                className={`w-full px-3 py-2.5 text-xs font-mono uppercase tracking-wider flex items-center justify-between text-left transition-colors ${
                  activeTab === 'enquiries'
                    ? 'bg-brand-accent text-white font-bold'
                    : 'text-[#A0A0A0] hover:text-[#F5F5F0] hover:bg-[#1A1A1A]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Inbox className="w-4 h-4 shrink-0" />
                  <span>Enquiries</span>
                </div>
                <span className="px-1.5 py-0.5 text-[10px] bg-black/40 rounded">
                  {enquiries.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('projects')}
                className={`w-full px-3 py-2.5 text-xs font-mono uppercase tracking-wider flex items-center justify-between text-left transition-colors ${
                  activeTab === 'projects'
                    ? 'bg-brand-accent text-white font-bold'
                    : 'text-[#A0A0A0] hover:text-[#F5F5F0] hover:bg-[#1A1A1A]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FolderKanban className="w-4 h-4 shrink-0" />
                  <span>Projects</span>
                </div>
                <span className="px-1.5 py-0.5 text-[10px] bg-black/40 rounded">
                  {projects.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('services')}
                className={`w-full px-3 py-2.5 text-xs font-mono uppercase tracking-wider flex items-center justify-between text-left transition-colors ${
                  activeTab === 'services'
                    ? 'bg-brand-accent text-white font-bold'
                    : 'text-[#A0A0A0] hover:text-[#F5F5F0] hover:bg-[#1A1A1A]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 shrink-0" />
                  <span>Services</span>
                </div>
                <span className="px-1.5 py-0.5 text-[10px] bg-black/40 rounded">
                  {services.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('gallery')}
                className={`w-full px-3 py-2.5 text-xs font-mono uppercase tracking-wider flex items-center justify-between text-left transition-colors ${
                  activeTab === 'gallery'
                    ? 'bg-brand-accent text-white font-bold'
                    : 'text-[#A0A0A0] hover:text-[#F5F5F0] hover:bg-[#1A1A1A]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ImageIcon className="w-4 h-4 shrink-0" />
                  <span>Gallery</span>
                </div>
                <span className="px-1.5 py-0.5 text-[10px] bg-black/40 rounded">
                  {gallery.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('testimonials')}
                className={`w-full px-3 py-2.5 text-xs font-mono uppercase tracking-wider flex items-center justify-between text-left transition-colors ${
                  activeTab === 'testimonials'
                    ? 'bg-brand-accent text-white font-bold'
                    : 'text-[#A0A0A0] hover:text-[#F5F5F0] hover:bg-[#1A1A1A]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span>Testimonials</span>
                </div>
                <span className="px-1.5 py-0.5 text-[10px] bg-black/40 rounded">
                  {testimonials.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('faqs')}
                className={`w-full px-3 py-2.5 text-xs font-mono uppercase tracking-wider flex items-center justify-between text-left transition-colors ${
                  activeTab === 'faqs'
                    ? 'bg-brand-accent text-white font-bold'
                    : 'text-[#A0A0A0] hover:text-[#F5F5F0] hover:bg-[#1A1A1A]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 shrink-0" />
                  <span>FAQs</span>
                </div>
                <span className="px-1.5 py-0.5 text-[10px] bg-black/40 rounded">
                  {faqs.length}
                </span>
              </button>

              <div className="pt-4 border-t border-[#222222] mt-auto">
                <button
                  onClick={loadAllData}
                  disabled={loading}
                  className="w-full px-3 py-2 bg-[#1A1A1A] hover:bg-[#252525] text-[#AAAAAA] text-xs font-mono uppercase flex items-center gap-2 justify-center border border-[#2A2A2A]"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Sync Database</span>
                </button>
              </div>
            </div>

            {/* Main Tab Panels */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0B0B0B]">
              
              {/* ENQUIRIES TAB */}
              {activeTab === 'enquiries' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2A2A2A]">
                    <div>
                      <h3 className="font-heading font-black text-2xl uppercase tracking-tight text-[#F5F5F0]">
                        Client Enquiries &amp; Feasibility Leads
                      </h3>
                      <p className="text-xs font-mono text-[#888888]">
                        Submissions captured from site estimator, contact page, and direct hotline triggers.
                      </p>
                    </div>

                    {/* Filter tabs */}
                    <div className="flex flex-wrap gap-1.5 text-xs font-mono uppercase">
                      {['ALL', 'NEW', 'CONTACTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map((st) => (
                        <button
                          key={st}
                          onClick={() => setEnquiryStatusFilter(st)}
                          className={`px-3 py-1.5 border transition-colors ${
                            enquiryStatusFilter === st
                              ? 'bg-brand-accent text-white border-brand-accent font-bold'
                              : 'bg-[#141414] text-[#A0A0A0] hover:text-[#F5F5F0] border-[#2A2A2A]'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {filteredEnquiries.length === 0 ? (
                    <div className="p-12 text-center border border-[#2A2A2A] bg-[#111111] space-y-2">
                      <Inbox className="w-8 h-8 text-[#555555] mx-auto" />
                      <div className="font-mono text-sm text-[#888888]">No enquiries found under status "{enquiryStatusFilter}"</div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredEnquiries.map((enq) => (
                        <div
                          key={enq.id}
                          className="p-4 sm:p-5 bg-[#141414] border border-[#2A2A2A] hover:border-[#404040] transition-colors space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#222222] pb-3">
                            <div className="flex items-center gap-3">
                              <span className="font-heading font-bold text-lg text-[#F5F5F0]">
                                {enq.name}
                              </span>
                              <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded ${
                                enq.status === 'NEW' ? 'bg-amber-900/60 text-amber-300 border border-amber-700' :
                                enq.status === 'CONTACTED' ? 'bg-blue-900/60 text-blue-300 border border-blue-700' :
                                enq.status === 'IN_PROGRESS' ? 'bg-purple-900/60 text-purple-300 border border-purple-700' :
                                enq.status === 'COMPLETED' ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700' :
                                'bg-neutral-800 text-neutral-400 border border-neutral-700'
                              }`}>
                                {enq.status}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Status selector */}
                              <select
                                value={enq.status}
                                onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                                className="px-2.5 py-1 bg-[#0A0A0A] border border-[#333333] text-xs font-mono uppercase text-[#CCCCCC] focus:border-brand-accent focus:outline-none"
                              >
                                <option value="NEW">Set NEW</option>
                                <option value="CONTACTED">Set CONTACTED</option>
                                <option value="IN_PROGRESS">Set IN_PROGRESS</option>
                                <option value="COMPLETED">Set COMPLETED</option>
                                <option value="CANCELLED">Set CANCELLED</option>
                              </select>

                              <button
                                onClick={() => handleDeleteEnquiry(enq.id)}
                                className="p-1.5 text-[#888888] hover:text-red-400 transition-colors"
                                title="Delete enquiry"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                            <div className="flex items-center gap-2 text-[#CCCCCC]">
                              <Phone className="w-3.5 h-3.5 text-brand-accent shrink-0" />
                              <a href={`tel:${enq.phone}`} className="hover:underline text-[#F5F5F0] font-bold">
                                {enq.phone}
                              </a>
                            </div>

                            <div className="flex items-center gap-2 text-[#CCCCCC]">
                              <MapPin className="w-3.5 h-3.5 text-brand-accent shrink-0" />
                              <span>{enq.city}</span>
                            </div>

                            <div className="flex items-center gap-2 text-[#CCCCCC]">
                              <Layers className="w-3.5 h-3.5 text-brand-accent shrink-0" />
                              <span className="text-amber-400 font-bold">{enq.service}</span>
                            </div>
                          </div>

                          {enq.message && (
                            <div className="p-3 bg-[#0A0A0A] border border-[#222222] text-xs font-mono text-[#AAAAAA] leading-relaxed">
                              {enq.message}
                            </div>
                          )}

                          <div className="flex items-center justify-between text-[10px] font-mono text-[#666666] pt-1">
                            <span>Captured: {new Date(enq.createdAt).toLocaleString()}</span>
                            <div className="flex items-center gap-3">
                              <a
                                href={`https://wa.me/${enq.phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(enq.name)},%20this%20is%20TDBD%20Engineering%20Works%20regarding%20your%20${encodeURIComponent(enq.service)}%20enquiry.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-400 hover:underline flex items-center gap-1 font-bold"
                              >
                                <span>WhatsApp Contact</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* PROJECTS TAB */}
              {activeTab === 'projects' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-[#2A2A2A]">
                    <div>
                      <h3 className="font-heading font-black text-2xl uppercase tracking-tight text-[#F5F5F0]">
                        Project Archive ({projects.length})
                      </h3>
                      <p className="text-xs font-mono text-[#888888]">
                        Active portfolio entries displayed on the public projects catalog.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setAddFormType('project');
                        setNewItem({
                          title: '',
                          category: 'House Lifting',
                          location: '',
                          liftHeight: '4.0 Feet',
                          imageUrl: '/images/slider_photo.jpg',
                          description: '',
                          problem: '',
                          solution: '',
                          featured: false
                        });
                        setShowAddModal(true);
                      }}
                      className="px-3.5 py-2 bg-brand-accent hover:bg-[#EA580C] text-white text-xs font-mono font-bold uppercase flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Project</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((proj) => (
                      <div
                        key={proj.id}
                        className="bg-[#141414] border border-[#2A2A2A] overflow-hidden flex flex-col justify-between"
                      >
                        <div className="h-40 relative bg-black">
                          <img
                            src={proj.imageUrl}
                            alt={proj.title}
                            className="w-full h-full object-cover opacity-80"
                            onError={(e) => { e.currentTarget.src = '/images/slider_photo.jpg'; }}
                          />
                          <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 border border-white/20 text-[10px] font-mono uppercase text-brand-accent">
                            {proj.category}
                          </div>
                          {proj.liftHeight && (
                            <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-brand-accent text-white text-[10px] font-mono font-bold uppercase">
                              {proj.liftHeight}
                            </div>
                          )}
                        </div>

                        <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-heading font-bold text-sm text-[#F5F5F0] uppercase line-clamp-2">
                              {proj.title}
                            </h4>
                            <div className="text-[11px] font-mono text-[#888888] mt-1">
                              {proj.location}
                            </div>
                          </div>

                          <div className="pt-3 border-t border-[#222222] flex items-center justify-between text-xs font-mono">
                            <span className="text-[#666666]">ID: {proj.id}</span>
                            <button
                              onClick={async () => {
                                if (window.confirm('Delete this project?')) {
                                  await api.deleteProject(proj.id);
                                  setProjects(prev => prev.filter(p => p.id !== proj.id));
                                }
                              }}
                              className="text-red-400 hover:text-red-300 flex items-center gap-1 text-[11px]"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SERVICES TAB */}
              {activeTab === 'services' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-[#2A2A2A]">
                    <div>
                      <h3 className="font-heading font-black text-2xl uppercase tracking-tight text-[#F5F5F0]">
                        Services Registry ({services.length})
                      </h3>
                      <p className="text-xs font-mono text-[#888888]">
                        Standard core offerings presented on the homepage.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setAddFormType('service');
                        setNewItem({
                          title: '',
                          shortDescription: '',
                          description: '',
                          imageUrl: '/images/slider_photo.jpg',
                          icon: 'Home',
                          featured: false
                        });
                        setShowAddModal(true);
                      }}
                      className="px-3.5 py-2 bg-brand-accent hover:bg-[#EA580C] text-white text-xs font-mono font-bold uppercase flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Service</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {services.map((serv) => (
                      <div
                        key={serv.id}
                        className="p-4 bg-[#141414] border border-[#2A2A2A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={serv.imageUrl}
                            alt={serv.title}
                            className="w-16 h-16 object-cover bg-black border border-[#333333] shrink-0"
                            onError={(e) => { e.currentTarget.src = '/images/slider_photo.jpg'; }}
                          />
                          <div>
                            <h4 className="font-heading font-bold text-base text-[#F5F5F0] uppercase">
                              {serv.title}
                            </h4>
                            <div className="text-xs font-mono text-brand-accent">
                              {serv.shortDescription}
                            </div>
                            <p className="text-xs text-[#888888] line-clamp-1 max-w-xl mt-1">
                              {serv.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={async () => {
                              if (window.confirm('Delete this service?')) {
                                await api.deleteService(serv.id);
                                setServices(prev => prev.filter(s => s.id !== serv.id));
                              }
                            }}
                            className="px-2.5 py-1 text-red-400 hover:bg-red-950/40 border border-[#333333] text-xs font-mono transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* GALLERY TAB */}
              {activeTab === 'gallery' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-[#2A2A2A]">
                    <div>
                      <h3 className="font-heading font-black text-2xl uppercase tracking-tight text-[#F5F5F0]">
                        Field Gallery Archive ({gallery.length})
                      </h3>
                      <p className="text-xs font-mono text-[#888888]">
                        On-site photos powering the visual gallery grid and lightbox.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setAddFormType('gallery');
                        setNewItem({
                          title: '',
                          category: 'Lifting',
                          imageUrl: '/images/slider_photo.jpg',
                          description: ''
                        });
                        setShowAddModal(true);
                      }}
                      className="px-3.5 py-2 bg-brand-accent hover:bg-[#EA580C] text-white text-xs font-mono font-bold uppercase flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Image</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {gallery.map((img) => (
                      <div
                        key={img.id}
                        className="bg-[#141414] border border-[#2A2A2A] overflow-hidden group flex flex-col justify-between"
                      >
                        <div className="aspect-[4/3] bg-black relative">
                          <img
                            src={img.imageUrl || img.src || img.url}
                            alt={img.title}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.currentTarget.src = '/images/slider_photo.jpg'; }}
                          />
                          <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/80 text-[9px] font-mono uppercase text-brand-accent">
                            {img.category}
                          </div>
                        </div>
                        <div className="p-2.5 space-y-1">
                          <div className="text-[11px] font-mono text-[#CCCCCC] truncate font-bold">
                            {img.title}
                          </div>
                          <button
                            onClick={async () => {
                              if (window.confirm('Delete this gallery photo?')) {
                                await api.deleteGalleryImage(img.id);
                                setGallery(prev => prev.filter(g => g.id !== img.id));
                              }
                            }}
                            className="text-red-400 hover:underline text-[10px] font-mono"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TESTIMONIALS TAB */}
              {activeTab === 'testimonials' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-[#2A2A2A]">
                    <div>
                      <h3 className="font-heading font-black text-2xl uppercase tracking-tight text-[#F5F5F0]">
                        Client Testimonials ({testimonials.length})
                      </h3>
                      <p className="text-xs font-mono text-[#888888]">
                        Quotes and verified outcomes featured in the testimonials slider.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setAddFormType('testimonial');
                        setNewItem({
                          name: '',
                          location: '',
                          projectType: 'House Lifting',
                          content: '',
                          outcome: '',
                          rating: 5,
                          approved: true
                        });
                        setShowAddModal(true);
                      }}
                      className="px-3.5 py-2 bg-brand-accent hover:bg-[#EA580C] text-white text-xs font-mono font-bold uppercase flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Testimonial</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {testimonials.map((test) => (
                      <div
                        key={test.id}
                        className="p-4 bg-[#141414] border border-[#2A2A2A] space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-heading font-bold text-sm text-[#F5F5F0]">
                              {test.name || test.author}
                            </span>
                            <span className="text-xs font-mono text-[#888888]">
                              ({test.location})
                            </span>
                          </div>
                          <button
                            onClick={async () => {
                              if (window.confirm('Delete this testimonial?')) {
                                await api.deleteTestimonial(test.id);
                                setTestimonials(prev => prev.filter(t => t.id !== test.id));
                              }
                            }}
                            className="text-red-400 hover:underline text-xs font-mono"
                          >
                            Delete
                          </button>
                        </div>
                        <p className="text-xs text-[#BBBBBB] italic">
                          "{test.content || test.quote}"
                        </p>
                        {test.outcome && (
                          <div className="text-[11px] font-mono text-brand-accent">
                            Outcome: {test.outcome}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQS TAB */}
              {activeTab === 'faqs' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-[#2A2A2A]">
                    <div>
                      <h3 className="font-heading font-black text-2xl uppercase tracking-tight text-[#F5F5F0]">
                        FAQ Management ({faqs.length})
                      </h3>
                      <p className="text-xs font-mono text-[#888888]">
                        Frequently asked questions and technical clarifications.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setAddFormType('faq');
                        setNewItem({
                          question: '',
                          answer: '',
                          category: 'General',
                          published: true
                        });
                        setShowAddModal(true);
                      }}
                      className="px-3.5 py-2 bg-brand-accent hover:bg-[#EA580C] text-white text-xs font-mono font-bold uppercase flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add FAQ</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {faqs.map((faq) => (
                      <div
                        key={faq.id}
                        className="p-4 bg-[#141414] border border-[#2A2A2A] space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-heading font-bold text-sm text-[#F5F5F0]">
                            {faq.question}
                          </span>
                          <button
                            onClick={async () => {
                              if (window.confirm('Delete this FAQ?')) {
                                await api.deleteFaq(faq.id);
                                setFaqs(prev => prev.filter(f => f.id !== faq.id));
                              }
                            }}
                            className="text-red-400 hover:underline text-xs font-mono"
                          >
                            Delete
                          </button>
                        </div>
                        <p className="text-xs text-[#999999] leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Generic Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
            <div className="bg-[#141414] border border-[#2A2A2A] p-6 max-w-lg w-full space-y-4">
              <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
                <h4 className="font-heading font-bold text-base uppercase text-[#F5F5F0]">
                  Add New {addFormType}
                </h4>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-[#888888] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateItem} className="space-y-3 text-xs font-mono">
                {addFormType === 'project' && (
                  <>
                    <div>
                      <label className="text-[#AAAAAA] block mb-1">Project Title *</label>
                      <input
                        type="text"
                        required
                        value={newItem.title || ''}
                        onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                        className="w-full p-2 bg-[#0A0A0A] border border-[#333333] text-[#F5F5F0]"
                        placeholder="e.g. 2-Storey House Elevation"
                      />
                    </div>
                    <div>
                      <label className="text-[#AAAAAA] block mb-1">Location *</label>
                      <input
                        type="text"
                        required
                        value={newItem.location || ''}
                        onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                        className="w-full p-2 bg-[#0A0A0A] border border-[#333333] text-[#F5F5F0]"
                        placeholder="e.g. Yamunanagar, Haryana"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[#AAAAAA] block mb-1">Category</label>
                        <select
                          value={newItem.category || 'House Lifting'}
                          onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                          className="w-full p-2 bg-[#0A0A0A] border border-[#333333] text-[#F5F5F0]"
                        >
                          <option value="House Lifting">House Lifting</option>
                          <option value="Building Lifting">Building Lifting</option>
                          <option value="House Shifting">House Shifting</option>
                          <option value="Commercial">Commercial</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[#AAAAAA] block mb-1">Lift Height</label>
                        <input
                          type="text"
                          value={newItem.liftHeight || ''}
                          onChange={(e) => setNewItem({ ...newItem, liftHeight: e.target.value })}
                          className="w-full p-2 bg-[#0A0A0A] border border-[#333333] text-[#F5F5F0]"
                          placeholder="4.0 Feet"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[#AAAAAA] block mb-1">Image URL</label>
                      <input
                        type="text"
                        required
                        value={newItem.imageUrl || ''}
                        onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
                        className="w-full p-2 bg-[#0A0A0A] border border-[#333333] text-[#F5F5F0]"
                        placeholder="/images/slider_photo.jpg"
                      />
                    </div>
                    <div>
                      <label className="text-[#AAAAAA] block mb-1">Description *</label>
                      <textarea
                        rows="2"
                        required
                        value={newItem.description || ''}
                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                        className="w-full p-2 bg-[#0A0A0A] border border-[#333333] text-[#F5F5F0]"
                      />
                    </div>
                  </>
                )}

                {addFormType === 'service' && (
                  <>
                    <div>
                      <label className="text-[#AAAAAA] block mb-1">Service Title *</label>
                      <input
                        type="text"
                        required
                        value={newItem.title || ''}
                        onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                        className="w-full p-2 bg-[#0A0A0A] border border-[#333333] text-[#F5F5F0]"
                      />
                    </div>
                    <div>
                      <label className="text-[#AAAAAA] block mb-1">Short Description *</label>
                      <input
                        type="text"
                        required
                        value={newItem.shortDescription || ''}
                        onChange={(e) => setNewItem({ ...newItem, shortDescription: e.target.value })}
                        className="w-full p-2 bg-[#0A0A0A] border border-[#333333] text-[#F5F5F0]"
                      />
                    </div>
                    <div>
                      <label className="text-[#AAAAAA] block mb-1">Image URL *</label>
                      <input
                        type="text"
                        required
                        value={newItem.imageUrl || ''}
                        onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
                        className="w-full p-2 bg-[#0A0A0A] border border-[#333333] text-[#F5F5F0]"
                      />
                    </div>
                    <div>
                      <label className="text-[#AAAAAA] block mb-1">Full Description *</label>
                      <textarea
                        rows="3"
                        required
                        value={newItem.description || ''}
                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                        className="w-full p-2 bg-[#0A0A0A] border border-[#333333] text-[#F5F5F0]"
                      />
                    </div>
                  </>
                )}

                {addFormType === 'gallery' && (
                  <>
                    <div>
                      <label className="text-[#AAAAAA] block mb-1">Title *</label>
                      <input
                        type="text"
                        required
                        value={newItem.title || ''}
                        onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                        className="w-full p-2 bg-[#0A0A0A] border border-[#333333] text-[#F5F5F0]"
                      />
                    </div>
                    <div>
                      <label className="text-[#AAAAAA] block mb-1">Category</label>
                      <select
                        value={newItem.category || 'Lifting'}
                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                        className="w-full p-2 bg-[#0A0A0A] border border-[#333333] text-[#F5F5F0]"
                      >
                        <option value="Lifting">Lifting</option>
                        <option value="Shifting">Shifting</option>
                        <option value="Equipment">Equipment</option>
                        <option value="Process">Process</option>
                        <option value="Commercial">Commercial</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[#AAAAAA] block mb-1">Image URL *</label>
                      <input
                        type="text"
                        required
                        value={newItem.imageUrl || ''}
                        onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
                        className="w-full p-2 bg-[#0A0A0A] border border-[#333333] text-[#F5F5F0]"
                      />
                    </div>
                  </>
                )}

                {addFormType === 'testimonial' && (
                  <>
                    <div>
                      <label className="text-[#AAAAAA] block mb-1">Client Name *</label>
                      <input
                        type="text"
                        required
                        value={newItem.name || ''}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        className="w-full p-2 bg-[#0A0A0A] border border-[#333333] text-[#F5F5F0]"
                      />
                    </div>
                    <div>
                      <label className="text-[#AAAAAA] block mb-1">Location *</label>
                      <input
                        type="text"
                        required
                        value={newItem.location || ''}
                        onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                        className="w-full p-2 bg-[#0A0A0A] border border-[#333333] text-[#F5F5F0]"
                      />
                    </div>
                    <div>
                      <label className="text-[#AAAAAA] block mb-1">Testimonial Quote / Story *</label>
                      <textarea
                        rows="3"
                        required
                        value={newItem.content || ''}
                        onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
                        className="w-full p-2 bg-[#0A0A0A] border border-[#333333] text-[#F5F5F0]"
                      />
                    </div>
                    <div>
                      <label className="text-[#AAAAAA] block mb-1">Outcome Highlight</label>
                      <input
                        type="text"
                        value={newItem.outcome || ''}
                        onChange={(e) => setNewItem({ ...newItem, outcome: e.target.value })}
                        className="w-full p-2 bg-[#0A0A0A] border border-[#333333] text-[#F5F5F0]"
                        placeholder="e.g. Lifted 4.5 Feet with Zero Cracks"
                      />
                    </div>
                  </>
                )}

                {addFormType === 'faq' && (
                  <>
                    <div>
                      <label className="text-[#AAAAAA] block mb-1">Question *</label>
                      <input
                        type="text"
                        required
                        value={newItem.question || ''}
                        onChange={(e) => setNewItem({ ...newItem, question: e.target.value })}
                        className="w-full p-2 bg-[#0A0A0A] border border-[#333333] text-[#F5F5F0]"
                      />
                    </div>
                    <div>
                      <label className="text-[#AAAAAA] block mb-1">Answer *</label>
                      <textarea
                        rows="4"
                        required
                        value={newItem.answer || ''}
                        onChange={(e) => setNewItem({ ...newItem, answer: e.target.value })}
                        className="w-full p-2 bg-[#0A0A0A] border border-[#333333] text-[#F5F5F0]"
                      />
                    </div>
                  </>
                )}

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-3 py-1.5 bg-[#222222] text-[#AAAAAA] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-brand-accent text-white font-bold hover:bg-[#EA580C]"
                  >
                    Save Record
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}


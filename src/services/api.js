import {
  projects as fallbackProjects,
  services as fallbackServices,
  galleryImages as fallbackGallery,
  testimonials as fallbackTestimonials,
  faqs as fallbackFaqs
} from '../data/companyData';

const API_BASE = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '/api';

export function getApiBaseUrl() {
  return API_BASE.replace(/\/+$/, '');
}

// Generic Fetch Wrapper (Relies strictly on secure HttpOnly cookies; zero localStorage tokens)
async function request(endpoint, options = {}) {
  const config = {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest', // Custom header for CSRF defense
      ...(options.headers || {})
    }
  };

  try {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}${endpoint}`, config);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg = data.message || `Request failed with status ${res.status}`;
      const err = new Error(errorMsg);
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (err) {
    // Re-throw with clear message
    throw err;
  }
}

// ==========================================
// PUBLIC API METHODS (WITH RESILIENT FALLBACK)
// ==========================================

export async function checkHealth() {
  try {
    return await request('/health');
  } catch (err) {
    return { success: false, message: err.message };
  }
}

// Normalization helpers to ensure consistent image and text properties across API and fallback datasets
function normalizeService(s) {
  if (!s) return s;
  const img = s.imageUrl || s.image || '/images/slider_photo.jpg';
  return {
    ...s,
    image: img,
    imageUrl: img,
    subtitle: s.subtitle || s.shortDescription || '',
    shortDescription: s.shortDescription || s.subtitle || '',
    specs: s.specs || {},
    features: s.features || []
  };
}

function normalizeProject(p) {
  if (!p) return p;
  const img = p.imageUrl || p.image || '/images/slider_photo.jpg';
  return {
    ...p,
    image: img,
    imageUrl: img,
    specs: p.specs || {}
  };
}

function normalizeGalleryItem(g) {
  if (!g) return g;
  const img = g.imageUrl || g.src || g.url || '/images/slider_photo.jpg';
  return {
    ...g,
    src: img,
    url: img,
    imageUrl: img
  };
}

export async function fetchProjects(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await request(`/projects${query ? `?${query}` : ''}`);
    if (res && res.data && res.data.length > 0) {
      return res.data.map(normalizeProject);
    }
    return fallbackProjects.map(normalizeProject);
  } catch (err) {
    console.info('API unavailable, serving fallback projects data:', err.message);
    return fallbackProjects.map(normalizeProject);
  }
}

export async function fetchProject(idOrSlug) {
  try {
    const res = await request(`/projects/${idOrSlug}`);
    if (res && res.data) return normalizeProject(res.data);
  } catch (err) {
    console.info(`API unavailable for project ${idOrSlug}, using fallback:`, err.message);
  }
  const match = fallbackProjects.find(p => p.id === parseInt(idOrSlug, 10) || p.slug === idOrSlug);
  return match ? normalizeProject(match) : null;
}

export async function fetchServices(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await request(`/services${query ? `?${query}` : ''}`);
    if (res && res.data && res.data.length > 0) {
      return res.data.map(normalizeService);
    }
    return fallbackServices.map(normalizeService);
  } catch (err) {
    console.info('API unavailable, serving fallback services data:', err.message);
    return fallbackServices.map(normalizeService);
  }
}

export async function fetchService(idOrSlug) {
  try {
    const res = await request(`/services/${idOrSlug}`);
    if (res && res.data) return normalizeService(res.data);
  } catch (err) {
    console.info(`API unavailable for service ${idOrSlug}, using fallback:`, err.message);
  }
  const match = fallbackServices.find(s => s.id === parseInt(idOrSlug, 10) || s.slug === idOrSlug);
  return match ? normalizeService(match) : null;
}

export async function fetchGallery(category) {
  try {
    const query = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
    const res = await request(`/gallery${query}`);
    if (res && res.data && res.data.length > 0) {
      return res.data.map(normalizeGalleryItem);
    }
    const list = category && category !== 'All'
      ? fallbackGallery.filter(g => g.category.toLowerCase() === category.toLowerCase())
      : fallbackGallery;
    return list.map(normalizeGalleryItem);
  } catch (err) {
    console.info('API unavailable, serving fallback gallery:', err.message);
    const list = category && category !== 'All'
      ? fallbackGallery.filter(g => g.category.toLowerCase() === category.toLowerCase())
      : fallbackGallery;
    return list.map(normalizeGalleryItem);
  }
}

export async function fetchTestimonials() {
  try {
    const res = await request('/testimonials');
    if (res && res.data && res.data.length > 0) {
      return res.data;
    }
    return fallbackTestimonials;
  } catch (err) {
    console.info('API unavailable, serving fallback testimonials:', err.message);
    return fallbackTestimonials;
  }
}

export async function fetchFaqs(category) {
  try {
    const query = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
    const res = await request(`/faqs${query}`);
    if (res && res.data && res.data.length > 0) {
      return res.data;
    }
    return category && category !== 'All'
      ? fallbackFaqs.filter(f => f.category.toLowerCase() === category.toLowerCase())
      : fallbackFaqs;
  } catch (err) {
    console.info('API unavailable, serving fallback FAQs:', err.message);
    return category && category !== 'All'
      ? fallbackFaqs.filter(f => f.category.toLowerCase() === category.toLowerCase())
      : fallbackFaqs;
  }
}

export async function submitEnquiry(enquiryData) {
  const res = await request('/enquiries', {
    method: 'POST',
    body: JSON.stringify(enquiryData)
  });

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('tdbd_enquiry_submitted', { detail: res?.data }));
    try {
      localStorage.setItem('tdbd_last_enquiry_time', Date.now().toString());
    } catch (e) {
      // ignore
    }
  }

  return res;
}

// ==========================================
// ADMIN AUTHENTICATION
// ==========================================

export function getGoogleLoginUrl() {
  const baseUrl = getApiBaseUrl();
  const returnTo = typeof window !== 'undefined' ? window.location.origin : '';
  return `${baseUrl}/auth/google?returnTo=${encodeURIComponent(returnTo)}`;
}

export function loginWithGoogle() {
  if (typeof window !== 'undefined') {
    window.location.href = getGoogleLoginUrl();
  }
}

export async function loginAdmin(email, password) {
  return await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export async function getAdminProfile() {
  try {
    return await request('/auth/me');
  } catch (err) {
    if (err.status === 401) {
      return { success: false, data: null };
    }
    throw err;
  }
}

export async function logoutAdmin() {
  try {
    await request('/auth/logout', { method: 'POST' });
  } catch (e) {
    // ignore
  }
}

// ==========================================
// ADMIN DASHBOARD CRUD
// ==========================================

export async function fetchAdminEnquiries(params = {}) {
  const query = new URLSearchParams(params).toString();
  return await request(`/enquiries${query ? `?${query}` : ''}`);
}

export async function updateEnquiryStatus(id, status, message) {
  return await request(`/enquiries/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status, message })
  });
}

export async function deleteEnquiry(id) {
  return await request(`/enquiries/${id}`, {
    method: 'DELETE'
  });
}

export async function createProject(data) {
  return await request('/projects', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateProject(id, data) {
  return await request(`/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function deleteProject(id) {
  return await request(`/projects/${id}`, {
    method: 'DELETE'
  });
}

export async function createService(data) {
  return await request('/services', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateService(id, data) {
  return await request(`/services/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function deleteService(id) {
  return await request(`/services/${id}`, {
    method: 'DELETE'
  });
}

export async function createGalleryImage(data) {
  return await request('/gallery', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function deleteGalleryImage(id) {
  return await request(`/gallery/${id}`, {
    method: 'DELETE'
  });
}

export async function fetchAllTestimonialsAdmin() {
  return await request('/testimonials/all');
}

export async function createTestimonial(data) {
  return await request('/testimonials', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateTestimonial(id, data) {
  return await request(`/testimonials/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function deleteTestimonial(id) {
  return await request(`/testimonials/${id}`, {
    method: 'DELETE'
  });
}

export async function fetchAllFaqsAdmin() {
  return await request('/faqs/all');
}

export async function createFaq(data) {
  return await request('/faqs', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateFaq(id, data) {
  return await request(`/faqs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function deleteFaq(id) {
  return await request(`/faqs/${id}`, {
    method: 'DELETE'
  });
}

export default {
  checkHealth,
  getGoogleLoginUrl,
  loginWithGoogle,
  fetchProjects,
  fetchProject,
  fetchServices,
  fetchService,
  fetchGallery,
  fetchTestimonials,
  fetchFaqs,
  submitEnquiry,
  loginAdmin,
  getAdminProfile,
  logoutAdmin,
  fetchAdminEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
  createProject,
  updateProject,
  deleteProject,
  createService,
  updateService,
  deleteService,
  createGalleryImage,
  deleteGalleryImage,
  fetchAllTestimonialsAdmin,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  fetchAllFaqsAdmin,
  createFaq,
  updateFaq,
  deleteFaq
};


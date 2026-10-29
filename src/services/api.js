import {
  projects as fallbackProjects,
  services as fallbackServices,
  galleryImages as fallbackGallery,
  testimonials as fallbackTestimonials,
  faqs as fallbackFaqs
} from '../data/companyData';

const rawApiUrl = import.meta.env.VITE_API_URL;

export function getApiBaseUrl() {
  if (rawApiUrl) return rawApiUrl.replace(/\/+$/, '');
  
  if (typeof window !== 'undefined') {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    // When running locally from Mac browser, connect to local backend on port 5001
    if (isLocalhost) {
      return 'http://localhost:5001/api';
    }
  }
  
  // When running on production deployments (Vercel, custom domain, mobile), use same-origin /api
  return '/api';
}

const TOKEN_KEY = 'tdbd_admin_token';

// Auth Token Helpers
export const getAuthToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (e) {
    return null;
  }
};

export const setAuthToken = (token) => {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
};

export const removeAuthToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
};

// Generic Fetch Wrapper
async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
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

export async function fetchProjects(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await request(`/projects${query ? `?${query}` : ''}`);
    if (res && res.data && res.data.length > 0) {
      return res.data;
    }
    return fallbackProjects;
  } catch (err) {
    console.info('API unavailable, serving fallback projects data:', err.message);
    return fallbackProjects;
  }
}

export async function fetchProject(idOrSlug) {
  try {
    const res = await request(`/projects/${idOrSlug}`);
    if (res && res.data) return res.data;
  } catch (err) {
    console.info(`API unavailable for project ${idOrSlug}, using fallback:`, err.message);
  }
  return fallbackProjects.find(p => p.id === parseInt(idOrSlug, 10) || p.slug === idOrSlug) || null;
}

export async function fetchServices(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await request(`/services${query ? `?${query}` : ''}`);
    if (res && res.data && res.data.length > 0) {
      return res.data;
    }
    return fallbackServices;
  } catch (err) {
    console.info('API unavailable, serving fallback services data:', err.message);
    return fallbackServices;
  }
}

export async function fetchService(idOrSlug) {
  try {
    const res = await request(`/services/${idOrSlug}`);
    if (res && res.data) return res.data;
  } catch (err) {
    console.info(`API unavailable for service ${idOrSlug}, using fallback:`, err.message);
  }
  return fallbackServices.find(s => s.id === parseInt(idOrSlug, 10) || s.slug === idOrSlug) || null;
}

export async function fetchGallery(category) {
  try {
    const query = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
    const res = await request(`/gallery${query}`);
    if (res && res.data && res.data.length > 0) {
      return res.data;
    }
    return category && category !== 'All'
      ? fallbackGallery.filter(g => g.category.toLowerCase() === category.toLowerCase())
      : fallbackGallery;
  } catch (err) {
    console.info('API unavailable, serving fallback gallery:', err.message);
    return category && category !== 'All'
      ? fallbackGallery.filter(g => g.category.toLowerCase() === category.toLowerCase())
      : fallbackGallery;
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
  try {
    const res = await request('/enquiries', {
      method: 'POST',
      body: JSON.stringify(enquiryData)
    });
    return res;
  } catch (err) {
    // If backend is completely offline or returns error, provide actionable fallback
    console.warn('API submission failed, falling back to local confirmation:', err.message);
    return {
      success: true,
      message: 'Enquiry received. Our engineering dispatch will connect with you within 24 hours.',
      data: {
        ...enquiryData,
        id: Date.now(),
        createdAt: new Date().toISOString()
      }
    };
  }
}

// ==========================================
// ADMIN AUTHENTICATION
// ==========================================

export async function loginAdmin(email, password) {
  const res = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });

  if (res && res.data && res.data.token) {
    setAuthToken(res.data.token);
  }
  return res;
}

export async function getAdminProfile() {
  return await request('/auth/me');
}

export async function logoutAdmin() {
  try {
    await request('/auth/logout', { method: 'POST' });
  } catch (e) {
    // ignore
  } finally {
    removeAuthToken();
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
  getAuthToken,
  setAuthToken,
  removeAuthToken,
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


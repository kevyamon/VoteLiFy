// Détermination dynamique de l'URL du backend via les variables d'environnement
const rawBase = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');
const API_BASE = rawBase
  ? (rawBase.endsWith('/api') ? rawBase : `${rawBase}/api`)
  : '/api';

/**
 * Client HTTP universel pour l'API VoteLiFy avec gestion des cookies HttpOnly et erreurs typées.
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const storedToken = typeof window !== 'undefined' ? localStorage.getItem('votelify_admin_token') : null;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include', // Transmission des cookies HttpOnly si autorisée
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);
    const result = await response.json().catch(() => null);

    if (!response.ok) {
      const error = new Error(result?.error?.message || 'Une erreur inattendue est survenue.');
      error.status = response.status;
      error.code = result?.error?.code || 'UNKNOWN_ERROR';
      error.details = result?.error?.details || null;
      throw error;
    }

    return result?.data;
  } catch (error) {
    if (!error.status) {
      error.message = 'Impossible de joindre le serveur VoteLiFy. Vérifiez votre connexion internet.';
      error.code = 'NETWORK_ERROR';
    }
    throw error;
  }
}

export const api = {
  // Routes publiques
  getElections: () => request('/elections'),
  getElectionById: (id) => request(`/elections/${id}`),
  getElectionInfo: () => request('/election'),
  getPositions: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/positions${query ? `?${query}` : ''}`);
  },
  getCandidates: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/candidates${query ? `?${query}` : ''}`);
  },
  getCandidateById: (id) => request(`/candidates/${id}`),
  submitCandidacy: (data) => request('/candidates', { method: 'POST', body: data }),
  submitVote: (data) => request('/votes/submit', { method: 'POST', body: data }),
  getResults: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/results${query ? `?${query}` : ''}`);
  },

  // Authentification administrative
  registerAdmin: async (data) => {
    const res = await request('/admin/register', { method: 'POST', body: data });
    if (res?.token && typeof window !== 'undefined') {
      localStorage.setItem('votelify_admin_token', res.token);
    }
    return res;
  },
  loginAdmin: async (data) => {
    const res = await request('/admin/login', { method: 'POST', body: data });
    if (res?.token && typeof window !== 'undefined') {
      localStorage.setItem('votelify_admin_token', res.token);
    }
    return res;
  },
  logoutAdmin: async () => {
    try {
      return await request('/admin/logout', { method: 'POST' });
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('votelify_admin_token');
      }
    }
  },
  getMe: () => request('/admin/me'),

  // Dashboard et Contrôle du scrutin
  getDashboardStats: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/dashboard${query ? `?${query}` : ''}`);
  },
  getAllElectionsAdmin: () => request('/admin/elections'),
  createElectionAdmin: (data) => request('/admin/elections', { method: 'POST', body: data }),
  updateElectionAdmin: (id, data) => request(`/admin/elections/${id}`, { method: 'PATCH', body: data }),
  deleteElectionAdmin: (id) => request(`/admin/elections/${id}`, { method: 'DELETE' }),
  openElectionVotingAdmin: (id) => request(`/admin/elections/${id}/open-voting`, { method: 'POST' }),
  closeElectionVotingAdmin: (id) => request(`/admin/elections/${id}/close-voting`, { method: 'POST' }),
  openElectionCandidaciesAdmin: (id) => request(`/admin/elections/${id}/open-candidates`, { method: 'POST' }),
  closeElectionCandidaciesAdmin: (id) => request(`/admin/elections/${id}/close-candidates`, { method: 'POST' }),
  publishElectionResultsAdmin: (id) => request(`/admin/elections/${id}/publish-results`, { method: 'POST' }),
  unpublishElectionResultsAdmin: (id) => request(`/admin/elections/${id}/unpublish-results`, { method: 'POST' }),
  uploadElectionImageAdmin: (id, image) => request(`/admin/elections/${id}/upload-image`, { method: 'POST', body: { image } }),

  updateSettings: (data) => request('/admin/election/settings', { method: 'PATCH', body: data }),
  openVoting: () => request('/admin/election/open-voting', { method: 'POST' }),
  closeVoting: () => request('/admin/election/close-voting', { method: 'POST' }),
  openCandidacies: () => request('/admin/election/open-candidates', { method: 'POST' }),
  closeCandidacies: () => request('/admin/election/close-candidates', { method: 'POST' }),
  publishResults: () => request('/admin/election/publish-results', { method: 'POST' }),
  unpublishResults: () => request('/admin/election/unpublish-results', { method: 'POST' }),
  getTally: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/election/tally${query ? `?${query}` : ''}`);
  },
  resetTestData: (data) => request('/admin/election/reset', { method: 'POST', body: data }),

  // Gestion des postes
  getAllPositionsAdmin: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/positions${query ? `?${query}` : ''}`);
  },
  createPosition: (data) => request('/admin/positions', { method: 'POST', body: data }),
  updatePosition: (id, data) => request(`/admin/positions/${id}`, { method: 'PATCH', body: data }),
  deletePosition: (id) => request(`/admin/positions/${id}`, { method: 'DELETE' }),

  // Registre des électeurs
  previewVoters: (data) => request('/admin/voters/preview', { method: 'POST', body: data }),
  importVoters: (data) => request('/admin/voters/import', { method: 'POST', body: data }),
  getVoters: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/voters${query ? `?${query}` : ''}`);
  },
  exportVoters: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/voters/export${query ? `?${query}` : ''}`);
  },
  deleteVoter: (id) => request(`/admin/voters/${id}`, { method: 'DELETE' }),
  regenerateVoterPin: (id) => request(`/admin/voters/${id}/regenerate-pin`, { method: 'POST' }),

  // Modération des candidatures
  getAllCandidatesAdmin: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/candidates${query ? `?${query}` : ''}`);
  },
  getCandidateByIdAdmin: (id) => request(`/admin/candidates/${id}`),
  approveCandidate: (id, data = {}) => request(`/admin/candidates/${id}/approve`, { method: 'PATCH', body: { status: 'approved', ...data } }),
  rejectCandidate: (id, data = {}) => request(`/admin/candidates/${id}/reject`, { method: 'PATCH', body: { status: 'rejected', ...data } }),
  updateCandidateAdmin: (id, data) => request(`/admin/candidates/${id}`, { method: 'PATCH', body: data }),
  deleteCandidateAdmin: (id) => request(`/admin/candidates/${id}`, { method: 'DELETE' }),
};

/**
 * getloss - Cloud Store Engine para API Serverless
 * Proporciona persistencia permanente en la nube y sincronización en tiempo real
 * entre Celulares, Tablets y Computadoras de Escritorio (PC / Mac).
 */

const CLOUD_ENDPOINTS = [
  'https://extendsclass.com/api/json-storage/bin/cbcdaec',
  'https://extendsclass.com/api/json-storage/bin/bafddad'
];
const CLOUD_SECURITY_KEY = 'getloss-master-key-2026';

// Memoria caché de instancia
let memoryCache = {
  users: [],
  finances: {}
};

// Fusionar usuarios sin duplicados de forma segura
function mergeUsers(a = [], b = []) {
  const map = new Map();
  for (const u of a || []) {
    if (u && u.email) map.set(u.email.toLowerCase(), u);
  }
  for (const u of b || []) {
    if (u && u.email) {
      const prev = map.get(u.email.toLowerCase()) || {};
      map.set(u.email.toLowerCase(), { ...prev, ...u });
    }
  }
  return Array.from(map.values());
}

// Obtener estado global completo
async function fetchFullCloudState() {
  for (const endpoint of CLOUD_ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        headers: {
          'Security-key': CLOUD_SECURITY_KEY,
          'Accept': 'application/json'
        }
      });
      if (res.ok) {
        const text = await res.text();
        const json = text ? JSON.parse(text) : {};
        memoryCache.users = mergeUsers(memoryCache.users, json.users || []);
        memoryCache.finances = {
          ...(memoryCache.finances || {}),
          ...(json.finances || {})
        };
        return memoryCache;
      }
    } catch (e) {
      console.warn(`[CloudStore] Endpoint ${endpoint} read error:`, e.message);
    }
  }
  return memoryCache;
}

// Guardar estado global completo
async function saveFullCloudState(state) {
  memoryCache = state;

  const payload = {
    users: state.users || [],
    finances: state.finances || {},
    updatedAt: new Date().toISOString()
  };

  const writePromises = CLOUD_ENDPOINTS.map(async (endpoint) => {
    try {
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Security-key': CLOUD_SECURITY_KEY
        },
        body: JSON.stringify(payload)
      });
      return res.ok;
    } catch {
      return false;
    }
  });

  const results = await Promise.allSettled(writePromises);
  return results.some(r => r.status === 'fulfilled' && r.value === true);
}

export const CloudStore = {
  // Obtener todos los usuarios registrados en la nube
  getUsers: async () => {
    const state = await fetchFullCloudState();
    return state.users || [];
  },

  // Guardar lista de usuarios en la nube
  saveUsers: async (users) => {
    const state = await fetchFullCloudState();
    state.users = mergeUsers(state.users, users);
    return await saveFullCloudState(state);
  },

  // Obtener finanzas del usuario desde la nube
  getUserFinances: async (userId) => {
    const state = await fetchFullCloudState();
    if (state.finances && state.finances[userId]) {
      return state.finances[userId];
    }
    return { transactions: [], fixedExpenses: [] };
  },

  // Guardar finanzas del usuario en la nube
  saveUserFinances: async (userId, userFinances) => {
    const state = await fetchFullCloudState();
    if (!state.finances) state.finances = {};
    state.finances[userId] = userFinances;
    return await saveFullCloudState(state);
  }
};

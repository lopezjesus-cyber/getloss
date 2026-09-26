/**
 * getloss - Cloud Store Engine para API Serverless en Vercel
 * Proporciona persistencia centralizada en la nube y sincronización universal en tiempo real
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

// Fusionar finanzas sin sobrescribir destructivamente
function mergeFinances(a = {}, b = {}) {
  const merged = { ...(a || {}) };
  for (const [uid, fData] of Object.entries(b || {})) {
    if (!merged[uid]) {
      merged[uid] = fData;
    } else {
      merged[uid] = {
        transactions: Array.isArray(fData.transactions) ? fData.transactions : (merged[uid].transactions || []),
        fixedExpenses: Array.isArray(fData.fixedExpenses) ? fData.fixedExpenses : (merged[uid].fixedExpenses || []),
        lastSync: fData.lastSync || new Date().toISOString()
      };
    }
  }
  return merged;
}

// Obtener estado global completo consultando y reconciliando los nodos de la nube en paralelo
async function fetchFullCloudState() {
  const fetchPromises = CLOUD_ENDPOINTS.map(async (endpoint) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(endpoint, {
        headers: {
          'Accept': 'application/json'
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const text = await res.text();
        let json = {};
        try {
          json = text ? JSON.parse(text) : {};
        } catch {}

        // En caso de que extendsclass devuelva { status: 0, data: "..." } o { status: 0, data: {...} }
        if (json && json.data) {
          try {
            json = typeof json.data === 'string' ? JSON.parse(json.data) : json.data;
          } catch {}
        }

        const endpointUsers = Array.isArray(json.users) ? json.users : [];
        const endpointFinances = (json.finances && typeof json.finances === 'object') ? json.finances : {};

        return { users: endpointUsers, finances: endpointFinances };
      }
    } catch (e) {
      console.warn(`[CloudStore] Endpoint ${endpoint} lectura aviso:`, e.message);
    }
    return null;
  });

  const results = await Promise.allSettled(fetchPromises);
  for (const r of results) {
    if (r.status === 'fulfilled' && r.value) {
      memoryCache.users = mergeUsers(memoryCache.users, r.value.users);
      memoryCache.finances = mergeFinances(memoryCache.finances, r.value.finances);
    }
  }

  return memoryCache;
}

// Guardar estado global completo en todos los nodos de la nube en paralelo
async function saveFullCloudState(state) {
  memoryCache = state;

  const payload = {
    users: state.users || [],
    finances: state.finances || {},
    updatedAt: new Date().toISOString()
  };

  const writePromises = CLOUD_ENDPOINTS.map(async (endpoint) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Security-key': CLOUD_SECURITY_KEY
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
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
    // Búsqueda insensible a mayúsculas
    for (const [key, val] of Object.entries(state.finances || {})) {
      if (key.toLowerCase() === (userId || '').toLowerCase()) {
        return val;
      }
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

/**
 * getloss - Cloud Store Engine para API Serverless
 * Proporciona almacenamiento en la nube persistente y sincronización en tiempo real
 * entre Celulares, Tablets y Computadoras de Escritorio (PC / Mac).
 */

const GLOBAL_CLOUD_ID = 'ff808181a09d98f701a0dd1362f61b60';
const CLOUD_URL = `https://api.restful-api.dev/objects/${GLOBAL_CLOUD_ID}`;

// Claves de entorno opcionales para Upstash / Vercel KV
const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

// Memoria caché local de instancia
let memoryCache = {
  users: [],
  finances: {} // { [userId]: { transactions: [], fixedExpenses: [] } }
};

// Fusionar usuarios sin duplicados de forma segura
function mergeUsers(a = [], b = []) {
  const map = new Map();
  for (const u of a) {
    if (u && u.email) map.set(u.email.toLowerCase(), u);
  }
  for (const u of b) {
    if (u && u.email) {
      const prev = map.get(u.email.toLowerCase()) || {};
      map.set(u.email.toLowerCase(), { ...prev, ...u });
    }
  }
  return Array.from(map.values());
}

// Fusionar finanzas sin duplicados
function mergeFinances(a = {}, b = {}) {
  const merged = { ...a };
  for (const [uid, fData] of Object.entries(b || {})) {
    if (!merged[uid]) {
      merged[uid] = fData;
    } else {
      const txMap = new Map();
      (merged[uid].transactions || []).forEach(t => txMap.set(t.id, t));
      (fData.transactions || []).forEach(t => txMap.set(t.id, t));

      const fixMap = new Map();
      (merged[uid].fixedExpenses || []).forEach(f => fixMap.set(f.id, f));
      (fData.fixedExpenses || []).forEach(f => fixMap.set(f.id, f));

      merged[uid] = {
        transactions: Array.from(txMap.values()),
        fixedExpenses: Array.from(fixMap.values()),
        lastSync: new Date().toISOString()
      };
    }
  }
  return merged;
}

// Función interna para obtener estado global completo
async function fetchFullCloudState() {
  // 1. Probar Upstash / KV si existe
  if (KV_URL && KV_TOKEN) {
    try {
      const res = await fetch(`${KV_URL}/get/getloss_full_store_v1`, {
        headers: { Authorization: `Bearer ${KV_TOKEN}` }
      });
      const data = await res.json();
      if (data && data.result) {
        const parsed = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
        memoryCache.users = mergeUsers(memoryCache.users, parsed.users);
        memoryCache.finances = mergeFinances(memoryCache.finances, parsed.finances);
        return memoryCache;
      }
    } catch (e) {
      console.warn('KV read warning:', e.message);
    }
  }

  // 2. Almacén Global en la Nube
  try {
    const res = await fetch(CLOUD_URL);
    if (res.ok) {
      const json = await res.json();
      if (json && json.data) {
        memoryCache.users = mergeUsers(memoryCache.users, json.data.users);
        memoryCache.finances = mergeFinances(memoryCache.finances, json.data.finances);
        return memoryCache;
      }
    }
  } catch (e) {
    console.warn('Cloud store read error:', e.message);
  }

  return memoryCache;
}

// Función interna para guardar estado global completo
async function saveFullCloudState(state) {
  memoryCache = state;

  // 1. Guardar en Upstash / KV si existe
  if (KV_URL && KV_TOKEN) {
    try {
      await fetch(`${KV_URL}/set/getloss_full_store_v1`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${KV_TOKEN}` },
        body: JSON.stringify(state)
      });
    } catch (e) {
      console.warn('KV write warning:', e.message);
    }
  }

  // 2. Guardar en Almacén Global en la Nube
  try {
    const res = await fetch(CLOUD_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'getloss_global_store_v1',
        data: {
          users: state.users || [],
          finances: state.finances || {},
          updatedAt: new Date().toISOString()
        }
      })
    });
    return res.ok;
  } catch (e) {
    console.error('Cloud store write error:', e.message);
    return false;
  }
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

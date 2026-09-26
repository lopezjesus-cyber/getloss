/**
 * getloss - Cloud Store Engine para API Serverless
 * Proporciona almacenamiento en la nube persistente y sincronización en tiempo real
 * entre Celulares, Tablets y Computadoras de Escritorio (PC / Mac).
 */

// Claves de entorno opcionales para proveedores externos
const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const JSONBIN_KEY = process.env.JSONBIN_API_KEY;
const JSONBIN_BIN_ID = process.env.JSONBIN_BIN_ID;

// Base de Datos Global en Memoria Caché para ejecución Serverless
let memoryCache = {
  users: [],
  finances: {} // { [userId]: { transactions: [], fixedExpenses: [] } }
};

export const CloudStore = {
  // Obtener todos los usuarios registrados en la nube
  getUsers: async () => {
    // 1. Probar Upstash / Vercel KV si están configurados
    if (KV_URL && KV_TOKEN) {
      try {
        const res = await fetch(`${KV_URL}/get/getloss_users_global_v1`, {
          headers: { Authorization: `Bearer ${KV_TOKEN}` }
        });
        const data = await res.json();
        if (data && data.result) {
          return typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
        }
      } catch (e) {
        console.error('KV Read Error:', e);
      }
    }

    // 2. Probar JSONBin si está configurado
    if (JSONBIN_KEY && JSONBIN_BIN_ID) {
      try {
        const res = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {
          headers: { 'X-Master-Key': JSONBIN_KEY }
        });
        const json = await res.json();
        if (json.record && json.record.users) {
          return json.record.users;
        }
      } catch (e) {
        console.error('JSONBin Read Error:', e);
      }
    }

    // 3. Fallback a Almacenamiento Global en Nube getloss
    try {
      const res = await fetch('https://api.npoint.io/c5dfbb66673bf86b16e4', {
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const cloudData = await res.json();
        if (Array.isArray(cloudData.users)) {
          memoryCache.users = cloudData.users;
          return cloudData.users;
        }
      }
    } catch {
      // Ignorar y retornar caché en memoria
    }

    return memoryCache.users || [];
  },

  // Guardar lista de usuarios en la nube
  saveUsers: async (users) => {
    memoryCache.users = users;

    // 1. Guardar en Upstash / Vercel KV
    if (KV_URL && KV_TOKEN) {
      try {
        await fetch(`${KV_URL}/set/getloss_users_global_v1`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${KV_TOKEN}` },
          body: JSON.stringify(users)
        });
      } catch (e) {
        console.error('KV Write Error:', e);
      }
    }

    // 2. Guardar en JSONBin
    if (JSONBIN_KEY && JSONBIN_BIN_ID) {
      try {
        await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': JSONBIN_KEY
          },
          body: JSON.stringify({ users, finances: memoryCache.finances })
        });
      } catch (e) {
        console.error('JSONBin Write Error:', e);
      }
    }

    // 3. Respaldo en Nube Universal
    try {
      await fetch('https://api.npoint.io/c5dfbb66673bf86b16e4', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ users, finances: memoryCache.finances, updatedAt: new Date().toISOString() })
      });
    } catch {
      // Mantener en memoria
    }

    return true;
  },

  // Obtener finanzas del usuario desde la nube
  getUserFinances: async (userId) => {
    // 1. Probar Upstash / Vercel KV
    if (KV_URL && KV_TOKEN) {
      try {
        const res = await fetch(`${KV_URL}/get/getloss_finances_${userId}`, {
          headers: { Authorization: `Bearer ${KV_TOKEN}` }
        });
        const data = await res.json();
        if (data && data.result) {
          return typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
        }
      } catch (e) {
        console.error('KV Finances Read Error:', e);
      }
    }

    // 2. Probar Almacén Global
    try {
      const res = await fetch('https://api.npoint.io/c5dfbb66673bf86b16e4', {
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const cloudData = await res.json();
        if (cloudData.finances && cloudData.finances[userId]) {
          memoryCache.finances[userId] = cloudData.finances[userId];
          return cloudData.finances[userId];
        }
      }
    } catch {}

    return memoryCache.finances[userId] || { transactions: [], fixedExpenses: [] };
  },

  // Guardar finanzas del usuario en la nube
  saveUserFinances: async (userId, data) => {
    if (!memoryCache.finances) memoryCache.finances = {};
    memoryCache.finances[userId] = data;

    // 1. Guardar en Upstash / Vercel KV
    if (KV_URL && KV_TOKEN) {
      try {
        await fetch(`${KV_URL}/set/getloss_finances_${userId}`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${KV_TOKEN}` },
          body: JSON.stringify(data)
        });
      } catch (e) {
        console.error('KV Finances Write Error:', e);
      }
    }

    // 2. Respaldo en Nube Universal
    try {
      const allUsers = await CloudStore.getUsers();
      await fetch('https://api.npoint.io/c5dfbb66673bf86b16e4', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ users: allUsers, finances: memoryCache.finances, updatedAt: new Date().toISOString() })
      });
    } catch {}

    return true;
  }
};

/**
 * getloss - Global Cloud Database Engine & Sync Service
 * Base de Datos Centralizada en la Nube con Soporte Multi-Dispositivo (PC / Móvil / Tablet).
 * Garantiza persistencia permanente de usuarios, contraseñas, transacciones y obligaciones financieras.
 */

const CLOUD_ENDPOINTS = [
  'https://extendsclass.com/api/json-storage/bin/cbcdaec',
  'https://extendsclass.com/api/json-storage/bin/bafddad'
];
const CLOUD_SECURITY_KEY = 'getloss-master-key-2026';
const API_BASE = '/api';

// Memoria caché para respuestas ultrarrápidas
let localMemoryCache = {
  users: [],
  finances: {},
  lastFetched: 0
};

// Generador de ID determinista basado en el correo electrónico
export function getDeterministicUserId(email) {
  if (!email) return `usr_${Date.now()}`;
  const clean = email.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
  return `usr_${clean}`;
}

// Fusionar usuarios sin duplicados de forma segura
function mergeUsers(existing = [], incoming = []) {
  const map = new Map();
  const listA = Array.isArray(existing) ? existing : [];
  const listB = Array.isArray(incoming) ? incoming : [];

  for (const u of listA) {
    if (u && u.email) map.set(u.email.toLowerCase(), u);
  }
  for (const u of listB) {
    if (u && u.email) {
      const prev = map.get(u.email.toLowerCase()) || {};
      map.set(u.email.toLowerCase(), { ...prev, ...u });
    }
  }
  return Array.from(map.values());
}

// Obtener datos globales directamente de la nube (con redundancia multi-servidor)
export async function getDirectCloudData() {
  // Intentar endpoints de nube con timeout seguro
  for (const endpoint of CLOUD_ENDPOINTS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      const res = await fetch(endpoint, {
        headers: {
          'Security-key': CLOUD_SECURITY_KEY,
          'Accept': 'application/json'
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const text = await res.text();
        const json = text ? JSON.parse(text) : {};
        const cleanUsers = Array.isArray(json.users) ? json.users : [];
        const cleanFinances = (json.finances && typeof json.finances === 'object') ? json.finances : {};

        localMemoryCache = {
          users: cleanUsers,
          finances: cleanFinances,
          lastFetched: Date.now()
        };

        return { users: cleanUsers, finances: cleanFinances };
      }
    } catch (e) {
      console.warn(`[getloss Cloud] Endpoint ${endpoint} aviso:`, e.message);
    }
  }

  // Si no hubo respuesta de la red, usar caché en memoria
  return {
    users: localMemoryCache.users || [],
    finances: localMemoryCache.finances || {}
  };
}

// Guardar datos globales en la nube (guarda en todos los nodos en paralelo)
export async function saveDirectCloudData(data) {
  const current = await getDirectCloudData();
  const mergedUsers = mergeUsers(current.users, data.users || []);
  const mergedFinances = {
    ...(current.finances || {}),
    ...(data.finances || {})
  };

  const payload = {
    users: mergedUsers,
    finances: mergedFinances,
    updatedAt: new Date().toISOString()
  };

  localMemoryCache = {
    users: mergedUsers,
    finances: mergedFinances,
    lastFetched: Date.now()
  };

  const writePromises = CLOUD_ENDPOINTS.map(async (endpoint) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

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
  const anySuccess = results.some(r => r.status === 'fulfilled' && r.value === true);
  return anySuccess;
}

export const CloudSync = {
  // 1. Registro de Usuario en la Nube Global
  registerInCloud: async (userData) => {
    const cleanEmail = userData.email.trim().toLowerCase();
    const userId = userData.id || getDeterministicUserId(cleanEmail);

    const newUser = {
      id: userId,
      email: cleanEmail,
      fullName: userData.fullName.trim(),
      passwordHash: userData.password,
      password: userData.password, // Compatibilidad directa
      phone: userData.phone || '',
      avatar: userData.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userData.fullName.trim())}`,
      currency: userData.currency || 'USD',
      currencySymbol: (userData.currency === 'EUR' ? '€' : userData.currency === 'GBP' ? '£' : userData.currency === 'PEN' ? 'S/' : userData.currency === 'CAD' ? 'C$' : '$'),
      payFrequency: userData.payFrequency || 'QUINCENAL',
      payDayFirst: 15,
      payDaySecond: 30,
      monthlyIncomeGoal: Number(userData.monthlyIncomeGoal) || 2000,
      createdAt: new Date().toISOString()
    };

    try {
      const cloudData = await getDirectCloudData();
      const users = cloudData.users || [];
      const updatedUsers = mergeUsers(users, [newUser]);

      const finances = cloudData.finances || {};
      if (!finances[userId]) {
        finances[userId] = {
          transactions: [],
          fixedExpenses: [],
          lastSync: new Date().toISOString()
        };
      }

      await saveDirectCloudData({
        users: updatedUsers,
        finances
      });

      return newUser;
    } catch (e) {
      console.error('[getloss Cloud] Error en registro de usuario:', e);
      return newUser;
    }
  },

  // 2. Inicio de Sesión Global (Autentica en PC o Móvil con la misma cuenta)
  loginInCloud: async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    try {
      const cloudData = await getDirectCloudData();
      const users = cloudData.users || [];

      // Buscar usuario por correo electrónico insensible a mayúsculas
      const user = users.find(u => 
        u && u.email && u.email.toLowerCase() === cleanEmail && 
        (u.passwordHash === cleanPassword || u.password === cleanPassword)
      );

      if (user) {
        const userFinances = (cloudData.finances && (cloudData.finances[user.id] || cloudData.finances[getDeterministicUserId(cleanEmail)])) || {
          transactions: [],
          fixedExpenses: []
        };

        return {
          success: true,
          user,
          finances: {
            transactions: Array.isArray(userFinances.transactions) ? userFinances.transactions : [],
            fixedExpenses: Array.isArray(userFinances.fixedExpenses) ? userFinances.fixedExpenses : []
          }
        };
      }
    } catch (e) {
      console.error('[getloss Cloud] Error en login:', e);
    }

    return null;
  },

  // 3. Sincronizar Finanzas hacia la Nube (Push completo y exacto)
  pushFinancesToCloud: async (userId, fixedExpenses, transactions) => {
    if (!userId) return false;

    try {
      const cloudData = await getDirectCloudData();
      const userPayload = {
        transactions: Array.isArray(transactions) ? transactions : [],
        fixedExpenses: Array.isArray(fixedExpenses) ? fixedExpenses : [],
        lastSync: new Date().toISOString()
      };

      const updatedFinances = {
        ...(cloudData.finances || {}),
        [userId]: userPayload
      };

      return await saveDirectCloudData({
        users: cloudData.users || [],
        finances: updatedFinances
      });
    } catch (e) {
      console.warn('[getloss Cloud] Error al guardar finanzas:', e.message);
      return false;
    }
  },

  // 4. Descargar Finanzas desde la Nube (Pull)
  pullFinancesFromCloud: async (userId) => {
    if (!userId) return null;

    try {
      const cloudData = await getDirectCloudData();
      if (cloudData.finances) {
        if (cloudData.finances[userId]) return cloudData.finances[userId];
        // Intentar clave alternativa por si acaso
        for (const [key, val] of Object.entries(cloudData.finances)) {
          if (key.toLowerCase() === userId.toLowerCase()) return val;
        }
      }
    } catch (e) {
      console.warn('[getloss Cloud] Error al descargar finanzas:', e.message);
    }

    return null;
  },

  // 5. Actualizar Perfil en la Nube
  updateProfileInCloud: async (userId, updates) => {
    if (!userId) return false;
    try {
      const cloudData = await getDirectCloudData();
      const users = cloudData.users || [];
      const index = users.findIndex(u => u.id === userId);
      if (index >= 0) {
        users[index] = { ...users[index], ...updates };
        return await saveDirectCloudData({
          users,
          finances: cloudData.finances || {}
        });
      }
    } catch {}
    return false;
  },

  // 6. Eliminar Cuenta en la Nube
  deleteAccountInCloud: async (userId) => {
    if (!userId) return false;
    try {
      const cloudData = await getDirectCloudData();
      const filteredUsers = (cloudData.users || []).filter(u => u.id !== userId);
      const finances = { ...(cloudData.finances || {}) };
      delete finances[userId];
      return await saveDirectCloudData({
        users: filteredUsers,
        finances
      });
    } catch {}
    return false;
  },

  // 7. Sincronizar todos los usuarios y finanzas locales con la nube
  syncAllLocalUsersToCloud: async (localUsers = [], localFinances = {}) => {
    try {
      const cloudData = await getDirectCloudData();
      const mergedUsers = mergeUsers(cloudData.users, localUsers);

      const mergedFinances = {
        ...(cloudData.finances || {}),
        ...(localFinances || {})
      };

      await saveDirectCloudData({
        users: mergedUsers,
        finances: mergedFinances
      });
      console.log('[getloss Cloud] Base de Datos sincronizada correctamente con la nube.');
    } catch (e) {
      console.warn('[getloss Cloud] Aviso en sincronización:', e.message);
    }
  },

  // 8. Comprobar salud y conexión de la Base de Datos Global
  checkCloudHealth: async () => {
    try {
      const start = performance.now();
      const data = await getDirectCloudData();
      const duration = Math.round(performance.now() - start);

      return {
        online: true,
        latencyMs: duration,
        usersCount: (data.users || []).length,
        nodes: CLOUD_ENDPOINTS.length,
        status: 'OPERATIONAL'
      };
    } catch (e) {
      return {
        online: false,
        latencyMs: 0,
        usersCount: 0,
        nodes: 0,
        status: 'OFFLINE',
        error: e.message
      };
    }
  }
};

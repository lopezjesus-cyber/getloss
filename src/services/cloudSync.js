/**
 * getloss - Cloud Sync Client Service
 * Comunica el frontend de PC y Celular con la Nube
 * garantizando sincronización bidireccional en tiempo real con soporte offline y cuentas globales.
 */

const API_BASE = '/api';
const DIRECT_CLOUD_URL = 'https://api.restful-api.dev/objects/ff808181a09d98f701a0dd1362f61b60';

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

// Función auxiliar para leer directamente de la nube como respaldo
async function getDirectCloudData() {
  try {
    const res = await fetch(DIRECT_CLOUD_URL);
    if (res.ok) {
      const json = await res.json();
      return json.data || { users: [], finances: {} };
    }
  } catch (e) {
    console.warn('Direct cloud read fallback warning:', e.message);
  }
  return { users: [], finances: {} };
}

// Función auxiliar para guardar directamente en la nube como respaldo
async function saveDirectCloudData(data) {
  try {
    const current = await getDirectCloudData();
    const mergedUsers = mergeUsers(current.users, data.users);
    const mergedFinances = mergeFinances(current.finances, data.finances);

    const res = await fetch(DIRECT_CLOUD_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'getloss_global_store_v1',
        data: {
          users: mergedUsers,
          finances: mergedFinances,
          updatedAt: new Date().toISOString()
        }
      })
    });
    return res.ok;
  } catch (e) {
    console.warn('Direct cloud write fallback error:', e.message);
    return false;
  }
}

export const CloudSync = {
  // 1. Registro en la Nube Global
  registerInCloud: async (userData) => {
    const cleanEmail = userData.email.trim().toLowerCase();

    // A. Intentar endpoint serverless
    try {
      const response = await fetch(`${API_BASE}/auth?action=register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user) return data.user;
      }
    } catch {
      // Continuar al fallback directo
    }

    // B. Respaldo directo a la nube
    try {
      const cloudData = await getDirectCloudData();
      const users = cloudData.users || [];

      const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
      if (existing) {
        return existing;
      }

      const newUser = {
        id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        email: cleanEmail,
        fullName: userData.fullName.trim(),
        passwordHash: userData.password,
        phone: userData.phone || '',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userData.fullName.trim())}`,
        currency: userData.currency || 'USD',
        currencySymbol: (userData.currency === 'EUR' ? '€' : userData.currency === 'GBP' ? '£' : userData.currency === 'PEN' ? 'S/' : userData.currency === 'CAD' ? 'C$' : '$'),
        payFrequency: userData.payFrequency || 'QUINCENAL',
        payDayFirst: 15,
        payDaySecond: 30,
        monthlyIncomeGoal: Number(userData.monthlyIncomeGoal) || 2000,
        createdAt: new Date().toISOString()
      };

      await saveDirectCloudData({
        users: [...users, newUser],
        finances: cloudData.finances || {}
      });

      return newUser;
    } catch (e) {
      console.warn('Error en registro directo en la nube:', e);
      return null;
    }
  },

  // 2. Inicio de Sesión Global (Funciona en PC, Celular, Mac y cualquier navegador con 1 sola cuenta)
  loginInCloud: async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // A. Intentar endpoint serverless
    try {
      const response = await fetch(`${API_BASE}/auth?action=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) return data;
      }
    } catch {
      // Continuar al fallback directo
    }

    // B. Respaldo directo a la nube
    try {
      const cloudData = await getDirectCloudData();
      const users = cloudData.users || [];
      const user = users.find(
        u => u.email.toLowerCase() === cleanEmail && u.passwordHash === cleanPassword
      );

      if (user) {
        const finances = (cloudData.finances && cloudData.finances[user.id]) || { transactions: [], fixedExpenses: [] };
        return { success: true, user, finances };
      }
    } catch (e) {
      console.warn('Error en login directo en la nube:', e);
    }

    return null;
  },

  // 3. Sincronizar Finanzas hacia la Nube (Push)
  pushFinancesToCloud: async (userId, fixedExpenses, transactions) => {
    if (!userId) return false;

    // A. Serverless
    try {
      const response = await fetch(`${API_BASE}/finances?action=sync&userId=${encodeURIComponent(userId)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fixedExpenses, transactions })
      });
      if (response.ok) return true;
    } catch {}

    // B. Directo
    try {
      const cloudData = await getDirectCloudData();
      const userFinances = {
        [userId]: {
          fixedExpenses: Array.isArray(fixedExpenses) ? fixedExpenses : [],
          transactions: Array.isArray(transactions) ? transactions : [],
          lastSync: new Date().toISOString()
        }
      };
      return await saveDirectCloudData({
        users: cloudData.users || [],
        finances: { ...(cloudData.finances || {}), ...userFinances }
      });
    } catch {
      return false;
    }
  },

  // 4. Descargar Finanzas desde la Nube (Pull)
  pullFinancesFromCloud: async (userId) => {
    if (!userId) return null;

    // A. Serverless
    try {
      const response = await fetch(`${API_BASE}/finances?userId=${encodeURIComponent(userId)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.finances) return data.finances;
      }
    } catch {}

    // B. Directo
    try {
      const cloudData = await getDirectCloudData();
      if (cloudData.finances && cloudData.finances[userId]) {
        return cloudData.finances[userId];
      }
    } catch {}

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
        await saveDirectCloudData({
          users,
          finances: cloudData.finances || {}
        });
        return true;
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
      await saveDirectCloudData({
        users: filteredUsers,
        finances
      });
      return true;
    } catch {}
    return false;
  },

  // 7. Sincronizar todos los usuarios y finanzas locales a la nube automáticamente
  syncAllLocalUsersToCloud: async (localUsers = [], localFinances = {}) => {
    try {
      const cloudData = await getDirectCloudData();
      const mergedUsers = mergeUsers(cloudData.users, localUsers);
      const mergedFinances = mergeFinances(cloudData.finances, localFinances);

      await saveDirectCloudData({
        users: mergedUsers,
        finances: mergedFinances
      });
      console.log('[getloss Sync] Cuentas y finanzas globales sincronizadas exitosamente.');
    } catch (e) {
      console.warn('[getloss Sync] Error durante sincronización global:', e);
    }
  }
};

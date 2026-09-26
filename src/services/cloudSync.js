/**
 * getloss - Cloud Sync Client Service
 * Comunica el frontend de PC y Celular con la Nube
 * garantizando sincronización bidireccional en tiempo real con soporte offline.
 */

const API_BASE = '/api';
const DIRECT_CLOUD_URL = 'https://api.restful-api.dev/objects/ff808181a09d98f701a0dd1362f61b60';

// Función auxiliar para leer directamente de la nube como respaldo
async function getDirectCloudData() {
  try {
    const res = await fetch(DIRECT_CLOUD_URL);
    if (res.ok) {
      const json = await res.json();
      return json.data || { users: [], finances: {} };
    }
  } catch (e) {
    console.warn('Direct cloud read fallback error:', e.message);
  }
  return { users: [], finances: {} };
}

// Función auxiliar para guardar directamente en la nube como respaldo
async function saveDirectCloudData(data) {
  try {
    const res = await fetch(DIRECT_CLOUD_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'getloss_global_store_v1',
        data: {
          ...data,
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
  // 1. Registro en la Nube
  registerInCloud: async (userData) => {
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
      const cleanEmail = userData.email.trim().toLowerCase();

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

      users.push(newUser);
      cloudData.users = users;
      await saveDirectCloudData(cloudData);

      return newUser;
    } catch (e) {
      console.warn('Error en registro directo en la nube:', e);
      return null;
    }
  },

  // 2. Inicio de Sesión en la Nube (Permite acceder en PC con cuentas creadas en Celular)
  loginInCloud: async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();

    // A. Intentar endpoint serverless
    try {
      const response = await fetch(`${API_BASE}/auth?action=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password })
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
        u => u.email.toLowerCase() === cleanEmail && u.passwordHash === password
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
      if (!cloudData.finances) cloudData.finances = {};
      cloudData.finances[userId] = {
        fixedExpenses: Array.isArray(fixedExpenses) ? fixedExpenses : [],
        transactions: Array.isArray(transactions) ? transactions : [],
        lastSync: new Date().toISOString()
      };
      return await saveDirectCloudData(cloudData);
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
        cloudData.users = users;
        await saveDirectCloudData(cloudData);
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
      cloudData.users = (cloudData.users || []).filter(u => u.id !== userId);
      if (cloudData.finances && cloudData.finances[userId]) {
        delete cloudData.finances[userId];
      }
      await saveDirectCloudData(cloudData);
      return true;
    } catch {}
    return false;
  },

  // 7. Sincronizar todos los usuarios y finanzas locales a la nube automáticamente
  syncAllLocalUsersToCloud: async (localUsers = [], localFinances = {}) => {
    try {
      const cloudData = await getDirectCloudData();
      let changed = false;
      const cloudUsers = cloudData.users || [];

      for (const lu of localUsers) {
        if (!lu || !lu.email) continue;
        const exists = cloudUsers.some(cu => cu.email.toLowerCase() === lu.email.toLowerCase());
        if (!exists) {
          cloudUsers.push(lu);
          changed = true;
        }
      }

      if (localFinances) {
        if (!cloudData.finances) cloudData.finances = {};
        for (const [uid, fData] of Object.entries(localFinances)) {
          if (!cloudData.finances[uid] || (fData.transactions && fData.transactions.length > (cloudData.finances[uid].transactions?.length || 0))) {
            cloudData.finances[uid] = fData;
            changed = true;
          }
        }
      }

      if (changed) {
        cloudData.users = cloudUsers;
        await saveDirectCloudData(cloudData);
        console.log('[getloss Sync] Cuentas locales sincronizadas a la nube con éxito.');
      }
    } catch (e) {
      console.warn('[getloss Sync] Error durante auto-migración a la nube:', e);
    }
  }
};

/**
 * getloss - Cloud Sync Client Service
 * Comunica el frontend de PC y Celular con la API Serverless en la nube
 * garantizando sincronización bidireccional en tiempo real con soporte offline.
 */

// Helper para llamadas a la API Serverless
const API_BASE = '/api';

export const CloudSync = {
  // 1. Registro en la Nube
  registerInCloud: async (userData) => {
    try {
      const response = await fetch(`${API_BASE}/auth?action=register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar en la nube.');
      }
      return data.user;
    } catch (error) {
      console.warn('Fallo de conexión con la nube durante registro, usando modo local:', error.message);
      return null;
    }
  },

  // 2. Inicio de Sesión en la Nube (Permite acceder en PC con cuentas de Celular)
  loginInCloud: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE}/auth?action=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Credenciales inválidas en la nube.');
      }
      return data; // { success: true, user, finances }
    } catch (error) {
      console.warn('Fallo de conexión con la nube durante login:', error.message);
      return null;
    }
  },

  // 3. Sincronizar Finanzas hacia la Nube (Push)
  pushFinancesToCloud: async (userId, fixedExpenses, transactions) => {
    if (!userId) return false;
    try {
      const response = await fetch(`${API_BASE}/finances?action=sync&userId=${encodeURIComponent(userId)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fixedExpenses, transactions })
      });
      return response.ok;
    } catch (e) {
      console.warn('Error al sincronizar finanzas con la nube:', e);
      return false;
    }
  },

  // 4. Descargar Finanzas desde la Nube (Pull)
  pullFinancesFromCloud: async (userId) => {
    if (!userId) return null;
    try {
      const response = await fetch(`${API_BASE}/finances?userId=${encodeURIComponent(userId)}`);
      if (response.ok) {
        const data = await response.json();
        return data.finances || null;
      }
      return null;
    } catch (e) {
      console.warn('Error al obtener finanzas de la nube:', e);
      return null;
    }
  },

  // 5. Actualizar Perfil en la Nube
  updateProfileInCloud: async (userId, updates) => {
    if (!userId) return false;
    try {
      await fetch(`${API_BASE}/auth?action=update-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, updates })
      });
      return true;
    } catch {
      return false;
    }
  },

  // 6. Eliminar Cuenta en la Nube
  deleteAccountInCloud: async (userId) => {
    if (!userId) return false;
    try {
      await fetch(`${API_BASE}/auth?action=delete-account`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      return true;
    } catch {
      return false;
    }
  }
};

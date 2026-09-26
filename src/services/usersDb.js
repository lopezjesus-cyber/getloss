/**
 * getloss - Base de Datos de Usuarios y Autenticación con Sincronización en la Nube
 * Administra la seguridad, registros, contraseñas, sesiones y sincronización entre PC y Celulares.
 */

import { CloudSync } from './cloudSync';
import { FinancesDB } from './financesDb';

const USERS_STORAGE_KEY = 'getloss_users_db_v1';
const SESSION_STORAGE_KEY = 'getloss_active_session_v1';

export const UsersDB = {
  // Obtener todos los usuarios registrados en local cache
  getAllUsers: () => {
    try {
      const data = localStorage.getItem(USERS_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([]));
        return [];
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error al leer Base de Datos de Usuarios:', e);
      return [];
    }
  },

  // Guardar lista de usuarios localmente
  _saveUsers: (users) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  },

  // Registrar nuevo usuario (Nube + Local)
  register: async (userData) => {
    // 1. Intentar registrar en la Nube Serverless
    let cloudUser = null;
    try {
      cloudUser = await CloudSync.registerInCloud(userData);
    } catch (err) {
      console.warn('Registro en la nube no disponible, guardando local:', err);
    }

    const users = UsersDB.getAllUsers();
    const existingIndex = users.findIndex(u => u.email.toLowerCase() === userData.email.toLowerCase());

    const newUser = cloudUser || {
      id: `usr-${Date.now()}`,
      email: userData.email.trim().toLowerCase(),
      fullName: userData.fullName.trim(),
      passwordHash: userData.password,
      phone: userData.phone || '',
      avatar: userData.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userData.fullName)}`,
      currency: userData.currency || 'USD',
      currencySymbol: (userData.currency === 'EUR' ? '€' : userData.currency === 'GBP' ? '£' : userData.currency === 'PEN' ? 'S/' : userData.currency === 'CAD' ? 'C$' : '$'),
      payFrequency: userData.payFrequency || 'QUINCENAL',
      payDayFirst: 15,
      payDaySecond: 30,
      monthlyIncomeGoal: Number(userData.monthlyIncomeGoal) || 2000,
      createdAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      users[existingIndex] = newUser;
    } else {
      users.push(newUser);
    }

    UsersDB._saveUsers(users);
    UsersDB.setActiveSession(newUser);
    return newUser;
  },

  // Iniciar sesión (Primero en la Nube para traer datos de Celular a PC, luego Local)
  login: async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Intentar autenticar con la Nube Serverless
    try {
      const cloudResult = await CloudSync.loginInCloud(cleanEmail, password);
      if (cloudResult && cloudResult.success && cloudResult.user) {
        const cloudUser = cloudResult.user;

        // Guardar usuario en caché local
        const users = UsersDB.getAllUsers();
        const index = users.findIndex(u => u.email.toLowerCase() === cleanEmail);
        if (index >= 0) {
          users[index] = cloudUser;
        } else {
          users.push(cloudUser);
        }
        UsersDB._saveUsers(users);

        // Si la nube devolvió finanzas asociadas, inyectarlas en FinancesDB
        if (cloudResult.finances && FinancesDB && FinancesDB.injectCloudData) {
          FinancesDB.injectCloudData(cloudUser.id, cloudResult.finances);
        }

        UsersDB.setActiveSession(cloudUser);
        return cloudUser;
      }
    } catch (e) {
      console.warn('Verificación en la nube omitida:', e.message);
    }

    // 2. Fallback a caché local (Offline)
    const users = UsersDB.getAllUsers();
    const user = users.find(
      u => u.email.toLowerCase() === cleanEmail && u.passwordHash === password
    );

    if (!user) {
      throw new Error('Credenciales inválidas. Verifica tu correo y contraseña.');
    }

    UsersDB.setActiveSession(user);
    return user;
  },

  // Obtener sesión activa
  getActiveSession: () => {
    try {
      const session = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!session) return null;
      const user = JSON.parse(session);
      const users = UsersDB.getAllUsers();
      return users.find(u => u.id === user.id) || user;
    } catch {
      return null;
    }
  },

  // Establecer sesión activa
  setActiveSession: (user) => {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
  },

  // Cerrar sesión
  logout: () => {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  },

  // Actualizar perfil de usuario
  updateProfile: async (userId, updates) => {
    const users = UsersDB.getAllUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) throw new Error('Usuario no encontrado');

    users[index] = { ...users[index], ...updates };
    UsersDB._saveUsers(users);

    const active = UsersDB.getActiveSession();
    if (active && active.id === userId) {
      UsersDB.setActiveSession(users[index]);
    }

    // Sincronizar actualización en la nube en segundo plano
    CloudSync.updateProfileInCloud(userId, updates).catch(() => {});

    return users[index];
  },

  // Eliminar Cuenta de Usuario
  deleteUser: async (userId) => {
    const users = UsersDB.getAllUsers();
    const filtered = users.filter(u => u.id !== userId);
    UsersDB._saveUsers(filtered);

    const active = UsersDB.getActiveSession();
    if (active && active.id === userId) {
      UsersDB.logout();
    }

    // Eliminar en la nube
    CloudSync.deleteAccountInCloud(userId).catch(() => {});

    return true;
  },

  // Limpiar Base de Datos de Usuarios
  resetDatabase: () => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([]));
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return [];
  }
};

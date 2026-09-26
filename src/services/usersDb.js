/**
 * getloss - Base de Datos de Usuarios y Autenticación Global en la Nube
 * Administra seguridad, contraseñas, sesiones y sincronización en tiempo real entre PC y Celulares.
 */

import { CloudSync, getDeterministicUserId, getDirectCloudData } from './cloudSync';
import { FirebaseService } from './firebaseService';
import { FinancesDB } from './financesDb';

const USERS_STORAGE_KEY = 'getloss_users_db_v1';
const SESSION_STORAGE_KEY = 'getloss_active_session_v1';

export const UsersDB = {
  // Obtener todos los usuarios registrados en caché local
  getAllUsers: () => {
    try {
      const data = localStorage.getItem(USERS_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([]));
        return [];
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error al leer Base de Datos de Usuarios local:', e);
      return [];
    }
  },

  // Guardar lista de usuarios localmente
  _saveUsers: (users) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  },

  // Obtener usuarios directamente de la nube
  fetchCloudUsers: async () => {
    try {
      const cloudData = await getDirectCloudData();
      if (cloudData && Array.isArray(cloudData.users)) {
        UsersDB._saveUsers(cloudData.users);
        return cloudData.users;
      }
    } catch (e) {
      console.warn('Error al obtener usuarios de la nube:', e);
    }
    return UsersDB.getAllUsers();
  },

  // Registrar nuevo usuario (Guarda permanentemente en la Nube Global y en local)
  register: async (userData) => {
    const cleanEmail = userData.email.trim().toLowerCase();
    const userId = userData.id || getDeterministicUserId(cleanEmail);

    const completeUserData = {
      ...userData,
      id: userId,
      email: cleanEmail
    };

    // 1. Guardar permanentemente en la Base de Datos en la Nube
    let cloudUser = null;
    try {
      cloudUser = await CloudSync.registerInCloud(completeUserData);
    } catch (err) {
      console.warn('[UsersDB] Error al guardar en nube:', err.message);
    }

    // 2. Guardar en Firebase si hay credenciales configuradas
    try {
      await FirebaseService.registerUser(completeUserData);
    } catch {}

    const registeredUser = cloudUser || {
      id: userId,
      email: cleanEmail,
      fullName: userData.fullName.trim(),
      passwordHash: userData.password,
      password: userData.password,
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

    // 3. Guardar en caché local
    const users = UsersDB.getAllUsers();
    const existingIndex = users.findIndex(u => u.email.toLowerCase() === cleanEmail);
    if (existingIndex >= 0) {
      users[existingIndex] = registeredUser;
    } else {
      users.push(registeredUser);
    }
    UsersDB._saveUsers(users);

    // 4. Establecer sesión activa
    UsersDB.setActiveSession(registeredUser);
    return registeredUser;
  },

  // Iniciar sesión global (Autentica contra la Base de Datos Central en tiempo real)
  login: async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // 1. Autenticar directamente contra la Base de Datos Global en la Nube
    try {
      const cloudResult = await CloudSync.loginInCloud(cleanEmail, cleanPassword);
      if (cloudResult && cloudResult.success && cloudResult.user) {
        const cloudUser = cloudResult.user;

        // Actualizar caché local de usuarios
        const users = UsersDB.getAllUsers();
        const index = users.findIndex(u => u.email.toLowerCase() === cleanEmail);
        if (index >= 0) {
          users[index] = cloudUser;
        } else {
          users.push(cloudUser);
        }
        UsersDB._saveUsers(users);

        // Inyectar finanzas de la nube directamente a la base de datos local
        if (cloudResult.finances && FinancesDB && FinancesDB.injectCloudData) {
          FinancesDB.injectCloudData(cloudUser.id, cloudResult.finances);
        }

        // Asegurar la descarga de las finanzas completas y más recientes
        try {
          const liveFinances = await CloudSync.pullFinancesFromCloud(cloudUser.id);
          if (liveFinances && FinancesDB && FinancesDB.injectCloudData) {
            FinancesDB.injectCloudData(cloudUser.id, liveFinances);
          }
        } catch {}

        UsersDB.setActiveSession(cloudUser);
        return cloudUser;
      }
    } catch (e) {
      console.warn('[UsersDB] Error al consultar autenticación en nube:', e.message);
    }

    // 2. Intentar autenticar con Firebase si estuviera configurado
    try {
      const firebaseResult = await FirebaseService.loginUser(cleanEmail, cleanPassword);
      if (firebaseResult && firebaseResult.success && firebaseResult.user) {
        const cloudUser = firebaseResult.user;
        const users = UsersDB.getAllUsers();
        const index = users.findIndex(u => u.email.toLowerCase() === cleanEmail);
        if (index >= 0) {
          users[index] = cloudUser;
        } else {
          users.push(cloudUser);
        }
        UsersDB._saveUsers(users);

        if (firebaseResult.finances && FinancesDB && FinancesDB.injectCloudData) {
          FinancesDB.injectCloudData(cloudUser.id, firebaseResult.finances);
        }

        UsersDB.setActiveSession(cloudUser);
        return cloudUser;
      }
    } catch {}

    // 3. Fallback a caché local si no hay conexión a internet
    const users = UsersDB.getAllUsers();
    const user = users.find(
      u => u.email.toLowerCase() === cleanEmail && 
      (u.passwordHash === cleanPassword || u.password === cleanPassword)
    );

    if (!user) {
      throw new Error('No encontramos una cuenta con este correo y contraseña. Verifica tus datos o regístrate si es tu primera vez.');
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
      return users.find(u => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase()) || user;
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
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      UsersDB._saveUsers(users);
      const active = UsersDB.getActiveSession();
      if (active && (active.id === userId || active.email === users[index].email)) {
        UsersDB.setActiveSession(users[index]);
      }
    }

    // Sincronizar en la Nube en segundo plano
    CloudSync.updateProfileInCloud(userId, updates).catch(() => {});
    FirebaseService.updateProfile(userId, updates).catch(() => {});

    return users[index] || updates;
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

    // Eliminar en la Nube
    CloudSync.deleteAccountInCloud(userId).catch(() => {});
    FirebaseService.deleteAccount(userId).catch(() => {});

    return true;
  },

  // Limpiar Base de Datos de Usuarios
  resetDatabase: () => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([]));
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return [];
  }
};

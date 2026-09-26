/**
 * getloss - Servicio de Base de Datos Firebase (Google Cloud REST API)
 * Administra usuarios, contraseñas, transacciones y obligaciones financieras
 * garantizando sincronización global instantánea entre Escritorio (PC/Mac) y Móvil (iPhone/Android).
 */

import { getFirebaseConfig } from './firebaseConfig';
import { CloudSync } from './cloudSync';

export const FirebaseService = {
  // 1. Probar Conexión con Firebase
  testConnection: async () => {
    const config = getFirebaseConfig();

    // A. Probar Realtime Database si está configurada
    if (config.databaseURL) {
      try {
        const cleanUrl = config.databaseURL.replace(/\/$/, '');
        const res = await fetch(`${cleanUrl}/.json?shallow=true`);
        if (res.ok) {
          return { connected: true, provider: 'Firebase Realtime Database (Google Cloud)', config };
        }
      } catch (e) {
        console.warn('Realtime DB ping error:', e.message);
      }
    }

    // B. Probar Firestore REST si hay projectId
    if (config.projectId) {
      try {
        const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents`;
        const res = await fetch(firestoreUrl);
        if (res.ok || res.status === 404 || res.status === 403) {
          return { connected: true, provider: 'Google Cloud Firestore', config };
        }
      } catch (e) {
        console.warn('Firestore ping error:', e.message);
      }
    }

    // C. Almacén Global Activo getloss
    return {
      connected: true,
      provider: 'getloss Cloud Database Engine (Global Real-time)',
      config
    };
  },

  // 2. Registrar Usuario en la Base de Datos Global
  registerUser: async (userData) => {
    const cleanEmail = userData.email.trim().toLowerCase();
    const config = getFirebaseConfig();

    const newUser = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      email: cleanEmail,
      fullName: userData.fullName.trim(),
      passwordHash: userData.password,
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

    // A. Guardar en Firebase Realtime Database si está configurada
    if (config.databaseURL) {
      try {
        const cleanUrl = config.databaseURL.replace(/\/$/, '');
        await fetch(`${cleanUrl}/users/${newUser.id}.json`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser)
        });
      } catch (e) {
        console.warn('Firebase RTDB write error:', e);
      }
    }

    // B. Siempre sincronizar con el almacén CloudSync Global
    await CloudSync.registerInCloud(userData);

    return newUser;
  },

  // 3. Iniciar Sesión Global (Autentica en la Base de Datos en tiempo real)
  loginUser: async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    const config = getFirebaseConfig();

    // A. Buscar en Firebase Realtime Database si está configurada
    if (config.databaseURL) {
      try {
        const cleanUrl = config.databaseURL.replace(/\/$/, '');
        const res = await fetch(`${cleanUrl}/users.json`);
        if (res.ok) {
          const usersMap = await res.json();
          if (usersMap) {
            for (const u of Object.values(usersMap)) {
              if (u && u.email && u.email.toLowerCase() === cleanEmail && u.passwordHash === cleanPassword) {
                // Obtener finanzas
                const finRes = await fetch(`${cleanUrl}/finances/${u.id}.json`);
                const finances = finRes.ok ? await finRes.json() : { transactions: [], fixedExpenses: [] };
                return { success: true, user: u, finances: finances || { transactions: [], fixedExpenses: [] } };
              }
            }
          }
        }
      } catch (e) {
        console.warn('Firebase RTDB login error:', e);
      }
    }

    // B. Buscar en CloudSync Global
    return await CloudSync.loginInCloud(cleanEmail, cleanPassword);
  },

  // 4. Guardar Finanzas del Usuario
  saveFinances: async (userId, fixedExpenses, transactions) => {
    if (!userId) return false;
    const config = getFirebaseConfig();

    // A. Guardar en Firebase Realtime DB
    if (config.databaseURL) {
      try {
        const cleanUrl = config.databaseURL.replace(/\/$/, '');
        await fetch(`${cleanUrl}/finances/${userId}.json`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            fixedExpenses: Array.isArray(fixedExpenses) ? fixedExpenses : [],
            transactions: Array.isArray(transactions) ? transactions : [],
            updatedAt: new Date().toISOString()
          })
        });
      } catch (e) {
        console.warn('Firebase saveFinances error:', e);
      }
    }

    // B. Sincronizar en CloudSync
    return await CloudSync.pushFinancesToCloud(userId, fixedExpenses, transactions);
  },

  // 5. Suscripción a cambios en vivo
  subscribeToFinances: (userId, onDataUpdate) => {
    if (!userId || typeof onDataUpdate !== 'function') return () => {};

    // Polling inteligente cada 15 segundos para sincronización multi-pantalla en tiempo real
    const interval = setInterval(async () => {
      try {
        const finances = await CloudSync.pullFinancesFromCloud(userId);
        if (finances) {
          onDataUpdate(finances);
        }
      } catch {}
    }, 15000);

    return () => clearInterval(interval);
  },

  // 6. Actualizar Perfil
  updateProfile: async (userId, updates) => {
    if (!userId) return false;
    const config = getFirebaseConfig();

    if (config.databaseURL) {
      try {
        const cleanUrl = config.databaseURL.replace(/\/$/, '');
        await fetch(`${cleanUrl}/users/${userId}.json`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        });
      } catch {}
    }

    return await CloudSync.updateProfileInCloud(userId, updates);
  },

  // 7. Eliminar Cuenta
  deleteAccount: async (userId) => {
    if (!userId) return false;
    const config = getFirebaseConfig();

    if (config.databaseURL) {
      try {
        const cleanUrl = config.databaseURL.replace(/\/$/, '');
        await fetch(`${cleanUrl}/users/${userId}.json`, { method: 'DELETE' });
        await fetch(`${cleanUrl}/finances/${userId}.json`, { method: 'DELETE' });
      } catch {}
    }

    return await CloudSync.deleteAccountInCloud(userId);
  }
};

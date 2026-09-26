/**
 * getloss - Configuración de Firebase y Base de Datos en la Nube
 * Administra las credenciales de Firebase (Google Cloud) y la persistencia global.
 */

const CUSTOM_FIREBASE_KEY = 'getloss_custom_firebase_config_v1';

export const getFirebaseConfig = () => {
  try {
    const custom = localStorage.getItem(CUSTOM_FIREBASE_KEY);
    if (custom) {
      const parsed = JSON.parse(custom);
      if (parsed && (parsed.projectId || parsed.databaseURL || parsed.apiKey)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error al leer configuración personalizada de Firebase:', e);
  }

  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || ''
  };
};

export const saveCustomFirebaseConfig = (config) => {
  if (!config) {
    localStorage.removeItem(CUSTOM_FIREBASE_KEY);
  } else {
    localStorage.setItem(CUSTOM_FIREBASE_KEY, JSON.stringify(config));
  }
};

export const initFirebase = () => {
  return getFirebaseConfig();
};

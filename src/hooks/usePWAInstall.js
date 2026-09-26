import { useState, useEffect } from 'react';

/**
 * usePWAInstall - Hook para gestionar la instalación nativa de la app en PC y Móvil
 */
export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [platform, setPlatform] = useState('desktop'); // 'ios' | 'android' | 'desktop'

  useEffect(() => {
    // 1. Detectar si ya está instalada o ejecutándose como app nativa
    const checkIsInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                           window.navigator.standalone === true ||
                           document.referrer.includes('android-app://');
      setIsInstalled(isStandalone);
    };

    checkIsInstalled();

    // 2. Detectar Plataforma
    const userAgent = window.navigator.userAgent || '';
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    const isAndroid = /android/i.test(userAgent);

    if (isIOS) {
      setPlatform('ios');
      setIsInstallable(true);
    } else if (isAndroid) {
      setPlatform('android');
    } else {
      setPlatform('desktop');
    }

    // 3. Capturar evento de instalación nativa de Chromium (Chrome, Edge, Brave, Android)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 4. Escuchar cuando la app sea instalada
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  /**
   * Dispara la instalación nativa o retorna false si requiere instrucciones manuales (ej. iOS Safari)
   */
  const triggerInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
      return { success: outcome === 'accepted', method: 'native' };
    }

    return { success: false, method: 'guide', platform };
  };

  return {
    isInstallable,
    isInstalled,
    platform,
    triggerInstall,
    hasNativePrompt: !!deferredPrompt
  };
};

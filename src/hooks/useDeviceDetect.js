import { useState, useEffect } from 'react';

/**
 * Hook para detección precisa de dispositivo (PC / Escritorio vs Celular / Móvil)
 * Analiza tamaño de pantalla, capacidades táctiles y User-Agent
 */
export const useDeviceDetect = () => {
  const getDetect = () => {
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isDesktop: true,
        isTablet: false,
        hasTouch: false,
        isIOS: false,
        isAndroid: false,
        width: 1200,
        height: 800,
        deviceType: 'DESKTOP',
      };
    }

    const userAgent = typeof navigator === 'undefined' ? '' : navigator.userAgent;
    const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
    const isAndroid = /Android/i.test(userAgent);
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isSmallScreen = window.innerWidth < 768;
    const isTabletScreen = window.innerWidth >= 768 && window.innerWidth < 1024;
    const hasTouch = 'ontouchstart' in window || (typeof navigator !== 'undefined' && (navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0));

    // Si es UA móvil o pantalla pequeña (< 768px), se clasifica como móvil
    const isMobile = isMobileUA || isSmallScreen;

    return {
      isMobile,
      isDesktop: !isMobile,
      isTablet: isTabletScreen,
      hasTouch,
      isIOS,
      isAndroid,
      width: window.innerWidth,
      height: window.innerHeight,
      deviceType: isMobile ? 'MOBILE' : 'DESKTOP',
    };
  };

  const [deviceInfo, setDeviceInfo] = useState(getDetect);

  useEffect(() => {
    const handleResize = () => {
      setDeviceInfo(getDetect());
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return deviceInfo;
};


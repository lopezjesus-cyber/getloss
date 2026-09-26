import React from 'react';

/**
 * BrandLogo - Logotipo Oficial Vectorial & App Icon de getloss
 * 
 * @param {Object} props
 * @param {'full' | 'icon' | 'app-icon' | 'badge'} [props.variant='full'] - Modo de renderizado
 * @param {'sm' | 'md' | 'lg' | 'xl' | number} [props.size='md'] - Tamaño del componente
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @param {boolean} [props.withGlow=false] - Efecto de resplandor ambiental
 * @param {Object} [props.style={}] - Estilos en línea
 */
export const BrandLogo = ({
  variant = 'full',
  size = 'md',
  className = '',
  withGlow = false,
  style = {}
}) => {
  // Dimensiones según el tamaño solicitado
  const sizeMap = {
    sm: { icon: 20, font: '0.95rem', gap: '0.45rem', box: 28 },
    md: { icon: 26, font: '1.25rem', gap: '0.6rem', box: 38 },
    lg: { icon: 38, font: '1.75rem', gap: '0.75rem', box: 54 },
    xl: { icon: 54, font: '2.5rem', gap: '1rem', box: 76 }
  };

  const currentSize = typeof size === 'number' 
    ? { icon: size, font: `${size * 0.9}px`, gap: `${size * 0.3}px`, box: size * 1.3 } 
    : (sizeMap[size] || sizeMap.md);

  // Isotipo Vectorial Exclusivo getloss (Escudo Hexagonal + Vértice Ascendente + Precisión Cero Fugas)
  const renderVectorIcon = (iconSize) => (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        display: 'block',
        filter: withGlow ? 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.45))' : 'none'
      }}
    >
      <defs>
        <linearGradient id="getlossMetalGrad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="35%" stopColor="#E4E4E7" />
          <stop offset="70%" stopColor="#A1A1AA" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>

        <linearGradient id="getlossGlowGrad" x1="24" y1="2" x2="24" y2="46" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#71717A" stopOpacity="0.4" />
        </linearGradient>

        <linearGradient id="getlossLineGrad" x1="12" y1="36" x2="36" y2="12" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A1A1AA" />
          <stop offset="50%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>
      </defs>

      {/* Escudo Exterior Geométrico */}
      <path
        d="M24 4L40 12V26C40 34.5 33.2 42.1 24 44.5C14.8 42.1 8 34.5 8 26V12L24 4Z"
        fill="#09090B"
        stroke="url(#getlossMetalGrad)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Núcleo Interior: Vértice de Crecimiento Financiero */}
      <path
        d="M24 10L33 16V25C33 30.5 29.2 35.8 24 37.8C18.8 35.8 15 30.5 15 25V16L24 10Z"
        fill="rgba(255, 255, 255, 0.05)"
        stroke="url(#getlossGlowGrad)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Flecha Vectorial Ascendente de Ganancia Neta & Cero Fugas */}
      <path
        d="M17 28L23 21L27 25L32 17"
        stroke="url(#getlossLineGrad)"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M27 17H32V22"
        stroke="#FFFFFF"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Punto de Precisión Central */}
      <circle cx="24" cy="4" r="1.5" fill="#FFFFFF" />
    </svg>
  );

  // Variante 1: Ícono App Móvil con Squircle de Titanio (iOS / Android)
  if (variant === 'app-icon') {
    return (
      <div
        className={`getloss-app-icon ${className}`}
        style={{
          width: `${currentSize.box}px`,
          height: `${currentSize.box}px`,
          borderRadius: `${currentSize.box * 0.225}px`,
          background: 'linear-gradient(145deg, #27272a 0%, #121215 45%, #09090b 100%)',
          border: '1.5px solid rgba(255, 255, 255, 0.28)',
          boxShadow: '0 12px 30px -5px rgba(0, 0, 0, 0.85), inset 0 1px 1px rgba(255, 255, 255, 0.4), 0 0 0 1px rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0,
          ...style
        }}
      >
        {/* Reflejo de Luz Superior Estilo Zafiro */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '45%',
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.16) 0%, transparent 100%)',
          pointerEvents: 'none'
        }} />

        {renderVectorIcon(currentSize.icon)}
      </div>
    );
  }

  // Variante 2: Solo el Isotipo Vectorial
  if (variant === 'icon') {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...style }} className={className}>
        {renderVectorIcon(currentSize.icon)}
      </div>
    );
  }

  // Variante 3: Badge Monocromático con Cápsula
  if (variant === 'badge') {
    return (
      <div
        className={`getloss-brand-badge ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: currentSize.gap,
          padding: '0.35rem 0.85rem 0.35rem 0.45rem',
          borderRadius: '9999px',
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          backdropFilter: 'blur(12px)',
          ...style
        }}
      >
        <div style={{
          width: `${currentSize.icon * 0.95}px`,
          height: `${currentSize.icon * 0.95}px`,
          borderRadius: '50%',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {renderVectorIcon(currentSize.icon * 0.65)}
        </div>
        <span style={{
          fontSize: currentSize.font,
          fontWeight: '800',
          letterSpacing: '-0.035em',
          color: '#ffffff'
        }}>
          getloss
        </span>
      </div>
    );
  }

  // Variante 4 (Default): Logotipo Completo (Isotipo + Wordmark Tipográfico)
  return (
    <div
      className={`getloss-brand-logo ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: currentSize.gap,
        userSelect: 'none',
        ...style
      }}
    >
      {renderVectorIcon(currentSize.icon)}
      <span
        style={{
          fontSize: currentSize.font,
          fontWeight: '800',
          letterSpacing: '-0.04em',
          color: '#ffffff',
          lineHeight: 1
        }}
      >
        getloss
      </span>
    </div>
  );
};

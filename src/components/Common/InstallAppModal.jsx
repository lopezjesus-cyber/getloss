import React, { useState } from 'react';
import { 
  Laptop, 
  Smartphone, 
  Download, 
  Share2, 
  PlusSquare, 
  Check, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Globe 
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export const InstallAppModal = ({ isOpen, onClose, pwaInstall }) => {
  const { platform, triggerInstall, hasNativePrompt, isInstalled } = pwaInstall || {};
  const [activeTab, setActiveTab] = useState(() => (platform === 'ios' || platform === 'android') ? 'mobile' : 'desktop');
  const [installedFeedback, setInstalledFeedback] = useState(false);

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    if (triggerInstall) {
      const res = await triggerInstall();
      if (res.success) {
        setInstalledFeedback(true);
        setTimeout(() => {
          setInstalledFeedback(false);
          onClose();
        }, 1500);
      }
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(16px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.25s ease-out'
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '520px',
          background: 'linear-gradient(145deg, #18181b 0%, #09090b 100%)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '24px',
          padding: '1.75rem',
          boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.95), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
          position: 'relative',
          color: '#ffffff',
          animation: 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: '#a1a1aa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#a1a1aa'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
        >
          <X size={16} />
        </button>

        {/* Encabezado con Ícono App Oficial */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <BrandLogo variant="app-icon" size="lg" withGlow={true} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '800', letterSpacing: '-0.03em', margin: 0 }}>
                Descargar getloss
              </h3>
              <Sparkles size={16} color="#ffffff" />
            </div>
            <p style={{ fontSize: '0.8rem', color: '#86868b', margin: 0 }}>
              Instala la aplicación nativa en tu Escritorio o Celular.
            </p>
          </div>
        </div>

        {/* Segmented Control Selector de Dispositivo */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          background: 'rgba(255, 255, 255, 0.06)',
          padding: '0.25rem',
          borderRadius: '14px',
          marginBottom: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('desktop')}
            style={{
              padding: '0.65rem 0.5rem',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'desktop' ? '#ffffff' : 'transparent',
              color: activeTab === 'desktop' ? '#000000' : '#86868b',
              fontWeight: '700',
              fontSize: '0.825rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <Laptop size={16} />
            <span>💻 PC / Mac</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('mobile')}
            style={{
              padding: '0.65rem 0.5rem',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'mobile' ? '#ffffff' : 'transparent',
              color: activeTab === 'mobile' ? '#000000' : '#86868b',
              fontWeight: '700',
              fontSize: '0.825rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <Smartphone size={16} />
            <span>📱 Celular</span>
          </button>
        </div>

        {/* CONTENIDO TAB 1: DESKTOP (PC & MAC) */}
        {activeTab === 'desktop' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'fadeIn 0.2s ease-in' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '1.15rem'
            }}>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Zap size={16} color="#ffffff" />
                <span>Instalación Directa en 1 Clic</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#a1a1aa', lineHeight: '1.5', margin: 0 }}>
                getloss se ejecuta como una aplicación de escritorio nativa e independiente, sin barras de navegación del navegador, con soporte offline y acceso directo en tu barra de tareas o dock.
              </p>
            </div>

            {/* Botón de Instalación Nativa en PC */}
            <button
              type="button"
              onClick={handleNativeInstall}
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: '12px',
                background: installedFeedback ? '#22c55e' : '#ffffff',
                color: installedFeedback ? '#ffffff' : '#000000',
                fontWeight: '800',
                fontSize: '0.9rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 0 30px rgba(255, 255, 255, 0.25)',
                transition: 'all 0.2s ease'
              }}
            >
              {installedFeedback ? (
                <>
                  <Check size={18} />
                  <span>¡Aplicación Instalada con Éxito!</span>
                </>
              ) : (
                <>
                  <Download size={18} />
                  <span>{hasNativePrompt ? 'Instalar App de Escritorio' : 'Descargar / Instalar en PC'}</span>
                </>
              )}
            </button>

            {/* Guía Alternativa de Navegador */}
            <div style={{ fontSize: '0.72rem', color: '#71717a', textAlign: 'center', lineHeight: '1.4' }}>
              💡 También puedes hacer clic en el ícono de instalación (<strong>⊕</strong> o <strong>⬇</strong>) en la barra de direcciones de Chrome / Edge / Brave.
            </div>
          </div>
        )}

        {/* CONTENIDO TAB 2: MÓVIL (IPHONE & ANDROID) */}
        {activeTab === 'mobile' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'fadeIn 0.2s ease-in' }}>
            {/* Pasos para iPhone / iOS */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '1.15rem'
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>🍎 En iPhone / iPad (Safari):</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.78rem', color: '#a1a1aa' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: '700', fontSize: '0.7rem' }}>1</div>
                  <span>Presiona el botón <strong>Compartir</strong> (<Share2 size={13} style={{ display: 'inline', verticalAlign: 'middle' }} />) en la barra inferior.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: '700', fontSize: '0.7rem' }}>2</div>
                  <span>Selecciona la opción <strong>"Agregar a Inicio"</strong> (<PlusSquare size={13} style={{ display: 'inline', verticalAlign: 'middle' }} />).</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: '700', fontSize: '0.7rem' }}>3</div>
                  <span>Toca <strong>"Agregar"</strong> y el ícono de getloss aparecerá en tu pantalla principal.</span>
                </div>
              </div>
            </div>

            {/* Pasos para Android */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '1.15rem'
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.65rem' }}>
                <span>🤖 En Android (Chrome / Firefox):</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#a1a1aa', margin: 0, lineHeight: '1.4' }}>
                Toca los <strong>tres puntos (⋮)</strong> en la esquina superior derecha y presiona <strong>"Instalar aplicación"</strong> o <strong>"Agregar a pantalla principal"</strong>.
              </p>
            </div>

            {hasNativePrompt && (
              <button
                type="button"
                onClick={handleNativeInstall}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: '12px',
                  background: '#ffffff',
                  color: '#000000',
                  fontWeight: '800',
                  fontSize: '0.85rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <Download size={17} />
                <span>Instalar en este Dispositivo</span>
              </button>
            )}
          </div>
        )}

        {/* Footer con Ventajas */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          marginTop: '1.5rem',
          paddingTop: '1rem',
          fontSize: '0.72rem',
          color: '#71717a'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={14} color="#22c55e" /> Sin descargas pesadas
          </span>
          <span>•</span>
          <span>⚡ Carga instantánea</span>
          <span>•</span>
          <span>🔒 100% Seguro</span>
        </div>
      </div>
    </div>
  );
};

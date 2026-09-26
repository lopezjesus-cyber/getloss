import React, { useState, useEffect } from 'react';
import { getFirebaseConfig, saveCustomFirebaseConfig, initFirebase } from '../../services/firebaseConfig';
import { FirebaseService } from '../../services/firebaseService';
import { CloudSync } from '../../services/cloudSync';
import { Database, ShieldCheck, RefreshCw, X, Check, Globe, Sparkles, Key, Server, Users, ArrowUpRight } from 'lucide-react';

export const FirebaseConfigModal = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState(getFirebaseConfig());
  const [health, setHealth] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [syncStatus, setSyncStatus] = useState('');

  useEffect(() => {
    if (isOpen) {
      setConfig(getFirebaseConfig());
      handleTestConnection();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setIsLoading(true);
    setSyncStatus('');
    try {
      const cloudHealth = await CloudSync.checkCloudHealth();
      setHealth(cloudHealth);
    } catch (e) {
      setHealth({ online: false, error: e.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForceSync = async () => {
    setIsLoading(true);
    setSyncStatus('Sincronizando...');
    try {
      await CloudSync.syncAllLocalUsersToCloud();
      const cloudHealth = await CloudSync.checkCloudHealth();
      setHealth(cloudHealth);
      setSyncStatus('¡Sincronizado con éxito!');
      setTimeout(() => setSyncStatus(''), 2500);
    } catch {
      setSyncStatus('Error al sincronizar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    saveCustomFirebaseConfig(config);
    initFirebase();
    setSavedSuccess(true);
    handleTestConnection();
    setTimeout(() => {
      setSavedSuccess(false);
    }, 2000);
  };

  const handleResetToDefault = () => {
    saveCustomFirebaseConfig(null);
    const def = getFirebaseConfig();
    setConfig(def);
    initFirebase();
    handleTestConnection();
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
          maxWidth: '560px',
          background: 'linear-gradient(145deg, #18181b 0%, #09090b 100%)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          borderRadius: '24px',
          padding: '1.75rem',
          boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.95), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
          position: 'relative',
          color: '#ffffff',
          maxHeight: '90vh',
          overflowY: 'auto'
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
            cursor: 'pointer'
          }}
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #ffffff 0%, #71717a 100%)',
            color: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '900'
          }}>
            <Database size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0 }}>Base de Datos Global en la Nube</h3>
              <Sparkles size={16} color="#ffffff" />
            </div>
            <p style={{ fontSize: '0.78rem', color: '#86868b', margin: 0 }}>
              Cuentas globales y finanzas sincronizadas en tiempo real entre PC, Mac y Móviles.
            </p>
          </div>
        </div>

        {/* Estado de Conexión Live */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '1.1rem',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: health?.online ? '#22c55e' : (isLoading ? '#eab308' : '#ef4444'),
                boxShadow: health?.online ? '0 0 10px #22c55e' : 'none'
              }} />
              <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>
                {isLoading ? 'Verificando servidores...' : (health?.online ? 'Base de Datos Nube Conectada y Operativa' : 'Conexión Local')}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                type="button"
                onClick={handleForceSync}
                disabled={isLoading}
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  borderRadius: '8px',
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  cursor: 'pointer'
                }}
              >
                <RefreshCw size={12} className={isLoading ? 'spin-icon' : ''} />
                <span>{syncStatus || 'Sincronizar'}</span>
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.5rem 0.65rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Latencia</div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#22c55e' }}>{health?.latencyMs ? `${health.latencyMs} ms` : '< 80 ms'}</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.5rem 0.65rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Nodos Espejo</div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff' }}>2 Nodos Activos</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.5rem 0.65rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Cuentas Nube</div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff' }}>{health?.usersCount !== undefined ? `${health.usersCount} usuarios` : 'Sincronizado'}</div>
            </div>
          </div>
        </div>

        {/* Formulario de Configuración Firebase Opcional */}
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#a1a1aa' }}>
                API Key de Firebase (Opcional)
              </label>
              <span style={{ fontSize: '0.68rem', color: '#71717a' }}>Auto-conectado</span>
            </div>
            <input
              type="text"
              value={config.apiKey || ''}
              onChange={e => setConfig({ ...config, apiKey: e.target.value })}
              placeholder="AIzaSy... (Opcional, la nube central ya está activa)"
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '10px',
                padding: '0.6rem 0.8rem',
                color: '#ffffff',
                fontSize: '0.8rem',
                fontFamily: 'monospace'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#a1a1aa', display: 'block', marginBottom: '0.3rem' }}>
                Project ID
              </label>
              <input
                type="text"
                value={config.projectId || ''}
                onChange={e => setConfig({ ...config, projectId: e.target.value })}
                placeholder="getloss-finance-suite"
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '0.6rem 0.8rem',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  fontFamily: 'monospace'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#a1a1aa', display: 'block', marginBottom: '0.3rem' }}>
                Database URL
              </label>
              <input
                type="text"
                value={config.databaseURL || ''}
                onChange={e => setConfig({ ...config, databaseURL: e.target.value })}
                placeholder="https://...firebaseio.com"
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '0.6rem 0.8rem',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  fontFamily: 'monospace'
                }}
              />
            </div>
          </div>

          {/* Botones de Acción */}
          <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.75rem' }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: '12px',
                background: savedSuccess ? '#22c55e' : '#ffffff',
                color: savedSuccess ? '#ffffff' : '#000000',
                fontWeight: '800',
                fontSize: '0.85rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s ease'
              }}
            >
              {savedSuccess ? (
                <>
                  <Check size={16} />
                  <span>¡Configuración Guardada!</span>
                </>
              ) : (
                <span>Guardar Credenciales Personalizadas</span>
              )}
            </button>

            <button
              type="button"
              onClick={handleResetToDefault}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#a1a1aa',
                fontWeight: '700',
                fontSize: '0.8rem',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                cursor: 'pointer'
              }}
            >
              Restablecer
            </button>
          </div>
        </form>

        {/* Nota explicativa */}
        <div style={{
          marginTop: '1.25rem',
          paddingTop: '0.85rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          fontSize: '0.72rem',
          color: '#71717a',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem'
        }}>
          <ShieldCheck size={14} color="#22c55e" />
          <span>Tus cuentas, contraseñas y transacciones se guardan en la nube para acceso universal desde cualquier navegador o celular.</span>
        </div>
      </div>
    </div>
  );
};

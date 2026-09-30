import React from 'react';
import { RotateCw, AlertTriangle, ShieldCheck } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[getloss ErrorBoundary] Capturado error en runtime:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    try {
      localStorage.removeItem('getloss_theme');
      localStorage.removeItem('getloss_active_session_v1');
      sessionStorage.clear();
      if ('caches' in window) {
        caches.keys().then((keys) => {
          keys.forEach((key) => caches.delete(key));
        });
      }
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#09090b',
          color: '#f4f4f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        }}>
          <div style={{
            maxWidth: '480px',
            width: '100%',
            backgroundColor: '#18181b',
            border: '1px solid #27272a',
            borderRadius: '16px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
              color: '#ef4444'
            }}>
              <AlertTriangle size={28} />
            </div>

            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem', color: '#fff' }}>
              Se produjo un problema al iniciar getloss
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#a1a1aa', margin: '0 0 1.5rem', lineHeight: 1.5 }}>
              Detectamos un error inesperado al renderizar la interfaz. Puedes recargar o restablecer la memoria temporal.
            </p>

            {this.state.error && (
              <div style={{
                backgroundColor: '#09090b',
                border: '1px solid #27272a',
                borderRadius: '8px',
                padding: '0.75rem',
                fontSize: '0.75rem',
                color: '#f87171',
                textAlign: 'left',
                overflowX: 'auto',
                marginBottom: '1.5rem',
                maxHeight: '120px'
              }}>
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={this.handleReload}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.25rem',
                  backgroundColor: '#fff',
                  color: '#09090b',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <RotateCw size={16} />
                Recargar aplicación
              </button>

              <button
                onClick={this.handleReset}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.25rem',
                  backgroundColor: 'transparent',
                  color: '#a1a1aa',
                  fontWeight: 500,
                  fontSize: '0.85rem',
                  borderRadius: '10px',
                  border: '1px solid #27272a',
                  cursor: 'pointer'
                }}
              >
                <ShieldCheck size={16} />
                Restablecer caché local
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

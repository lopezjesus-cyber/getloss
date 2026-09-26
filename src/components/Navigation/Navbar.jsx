import React from 'react';
import { Sun, Moon, LogIn, LogOut, User, Plus, Shield } from 'lucide-react';

export const Navbar = ({
  user,
  theme,
  onToggleTheme,
  onOpenAuth,
  onLogout,
  onOpenProfile,
  onOpenAddTx
}) => {
  return (
    <header className="top-navbar">
      {/* Logotipo getloss */}
      <div className="brand-logo-container">
        <div className="brand-badge">
          <span className="brand-dot" />
          <span>getloss</span>
        </div>
        <span className="badge" style={{ fontSize: '0.7rem' }}>
          Fintech Suite
        </span>
      </div>

      {/* Controles del Lado Derecho */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        {/* Botón Acción Rápida (visible en PC/Desktop) */}
        {user && (
          <button
            onClick={onOpenAddTx}
            className="btn-primary hide-on-mobile"
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.9rem' }}
          >
            <Plus size={15} />
            <span>Nuevo Movimiento</span>
          </button>
        )}


        {/* Alternador de Tema Oscuro / Claro */}
        <button
          onClick={onToggleTheme}
          className="btn-icon"
          title={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
          style={{ width: '36px', height: '36px' }}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Perfil o Login */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={onOpenProfile}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-full)',
                padding: '0.25rem 0.75rem 0.25rem 0.35rem',
                transition: 'var(--transition)'
              }}
            >
              <img
                src={user.avatar}
                alt={user.fullName}
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  background: 'var(--bg-card-elevated)'
                }}
              />
              <span style={{ fontSize: '0.825rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                {user.fullName.split(' ')[0]}
              </span>
            </button>

            <button
              onClick={onLogout}
              className="btn-icon"
              title="Cerrar Sesión"
              style={{ width: '36px', height: '36px', color: 'var(--text-muted)' }}
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="btn-primary"
            style={{ fontSize: '0.825rem', padding: '0.5rem 1rem' }}
          >
            <LogIn size={15} />
            <span>Acceder</span>
          </button>
        )}
      </div>
    </header>
  );
};

import React from 'react';
import { Sun, Moon, LogIn, LogOut, Database, Cloud } from 'lucide-react';
import { BrandLogo } from '../Common/BrandLogo';

export const Navbar = ({
  user,
  theme,
  onToggleTheme,
  onOpenAuth,
  onLogout,
  onOpenProfile,
  onOpenAddTx,
  onOpenDatabase,
  onOpenSql
}) => {
  return (
    <header className="top-navbar">
      {/* Logotipo Oficial getloss */}
      <div className="brand-logo-container" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <BrandLogo variant="full" size="sm" withGlow={true} />
        <span className="badge hide-on-mobile" style={{ fontSize: '0.68rem', padding: '0.2rem 0.55rem', borderRadius: '9999px', background: 'var(--bg-card-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
          Fintech Suite
        </span>
      </div>

      {/* Controles del Lado Derecho */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>

        {/* Consola y Tablas de Base de Datos SQL */}
        <button
          onClick={onOpenSql}
          className="sql-status-pill"
          title="Consola y Explorador de Base de Datos Relacional SQL (SQLite)"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.38rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-medium)',
            borderRadius: '9999px',
            padding: '0.28rem 0.55rem',
            fontSize: '0.72rem',
            fontWeight: '700',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            transition: 'var(--transition)'
          }}
          onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
          onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-medium)'; }}
        >
          <Database size={13} style={{ color: '#ffffff' }} />
          <span className="hide-on-mobile">SQL</span>
        </button>

        {/* Estado de Base de Datos Global en la Nube */}
        <button
          onClick={onOpenDatabase}
          className="cloud-status-pill"
          title="Base de Datos Global en la Nube (Sincronización PC & Celular)"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.38rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-medium)',
            borderRadius: '9999px',
            padding: '0.28rem 0.55rem',
            fontSize: '0.72rem',
            fontWeight: '600',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'var(--transition)'
          }}
          onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
          onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-medium)'; }}
        >
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: '#22c55e',
            boxShadow: '0 0 6px rgba(34, 197, 94, 0.8)',
            display: 'inline-block'
          }} />
          <Cloud size={13} style={{ color: 'var(--text-muted)' }} />
          <span className="hide-on-mobile">Nube</span>
        </button>

        {/* Alternador de Tema Oscuro / Claro */}
        <button
          onClick={onToggleTheme}
          className="btn-icon"
          title={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
          style={{ width: '34px', height: '34px' }}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Perfil o Login */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <button
              onClick={onOpenProfile}
              title={`Perfil: ${user.fullName}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-full)',
                padding: '0.2rem 0.6rem 0.2rem 0.25rem',
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
              <span className="hide-on-mobile" style={{ fontSize: '0.825rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                {user.fullName.split(' ')[0]}
              </span>
            </button>

            <button
              onClick={onLogout}
              className="btn-icon hide-on-mobile"
              title="Cerrar Sesión"
              style={{ width: '34px', height: '34px', color: 'var(--text-muted)' }}
            >
              <LogOut size={15} />
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

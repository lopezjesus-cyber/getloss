import React from 'react';
import { LayoutDashboard, ShieldCheck, Receipt, BarChart3, Plus } from 'lucide-react';

export const BottomNav = ({ activeTab, onSelectTab, onOpenAddTx }) => {
  return (
    <nav className="mobile-bottom-nav" style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      background: 'rgba(9, 9, 11, 0.92)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderTop: '1px solid var(--border-medium)',
      padding: '0.4rem 0.75rem calc(0.4rem + env(safe-area-inset-bottom, 0px)) 0.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around'
    }}>
      {/* 1. Dashboard */}
      <button
        onClick={() => onSelectTab('dashboard')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.2rem',
          color: activeTab === 'dashboard' ? 'var(--text-primary)' : 'var(--text-muted)',
          fontSize: '0.68rem',
          fontWeight: activeTab === 'dashboard' ? '700' : '500',
          padding: '0.3rem 0.5rem'
        }}
      >
        <LayoutDashboard size={19} />
        <span>Panel</span>
      </button>

      {/* 2. Gastos Indispensables */}
      <button
        onClick={() => onSelectTab('fixed')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.2rem',
          color: activeTab === 'fixed' ? 'var(--text-primary)' : 'var(--text-muted)',
          fontSize: '0.68rem',
          fontWeight: activeTab === 'fixed' ? '700' : '500',
          padding: '0.3rem 0.5rem'
        }}
      >
        <ShieldCheck size={19} />
        <span>Obligaciones</span>
      </button>

      {/* 3. Botón Central Flotante (+) */}
      <div style={{ position: 'relative', top: '-14px' }}>
        <button
          onClick={onOpenAddTx}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'var(--text-primary)',
            color: 'var(--text-inverse)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.6)',
            border: '3px solid var(--bg-surface)',
            transition: 'var(--transition)'
          }}
        >
          <Plus size={24} strokeWidth={2.5} />
        </button>
      </div>

      {/* 4. Movimientos */}
      <button
        onClick={() => onSelectTab('transactions')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.2rem',
          color: activeTab === 'transactions' ? 'var(--text-primary)' : 'var(--text-muted)',
          fontSize: '0.68rem',
          fontWeight: activeTab === 'transactions' ? '700' : '500',
          padding: '0.3rem 0.5rem'
        }}
      >
        <Receipt size={19} />
        <span>Movimientos</span>
      </button>

      {/* 5. Reportes */}
      <button
        onClick={() => onSelectTab('reports')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.2rem',
          color: activeTab === 'reports' ? 'var(--text-primary)' : 'var(--text-muted)',
          fontSize: '0.68rem',
          fontWeight: activeTab === 'reports' ? '700' : '500',
          padding: '0.3rem 0.5rem'
        }}
      >
        <BarChart3 size={19} />
        <span>Reportes</span>
      </button>
    </nav>
  );
};

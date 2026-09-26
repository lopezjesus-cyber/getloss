import React from 'react';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Receipt, 
  BarChart3, 
  PlusCircle, 
  Sparkles
} from 'lucide-react';

export const Sidebar = ({ activeTab, onSelectTab, onOpenAddTx, fixedCount }) => {
  const navItems = [
    { id: 'dashboard', label: 'Panel Principal', icon: LayoutDashboard },
    { id: 'fixed', label: 'Gastos Indispensables', icon: ShieldCheck, badge: fixedCount },
    { id: 'transactions', label: 'Movimientos', icon: Receipt },
    { id: 'reports', label: 'Reportes y PDF', icon: BarChart3 },
  ];

  return (
    <aside style={{
      width: '260px',
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'none',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '1.5rem 1rem',
      minHeight: 'calc(100vh - 61px)',
      position: 'sticky',
      top: '61px'
    }} className="desktop-sidebar">
      <div>
        {/* Botón de Acción Principal */}
        <button
          onClick={onOpenAddTx}
          className="btn-primary"
          style={{
            width: '100%',
            marginBottom: '1.5rem',
            padding: '0.8rem',
            fontSize: '0.875rem'
          }}
        >
          <PlusCircle size={18} />
          <span>Nuevo Movimiento</span>
        </button>

        {/* Lista de Navegación */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <span style={{
            fontSize: '0.7rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--text-muted)',
            padding: '0.5rem 0.75rem'
          }}>
            Navegación
          </span>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'var(--bg-card-elevated)' : 'transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  border: isActive ? '1px solid var(--border-medium)' : '1px solid transparent',
                  fontWeight: isActive ? '700' : '500',
                  fontSize: '0.875rem',
                  transition: 'var(--transition)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Icon size={18} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="badge" style={{ fontSize: '0.7rem', padding: '0.1rem 0.45rem' }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer del Sidebar */}
      <div style={{
        padding: '0.85rem',
        borderRadius: 'var(--radius-md)',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-primary)' }}>
          getloss Suite
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
          Control Quincenal & Mensual
        </div>
      </div>
    </aside>
  );
};

import React, { useState } from 'react';
import { UsersDB } from '../../services/usersDb';
import { FinancesDB } from '../../services/financesDb';
import { Database, Server, UserCheck, CreditCard, RefreshCw, X, Code, Table as TableIcon } from 'lucide-react';

export const DatabaseModal = ({ isOpen, onClose, onDataReset }) => {
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'finances'
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'json'

  if (!isOpen) return null;

  const users = UsersDB.getAllUsers();
  const rawFinances = FinancesDB.getRawDatabase();

  const handleResetData = () => {
    if (window.confirm('¿Deseas restablecer ambas bases de datos a sus valores iniciales de fábrica?')) {
      UsersDB.resetDatabase();
      FinancesDB.resetDatabase();
      onDataReset();
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ maxWidth: '850px', width: '95%' }}>
        {/* Cabecera */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--text-primary)',
              color: 'var(--text-inverse)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Database size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                Arquitectura de Bases de Datos Separadas
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Visualizador de Base de Datos de Usuarios y Base de Datos Financiera de Clientes
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn-icon" style={{ width: '32px', height: '32px' }}>
            <X size={16} />
          </button>
        </div>

        {/* Selector de Base de Datos y Formato */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          marginBottom: '1rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          {/* Tabs: Users DB vs Finances DB */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setActiveTab('users')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.9rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.825rem',
                fontWeight: activeTab === 'users' ? '700' : '500',
                background: activeTab === 'users' ? 'var(--btn-primary-bg)' : 'var(--bg-card)',
                color: activeTab === 'users' ? 'var(--btn-primary-text)' : 'var(--text-secondary)',
                border: '1px solid var(--border-medium)',
                transition: 'var(--transition)'
              }}
            >
              <UserCheck size={14} />
              <span>DB 1: Usuarios ({users.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('finances')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.9rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.825rem',
                fontWeight: activeTab === 'finances' ? '700' : '500',
                background: activeTab === 'finances' ? 'var(--btn-primary-bg)' : 'var(--bg-card)',
                color: activeTab === 'finances' ? 'var(--btn-primary-text)' : 'var(--text-secondary)',
                border: '1px solid var(--border-medium)',
                transition: 'var(--transition)'
              }}
            >
              <CreditCard size={14} />
              <span>DB 2: Finanzas Clientes ({rawFinances.transactions.length} Tx)</span>
            </button>
          </div>

          {/* Selector de Vista: Tabla / JSON */}
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button
              onClick={() => setViewMode('table')}
              className={viewMode === 'table' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
            >
              <TableIcon size={14} />
              <span>Tabla</span>
            </button>
            <button
              onClick={() => setViewMode('json')}
              className={viewMode === 'json' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
            >
              <Code size={14} />
              <span>JSON Raw</span>
            </button>
          </div>
        </div>

        {/* Contenido de la Base de Datos */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-medium)',
          padding: '1rem',
          maxHeight: '380px',
          overflowY: 'auto'
        }}>
          {viewMode === 'json' ? (
            <pre style={{
              fontSize: '0.75rem',
              color: 'var(--text-primary)',
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {JSON.stringify(activeTab === 'users' ? users : rawFinances, null, 2)}
            </pre>
          ) : activeTab === 'users' ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-medium)', color: 'var(--text-muted)', textAlign: 'left' }}>
                  <th style={{ padding: '0.5rem' }}>ID Usuario</th>
                  <th style={{ padding: '0.5rem' }}>Nombre</th>
                  <th style={{ padding: '0.5rem' }}>Email</th>
                  <th style={{ padding: '0.5rem' }}>Frecuencia Cobro</th>
                  <th style={{ padding: '0.5rem' }}>Moneda</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{u.id}</td>
                    <td style={{ padding: '0.5rem', fontWeight: '600' }}>{u.fullName}</td>
                    <td style={{ padding: '0.5rem', color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td style={{ padding: '0.5rem' }}>
                      <span className="badge">{u.payFrequency}</span>
                    </td>
                    <td style={{ padding: '0.5rem', fontWeight: '700' }}>{u.currency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <h5 style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                  Tabla: Transacciones de Clientes ({rawFinances.transactions.length})
                </h5>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-medium)', color: 'var(--text-muted)', textAlign: 'left' }}>
                      <th style={{ padding: '0.4rem' }}>ID Tx</th>
                      <th style={{ padding: '0.4rem' }}>User ID</th>
                      <th style={{ padding: '0.4rem' }}>Título</th>
                      <th style={{ padding: '0.4rem' }}>Tipo</th>
                      <th style={{ padding: '0.4rem' }}>Quincena</th>
                      <th style={{ padding: '0.4rem', textAlign: 'right' }}>Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rawFinances.transactions.map(t => (
                      <tr key={t.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '0.4rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{t.id}</td>
                        <td style={{ padding: '0.4rem', color: 'var(--text-secondary)' }}>{t.userId}</td>
                        <td style={{ padding: '0.4rem', fontWeight: '600' }}>{t.title}</td>
                        <td style={{ padding: '0.4rem' }}>{t.type}</td>
                        <td style={{ padding: '0.4rem' }}>Q{t.periodQuincena}</td>
                        <td style={{ padding: '0.4rem', textAlign: 'right', fontWeight: '700' }}>${t.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div>
                <h5 style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                  Tabla: Gastos Indispensables Fijos ({rawFinances.fixedExpenses.length})
                </h5>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-medium)', color: 'var(--text-muted)', textAlign: 'left' }}>
                      <th style={{ padding: '0.4rem' }}>Concepto</th>
                      <th style={{ padding: '0.4rem' }}>Periodo Asignado</th>
                      <th style={{ padding: '0.4rem' }}>Día Límite</th>
                      <th style={{ padding: '0.4rem', textAlign: 'right' }}>Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rawFinances.fixedExpenses.map(f => (
                      <tr key={f.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '0.4rem', fontWeight: '600' }}>{f.name}</td>
                        <td style={{ padding: '0.4rem' }}>{f.targetPeriod}</td>
                        <td style={{ padding: '0.4rem' }}>Día {f.dueDay}</td>
                        <td style={{ padding: '0.4rem', textAlign: 'right', fontWeight: '700' }}>${f.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer con opción de reinicio */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem' }}>
          <button
            onClick={handleResetData}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              padding: '0.4rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <RefreshCw size={12} />
            <span>Restablecer Datos de Demostración</span>
          </button>

          <button onClick={onClose} className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
            Cerrar Inspector
          </button>
        </div>
      </div>
    </div>
  );
};

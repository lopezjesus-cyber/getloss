import React from 'react';
import { ArrowUpRight, ArrowDownRight, Wallet, ShieldAlert, CheckCircle2, TrendingUp } from 'lucide-react';

export const BalanceCards = ({ summary, user }) => {
  const symbol = user?.currencySymbol || '$';

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '1rem',
      marginBottom: '1.75rem'
    }}>
      {/* 1. Saldo Neto Disponible */}
      <div className="card" style={{
        background: 'linear-gradient(145deg, var(--bg-card-elevated) 0%, var(--bg-card) 100%)',
        border: '1px solid var(--border-medium)'
      }}>
        <div className="card-title">
          <span>Balance Disponible</span>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--text-primary)',
            color: 'var(--text-inverse)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Wallet size={16} />
          </div>
        </div>
        <div className="card-value" style={{ color: summary.netBalance >= 0 ? 'var(--text-primary)' : '#ef4444' }}>
          {symbol}{summary.netBalance.toLocaleString()}
        </div>
        <div style={{ marginTop: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="badge">
            <TrendingUp size={12} />
            {summary.savingsRate}% Ahorro
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Flujo libre del periodo
          </span>
        </div>
      </div>

      {/* 2. Ingresos del Periodo */}
      <div className="card">
        <div className="card-title">
          <span>Ingresos Totales</span>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ArrowUpRight size={18} />
          </div>
        </div>
        <div className="card-value">
          +{symbol}{summary.totalIncome.toLocaleString()}
        </div>
        <div style={{ marginTop: '0.65rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          Entradas registradas
        </div>
      </div>

      {/* 3. Egresos Totales Ejecutados */}
      <div className="card">
        <div className="card-title">
          <span>Egresos Totales</span>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.05)',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ArrowDownRight size={18} />
          </div>
        </div>
        <div className="card-value" style={{ color: 'var(--text-secondary)' }}>
          -{symbol}{summary.totalExpense.toLocaleString()}
        </div>
        <div style={{ marginTop: '0.65rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {summary.transactionsCount} movimientos realizados
        </div>
      </div>

      {/* 4. Gastos Indispensables / Fijos Pendientes */}
      <div className="card">
        <div className="card-title">
          <span>Obligaciones Fijas</span>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-md)',
            background: summary.fixedPendingAmount > 0 ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.15)',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {summary.fixedPendingAmount > 0 ? <ShieldAlert size={16} /> : <CheckCircle2 size={16} />}
          </div>
        </div>
        <div className="card-value" style={{ fontSize: '1.8rem' }}>
          {symbol}{summary.fixedPendingAmount.toLocaleString()}
        </div>
        <div style={{ marginTop: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span className="badge" style={{
            background: summary.fixedPendingAmount === 0 ? 'var(--text-primary)' : 'var(--badge-bg)',
            color: summary.fixedPendingAmount === 0 ? 'var(--text-inverse)' : 'var(--text-secondary)'
          }}>
            {summary.fixedPendingAmount === 0 ? '✓ Todo al día' : 'Pendiente por pagar'}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            de {symbol}{summary.totalFixedCommitted.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

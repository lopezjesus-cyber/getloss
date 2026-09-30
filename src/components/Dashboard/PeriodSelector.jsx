import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, Layers } from 'lucide-react';

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const PeriodSelector = ({ currentPeriod, onPeriodChange }) => {
  const { year, month, mode = 'QUINCENAL' } = currentPeriod;

  const handlePrevMonth = () => {
    let newMonth = month - 1;
    let newYear = year;
    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }
    onPeriodChange({ ...currentPeriod, month: newMonth, year: newYear });
  };

  const handleNextMonth = () => {
    let newMonth = month + 1;
    let newYear = year;
    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }
    onPeriodChange({ ...currentPeriod, month: newMonth, year: newYear });
  };

  const setMode = (selectedMode) => {
    onPeriodChange({ ...currentPeriod, mode: selectedMode });
  };

  const monthName = MONTH_NAMES[month - 1];
  const getPeriodLabel = () => {
    if (mode === 'QUINCENAL') return `Control Quincenal (15 Días • ${monthName} ${year})`;
    return `Control Mensual (Mes Completo • ${monthName} ${year})`;
  };

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: '0.75rem 0.95rem',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '0.75rem',
      marginBottom: '1.25rem',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Selector de Mes con Flechas */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', width: '100%', maxWidth: '300px' }}>
        <button
          onClick={handlePrevMonth}
          className="btn-icon"
          title="Mes Anterior"
          style={{ width: '32px', height: '32px', flexShrink: 0 }}
        >
          <ChevronLeft size={16} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'center' }}>
          <Calendar size={16} style={{ color: 'var(--text-secondary)' }} />
          <span style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-primary)' }}>
            {monthName} {year}
          </span>
        </div>

        <button
          onClick={handleNextMonth}
          className="btn-icon"
          title="Mes Siguiente"
          style={{ width: '32px', height: '32px', flexShrink: 0 }}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Selector Directo: QUINCENAL vs MENSUAL con ancho adaptable */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'var(--bg-surface)',
        padding: '0.25rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-medium)',
        gap: '0.25rem',
        flex: 1,
        minWidth: '240px'
      }}>
        <button
          onClick={() => setMode('QUINCENAL')}
          style={{
            flex: 1,
            padding: '0.45rem 0.65rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.8rem',
            fontWeight: mode === 'QUINCENAL' ? '700' : '500',
            background: mode === 'QUINCENAL' ? 'var(--btn-primary-bg)' : 'transparent',
            color: mode === 'QUINCENAL' ? 'var(--btn-primary-text)' : 'var(--text-secondary)',
            boxShadow: mode === 'QUINCENAL' ? 'var(--shadow-sm)' : 'none',
            transition: 'var(--transition)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.35rem',
            whiteSpace: 'nowrap'
          }}
        >
          <span>🗓️ Quincenal</span>
        </button>

        <button
          onClick={() => setMode('MENSUAL')}
          style={{
            flex: 1,
            padding: '0.45rem 0.65rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.8rem',
            fontWeight: mode === 'MENSUAL' ? '700' : '500',
            background: mode === 'MENSUAL' ? 'var(--btn-primary-bg)' : 'transparent',
            color: mode === 'MENSUAL' ? 'var(--btn-primary-text)' : 'var(--text-secondary)',
            boxShadow: mode === 'MENSUAL' ? 'var(--shadow-sm)' : 'none',
            transition: 'var(--transition)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.35rem',
            whiteSpace: 'nowrap'
          }}
        >
          <span>📅 Mensual</span>
        </button>
      </div>

      {/* Indicador de Modo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.75rem', width: '100%', justifyContent: 'flex-start' }}>
        <Clock size={13} />
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{getPeriodLabel()}</span>
      </div>
    </div>
  );
};

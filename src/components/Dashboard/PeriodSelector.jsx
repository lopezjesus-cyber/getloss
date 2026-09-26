import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const PeriodSelector = ({ currentPeriod, onPeriodChange }) => {
  const { year, month, quincena } = currentPeriod;

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

  const setQuincena = (q) => {
    onPeriodChange({ ...currentPeriod, quincena: q });
  };

  const getPeriodLabel = () => {
    const monthName = MONTH_NAMES[month - 1];
    if (quincena === '1') return `1ª Quincena (1 - 15 de ${monthName})`;
    if (quincena === '2') return `2ª Quincena (16 - Fin de ${monthName})`;
    return `Mes Completo (${monthName} ${year})`;
  };

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: '0.85rem 1.25rem',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      marginBottom: '1.5rem'
    }}>
      {/* Selector de Mes con Flechas */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button
          onClick={handlePrevMonth}
          className="btn-icon"
          title="Mes Anterior"
          style={{ width: '32px', height: '32px' }}
        >
          <ChevronLeft size={16} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '160px', justifyContent: 'center' }}>
          <Calendar size={16} style={{ color: 'var(--text-secondary)' }} />
          <span style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-primary)' }}>
            {MONTH_NAMES[month - 1]} {year}
          </span>
        </div>

        <button
          onClick={handleNextMonth}
          className="btn-icon"
          title="Mes Siguiente"
          style={{ width: '32px', height: '32px' }}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Selector de Quincena o Mes */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'var(--bg-surface)',
        padding: '0.25rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        gap: '0.25rem'
      }}>
        <button
          onClick={() => setQuincena('1')}
          style={{
            padding: '0.45rem 0.85rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.8rem',
            fontWeight: quincena === '1' ? '700' : '500',
            background: quincena === '1' ? 'var(--btn-primary-bg)' : 'transparent',
            color: quincena === '1' ? 'var(--btn-primary-text)' : 'var(--text-secondary)',
            transition: 'var(--transition)'
          }}
        >
          1ª Quincena (1-15)
        </button>

        <button
          onClick={() => setQuincena('2')}
          style={{
            padding: '0.45rem 0.85rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.8rem',
            fontWeight: quincena === '2' ? '700' : '500',
            background: quincena === '2' ? 'var(--btn-primary-bg)' : 'transparent',
            color: quincena === '2' ? 'var(--btn-primary-text)' : 'var(--text-secondary)',
            transition: 'var(--transition)'
          }}
        >
          2ª Quincena (16-Fin)
        </button>

        <button
          onClick={() => setQuincena('ALL')}
          style={{
            padding: '0.45rem 0.85rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.8rem',
            fontWeight: quincena === 'ALL' ? '700' : '500',
            background: quincena === 'ALL' ? 'var(--btn-primary-bg)' : 'transparent',
            color: quincena === 'ALL' ? 'var(--btn-primary-text)' : 'var(--text-secondary)',
            transition: 'var(--transition)'
          }}
        >
          Mes Completo
        </button>
      </div>

      {/* Indicador de Rango de Fechas */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        <Clock size={14} />
        <span>{getPeriodLabel()}</span>
      </div>
    </div>
  );
};

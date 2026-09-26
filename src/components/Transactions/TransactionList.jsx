import React, { useState } from 'react';
import { FinancesDB, DEFAULT_CATEGORIES } from '../../services/financesDb';
import { formatMoney } from '../../utils/formatters';
import { CategoryIcon } from '../Common/CategoryIcon';
import { Search, Filter, Trash2, ArrowUpRight, ArrowDownRight, Tag, Calendar, FileText } from 'lucide-react';

export const TransactionList = ({ user, currentPeriod, onDataChanged }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const { year, month, mode } = currentPeriod;
  const currency = user?.currency || 'USD';

  const transactions = FinancesDB.getTransactions(user.id, {
    year,
    month,
    mode
  });

  // Filtrado local
  const filteredTxs = transactions.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (t.notes && t.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'ALL' || t.type === typeFilter;
    const matchesCategory = categoryFilter === 'ALL' || t.categoryId === categoryFilter;
    return matchesSearch && matchesType && matchesCategory;
  });

  const handleDelete = (txId) => {
    if (window.confirm('¿Deseas eliminar este movimiento financiero?')) {
      FinancesDB.deleteTransaction(txId);
      onDataChanged();
    }
  };

  return (
    <div className="card">
      {/* Cabecera y Filtros */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '1.25rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Historial de Movimientos
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Registro detallado de ingresos y egresos para el periodo seleccionado
          </p>
        </div>

        {/* Barra de Búsqueda y Filtros Rápidos */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ position: 'relative', minWidth: '180px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Buscar concepto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 0.6rem 0.45rem 2rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-medium)',
                background: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontSize: '0.8rem'
              }}
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{
              padding: '0.45rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-medium)',
              background: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              fontSize: '0.8rem'
            }}
          >
            <option value="ALL">Todos los Tipos</option>
            <option value="INCOME">Solo Ingresos (+)</option>
            <option value="EXPENSE">Solo Gastos (-)</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              padding: '0.45rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-medium)',
              background: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              fontSize: '0.8rem'
            }}
          >
            <option value="ALL">Todas las Categorías</option>
            {DEFAULT_CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de Transacciones */}
      {filteredTxs.length === 0 ? (
        <div style={{
          padding: '2.5rem 1rem',
          textAlign: 'center',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-md)',
          border: '1px dashed var(--border-medium)'
        }}>
          <FileText size={28} style={{ color: 'var(--text-muted)', margin: '0 auto 0.5rem auto' }} />
          <p style={{ fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            No se encontraron movimientos registrados con estos filtros.
          </p>
          <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Presiona el botón "+" o "Registrar Movimiento" para agregar un nuevo ingreso o gasto.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {filteredTxs.map(t => {
            const cat = FinancesDB.getCategoryById(t.categoryId);
            const isIncome = t.type === 'INCOME';

            return (
              <div
                key={t.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  transition: 'var(--transition)'
                }}
              >
                {/* Lado Izquierdo: Icono + Detalles */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-md)',
                    background: isIncome ? 'rgba(255, 255, 255, 0.12)' : 'var(--bg-card-elevated)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-primary)'
                  }}>
                    <CategoryIcon iconName={cat.icon} size={18} />
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                        {t.title}
                      </span>
                      {cat.isIndispensable && (
                        <span className="badge" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                          Indispensable
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      <span>{t.date}</span>
                      <span>•</span>
                      <span>{cat.name}</span>
                      <span>•</span>
                      <span>{t.periodMode === 'MENSUAL' ? 'Mensual' : 'Quincenal'}</span>
                      {t.notes && (
                        <>
                          <span>•</span>
                          <span style={{ fontStyle: 'italic' }}>{t.notes}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Lado Derecho: Monto + Acción */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: '1.05rem',
                      fontWeight: '800',
                      fontFamily: 'var(--font-display)',
                      color: isIncome ? 'var(--text-primary)' : 'var(--text-secondary)'
                    }}>
                      {isIncome ? '+' : '-'}{formatMoney(t.amount, currency)}
                    </div>
                    <span style={{
                      fontSize: '0.7rem',
                      color: isIncome ? 'var(--text-secondary)' : 'var(--text-muted)',
                      textTransform: 'uppercase',
                      fontWeight: '600'
                    }}>
                      {isIncome ? 'Ingreso' : 'Egreso'}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDelete(t.id)}
                    title="Eliminar movimiento"
                    style={{
                      padding: '6px',
                      color: 'var(--text-muted)',
                      borderRadius: 'var(--radius-sm)',
                      transition: 'var(--transition)'
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

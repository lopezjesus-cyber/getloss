import React, { useState } from 'react';
import { CategoryIcon } from '../Common/CategoryIcon';
import { FinancesDB, DEFAULT_CATEGORIES } from '../../services/financesDb';
import { formatMoney } from '../../utils/formatters';
import { Plus, Check, Clock, Trash2, ShieldCheck, AlertCircle, Info } from 'lucide-react';

export const FixedExpensesList = ({ user, currentPeriod, onDataChanged }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newFixed, setNewFixed] = useState({
    name: '',
    categoryId: 'cat-services',
    amount: '',
    dueDay: 15,
    targetMode: currentPeriod.mode || 'QUINCENAL',
    isIndispensable: true,
    notes: ''
  });

  const fixedList = FinancesDB.getFixedExpenses(user.id);
  const currency = user?.currency || 'USD';
  const { year, month, mode = 'QUINCENAL' } = currentPeriod;

  // Filtrar según el modo activo (Quincenal o Mensual)
  const filteredList = fixedList.filter(item => {
    if (mode === 'QUINCENAL') return item.targetMode === 'QUINCENAL' || !item.targetMode;
    return true; // En modo mensual se muestran todas las obligaciones del mes
  });

  const currentPeriodKey = `${year}-${month}-${mode}`;
  const totalAmount = filteredList.reduce((sum, item) => sum + item.amount, 0);
  const paidList = filteredList.filter(item => (item.paidPeriods || []).includes(currentPeriodKey));
  const paidAmount = paidList.reduce((sum, item) => sum + item.amount, 0);
  const progressPercent = totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 100;

  const handleTogglePaid = (fixedId) => {
    FinancesDB.toggleFixedExpensePaid(fixedId, year, month, mode);
    onDataChanged();
  };

  const handleDelete = (fixedId) => {
    if (window.confirm('¿Estás seguro de eliminar este gasto indispensable de tu lista?')) {
      FinancesDB.deleteFixedExpense(fixedId);
      onDataChanged();
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newFixed.name || !newFixed.amount) return;

    FinancesDB.addFixedExpense(user.id, {
      ...newFixed,
      amount: Number(newFixed.amount),
      dueDay: Number(newFixed.dueDay)
    });

    setNewFixed({
      name: '',
      categoryId: 'cat-services',
      amount: '',
      dueDay: 15,
      targetMode: mode,
      isIndispensable: true,
      notes: ''
    });
    setIsAddModalOpen(false);
    onDataChanged();
  };

  return (
    <div className="card" style={{ marginBottom: '1.75rem' }}>
      {/* Cabecera del Módulo */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '1.25rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={20} style={{ color: 'var(--text-primary)' }} />
            <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Gastos Constantes e Indispensables
            </h2>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Obligaciones fijas críticas (Servicios, Alquiler, Comida, Transporte) en <strong>Modo {mode === 'QUINCENAL' ? 'Quincenal' : 'Mensual'}</strong>.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary"
          style={{ padding: '0.55rem 1rem', fontSize: '0.825rem' }}
        >
          <Plus size={16} />
          <span>Agregar Obligación</span>
        </button>
      </div>

      {/* Barra de Progreso de Obligaciones */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '0.85rem 1rem',
        marginBottom: '1.25rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
          <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>
            Cumplimiento del Periodo: {progressPercent}% Pagado
          </span>
          <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
            {formatMoney(paidAmount, currency)} de {formatMoney(totalAmount, currency)}
          </span>
        </div>
        <div style={{ width: '100%', height: '8px', background: 'var(--bg-card-elevated)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
          <div
            style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: progressPercent === 100 ? '#ffffff' : 'var(--text-secondary)',
              transition: 'width 0.4s ease-out'
            }}
          />
        </div>
      </div>

      {/* Lista de Gastos Indispensables */}
      {filteredList.length === 0 ? (
        <div style={{
          padding: '2.5rem 1rem',
          textAlign: 'center',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-md)',
          border: '1px dashed var(--border-medium)'
        }}>
          <Info size={28} style={{ color: 'var(--text-muted)', margin: '0 auto 0.5rem auto' }} />
          <p style={{ fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            No hay obligaciones asignadas al {mode === 'QUINCENAL' ? 'Modo Quincenal' : 'Modo Mensual'}.
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Agrega tu arriendo, servicios básicos o presupuesto de comida para mantener el control.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '0.85rem' }}>
          {filteredList.map(item => {
            const cat = FinancesDB.getCategoryById(item.categoryId);
            const isPaid = (item.paidPeriods || []).includes(currentPeriodKey);

            return (
              <div
                key={item.id}
                style={{
                  background: isPaid ? 'rgba(255, 255, 255, 0.03)' : 'var(--bg-surface)',
                  border: isPaid ? '1px solid var(--border-subtle)' : '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  transition: 'var(--transition)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-card-elevated)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-primary)'
                    }}>
                      <CategoryIcon iconName={cat.icon} size={18} />
                    </div>
                    <div>
                      <h4 style={{
                        fontSize: '0.925rem',
                        fontWeight: '700',
                        color: 'var(--text-primary)',
                        textDecoration: isPaid ? 'line-through' : 'none',
                        opacity: isPaid ? 0.75 : 1
                      }}>
                        {item.name}
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {cat.name}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(item.id)}
                    title="Eliminar obligación"
                    style={{ color: 'var(--text-muted)', padding: '4px' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '0.5rem',
                  borderTop: '1px solid var(--border-subtle)'
                }}>
                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {formatMoney(item.amount, currency)}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={11} />
                      <span>Vence día {item.dueDay} ({item.targetMode === 'QUINCENAL' ? 'Quincenal' : 'Mensual'})</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleTogglePaid(item.id)}
                    className={isPaid ? 'btn-secondary' : 'btn-primary'}
                    style={{
                      padding: '0.4rem 0.8rem',
                      fontSize: '0.75rem',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    {isPaid ? (
                      <>
                        <Check size={14} />
                        <span>Pagado</span>
                      </>
                    ) : (
                      <span>Marcar Pagado</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal para Agregar Nuevo Gasto Indispensable */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: '440px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Nueva Obligación Indispensable
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Registra un gasto fijo recurrente (arriendo, servicios de energía/agua, despensa, etc.)
            </p>

            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                  Nombre del Gasto Fijo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. Factura Luz y Gas"
                  value={newFixed.name}
                  onChange={(e) => setNewFixed({ ...newFixed, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.7rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    fontSize: '0.875rem'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                    Monto ({symbol}) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    min="0.01"
                    placeholder="ej. 120.00"
                    value={newFixed.amount}
                    onChange={(e) => setNewFixed({ ...newFixed, amount: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.7rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-medium)',
                      background: 'var(--bg-card)',
                      color: 'var(--text-primary)',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                    Día Límite de Pago
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={newFixed.dueDay}
                    onChange={(e) => setNewFixed({ ...newFixed, dueDay: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.7rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-medium)',
                      background: 'var(--bg-card)',
                      color: 'var(--text-primary)',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                  Categoría
                </label>
                <select
                  value={newFixed.categoryId}
                  onChange={(e) => setNewFixed({ ...newFixed, categoryId: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.7rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    fontSize: '0.875rem'
                  }}
                >
                  {DEFAULT_CATEGORIES.filter(c => c.type === 'EXPENSE').map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.isIndispensable ? '⭐ ' : ''}{cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                  Frecuencia de la Obligación
                </label>
                <select
                  value={newFixed.targetMode}
                  onChange={(e) => setNewFixed({ ...newFixed, targetMode: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.7rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="QUINCENAL">Quincenal (Cada 15 días)</option>
                  <option value="MENSUAL">Mensual (1 vez al mes)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 1 }}
                >
                  Guardar Obligación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

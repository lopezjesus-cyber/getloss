import React, { useState } from 'react';
import { CategoryIcon } from '../Common/CategoryIcon';
import { FinancesDB, DEFAULT_CATEGORIES } from '../../services/financesDb';
import { formatMoney, getCurrencySymbol } from '../../utils/formatters';
import { Plus, Check, Clock, Trash2, ShieldCheck, AlertCircle, Info, Pencil, Calendar, X } from 'lucide-react';

export const FixedExpensesList = ({ user, currentPeriod = {}, onDataChanged }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingFixed, setEditingFixed] = useState(null);
  const [viewFilter, setViewFilter] = useState('ALL'); // 'ALL' | 'QUINCENAL' | 'MENSUAL'

  const currency = user?.currency || 'USD';
  const symbol = getCurrencySymbol(currency) || user?.currencySymbol || '$';
  const { year = new Date().getFullYear(), month = new Date().getMonth() + 1, mode = 'QUINCENAL' } = currentPeriod;

  const [formData, setFormData] = useState({
    name: '',
    categoryId: 'cat-services',
    amount: '',
    dueDay: 15,
    targetMode: mode || 'QUINCENAL',
    isIndispensable: true,
    notes: ''
  });

  const fixedList = user?.id ? FinancesDB.getFixedExpenses(user.id) : [];

  // Filtrado de la lista según la pestaña seleccionada
  const filteredList = fixedList.filter(item => {
    if (viewFilter === 'QUINCENAL') return item.targetMode === 'QUINCENAL' || !item.targetMode;
    if (viewFilter === 'MENSUAL') return item.targetMode === 'MENSUAL';
    return true; // 'ALL' muestra todas las obligaciones
  });

  const currentPeriodKey = `${year}-${month}-${mode}`;
  const totalAmount = filteredList.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  // Verificación coherente de si una obligación está pagada
  const checkIsPaid = (item) => {
    return (item.paidPeriods || []).some(p => 
      p === currentPeriodKey || 
      p === `${year}-${month}` || 
      p === `${year}-${month}-QUINCENAL` || 
      p === `${year}-${month}-MENSUAL`
    );
  };

  const paidList = filteredList.filter(checkIsPaid);
  const paidAmount = paidList.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const progressPercent = totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : (filteredList.length === 0 ? 100 : 0);

  const countQuincenales = fixedList.filter(item => item.targetMode === 'QUINCENAL' || !item.targetMode).length;
  const countMensuales = fixedList.filter(item => item.targetMode === 'MENSUAL').length;

  const handleOpenAdd = () => {
    setEditingFixed(null);
    setFormData({
      name: '',
      categoryId: 'cat-services',
      amount: '',
      dueDay: 15,
      targetMode: mode || 'QUINCENAL',
      isIndispensable: true,
      notes: ''
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingFixed(item);
    setFormData({
      name: item.name || '',
      categoryId: item.categoryId || 'cat-services',
      amount: item.amount !== undefined ? item.amount : '',
      dueDay: item.dueDay || 15,
      targetMode: item.targetMode || 'QUINCENAL',
      isIndispensable: item.isIndispensable !== false,
      notes: item.notes || ''
    });
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingFixed(null);
  };

  const handleTogglePaid = (fixedId) => {
    try {
      FinancesDB.toggleFixedExpensePaid(fixedId, year, month, mode);
      if (onDataChanged) onDataChanged();
    } catch (err) {
      console.error('Error al cambiar estado de pago:', err);
    }
  };

  const handleDelete = (fixedId) => {
    if (window.confirm('¿Estás seguro de eliminar esta obligación de tu lista?')) {
      try {
        FinancesDB.deleteFixedExpense(fixedId);
        if (onDataChanged) onDataChanged();
      } catch (err) {
        console.error('Error al eliminar obligación:', err);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.amount) return;

    try {
      if (editingFixed) {
        FinancesDB.updateFixedExpense(editingFixed.id, {
          ...formData,
          amount: Number(formData.amount),
          dueDay: Number(formData.dueDay) || 15
        });
      } else {
        FinancesDB.addFixedExpense(user.id, {
          ...formData,
          amount: Number(formData.amount),
          dueDay: Number(formData.dueDay) || 15
        });
      }

      handleCloseModal();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert('Error al guardar la obligación: ' + err.message);
    }
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
            Obligaciones fijas críticas (Servicios, Alquiler, Comida, Transporte) proyectadas para este periodo.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn-primary"
          style={{ padding: '0.55rem 1rem', fontSize: '0.825rem' }}
          id="btn-add-obligation"
        >
          <Plus size={16} />
          <span>Agregar Obligación</span>
        </button>
      </div>

      {/* Pestañas de Filtro Rápido con scroll horizontal suave en móvil */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.35rem',
        marginBottom: '1rem',
        background: 'var(--bg-surface)',
        padding: '0.25rem',
        borderRadius: 'var(--radius-md)',
        width: 'fit-content',
        maxWidth: '100%',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}>
        <button
          onClick={() => setViewFilter('ALL')}
          style={{
            padding: '0.35rem 0.65rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem',
            fontWeight: viewFilter === 'ALL' ? '700' : '500',
            background: viewFilter === 'ALL' ? 'var(--bg-card-elevated)' : 'transparent',
            color: viewFilter === 'ALL' ? 'var(--text-primary)' : 'var(--text-secondary)',
            border: viewFilter === 'ALL' ? '1px solid var(--border-medium)' : '1px solid transparent',
            whiteSpace: 'nowrap'
          }}
        >
          Todas ({fixedList.length})
        </button>
        <button
          onClick={() => setViewFilter('QUINCENAL')}
          style={{
            padding: '0.35rem 0.65rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem',
            fontWeight: viewFilter === 'QUINCENAL' ? '700' : '500',
            background: viewFilter === 'QUINCENAL' ? 'var(--bg-card-elevated)' : 'transparent',
            color: viewFilter === 'QUINCENAL' ? 'var(--text-primary)' : 'var(--text-secondary)',
            border: viewFilter === 'QUINCENAL' ? '1px solid var(--border-medium)' : '1px solid transparent',
            whiteSpace: 'nowrap'
          }}
        >
          Quincenales ({countQuincenales})
        </button>
        <button
          onClick={() => setViewFilter('MENSUAL')}
          style={{
            padding: '0.35rem 0.65rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem',
            fontWeight: viewFilter === 'MENSUAL' ? '700' : '500',
            background: viewFilter === 'MENSUAL' ? 'var(--bg-card-elevated)' : 'transparent',
            color: viewFilter === 'MENSUAL' ? 'var(--text-primary)' : 'var(--text-secondary)',
            border: viewFilter === 'MENSUAL' ? '1px solid var(--border-medium)' : '1px solid transparent',
            whiteSpace: 'nowrap'
          }}
        >
          Mensuales ({countMensuales})
        </button>
      </div>

      {/* Barra de Progreso de Obligaciones */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '0.85rem 1rem',
        marginBottom: '1.25rem',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', fontSize: '0.8rem', flexWrap: 'wrap', gap: '0.4rem' }}>
          <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>
            Cumplimiento: {progressPercent}% Pagado
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
              background: progressPercent === 100 ? '#22c55e' : 'var(--text-primary)',
              transition: 'width 0.4s ease-out'
            }}
          />
        </div>
      </div>

      {/* Lista de Gastos Indispensables con grid auto-adaptable a cualquier ancho */}
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
            {viewFilter === 'ALL'
              ? 'No tienes obligaciones registradas en tu lista.'
              : `No hay obligaciones con frecuencia ${viewFilter === 'QUINCENAL' ? 'Quincenal' : 'Mensual'}.`}
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Agrega tu arriendo, servicios básicos o compras indispensables para mantener tu control financiero al día.
          </p>
          <button
            onClick={handleOpenAdd}
            className="btn-secondary"
            style={{ marginTop: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}
          >
            <Plus size={14} />
            <span>Crear primera obligación</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '0.85rem', width: '100%' }}>
          {filteredList.map(item => {
            const cat = FinancesDB.getCategoryById(item.categoryId);
            const isPaid = checkIsPaid(item);

            return (
              <div
                key={item.id}
                style={{
                  background: isPaid ? 'rgba(255, 255, 255, 0.02)' : 'var(--bg-surface)',
                  border: isPaid ? '1px solid var(--border-subtle)' : '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.9rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  transition: 'var(--transition)',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1, minWidth: 0 }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      flexShrink: 0,
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-card-elevated)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-primary)'
                    }}>
                      <CategoryIcon iconName={cat.icon} size={17} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                        <h4 style={{
                          fontSize: '0.875rem',
                          fontWeight: '700',
                          color: 'var(--text-primary)',
                          textDecoration: isPaid ? 'line-through' : 'none',
                          opacity: isPaid ? 0.75 : 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '100%'
                        }}>
                          {item.name}
                        </h4>
                        <span className="badge" style={{ fontSize: '0.6rem', padding: '0.05rem 0.35rem' }}>
                          {item.targetMode === 'MENSUAL' ? 'Mensual' : 'Quincenal'}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {cat.name}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', flexShrink: 0 }}>
                    <button
                      onClick={() => handleOpenEdit(item)}
                      title="Editar obligación"
                      style={{ color: 'var(--text-secondary)', padding: '5px', borderRadius: 'var(--radius-sm)' }}
                      className="btn-icon"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      title="Eliminar obligación"
                      style={{ color: 'var(--text-muted)', padding: '5px', borderRadius: 'var(--radius-sm)' }}
                      className="btn-icon"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '0.5rem',
                  borderTop: '1px solid var(--border-subtle)',
                  gap: '0.5rem',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 'clamp(1rem, 3.5vw, 1.15rem)', fontWeight: '800', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                      {formatMoney(item.amount, currency)}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <Clock size={11} style={{ flexShrink: 0 }} />
                      <span>Vence día {item.dueDay} ({item.targetMode === 'MENSUAL' ? '1/mes' : '15 días'})</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleTogglePaid(item.id)}
                    className={isPaid ? 'btn-secondary' : 'btn-primary'}
                    style={{
                      padding: '0.4rem 0.75rem',
                      fontSize: '0.72rem',
                      borderRadius: 'var(--radius-sm)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      flexShrink: 0
                    }}
                  >
                    {isPaid ? (
                      <>
                        <Check size={13} style={{ color: '#22c55e' }} />
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

      {/* Modal para Agregar o Editar Obligación Indispensable */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-box" style={{ maxWidth: '440px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                {editingFixed ? 'Editar Obligación' : 'Nueva Obligación Indispensable'}
              </h3>
              <button onClick={handleCloseModal} className="btn-icon" style={{ width: '28px', height: '28px' }}>
                <X size={16} />
              </button>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Registra un gasto fijo indispensable recurrente (arriendo, luz/agua, despensa, etc.)
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                  Nombre del Gasto Fijo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. Factura Luz y Gas"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
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
                    value={formData.dueDay}
                    onChange={(e) => setFormData({ ...formData, dueDay: e.target.value })}
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
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
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
                  value={formData.targetMode}
                  onChange={(e) => setFormData({ ...formData, targetMode: e.target.value })}
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
                  onClick={handleCloseModal}
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
                  {editingFixed ? 'Actualizar Obligación' : 'Guardar Obligación'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

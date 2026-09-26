import React, { useState } from 'react';
import { FinancesDB, DEFAULT_CATEGORIES } from '../../services/financesDb';
import { CategoryIcon } from '../Common/CategoryIcon';
import { Plus, ArrowUpRight, ArrowDownRight, Calendar, DollarSign, FileText, Tag, X } from 'lucide-react';

export const AddTransactionModal = ({ isOpen, onClose, user, currentPeriod, onTransactionAdded }) => {
  const [type, setType] = useState('EXPENSE');
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    categoryId: 'cat-food',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    periodQuincena: currentPeriod.quincena === 'ALL' ? (new Date().getDate() <= 15 ? 1 : 2) : Number(currentPeriod.quincena)
  });

  if (!isOpen) return null;

  const availableCategories = DEFAULT_CATEGORIES.filter(c => c.type === type);

  const handleTypeChange = (newType) => {
    setType(newType);
    const firstCat = DEFAULT_CATEGORIES.find(c => c.type === newType);
    if (firstCat) {
      setFormData(prev => ({ ...prev, categoryId: firstCat.id }));
    }
  };

  const handleDateChange = (dateVal) => {
    const day = new Date(dateVal).getDate();
    const autoQuincena = day <= 15 ? 1 : 2;
    setFormData(prev => ({ ...prev, date: dateVal, periodQuincena: autoQuincena }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;

    FinancesDB.addTransaction(user.id, {
      title: formData.title,
      amount: Number(formData.amount),
      type,
      categoryId: formData.categoryId,
      date: formData.date,
      periodQuincena: formData.periodQuincena,
      notes: formData.notes
    });

    onTransactionAdded();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ maxWidth: '480px' }}>
        {/* Cabecera */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Registrar Movimiento
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Añade un nuevo ingreso o gasto a tu registro de finanzas
            </p>
          </div>
          <button onClick={onClose} className="btn-icon" style={{ width: '32px', height: '32px' }}>
            <X size={16} />
          </button>
        </div>

        {/* Selector de Tipo (Ingreso vs Egreso) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.5rem',
          background: 'var(--bg-card)',
          padding: '0.35rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.25rem',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            type="button"
            onClick={() => handleTypeChange('EXPENSE')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              padding: '0.65rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: type === 'EXPENSE' ? '700' : '500',
              background: type === 'EXPENSE' ? 'var(--bg-card-elevated)' : 'transparent',
              color: type === 'EXPENSE' ? 'var(--text-primary)' : 'var(--text-muted)',
              border: type === 'EXPENSE' ? '1px solid var(--border-medium)' : '1px solid transparent',
              transition: 'var(--transition)'
            }}
          >
            <ArrowDownRight size={16} />
            <span>Egreso / Gasto</span>
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange('INCOME')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              padding: '0.65rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: type === 'INCOME' ? '700' : '500',
              background: type === 'INCOME' ? 'var(--bg-card-elevated)' : 'transparent',
              color: type === 'INCOME' ? 'var(--text-primary)' : 'var(--text-muted)',
              border: type === 'INCOME' ? '1px solid var(--border-medium)' : '1px solid transparent',
              transition: 'var(--transition)'
            }}
          >
            <ArrowUpRight size={16} />
            <span>Ingreso / Entrada</span>
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
              Descripción / Concepto *
            </label>
            <input
              type="text"
              required
              placeholder={type === 'EXPENSE' ? 'ej. Compras de despensa' : 'ej. Salario 1ª Quincena'}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-medium)',
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                Monto ({user.currencySymbol || '$'}) *
              </label>
              <div style={{ position: 'relative' }}>
                <DollarSign size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="number"
                  step="0.01"
                  required
                  min="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.75rem 0.75rem 2.2rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                Fecha
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleDateChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  background: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}
              />
            </div>
          </div>

          {/* Categoría con Iconos Vectoriales */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Categoría con Vector
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: '0.5rem',
              maxHeight: '160px',
              overflowY: 'auto',
              padding: '0.5rem',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)'
            }}>
              {availableCategories.map(cat => {
                const isSelected = formData.categoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, categoryId: cat.id })}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.45rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      background: isSelected ? 'var(--btn-primary-bg)' : 'var(--bg-surface)',
                      color: isSelected ? 'var(--btn-primary-text)' : 'var(--text-primary)',
                      border: isSelected ? '1px solid var(--text-primary)' : '1px solid var(--border-subtle)',
                      fontSize: '0.75rem',
                      textAlign: 'left',
                      transition: 'var(--transition)'
                    }}
                  >
                    <CategoryIcon iconName={cat.icon} size={14} />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {cat.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                Periodo Quincenal
              </label>
              <select
                value={formData.periodQuincena}
                onChange={(e) => setFormData({ ...formData, periodQuincena: Number(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  background: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}
              >
                <option value={1}>1ª Quincena (1 - 15)</option>
                <option value={2}>2ª Quincena (16 - 31)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                Notas / Referencia
              </label>
              <input
                type="text"
                placeholder="Opcional"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  background: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              style={{ flex: 1, padding: '0.8rem' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ flex: 1, padding: '0.8rem' }}
            >
              Guardar Movimiento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

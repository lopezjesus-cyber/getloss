import React, { useState } from 'react';
import { UsersDB } from '../../services/usersDb';
import { User, Mail, DollarSign, Calendar, Phone, Check, X, Shield } from 'lucide-react';

export const ProfileModal = ({ isOpen, onClose, user, onProfileUpdated }) => {
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    currency: user?.currency || 'USD',
    payFrequency: user?.payFrequency || 'QUINCENAL',
    monthlyIncomeGoal: user?.monthlyIncomeGoal || 2500
  });
  const [saved, setSaved] = useState(false);

  if (!isOpen || !user) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = UsersDB.updateProfile(user.id, {
      fullName: formData.fullName,
      phone: formData.phone,
      currency: formData.currency,
      currencySymbol: formData.currency === 'EUR' ? '€' : '$',
      payFrequency: formData.payFrequency,
      monthlyIncomeGoal: Number(formData.monthlyIncomeGoal)
    });

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onProfileUpdated(updated);
      onClose();
    }, 600);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ maxWidth: '460px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)' }}>
              Configuración de Cuenta & Finanzas
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Ajusta tus parámetros personales y ciclo de cobro
            </p>
          </div>
          <button onClick={onClose} className="btn-icon" style={{ width: '32px', height: '32px' }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
              Nombre Completo
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
              Correo Electrónico (Solo Lectura)
            </label>
            <input
              type="email"
              disabled
              value={user.email}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface)',
                color: 'var(--text-muted)',
                fontSize: '0.85rem'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                Moneda
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
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
                <option value="USD">USD ($ - Dólar)</option>
                <option value="COP">COP ($ - Peso Col.)</option>
                <option value="MXN">MXN ($ - Peso Mex.)</option>
                <option value="EUR">EUR (€ - Euro)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                Frecuencia de Pago
              </label>
              <select
                value={formData.payFrequency}
                onChange={(e) => setFormData({ ...formData, payFrequency: e.target.value })}
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
                <option value="QUINCENAL">Quincenal (15 y 30)</option>
                <option value="MENSUAL">Mensual</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
              Meta de Ingreso Mensual
            </label>
            <input
              type="number"
              value={formData.monthlyIncomeGoal}
              onChange={(e) => setFormData({ ...formData, monthlyIncomeGoal: e.target.value })}
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

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
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
              {saved ? '¡Guardado!' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

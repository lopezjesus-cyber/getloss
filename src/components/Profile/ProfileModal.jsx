import React, { useState } from 'react';
import { UsersDB } from '../../services/usersDb';
import { FinancesDB } from '../../services/financesDb';
import { getCurrencySymbol } from '../../utils/formatters';
import { User, Mail, DollarSign, Calendar, Phone, Check, X, Shield, Trash2, AlertTriangle, Database } from 'lucide-react';

export const ProfileModal = ({ isOpen, onClose, user, onProfileUpdated, onDeleteAccount, onOpenFirebase, onOpenSql }) => {
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    currency: user?.currency || 'USD',
    payFrequency: user?.payFrequency || 'QUINCENAL',
    monthlyIncomeGoal: user?.monthlyIncomeGoal || 2500
  });
  const [saved, setSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !user) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = UsersDB.updateProfile(user.id, {
      fullName: formData.fullName,
      phone: formData.phone,
      currency: formData.currency,
      currencySymbol: getCurrencySymbol(formData.currency),
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

  const handleConfirmDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      // 1. Eliminar datos financieros del usuario
      FinancesDB.deleteUserData(user.id);
      // 2. Eliminar cuenta de usuario de la base de datos
      UsersDB.deleteUser(user.id);
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      if (onDeleteAccount) {
        onDeleteAccount();
      } else {
        onClose();
      }
    }, 400);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ maxWidth: '480px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)' }}>
              Configuración de Cuenta & Finanzas
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Ajusta tus parámetros personales, divisa o elimina tu cuenta
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
                <option value="ARS">ARS ($ - Peso Arg.)</option>
                <option value="CLP">CLP ($ - Peso Chileno)</option>
                <option value="PEN">PEN (S/ - Sol)</option>
                <option value="GBP">GBP (£ - Libra)</option>
                <option value="CAD">CAD (C$ - Dólar Can.)</option>
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
              step="0.01"
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

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
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

        {/* Sección de Conexión a Base de Datos en la Nube */}
        {onOpenFirebase && (
          <div style={{
            marginTop: '1.25rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '0.825rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                <span>Base de Datos Firebase (Google Cloud)</span>
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '0.15rem 0 0' }}>
                Sincronización global activa entre PC y Celular.
              </p>
            </div>
            <button
              type="button"
              onClick={() => { onClose(); onOpenFirebase(); }}
              className="btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
            >
              <span>Ver Estado</span>
            </button>
          </div>
        )}

        {/* Base de Datos Relacional SQL */}
        {onOpenSql && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            marginTop: '0.75rem'
          }}>
            <div>
              <div style={{ fontSize: '0.825rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Database size={14} style={{ color: '#ffffff' }} />
                <span>Base de Datos SQL (SQLite)</span>
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '0.15rem 0 0' }}>
                Tablas relacionales users, transactions y exportación .SQL
              </p>
            </div>
            <button
              type="button"
              onClick={() => { onClose(); onOpenSql(); }}
              className="btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem', fontWeight: '700' }}
            >
              <span>Abrir SQL</span>
            </button>
          </div>
        )}

        {/* Zona de Peligro: Eliminar Cuenta */}
        <div style={{
          marginTop: '1.25rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--border-medium)'
        }}>
          {!showDeleteConfirm ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(239, 68, 68, 0.04)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem'
            }}>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#f87171' }}>
                  Eliminar Cuenta
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Borrar permanentemente tu usuario y todos tus registros financieros
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  color: '#f87171',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)'; }}
              >
                <Trash2 size={14} />
                <span>Eliminar Cuenta</span>
              </button>
            </div>
          ) : (
            <div style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              animation: 'fadeIn 0.2s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f87171', fontWeight: '700', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                <AlertTriangle size={18} />
                <span>¿Confirmas que deseas eliminar tu cuenta?</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.45' }}>
                Esta acción es <strong>irreversible</strong>. Se eliminarán permanentemente tu perfil, historial de ingresos, egresos, gastos fijos indispensables y reportes.
              </p>

              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="btn-secondary"
                  style={{ flex: 1, fontSize: '0.8rem', padding: '0.5rem' }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  style={{
                    flex: 1.5,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    background: '#dc2626',
                    border: '1px solid #ef4444',
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    cursor: isDeleting ? 'not-allowed' : 'pointer'
                  }}
                >
                  <Trash2 size={14} />
                  <span>{isDeleting ? 'Eliminando...' : 'Sí, Eliminar Permanentemente'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

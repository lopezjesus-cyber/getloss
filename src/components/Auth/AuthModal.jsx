import React, { useState } from 'react';
import { UsersDB } from '../../services/usersDb';
import { Lock, Mail, User, Phone, DollarSign, Calendar, AlertCircle, ArrowRight, ShieldCheck, X } from 'lucide-react';

export const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    currency: 'USD',
    payFrequency: 'QUINCENAL',
    monthlyIncomeGoal: 2000,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        const user = UsersDB.login(formData.email, formData.password);
        onAuthSuccess(user);
        onClose();
      } else {
        if (!formData.fullName || !formData.email || !formData.password) {
          throw new Error('Por favor completa todos los campos obligatorios.');
        }
        const newUser = UsersDB.register(formData);
        onAuthSuccess(newUser);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Ocurrió un error al procesar la solicitud.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ maxWidth: '480px' }}>
        {/* Cabecera del Modal */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ 
              width: '10px', 
              height: '10px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--text-primary)',
              boxShadow: '0 0 12px var(--text-primary)' 
            }} />
            <span style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: '1.75rem', 
              fontWeight: '800', 
              letterSpacing: '-0.04em' 
            }}>
              getloss
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            {isLogin 
              ? 'Inicia sesión para gestionar tus finanzas quincenales y mensuales' 
              : 'Crea tu cuenta y toma el control absoluto de tus ingresos y gastos'}
          </p>
        </div>

        {/* Selector de Pestañas: Iniciar Sesión / Registrarse */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          background: 'var(--bg-card)',
          padding: '0.3rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(''); }}
            style={{
              padding: '0.6rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: isLogin ? '700' : '500',
              fontSize: '0.875rem',
              background: isLogin ? 'var(--bg-card-elevated)' : 'transparent',
              color: isLogin ? 'var(--text-primary)' : 'var(--text-muted)',
              transition: 'var(--transition)'
            }}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(''); }}
            style={{
              padding: '0.6rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: !isLogin ? '700' : '500',
              fontSize: '0.875rem',
              background: !isLogin ? 'var(--bg-card-elevated)' : 'transparent',
              color: !isLogin ? 'var(--text-primary)' : 'var(--text-muted)',
              transition: 'var(--transition)'
            }}
          >
            Crear Cuenta
          </button>
        </div>

        {/* Alerta de Error */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#f87171',
            fontSize: '0.85rem'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {!isLogin && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Nombre Completo *
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  required
                  placeholder="ej. Jesús López"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.75rem 0.75rem 2.4rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Correo Electrónico *
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                required
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 2.4rem',
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
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Contraseña *
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 2.4rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  background: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          {!isLogin && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
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
                    <option value="MENSUAL">Mensual (Mes completo)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
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
                    <option value="COP">COP ($ - Peso Colombiano)</option>
                    <option value="MXN">MXN ($ - Peso Mexicano)</option>
                    <option value="EUR">EUR (€ - Euro)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Ingreso Mensual Estimado
                </label>
                <div style={{ position: 'relative' }}>
                  <DollarSign size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="number"
                    placeholder="2000"
                    value={formData.monthlyIncomeGoal}
                    onChange={(e) => setFormData({ ...formData, monthlyIncomeGoal: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.75rem 0.75rem 2.4rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-medium)',
                      background: 'var(--bg-card)',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem' }}
          >
            {isLoading ? 'Procesando...' : isLogin ? 'Ingresar a getloss' : 'Registrarse en getloss'}
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

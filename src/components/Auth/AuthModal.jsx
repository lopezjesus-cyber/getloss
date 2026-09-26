import React, { useState, useEffect, useRef } from 'react';
import { UsersDB } from '../../services/usersDb';
import { EmailService } from '../../services/emailService';
import { 
  Lock, 
  Mail, 
  User, 
  Phone, 
  DollarSign, 
  Calendar, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  RotateCw, 
  KeyRound, 
  Send,
  X 
} from 'lucide-react';

export const AuthModal = ({ isOpen, onClose, onAuthSuccess, initialIsLogin = true }) => {
  const [isLogin, setIsLogin] = useState(initialIsLogin);
  const [step, setStep] = useState('FORM'); // 'FORM' | 'VERIFY_EMAIL' | 'SUCCESS'

  useEffect(() => {
    setIsLogin(initialIsLogin);
    setStep('FORM');
    setError('');
  }, [initialIsLogin, isOpen]);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    currency: 'USD',
    payFrequency: 'QUINCENAL',
    monthlyIncomeGoal: 2000,
  });

  // Estado para el PIN de 6 dígitos
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const pinInputRefs = useRef([]);

  const [resendTimer, setResendTimer] = useState(30);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Temporizador para reenvío de código
  useEffect(() => {
    let interval = null;
    if (step === 'VERIFY_EMAIL' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, resendTimer]);

  if (!isOpen) return null;

  // Manejo de envío del formulario inicial
  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      setIsLoading(true);
      try {
        const user = UsersDB.login(formData.email, formData.password);
        onAuthSuccess(user);
        onClose();
      } catch (err) {
        setError(err.message || 'Error al iniciar sesión.');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Registro: Validar y enviar código de verificación al correo real
      if (!formData.fullName.trim() || !formData.email.trim() || !formData.password) {
        setError('Por favor completa todos los campos obligatorios.');
        return;
      }

      // Validar si el correo ya existe
      const existingUsers = UsersDB.getAllUsers();
      if (existingUsers.some(u => u.email.toLowerCase() === formData.email.trim().toLowerCase())) {
        setError('Ya existe una cuenta con este correo electrónico.');
        return;
      }

      setIsLoading(true);
      try {
        await EmailService.sendVerificationCode(formData.email, formData.fullName);
        setPin(['', '', '', '', '', '']);
        setResendTimer(30);
        setStep('VERIFY_EMAIL');
      } catch (err) {
        setError('No se pudo enviar el correo de verificación. Intenta nuevamente.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Manejo de cambio en los inputs del PIN
  const handlePinChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);

    // Auto-focus al siguiente input si se ingresó un dígito
    if (value && index < 5) {
      pinInputRefs.current[index + 1]?.focus();
    }
  };

  const handlePinKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      pinInputRefs.current[index - 1]?.focus();
    }
  };

  const handlePinPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setPin(digits);
      pinInputRefs.current[5]?.focus();
    }
  };

  // Reenviar código real al correo
  const handleResendCode = async () => {
    if (resendTimer > 0) return;
    setError('');
    setIsLoading(true);
    try {
      await EmailService.sendVerificationCode(formData.email, formData.fullName);
      setPin(['', '', '', '', '', '']);
      setResendTimer(30);
    } catch {
      setError('Error al reenviar el código. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Confirmar verificación y registrar cuenta
  const handleVerifyAndRegister = (e) => {
    if (e) e.preventDefault();
    setError('');
    const fullCode = pin.join('');

    if (fullCode.length !== 6) {
      setError('Por favor ingresa los 6 dígitos del código de verificación enviado a tu correo.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const verification = EmailService.verifyCode(formData.email, fullCode);

      if (!verification.valid) {
        setError(verification.message || 'Código incorrecto.');
        setIsLoading(false);
        return;
      }

      try {
        const newUser = UsersDB.register(formData);
        setStep('SUCCESS');
        setIsLoading(false);

        setTimeout(() => {
          onAuthSuccess(newUser);
          onClose();
        }, 1000);
      } catch (err) {
        setError(err.message || 'Error al completar el registro.');
        setIsLoading(false);
      }
    }, 400);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ maxWidth: '480px' }}>
        {/* Botón de Volver */}
        <button
          type="button"
          onClick={() => {
            if (step === 'VERIFY_EMAIL') {
              setStep('FORM');
              setError('');
            } else {
              onClose();
            }
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            marginBottom: '1rem',
            padding: '0.3rem 0.5rem',
            borderRadius: 'var(--radius-sm)',
            transition: 'var(--transition)'
          }}
          onMouseOver={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }}
          onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
        >
          <ArrowLeft size={14} />
          <span>{step === 'VERIFY_EMAIL' ? 'Regresar a editar datos' : 'Volver a la página principal'}</span>
        </button>

        {/* ------------------------------------------------------------- */}
        {/* PASO 1: FORMULARIO DE LOGIN / REGISTRO                        */}
        {/* ------------------------------------------------------------- */}
        {step === 'FORM' && (
          <>
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
                  : 'Crea tu cuenta y verifica tu correo para comenzar'}
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
            <form onSubmit={handleInitialSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                        <option value="ARS">ARS ($ - Peso Argentino)</option>
                        <option value="CLP">CLP ($ - Peso Chileno)</option>
                        <option value="PEN">PEN (S/ - Sol)</option>
                        <option value="GBP">GBP (£ - Libra)</option>
                        <option value="CAD">CAD (C$ - Dólar Can.)</option>
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
                        step="0.01"
                        placeholder="2000.00"
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
                {isLoading 
                  ? 'Enviando código...' 
                  : isLogin 
                    ? 'Ingresar a getloss' 
                    : 'Enviar Código de Verificación al Correo'}
                <ArrowRight size={16} />
              </button>
            </form>
          </>
        )}

        {/* ------------------------------------------------------------- */}
        {/* PASO 2: VERIFICACIÓN DEL CÓDIGO REAL ENVIADO AL CORREO        */}
        {/* ------------------------------------------------------------- */}
        {step === 'VERIFY_EMAIL' && (
          <div>
            {/* Cabecera */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid var(--border-medium)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.85rem auto',
                color: 'var(--text-primary)'
              }}>
                <KeyRound size={28} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                Verifica tu Correo
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Hemos enviado un correo electrónico con tu código de seguridad de 6 dígitos a: <br />
                <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{formData.email}</strong>
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                (Revisa tu bandeja de entrada o carpeta de Spam / Correo no deseado)
              </p>
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

            {/* Inputs de PIN (6 dígitos) */}
            <form onSubmit={handleVerifyAndRegister}>
              <div 
                onPaste={handlePinPaste}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginBottom: '1.5rem'
                }}
              >
                {pin.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (pinInputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    onKeyDown={(e) => handlePinKeyDown(index, e.key)}
                    style={{
                      width: '48px',
                      height: '56px',
                      textAlign: 'center',
                      fontSize: '1.4rem',
                      fontWeight: '800',
                      borderRadius: 'var(--radius-md)',
                      border: digit ? '2px solid var(--text-primary)' : '1px solid var(--border-medium)',
                      background: 'var(--bg-card)',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      transition: 'border 0.2s ease, transform 0.15s ease'
                    }}
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isLoading || pin.join('').length !== 6}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  fontSize: '0.95rem',
                  opacity: pin.join('').length === 6 ? 1 : 0.6
                }}
              >
                {isLoading ? 'Verificando código...' : 'Verificar y Completar Registro'}
                <ShieldCheck size={18} />
              </button>
            </form>

            {/* Opciones de Reenvío */}
            <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resendTimer > 0 || isLoading}
                style={{
                  background: 'none',
                  border: 'none',
                  color: resendTimer > 0 ? 'var(--text-muted)' : 'var(--text-primary)',
                  fontSize: '0.825rem',
                  cursor: resendTimer > 0 ? 'default' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontWeight: '600'
                }}
              >
                <RotateCw size={14} className={isLoading ? 'spin' : ''} />
                <span>
                  {resendTimer > 0 
                    ? `Reenviar nuevo código al correo en ${resendTimer}s` 
                    : 'Reenviar código a mi correo'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* PASO 3: ÉXITO DE VERIFICACIÓN Y REGISTRO                       */}
        {/* ------------------------------------------------------------- */}
        {step === 'SUCCESS' && (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', animation: 'fadeIn 0.3s ease' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.15)',
              border: '2px solid var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
              color: 'var(--text-primary)',
              boxShadow: '0 0 24px rgba(255, 255, 255, 0.25)'
            }}>
              <CheckCircle2 size={36} />
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              ¡Correo Verificado con Éxito!
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Tu cuenta ha sido creada. Ingresando a tu panel de control...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

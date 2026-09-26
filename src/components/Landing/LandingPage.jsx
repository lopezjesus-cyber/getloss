import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck, 
  Calendar, 
  BarChart3, 
  FileSpreadsheet, 
  Download, 
  Zap, 
  Home, 
  ShoppingCart, 
  Car, 
  Lock, 
  CheckCircle2, 
  TrendingUp, 
  Sparkles,
  Smartphone,
  Laptop,
  Check,
  X,
  CreditCard,
  Layers,
  ChevronRight,
  DollarSign,
  PieChart,
  HelpCircle,
  Clock,
  Plus,
  LayoutDashboard,
  Receipt,
  Wifi,
  Battery,
  ShieldAlert,
  Moon,
  Sun
} from 'lucide-react';
import { formatMoney } from '../../utils/formatters';
import { useDeviceDetect } from '../../hooks/useDeviceDetect';

export const LandingPage = ({ onOpenAuth, onToggleTheme, theme }) => {
  // Detección automática del dispositivo real del usuario
  const deviceDetect = useDeviceDetect();
  // Estado para el dispositivo seleccionado en el simulador: 'DESKTOP' o 'MOBILE'
  const [activeDevice, setActiveDevice] = useState(() => deviceDetect.deviceType || 'DESKTOP');
  const [hasManuallyToggled, setHasManuallyToggled] = useState(false);

  // Sincronizar automáticamente con el dispositivo detectado si el usuario no ha cambiado manualmente
  useEffect(() => {
    if (!hasManuallyToggled && deviceDetect.deviceType) {
      setActiveDevice(deviceDetect.deviceType);
    }
  }, [deviceDetect.deviceType, hasManuallyToggled]);

  // Estado para el periodo: 'QUINCENAL' o 'MENSUAL'
  const [simPeriod, setSimPeriod] = useState('QUINCENAL');
  const [activeFaq, setActiveFaq] = useState(null);


  // Datos simulados para demostración en vivo en la landing
  const simData = {
    QUINCENAL: {
      income: 1400,
      expenses: 960,
      balance: 440,
      savingsRate: '31.4%',
      obligationsPaid: '3 de 3 Pagadas',
      obligations: [
        { name: 'Arriendo / Vivienda (15 Días)', amount: 425, due: 'Día 5', status: 'Pagado', icon: Home, cat: 'Vivienda' },
        { name: 'Servicios Básicos (Luz/Agua)', amount: 110, due: 'Día 12', status: 'Pagado', icon: Zap, cat: 'Servicios' },
        { name: 'Supermercado Quincenal', amount: 220, due: 'Día 3', status: 'Pagado', icon: ShoppingCart, cat: 'Alimentación' }
      ],
      recentTxs: [
        { title: 'Pago Quincena Nómina', amount: 1400, type: 'INCOME', date: '15 Sep', icon: TrendingUp },
        { title: 'Pago Arriendo', amount: 425, type: 'EXPENSE', date: '05 Sep', icon: Home },
        { title: 'Factura Luz & Gas', amount: 110, type: 'EXPENSE', date: '12 Sep', icon: Zap }
      ]
    },
    MENSUAL: {
      income: 2800,
      expenses: 1455,
      balance: 1345,
      savingsRate: '48.0%',
      obligationsPaid: '4 de 4 Pagadas',
      obligations: [
        { name: 'Arriendo Apartamento Mensual', amount: 850, due: 'Día 5', status: 'Pagado', icon: Home, cat: 'Vivienda' },
        { name: 'Factura Luz & Agua', amount: 110, due: 'Día 12', status: 'Pagado', icon: Zap, cat: 'Servicios' },
        { name: 'Mercado Mensual Integral', amount: 440, due: 'Día 15', status: 'Pagado', icon: ShoppingCart, cat: 'Alimentación' },
        { name: 'Internet Fibra Óptica 500MB', amount: 45, due: 'Día 18', status: 'Pagado', icon: Zap, cat: 'Servicios' }
      ],
      recentTxs: [
        { title: 'Sueldo Mensual Completo', amount: 2800, type: 'INCOME', date: '30 Sep', icon: TrendingUp },
        { title: 'Arriendo Apartamento', amount: 850, type: 'EXPENSE', date: '05 Sep', icon: Home },
        { title: 'Mercado Mensual', amount: 440, type: 'EXPENSE', date: '15 Sep', icon: ShoppingCart }
      ]
    }
  };

  const currentSim = simData[simPeriod];

  const faqs = [
    {
      q: '¿Cómo funciona la elección entre Modo Quincenal o Modo Mensual?',
      a: 'getloss te permite escoger si deseas administrar tu dinero en ciclos de 15 días (Modo Quincenal) o en ciclos de 30 días (Modo Mensual). Tus balances, listas de obligaciones y reportes se adaptan automáticamente a tu elección.'
    },
    {
      q: '¿Qué son los Gastos Constantes e Indispensables?',
      a: 'Son tus obligaciones críticas ineludibles: arriendo/vivienda, servicios de energía/agua/internet, supermercado básico y transporte. getloss te muestra una lista con indicador de estado (Pagado/Pendiente) para que nunca caigas en mora.'
    },
    {
      q: '¿Puedo exportar reportes para imprimir o auditar?',
      a: 'Sí. Con un solo clic puedes descargar un reporte ejecutivo en PDF estructurado con balances y listas de comprobación, o exportar todos los datos a formato CSV compatible con Excel.'
    },
    {
      q: '¿Cómo cambia la interfaz entre PC y Celular?',
      a: 'En PC cuentas con una vista extendida con panel lateral, gráficos completos y atajos. En Celular disfrutas de una navegación inferior ergonómica con botón flotante (+) para registrar gastos en segundos.'
    }
  ];

  return (
    <div className="landing-container" style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, #18181b 0%, #09090b 60%, #000000 100%)',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-main)'
    }}>
      {/* 1. Header de la Landing */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(9, 9, 11, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '1.1rem 1.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1300px',
        margin: '0 auto'
      }}>
        {/* Logo de Marca */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            boxShadow: '0 0 14px rgba(255, 255, 255, 0.9)'
          }} />
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.45rem',
            fontWeight: '800',
            letterSpacing: '-0.04em',
            color: '#ffffff'
          }}>
            getloss
          </span>
          <span className="badge" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
            Fintech Suite
          </span>
        </div>

        {/* Botones de Acción */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <button
            onClick={() => onOpenAuth(true)}
            style={{
              padding: '0.55rem 1.15rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              fontWeight: '600',
              background: 'transparent',
              color: '#e4e4e7',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              transition: 'var(--transition)'
            }}
          >
            Iniciar Sesión
          </button>

          <button
            onClick={() => onOpenAuth(false)}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              fontWeight: '700',
              background: '#ffffff',
              color: '#09090b',
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.25)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'var(--transition)'
            }}
          >
            <span>Crear Cuenta</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '4rem 1.5rem 2rem 1.5rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        {/* Badge Superior */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.45rem 1.15rem',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          fontSize: '0.825rem',
          fontWeight: '600',
          color: '#e4e4e7',
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
        }}>
          <Sparkles size={15} style={{ color: '#ffffff' }} />
          <span>Gestión Financiera Quincenal y Mensual • Para PC y Celular</span>
        </div>

        {/* Titular */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
          fontWeight: '800',
          lineHeight: '1.08',
          letterSpacing: '-0.035em',
          maxWidth: '920px',
          background: 'linear-gradient(180deg, #FFFFFF 20%, #A1A1AA 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Elimina tus fugas de dinero. Ten el control total de cada quincena.
        </h1>

        {/* Subtítulo */}
        <p style={{
          fontSize: 'clamp(1rem, 2.2vw, 1.25rem)',
          color: '#a1a1aa',
          maxWidth: '740px',
          lineHeight: '1.65'
        }}>
          <strong>getloss</strong> separa tus <strong>obligaciones indispensables</strong> (arriendo, servicios, despensa) de tus gastos variables, calcula tu ahorro con decimales exactos y genera reportes ejecutivos en PDF.
        </p>

        {/* CTAs */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.15rem',
          marginTop: '0.5rem'
        }}>
          <button
            onClick={() => onOpenAuth(false)}
            style={{
              padding: '1rem 2.4rem',
              fontSize: '1.05rem',
              fontWeight: '700',
              borderRadius: 'var(--radius-md)',
              background: '#ffffff',
              color: '#09090b',
              boxShadow: '0 0 28px rgba(255, 255, 255, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              transition: 'var(--transition)'
            }}
          >
            <span>Comenzar Gratis</span>
            <ArrowRight size={18} />
          </button>

          <button
            onClick={() => onOpenAuth(true)}
            style={{
              padding: '1rem 2rem',
              fontSize: '1.05rem',
              fontWeight: '600',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              transition: 'var(--transition)'
            }}
          >
            <span>Iniciar Sesión</span>
          </button>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* 3. SHOWCASE INTERACTIVO: SELECTOR DUAL (PC vs CELULAR)             */}
        {/* ------------------------------------------------------------------ */}
        <div style={{
          marginTop: '3.5rem',
          width: '100%',
          maxWidth: '1100px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* Selector de Dispositivo (PC vs Celular) y Periodo */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            gap: '1rem',
            marginBottom: '1.25rem',
            padding: '0 0.5rem'
          }}>
            {/* Botones de Cambio de Dispositivo (PC / Móvil) */}
            <div style={{
              display: 'inline-flex',
              background: '#121215',
              padding: '0.35rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              gap: '0.35rem'
            }}>
              <button
                type="button"
                onClick={() => {
                  setActiveDevice('DESKTOP');
                  setHasManuallyToggled(true);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.55rem 1.15rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  fontWeight: activeDevice === 'DESKTOP' ? '700' : '500',
                  background: activeDevice === 'DESKTOP' ? '#ffffff' : 'transparent',
                  color: activeDevice === 'DESKTOP' ? '#09090b' : '#a1a1aa',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
              >
                <Laptop size={16} />
                <span>Interfaz PC / Escritorio</span>
                {deviceDetect.deviceType === 'DESKTOP' && (
                  <span style={{
                    fontSize: '0.65rem',
                    padding: '0.1rem 0.45rem',
                    borderRadius: 'var(--radius-full)',
                    background: activeDevice === 'DESKTOP' ? '#09090b' : 'rgba(255, 255, 255, 0.15)',
                    color: activeDevice === 'DESKTOP' ? '#ffffff' : '#ffffff',
                    fontWeight: '700'
                  }}>
                    Tu Equipo
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveDevice('MOBILE');
                  setHasManuallyToggled(true);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.55rem 1.15rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  fontWeight: activeDevice === 'MOBILE' ? '700' : '500',
                  background: activeDevice === 'MOBILE' ? '#ffffff' : 'transparent',
                  color: activeDevice === 'MOBILE' ? '#09090b' : '#a1a1aa',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
              >
                <Smartphone size={16} />
                <span>Interfaz Celular / Móvil</span>
                {deviceDetect.deviceType === 'MOBILE' && (
                  <span style={{
                    fontSize: '0.65rem',
                    padding: '0.1rem 0.45rem',
                    borderRadius: 'var(--radius-full)',
                    background: activeDevice === 'MOBILE' ? '#09090b' : 'rgba(255, 255, 255, 0.15)',
                    color: activeDevice === 'MOBILE' ? '#ffffff' : '#ffffff',
                    fontWeight: '700'
                  }}>
                    Tu Equipo
                  </span>
                )}
              </button>
            </div>


            {/* Selector de Periodo (Quincenal vs Mensual) */}
            <div style={{
              display: 'inline-flex',
              background: '#121215',
              padding: '0.35rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              gap: '0.35rem'
            }}>
              <button
                type="button"
                onClick={() => setSimPeriod('QUINCENAL')}
                style={{
                  padding: '0.55rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.825rem',
                  fontWeight: simPeriod === 'QUINCENAL' ? '700' : '500',
                  background: simPeriod === 'QUINCENAL' ? '#ffffff' : 'transparent',
                  color: simPeriod === 'QUINCENAL' ? '#09090b' : '#a1a1aa',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
              >
                🗓️ Modo Quincenal
              </button>
              <button
                type="button"
                onClick={() => setSimPeriod('MENSUAL')}
                style={{
                  padding: '0.55rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.825rem',
                  fontWeight: simPeriod === 'MENSUAL' ? '700' : '500',
                  background: simPeriod === 'MENSUAL' ? '#ffffff' : 'transparent',
                  color: simPeriod === 'MENSUAL' ? '#09090b' : '#a1a1aa',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
              >
                📅 Modo Mensual
              </button>
            </div>
          </div>

          {/* ============================================================= */}
          {/* MOCKUP 1: INTERFAZ PC / ESCRITORIO                            */}
          {/* ============================================================= */}
          {activeDevice === 'DESKTOP' && (
            <div style={{
              width: '100%',
              background: 'rgba(24, 24, 27, 0.85)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              boxShadow: '0 28px 72px -12px rgba(0, 0, 0, 0.95), 0 0 40px rgba(255, 255, 255, 0.05)',
              textAlign: 'left'
            }}>
              {/* Barra de Ventana PC */}
              <div style={{
                background: '#121215',
                padding: '0.75rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#ef4444' }} />
                  <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#eab308' }} />
                  <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#22c55e' }} />
                </div>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '0.25rem 1.25rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  color: '#a1a1aa',
                  fontFamily: 'monospace'
                }}>
                  app.getloss.com/dashboard • Vista Escritorio ({simPeriod})
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#71717a', fontSize: '0.75rem' }}>
                  <Laptop size={14} />
                  <span>PC Mode</span>
                </div>
              </div>

              {/* Contenido de la Pantalla PC (Sidebar + Panel Principal) */}
              <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '480px' }}>
                {/* Sidebar Desktop */}
                <div style={{
                  background: '#121215',
                  borderRight: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '1.25rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', paddingLeft: '0.35rem' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffffff' }} />
                      <span style={{ fontWeight: '800', color: '#ffffff', fontSize: '1.05rem' }}>getloss</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onOpenAuth(false)}
                      style={{
                        width: '100%',
                        padding: '0.65rem',
                        borderRadius: 'var(--radius-sm)',
                        background: '#ffffff',
                        color: '#09090b',
                        fontWeight: '700',
                        fontSize: '0.8rem',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        marginBottom: '1.25rem',
                        cursor: 'pointer'
                      }}
                    >
                      <Plus size={15} />
                      <span>Nuevo Movimiento</span>
                    </button>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      <div style={{ padding: '0.55rem 0.75rem', background: 'rgba(255,255,255,0.08)', borderRadius: 'var(--radius-sm)', color: '#ffffff', fontWeight: '700', fontSize: '0.825rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <LayoutDashboard size={16} />
                        <span>Panel Principal</span>
                      </div>
                      <div style={{ padding: '0.55rem 0.75rem', borderRadius: 'var(--radius-sm)', color: '#a1a1aa', fontWeight: '500', fontSize: '0.825rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <ShieldCheck size={16} />
                        <span>Obligaciones ({currentSim.obligations.length})</span>
                      </div>
                      <div style={{ padding: '0.55rem 0.75rem', borderRadius: 'var(--radius-sm)', color: '#a1a1aa', fontWeight: '500', fontSize: '0.825rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <Receipt size={16} />
                        <span>Movimientos</span>
                      </div>
                      <div style={{ padding: '0.55rem 0.75rem', borderRadius: 'var(--radius-sm)', color: '#a1a1aa', fontWeight: '500', fontSize: '0.825rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <BarChart3 size={16} />
                        <span>Reportes & PDF</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.85rem' }}>
                    <div style={{ fontSize: '0.75rem', color: '#71717a' }}>Usuario demo</div>
                    <div style={{ fontSize: '0.825rem', fontWeight: '600', color: '#ffffff' }}>Jesús López</div>
                  </div>
                </div>

                {/* Dashboard Desktop */}
                <div style={{ padding: '1.5rem', background: '#09090b', overflowY: 'auto' }}>
                  {/* Tarjetas de Métricas en PC */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.85rem', marginBottom: '1.25rem' }}>
                    <div style={{ background: '#18181b', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                      <span style={{ fontSize: '0.7rem', color: '#71717a', fontWeight: '700', textTransform: 'uppercase' }}>Balance Disponible</span>
                      <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#ffffff', margin: '0.2rem 0' }}>{formatMoney(currentSim.balance, 'USD')}</div>
                      <span style={{ fontSize: '0.72rem', color: '#a1a1aa' }}>{currentSim.savingsRate} tasa de ahorro</span>
                    </div>

                    <div style={{ background: '#18181b', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                      <span style={{ fontSize: '0.7rem', color: '#71717a', fontWeight: '700', textTransform: 'uppercase' }}>Ingresos Proyectados</span>
                      <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#ffffff', margin: '0.2rem 0' }}>+{formatMoney(currentSim.income, 'USD')}</div>
                      <span style={{ fontSize: '0.72rem', color: '#a1a1aa' }}>Entrada garantizada</span>
                    </div>

                    <div style={{ background: '#18181b', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                      <span style={{ fontSize: '0.7rem', color: '#71717a', fontWeight: '700', textTransform: 'uppercase' }}>Egresos Totales</span>
                      <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#a1a1aa', margin: '0.2rem 0' }}>-{formatMoney(currentSim.expenses, 'USD')}</div>
                      <span style={{ fontSize: '0.72rem', color: '#71717a' }}>Obligaciones + Variables</span>
                    </div>

                    <div style={{ background: '#18181b', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                      <span style={{ fontSize: '0.7rem', color: '#71717a', fontWeight: '700', textTransform: 'uppercase' }}>Cumplimiento Fijo</span>
                      <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff', margin: '0.35rem 0' }}>{currentSim.obligationsPaid}</div>
                      <span style={{ fontSize: '0.72rem', color: '#22c55e' }}>✓ 100% al día</span>
                    </div>
                  </div>

                  {/* Dos Columnas: Obligaciones y Últimas Transacciones en PC */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
                    {/* Lista de Obligaciones Fijas */}
                    <div style={{ background: '#18181b', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: '#a1a1aa', marginBottom: '0.75rem' }}>
                        Obligaciones Indispensables ({simPeriod})
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                        {currentSim.obligations.map((item, idx) => {
                          const Icon = item.icon;
                          return (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.55rem 0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.06)' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                <div style={{ width: '28px', height: '28px', borderRadius: '4px', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <Icon size={14} color="#ffffff" />
                                </div>
                                <div>
                                  <div style={{ fontSize: '0.825rem', fontWeight: '600', color: '#ffffff' }}>{item.name}</div>
                                  <div style={{ fontSize: '0.7rem', color: '#71717a' }}>Vencimiento: {item.due}</div>
                                </div>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff' }}>{formatMoney(item.amount, 'USD')}</span>
                                <span style={{ fontSize: '0.65rem', fontWeight: '700', background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', padding: '0.15rem 0.45rem', borderRadius: 'var(--radius-full)' }}>{item.status}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Transacciones Recientes en PC */}
                    <div style={{ background: '#18181b', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: '#a1a1aa', marginBottom: '0.75rem' }}>
                        Movimientos Recientes
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                        {currentSim.recentTxs.map((tx, idx) => {
                          const Icon = tx.icon;
                          const isInc = tx.type === 'INCOME';
                          return (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.55rem 0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <Icon size={14} color={isInc ? '#ffffff' : '#a1a1aa'} />
                                <div>
                                  <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#ffffff' }}>{tx.title}</div>
                                  <div style={{ fontSize: '0.68rem', color: '#71717a' }}>{tx.date}</div>
                                </div>
                              </div>
                              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: isInc ? '#ffffff' : '#a1a1aa' }}>
                                {isInc ? '+' : '-'}{formatMoney(tx.amount, 'USD')}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================= */}
          {/* MOCKUP 2: INTERFAZ CELULAR / MÓVIL                            */}
          {/* ============================================================= */}
          {activeDevice === 'MOBILE' && (
            <div style={{
              width: '100%',
              maxWidth: '380px',
              margin: '0 auto',
              background: '#000000',
              border: '6px solid #27272a',
              borderRadius: '44px',
              padding: '0.85rem',
              boxShadow: '0 32px 80px -12px rgba(0, 0, 0, 0.95), 0 0 32px rgba(255, 255, 255, 0.08)',
              position: 'relative',
              textAlign: 'left'
            }}>
              {/* Dynamic Island / Notch Móvil */}
              <div style={{
                width: '110px',
                height: '24px',
                background: '#09090b',
                borderRadius: 'var(--radius-full)',
                margin: '0 auto 0.75rem auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#27272a' }} />
              </div>

              {/* Barra de Estado del Móvil */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0.75rem 0.5rem 0.75rem', fontSize: '0.75rem', color: '#a1a1aa' }}>
                <span style={{ fontWeight: '700', color: '#ffffff' }}>9:41</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Wifi size={13} />
                  <Battery size={14} />
                </div>
              </div>

              {/* Pantalla del Celular */}
              <div style={{
                background: '#121215',
                borderRadius: '28px',
                padding: '1.15rem 1rem',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                minHeight: '520px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  {/* Top Bar Móvil */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffffff' }} />
                      <span style={{ fontWeight: '800', color: '#ffffff', fontSize: '0.95rem' }}>getloss</span>
                    </div>
                    <span className="badge" style={{ fontSize: '0.65rem' }}>{simPeriod}</span>
                  </div>

                  {/* Tarjeta Principal Móvil (Balance Libre) */}
                  <div style={{
                    background: 'linear-gradient(135deg, #1f1f23 0%, #18181b 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.16)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.15rem',
                    marginBottom: '1rem',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
                  }}>
                    <div style={{ fontSize: '0.72rem', color: '#a1a1aa', fontWeight: '700', textTransform: 'uppercase' }}>
                      Balance Disponible
                    </div>
                    <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#ffffff', margin: '0.2rem 0' }}>
                      {formatMoney(currentSim.balance, 'USD')}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.6rem', fontSize: '0.72rem', color: '#a1a1aa', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.5rem' }}>
                      <span>Ingresos: +{formatMoney(currentSim.income, 'USD')}</span>
                      <span style={{ color: '#22c55e' }}>{currentSim.savingsRate} Ahorro</span>
                    </div>
                  </div>

                  {/* Lista Compacta de Obligaciones en Celular */}
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#a1a1aa', marginBottom: '0.5rem' }}>
                      Obligaciones ({currentSim.obligations.length})
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {currentSim.obligations.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                          <div key={idx} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.6rem 0.75rem',
                            background: 'rgba(255, 255, 255, 0.04)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid rgba(255, 255, 255, 0.06)'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Icon size={14} color="#ffffff" />
                              </div>
                              <div>
                                <div style={{ fontSize: '0.78rem', fontWeight: '600', color: '#ffffff' }}>{item.name}</div>
                                <div style={{ fontSize: '0.68rem', color: '#71717a' }}>{item.due}</div>
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#ffffff' }}>{formatMoney(item.amount, 'USD')}</div>
                              <span style={{ fontSize: '0.6rem', color: '#4ade80' }}>✓ Pagado</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Barra de Navegación Inferior Móvil con Botón Flotante (+) */}
                <div style={{ position: 'relative' }}>
                  {/* Botón Flotante Central (+) */}
                  <button
                    type="button"
                    onClick={() => onOpenAuth(false)}
                    style={{
                      position: 'absolute',
                      top: '-24px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: '#ffffff',
                      color: '#09090b',
                      border: 'none',
                      boxShadow: '0 4px 16px rgba(255, 255, 255, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      zIndex: 10
                    }}
                    title="Nuevo Movimiento Móvil"
                  >
                    <Plus size={20} strokeWidth={2.5} />
                  </button>

                  <div style={{
                    background: '#18181b',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '0.55rem 0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    fontSize: '0.65rem',
                    color: '#71717a'
                  }}>
                    <div style={{ textAlign: 'center', color: '#ffffff', fontWeight: '700' }}>
                      <LayoutDashboard size={15} style={{ margin: '0 auto 2px auto' }} />
                      <span>Inicio</span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <ShieldCheck size={15} style={{ margin: '0 auto 2px auto' }} />
                      <span>Fijos</span>
                    </div>
                    <div style={{ width: '32px' }} /> {/* Espacio para el botón flotante */}
                    <div style={{ textAlign: 'center' }}>
                      <Receipt size={15} style={{ margin: '0 auto 2px auto' }} />
                      <span>Movs</span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <BarChart3 size={15} style={{ margin: '0 auto 2px auto' }} />
                      <span>PDF</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. COMPARATIVA DE PLATAFORMAS (PC vs CELULAR) */}
      <section style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '4rem 1.5rem 2rem 1.5rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
            fontWeight: '800',
            color: '#ffffff',
            letterSpacing: '-0.02em',
            marginBottom: '0.5rem'
          }}>
            Diseñado para Computadora y Celular
          </h2>
          <p style={{ color: '#a1a1aa', fontSize: '0.95rem' }}>
            Accede desde cualquier dispositivo con una experiencia optimizada para cada pantalla.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* Card: Interfaz PC */}
          <div style={{
            background: 'rgba(24, 24, 27, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: '#ffffff', color: '#09090b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Laptop size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff' }}>Experiencia en PC & Mac</h3>
                <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>Productividad y Análisis Extendido</span>
              </div>
            </div>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.875rem', color: '#d4d4d8' }}>
              <li>✅ <strong>Panel Lateral Extendido:</strong> Navegación instantánea con indicadores de obligaciones.</li>
              <li>✅ <strong>Tablas y Reportes Ejecutivos:</strong> Visualización simultánea de ingresos, egresos y descarga en PDF/CSV.</li>
              <li>✅ <strong>Multicolumna Financiera:</strong> Proyección de ahorro y balance libre en pantalla completa.</li>
            </ul>
          </div>

          {/* Card: Interfaz Celular */}
          <div style={{
            background: 'rgba(24, 24, 27, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: '#ffffff', color: '#09090b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Smartphone size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff' }}>Experiencia en Celular</h3>
                <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>Control Inmediato y Ergonómico</span>
              </div>
            </div>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.875rem', color: '#d4d4d8' }}>
              <li>✅ <strong>Botón Flotante (+):</strong> Registra gastos en 3 segundos desde cualquier lugar.</li>
              <li>✅ <strong>Navegación al alcance del pulgar:</strong> Barra inferior adaptada para uso con una sola mano.</li>
              <li>✅ <strong>Check Táctil de Pagos:</strong> Marca tus facturas de luz, agua y arriendo con un toque.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. Preguntas Frecuentes (FAQ) */}
      <section style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '3rem 1.5rem 5rem 1.5rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.85rem',
            fontWeight: '800',
            color: '#ffffff'
          }}>
            Preguntas Frecuentes
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                style={{
                  background: 'rgba(24, 24, 27, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden'
                }}
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '1.15rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    color: '#ffffff',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <span>{faq.q}</span>
                  <ChevronRight size={18} style={{ transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s ease' }} />
                </button>
                {isOpen && (
                  <div style={{ padding: '0 1.25rem 1.25rem 1.25rem', color: '#a1a1aa', fontSize: '0.875rem', lineHeight: '1.6' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Banner Final CTA */}
      <section style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0 1.5rem 6rem 1.5rem'
      }}>
        <div style={{
          background: 'linear-gradient(180deg, #18181b 0%, #09090b 100%)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 'var(--radius-xl)',
          padding: '3.5rem 2rem',
          textAlign: 'center',
          boxShadow: '0 0 40px rgba(255, 255, 255, 0.05)'
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: '800',
            color: '#ffffff',
            marginBottom: '0.75rem'
          }}>
            Comienza a administrar tu dinero con precisión
          </h2>
          <p style={{ color: '#a1a1aa', fontSize: '1.05rem', maxWidth: '580px', margin: '0 auto 2rem auto' }}>
            Únete hoy a getloss. Crea tu cuenta en menos de 1 minuto y toma el control de tu próxima quincena.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={() => onOpenAuth(false)}
              style={{
                padding: '0.95rem 2.4rem',
                fontSize: '1rem',
                fontWeight: '700',
                borderRadius: 'var(--radius-md)',
                background: '#ffffff',
                color: '#09090b',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                border: 'none'
              }}
            >
              <span>Crear Cuenta Gratis</span>
              <ArrowRight size={17} />
            </button>
            <button
              onClick={() => onOpenAuth(true)}
              style={{
                padding: '0.95rem 2rem',
                fontSize: '1rem',
                fontWeight: '600',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                cursor: 'pointer'
              }}
            >
              <span>Iniciar Sesión</span>
            </button>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '2rem 1.5rem',
        textAlign: 'center',
        color: '#71717a',
        fontSize: '0.85rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffffff' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: '700', color: '#ffffff' }}>
            getloss
          </span>
        </div>
        <p>© {new Date().getFullYear()} getloss • Tu suite de control financiero quincenal y mensual para PC y Celular.</p>
      </footer>
    </div>
  );
};

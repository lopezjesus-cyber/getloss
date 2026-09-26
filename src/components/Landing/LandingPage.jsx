import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Home, 
  ShoppingCart, 
  Sparkles,
  Smartphone,
  Laptop,
  ChevronRight,
  Plus,
  LayoutDashboard,
  Receipt,
  Wifi,
  Battery,
  ShieldAlert,
  Download,
  FileSpreadsheet,
  TrendingUp,
  CheckCircle2,
  Lock,
  PieChart,
  DollarSign,
  X,
  CreditCard,
  Calendar,
  Check,
  Search,
  SlidersHorizontal,
  FileText,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
  Layers,
  CheckCircle
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

  // Estado interactivo compartido dentro de los simuladores (PC y Móvil)
  const [activeScreenTab, setActiveScreenTab] = useState('dashboard');
  const [isDynamicIslandExpanded, setIsDynamicIslandExpanded] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [paidObligations, setPaidObligations] = useState({ 0: true, 1: true, 2: true, 3: true });
  const [pcSearchQuery, setPcSearchQuery] = useState('');
  const [pcTxFilter, setPcTxFilter] = useState('ALL');
  const [quickAddConcept, setQuickAddConcept] = useState('Supermercado Quincenal');
  const [quickAddAmount, setQuickAddAmount] = useState('120');
  const [quickAddCat, setQuickAddCat] = useState('Alimentación');
  const [quickAddFeedback, setQuickAddFeedback] = useState(false);

  const toggleObligation = (idx) => {
    setPaidObligations(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleSimQuickAdd = (e) => {
    e.preventDefault();
    setQuickAddFeedback(true);
    setTimeout(() => {
      setQuickAddFeedback(false);
      setIsQuickAddOpen(false);
    }, 1200);
  };

  // Datos simulados para demostración en vivo en la landing
  const simData = {
    QUINCENAL: {
      income: 1400,
      expenses: 960,
      balance: 440,
      savingsRate: '31.4%',
      obligationsPaid: '3 de 3 Pagadas',
      obligations: [
        { name: 'Arriendo / Vivienda (15 Días)', amount: 425, due: 'Día 5', icon: Home, cat: 'Vivienda' },
        { name: 'Servicios Básicos (Luz & Agua)', amount: 110, due: 'Día 12', icon: Zap, cat: 'Servicios' },
        { name: 'Supermercado Quincenal', amount: 220, due: 'Día 3', icon: ShoppingCart, cat: 'Alimentación' }
      ],
      recentTxs: [
        { title: 'Pago Quincena Nómina', amount: 1400, type: 'INCOME', date: '15 Sep', icon: TrendingUp },
        { title: 'Pago Arriendo Residencia', amount: 425, type: 'EXPENSE', date: '05 Sep', icon: Home },
        { title: 'Factura Luz & Energía', amount: 110, type: 'EXPENSE', date: '12 Sep', icon: Zap }
      ]
    },
    MENSUAL: {
      income: 2800,
      expenses: 1455,
      balance: 1345,
      savingsRate: '48.0%',
      obligationsPaid: '4 de 4 Pagadas',
      obligations: [
        { name: 'Arriendo Apartamento Mensual', amount: 850, due: 'Día 5', icon: Home, cat: 'Vivienda' },
        { name: 'Factura Luz, Agua & Gas', amount: 110, due: 'Día 12', icon: Zap, cat: 'Servicios' },
        { name: 'Mercado Mensual Integral', amount: 440, due: 'Día 15', icon: ShoppingCart, cat: 'Alimentación' },
        { name: 'Internet Fibra Óptica 500MB', amount: 45, due: 'Día 18', icon: Zap, cat: 'Servicios' }
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
      a: 'getloss te permite escoger con un solo clic si deseas administrar tu flujo de dinero en ciclos de 15 días (Modo Quincenal) o en ciclos de 30 días (Modo Mensual). Tus balances, listas de obligaciones y reportes ejecutivos se adaptan inmediatamente sin mezclar cuentas.'
    },
    {
      q: '¿Qué son los Gastos Indispensables y por qué son clave?',
      a: 'Son tus obligaciones ineludibles: arriendo/vivienda, servicios de energía/agua, internet, supermercado y transporte. getloss los prioriza y los descuenta preventivamente para que tu saldo disponible nunca sea una ilusión financiera.'
    },
    {
      q: '¿Cómo se comporta la interfaz en mi Computadora y en mi Celular?',
      a: 'El sistema reconoce tu dispositivo automáticamente. En PC ofrece un panel extendido con barra lateral, vista de auditoría y tablas simultáneas. En Celular activa una navegación ergonómica al alcance del pulgar con botón flotante (+) para registrar gastos en 3 segundos.'
    },
    {
      q: '¿Puedo exportar reportes ejecutivos para imprimir o abrir en Excel?',
      a: 'Totalmente. Con un toque generas un estado financiero formal en PDF de alta fidelidad con encabezado corporativo o descargas un archivo CSV estructurado para análisis profesional en Excel o Google Sheets.'
    }
  ];

  return (
    <div className="landing-container" style={{
      minHeight: '100vh',
      background: '#000000',
      color: '#f4f4f5',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Plus Jakarta Sans", sans-serif',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Luz Ambiental de Fondo Estilo Apple */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '900px',
        height: '600px',
        background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 40%, transparent 70%)',
        filter: 'blur(80px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* ------------------------------------------------------------------ */}
      {/* 1. HEADER DE CRISTAL ESMERILADO ESTILO APPLE (48px - 56px)         */}
      {/* ------------------------------------------------------------------ */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(0, 0, 0, 0.72)',
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '0.85rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '100%',
        width: '100%'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Logo Apple-Minimalist */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{
              width: '9px',
              height: '9px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              boxShadow: '0 0 12px #ffffff'
            }} />
            <span style={{
              fontSize: '1.35rem',
              fontWeight: '800',
              letterSpacing: '-0.04em',
              color: '#ffffff'
            }}>
              getloss
            </span>
            <span style={{
              fontSize: '0.68rem',
              fontWeight: '600',
              padding: '0.15rem 0.55rem',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#d4d4d8',
              letterSpacing: '0.04em'
            }}>
              PRO
            </span>
          </div>

          {/* Acciones de Cabecera */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => onOpenAuth(true)}
              style={{
                padding: '0.5rem 1.15rem',
                borderRadius: '9999px',
                fontSize: '0.825rem',
                fontWeight: '600',
                background: 'transparent',
                color: '#d4d4d8',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#d4d4d8';
              }}
            >
              Iniciar Sesión
            </button>

            <button
              onClick={() => onOpenAuth(false)}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '9999px',
                fontSize: '0.825rem',
                fontWeight: '700',
                background: '#ffffff',
                color: '#000000',
                border: 'none',
                boxShadow: '0 0 20px rgba(255, 255, 255, 0.25)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.03)';
                e.currentTarget.style.boxShadow = '0 0 28px rgba(255, 255, 255, 0.45)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.25)';
              }}
            >
              <span>Crear Cuenta</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* 2. HERO SECTION CON MEDIDAS Y TIPOGRAFÍA APPLE                     */}
      {/* ------------------------------------------------------------------ */}
      <section style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '5rem 1.5rem 3rem 1.5rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Eyebrow Pill con Micro-Brillo */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.55rem',
          padding: '0.45rem 1.15rem',
          borderRadius: '9999px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          fontSize: '0.8rem',
          fontWeight: '600',
          color: '#e4e4e7',
          letterSpacing: '-0.01em',
          marginBottom: '1.5rem',
          backdropFilter: 'blur(10px)'
        }}>
          <Sparkles size={14} style={{ color: '#ffffff' }} />
          <span>getloss 2.0 • Diseñado para Computadora y Celular</span>
        </div>

        {/* Titular Titánico Estilo Keynote de Apple */}
        <h1 style={{
          fontSize: 'clamp(2.8rem, 6.5vw, 5.2rem)',
          fontWeight: '800',
          lineHeight: '1.04',
          letterSpacing: '-0.045em',
          maxWidth: '980px',
          margin: '0 auto 1.5rem auto',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 60%, rgba(255, 255, 255, 0.5) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Elimina tus fugas de dinero. Con precisión absoluta.
        </h1>

        {/* Subtítulo Equilibrado */}
        <p style={{
          fontSize: 'clamp(1.1rem, 2.2vw, 1.35rem)',
          color: '#86868b',
          maxWidth: '680px',
          lineHeight: '1.55',
          margin: '0 auto 2.5rem auto',
          fontWeight: '400',
          letterSpacing: '-0.015em'
        }}>
          La suite financiera monocromática que separa tus <strong>obligaciones indispensables</strong> de tus gastos variables, calculando tu saldo libre quincena a quincena.
        </p>

        {/* Botones de Acción Estilo Cápsula Apple */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.25rem',
          marginBottom: '3.5rem'
        }}>
          <button
            onClick={() => onOpenAuth(false)}
            style={{
              padding: '0.95rem 2.5rem',
              fontSize: '1rem',
              fontWeight: '700',
              borderRadius: '9999px',
              background: '#ffffff',
              color: '#000000',
              boxShadow: '0 0 35px rgba(255, 255, 255, 0.35)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.55rem',
              cursor: 'pointer',
              border: 'none',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.04)';
              e.currentTarget.style.boxShadow = '0 0 50px rgba(255, 255, 255, 0.55)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 0 35px rgba(255, 255, 255, 0.35)';
            }}
          >
            <span>Comenzar Ahora</span>
            <ArrowRight size={17} />
          </button>

          <button
            onClick={() => onOpenAuth(true)}
            style={{
              padding: '0.95rem 2.2rem',
              fontSize: '1rem',
              fontWeight: '600',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              backdropFilter: 'blur(12px)',
              cursor: 'pointer',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.35)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)';
            }}
          >
            <span>Iniciar Sesión</span>
          </button>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* 3. HARDWARE SHOWCASE APPLE (MACBOOK PRO & IPHONE 16 PRO)            */}
        {/* ------------------------------------------------------------------ */}
        <div style={{
          width: '100%',
          maxWidth: '1120px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative'
        }}>
          {/* Spotlight Glow Detrás del Hardware */}
          <div style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '85%',
            height: '350px',
            background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.07) 0%, transparent 70%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
            zIndex: 0
          }} />

          {/* Selector de Dispositivo y Periodo en Formato Segmented Control */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            gap: '1rem',
            marginBottom: '1.75rem',
            zIndex: 2
          }}>
            {/* Segmented Control 1: PC vs Celular */}
            <div className="apple-segmented-control">
              <button
                type="button"
                className="apple-pill-btn"
                onClick={() => {
                  setActiveDevice('DESKTOP');
                  setHasManuallyToggled(true);
                }}
                style={{
                  background: activeDevice === 'DESKTOP' ? '#ffffff' : 'transparent',
                  color: activeDevice === 'DESKTOP' ? '#000000' : '#86868b'
                }}
              >
                <Laptop size={16} />
                <span>Vista PC / Mac</span>
                {deviceDetect.deviceType === 'DESKTOP' && (
                  <span style={{
                    fontSize: '0.625rem',
                    padding: '0.1rem 0.45rem',
                    borderRadius: '9999px',
                    background: activeDevice === 'DESKTOP' ? '#000000' : 'rgba(255, 255, 255, 0.15)',
                    color: activeDevice === 'DESKTOP' ? '#ffffff' : '#ffffff',
                    fontWeight: '700'
                  }}>
                    Tu Equipo
                  </span>
                )}
              </button>

              <button
                type="button"
                className="apple-pill-btn"
                onClick={() => {
                  setActiveDevice('MOBILE');
                  setHasManuallyToggled(true);
                }}
                style={{
                  background: activeDevice === 'MOBILE' ? '#ffffff' : 'transparent',
                  color: activeDevice === 'MOBILE' ? '#000000' : '#86868b'
                }}
              >
                <Smartphone size={16} />
                <span>Vista iPhone / Celular</span>
                {deviceDetect.deviceType === 'MOBILE' && (
                  <span style={{
                    fontSize: '0.625rem',
                    padding: '0.1rem 0.45rem',
                    borderRadius: '9999px',
                    background: activeDevice === 'MOBILE' ? '#000000' : 'rgba(255, 255, 255, 0.15)',
                    color: activeDevice === 'MOBILE' ? '#ffffff' : '#ffffff',
                    fontWeight: '700'
                  }}>
                    Tu Equipo
                  </span>
                )}
              </button>
            </div>

            {/* Segmented Control 2: Quincenal vs Mensual */}
            <div className="apple-segmented-control">
              <button
                type="button"
                className="apple-pill-btn"
                onClick={() => setSimPeriod('QUINCENAL')}
                style={{
                  background: simPeriod === 'QUINCENAL' ? '#ffffff' : 'transparent',
                  color: simPeriod === 'QUINCENAL' ? '#000000' : '#86868b'
                }}
              >
                <span>🗓️ Modo Quincenal</span>
              </button>

              <button
                type="button"
                className="apple-pill-btn"
                onClick={() => setSimPeriod('MENSUAL')}
                style={{
                  background: simPeriod === 'MENSUAL' ? '#ffffff' : 'transparent',
                  color: simPeriod === 'MENSUAL' ? '#000000' : '#86868b'
                }}
              >
                <span>📅 Modo Mensual</span>
              </button>
            </div>
          </div>

          {/* ============================================================= */}
          {/* MOCKUP 1: MACBOOK PRO 16" SPACE BLACK HIPERREALISTA & INTERACTIVO */}
          {/* ============================================================= */}
          {activeDevice === 'DESKTOP' && (() => {
            // Cálculos dinámicos en tiempo real basados en los checks del usuario
            const totalObligationsSum = currentSim.obligations.reduce((acc, curr) => acc + curr.amount, 0);
            const paidObligationsSum = currentSim.obligations
              .filter((_, idx) => paidObligations[idx] !== false)
              .reduce((acc, curr) => acc + curr.amount, 0);
            const pendingObligationsSum = currentSim.obligations
              .filter((_, idx) => paidObligations[idx] === false)
              .reduce((acc, curr) => acc + curr.amount, 0);
            const paidCount = currentSim.obligations.filter((_, idx) => paidObligations[idx] !== false).length;
            const totalCount = currentSim.obligations.length;
            const dynamicBalance = currentSim.income - currentSim.expenses + pendingObligationsSum;
            const savingsPercent = Math.max(0, Math.round((dynamicBalance / currentSim.income) * 100));
            const compliancePercent = Math.round((paidCount / totalCount) * 100);

            // Filtrado interactivo de obligaciones y transacciones en PC
            const filteredObligations = currentSim.obligations.filter(item => 
              pcSearchQuery === '' || 
              item.name.toLowerCase().includes(pcSearchQuery.toLowerCase()) ||
              item.cat.toLowerCase().includes(pcSearchQuery.toLowerCase())
            );

            const filteredTxs = currentSim.recentTxs.filter(tx => {
              if (pcTxFilter === 'INCOME') return tx.type === 'INCOME';
              if (pcTxFilter === 'EXPENSE') return tx.type === 'EXPENSE';
              return true;
            });

            return (
              <div style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                padding: '0.5rem 0'
              }}>
                {/* CHASIS MACBOOK PRO 16" SPACE BLACK */}
                <div className="apple-hardware-wrapper" style={{
                  width: '100%',
                  maxWidth: '1080px',
                  zIndex: 2,
                  animation: 'appleFadeScale 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative'
                }}>
                  {/* TAPA SUPERIOR DE ALUMINIO ANODIZADO SPACE BLACK (R=24px) */}
                  <div style={{
                    background: 'linear-gradient(145deg, #3f3f46 0%, #1c1c20 25%, #27272a 70%, #121215 100%)',
                    borderRadius: '24px 24px 8px 8px',
                    border: '1px solid rgba(255, 255, 255, 0.28)',
                    padding: '8px 8px 10px 8px',
                    boxShadow: '0 45px 120px -20px rgba(0, 0, 0, 0.98), 0 0 0 1px rgba(255, 255, 255, 0.12), inset 0 1px 2px rgba(255, 255, 255, 0.45)',
                    textAlign: 'left',
                    position: 'relative'
                  }}>
                    {/* Notch / Sensor Cámara FaceTime HD con LED Activo */}
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '98px',
                      height: '14px',
                      background: '#000000',
                      borderBottomLeftRadius: '9px',
                      borderBottomRightRadius: '9px',
                      zIndex: 35,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.6)'
                    }}>
                      {/* Lente Cámara */}
                      <div style={{ width: '5.5px', height: '5.5px', borderRadius: '50%', background: '#1c1c20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: '2.5px', height: '2.5px', borderRadius: '50%', background: '#09090b' }} />
                      </div>
                      {/* LED Verde de Privacidad Activo */}
                      <div style={{
                        width: '3.5px',
                        height: '3.5px',
                        borderRadius: '50%',
                        background: '#22c55e',
                        boxShadow: '0 0 6px #22c55e',
                        animation: 'applePulseGlow 3s ease-in-out infinite'
                      }} />
                    </div>

                    {/* Pantalla Liquid Retina XDR OLED Pro (R=16px) */}
                    <div style={{
                      background: '#09090b',
                      borderRadius: '16px 16px 6px 6px',
                      overflow: 'hidden',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      position: 'relative'
                    }}>
                      {/* Reflejo Diagonal de Cristal Mac (Glare Sheen) */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '240px',
                        background: 'linear-gradient(120deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.01) 45%, transparent 80%)',
                        pointerEvents: 'none',
                        zIndex: 25
                      }} />

                      {/* -------------------------------------------------------- */}
                      {/* BARRA DE SISTEMA macOS (Menu Bar Superior)              */}
                      {/* -------------------------------------------------------- */}
                      <div style={{
                        background: '#0d0d10',
                        padding: '0.35rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                        fontSize: '0.68rem',
                        color: '#a1a1aa',
                        userSelect: 'none',
                        zIndex: 30,
                        position: 'relative'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <span style={{ color: '#ffffff', fontWeight: '800', fontSize: '0.85rem' }}></span>
                          <span style={{ color: '#ffffff', fontWeight: '700' }}>getloss</span>
                          <span style={{ cursor: 'pointer', color: '#71717a' }}>Archivo</span>
                          <span style={{ cursor: 'pointer', color: '#71717a' }}>Editar</span>
                          <span style={{ cursor: 'pointer', color: '#71717a' }}>Ver</span>
                          <span style={{ cursor: 'pointer', color: '#71717a' }}>Quincena</span>
                          <span style={{ cursor: 'pointer', color: '#71717a' }}>Ayuda</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#22c55e', fontWeight: '700' }}>
                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22c55e' }} />
                            <span>100% Sincronizado</span>
                          </div>
                          <Wifi size={12} color="#ffffff" />
                          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                            <Battery size={13} color="#ffffff" />
                            <span style={{ color: '#ffffff', fontWeight: '600' }}>100%</span>
                          </div>
                          <span style={{ color: '#ffffff', fontWeight: '700' }}>Vie 9:41 AM</span>
                        </div>
                      </div>

                      {/* -------------------------------------------------------- */}
                      {/* BARRA DE VENTANA macOS (Traffic Lights & Address Bar)     */}
                      {/* -------------------------------------------------------- */}
                      <div style={{
                        background: '#141418',
                        padding: '0.55rem 1.15rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                        position: 'relative',
                        zIndex: 20
                      }}>
                        {/* Traffic Lights con Micro-Iconos de Control */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div
                            title="Cerrar"
                            style={{
                              width: '12px',
                              height: '12px',
                              borderRadius: '50%',
                              background: '#ff5f56',
                              border: '1px solid rgba(0,0,0,0.2)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.5rem',
                              color: '#4c0002',
                              cursor: 'pointer'
                            }}
                          >
                            ×
                          </div>
                          <div
                            title="Minimizar"
                            style={{
                              width: '12px',
                              height: '12px',
                              borderRadius: '50%',
                              background: '#ffbd2e',
                              border: '1px solid rgba(0,0,0,0.2)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.5rem',
                              color: '#5c3b00',
                              cursor: 'pointer'
                            }}
                          >
                            −
                          </div>
                          <div
                            title="Pantalla Completa"
                            style={{
                              width: '12px',
                              height: '12px',
                              borderRadius: '50%',
                              background: '#27c93f',
                              border: '1px solid rgba(0,0,0,0.2)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.45rem',
                              color: '#004d11',
                              cursor: 'pointer'
                            }}
                          >
                            ⤢
                          </div>
                        </div>

                        {/* Cápsula de Dirección Web SSL */}
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          padding: '0.3rem 1.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.725rem',
                          color: '#e4e4e7',
                          fontFamily: 'monospace',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.4)'
                        }}>
                          <Lock size={11} style={{ color: '#22c55e' }} />
                          <span>app.getloss.com/suite • <strong>{simPeriod === 'QUINCENAL' ? 'Ciclo Quincenal (15 Días)' : 'Ciclo Mensual (30 Días)'}</strong></span>
                        </div>

                        {/* Controles Rápidos de Cabecera */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <button
                            type="button"
                            onClick={() => onOpenAuth(false)}
                            style={{
                              fontSize: '0.7rem',
                              padding: '0.2rem 0.65rem',
                              borderRadius: '6px',
                              background: 'rgba(255,255,255,0.08)',
                              color: '#ffffff',
                              border: '1px solid rgba(255,255,255,0.12)',
                              cursor: 'pointer',
                              fontWeight: '600'
                            }}
                          >
                            Probar en Vivo
                          </button>
                        </div>
                      </div>

                      {/* -------------------------------------------------------- */}
                      {/* CUERPO DE LA APLICACIÓN PC (Sidebar + Main Viewport)     */}
                      {/* -------------------------------------------------------- */}
                      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '540px', position: 'relative' }}>
                        {/* SIDEBAR MAC INTERACTIVO */}
                        <div style={{
                          background: '#111114',
                          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
                          padding: '1.25rem 1rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          zIndex: 10
                        }}>
                          <div>
                            {/* Logo getloss Pro con Indicador Pulsante */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingLeft: '0.25rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 0 10px #ffffff' }} />
                                <span style={{ fontWeight: '800', color: '#ffffff', fontSize: '1.05rem', letterSpacing: '-0.02em' }}>getloss</span>
                              </div>
                              <span style={{ fontSize: '0.625rem', background: '#ffffff', padding: '0.12rem 0.45rem', borderRadius: '9999px', color: '#000000', fontWeight: '800' }}>
                                PRO
                              </span>
                            </div>

                            {/* Botón "+ Nuevo Movimiento" con Efecto Glow */}
                            <button
                              type="button"
                              onClick={() => setIsQuickAddOpen(prev => !prev)}
                              style={{
                                width: '100%',
                                padding: '0.7rem',
                                borderRadius: '10px',
                                background: isQuickAddOpen ? '#27272a' : '#ffffff',
                                color: isQuickAddOpen ? '#ffffff' : '#000000',
                                fontWeight: '700',
                                fontSize: '0.825rem',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                marginBottom: '1.25rem',
                                cursor: 'pointer',
                                boxShadow: isQuickAddOpen ? 'none' : '0 4px 16px rgba(255, 255, 255, 0.3)',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <Plus size={16} strokeWidth={2.8} style={{ transform: isQuickAddOpen ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s ease' }} />
                              <span>{isQuickAddOpen ? 'Cerrar Registro' : 'Nuevo Movimiento'}</span>
                            </button>

                            {/* Buscador Rápido en Sidebar */}
                            <div style={{
                              position: 'relative',
                              marginBottom: '1rem'
                            }}>
                              <Search size={13} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#71717a' }} />
                              <input
                                type="text"
                                value={pcSearchQuery}
                                onChange={(e) => setPcSearchQuery(e.target.value)}
                                placeholder="Buscar en quincena..."
                                style={{
                                  width: '100%',
                                  padding: '0.45rem 0.75rem 0.45rem 2rem',
                                  borderRadius: '8px',
                                  background: 'rgba(255, 255, 255, 0.04)',
                                  border: '1px solid rgba(255, 255, 255, 0.08)',
                                  fontSize: '0.75rem',
                                  color: '#ffffff',
                                  outline: 'none'
                                }}
                              />
                            </div>

                            {/* Pestañas Interactivas del Sidebar PC */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                              <button
                                type="button"
                                onClick={() => setActiveScreenTab('dashboard')}
                                style={{
                                  width: '100%',
                                  padding: '0.65rem 0.85rem',
                                  background: activeScreenTab === 'dashboard' ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                                  border: activeScreenTab === 'dashboard' ? '1px solid rgba(255, 255, 255, 0.18)' : '1px solid transparent',
                                  borderRadius: '10px',
                                  color: activeScreenTab === 'dashboard' ? '#ffffff' : '#86868b',
                                  fontWeight: activeScreenTab === 'dashboard' ? '700' : '500',
                                  fontSize: '0.825rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                  textAlign: 'left'
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                  <LayoutDashboard size={16} />
                                  <span>Panel Principal</span>
                                </div>
                                <span style={{ fontSize: '0.65rem', color: '#71717a' }}>⌘1</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setActiveScreenTab('fixed')}
                                style={{
                                  width: '100%',
                                  padding: '0.65rem 0.85rem',
                                  background: activeScreenTab === 'fixed' ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                                  border: activeScreenTab === 'fixed' ? '1px solid rgba(255, 255, 255, 0.18)' : '1px solid transparent',
                                  borderRadius: '10px',
                                  color: activeScreenTab === 'fixed' ? '#ffffff' : '#86868b',
                                  fontWeight: activeScreenTab === 'fixed' ? '700' : '500',
                                  fontSize: '0.825rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                  textAlign: 'left'
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                  <ShieldCheck size={16} />
                                  <span>Obligaciones</span>
                                </div>
                                <span style={{
                                  fontSize: '0.65rem',
                                  background: paidCount === totalCount ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255,255,255,0.1)',
                                  color: paidCount === totalCount ? '#4ade80' : '#ffffff',
                                  padding: '0.1rem 0.45rem',
                                  borderRadius: '9999px',
                                  fontWeight: '700'
                                }}>
                                  {paidCount}/{totalCount}
                                </span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setActiveScreenTab('transactions')}
                                style={{
                                  width: '100%',
                                  padding: '0.65rem 0.85rem',
                                  background: activeScreenTab === 'transactions' ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                                  border: activeScreenTab === 'transactions' ? '1px solid rgba(255, 255, 255, 0.18)' : '1px solid transparent',
                                  borderRadius: '10px',
                                  color: activeScreenTab === 'transactions' ? '#ffffff' : '#86868b',
                                  fontWeight: activeScreenTab === 'transactions' ? '700' : '500',
                                  fontSize: '0.825rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                  textAlign: 'left'
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                  <Receipt size={16} />
                                  <span>Movimientos</span>
                                </div>
                                <span style={{ fontSize: '0.65rem', color: '#71717a' }}>⌘3</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setActiveScreenTab('reports')}
                                style={{
                                  width: '100%',
                                  padding: '0.65rem 0.85rem',
                                  background: activeScreenTab === 'reports' ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                                  border: activeScreenTab === 'reports' ? '1px solid rgba(255, 255, 255, 0.18)' : '1px solid transparent',
                                  borderRadius: '10px',
                                  color: activeScreenTab === 'reports' ? '#ffffff' : '#86868b',
                                  fontWeight: activeScreenTab === 'reports' ? '700' : '500',
                                  fontSize: '0.825rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                  textAlign: 'left'
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                  <Download size={16} />
                                  <span>Reportes & PDF</span>
                                </div>
                                <span style={{ fontSize: '0.65rem', color: '#71717a' }}>⌘4</span>
                              </button>
                            </div>
                          </div>

                          {/* Perfil de Usuario con Estado en Vivo */}
                          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.85rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                              <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg, #27272a, #3f3f46)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.725rem', fontWeight: '800', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)' }}>
                                JL
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  Jesús López
                                </div>
                                <div style={{ fontSize: '0.68rem', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22c55e' }} />
                                  <span>Cuenta Pro Activa</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* VIEWPORT PRINCIPAL PC */}
                        <div style={{ padding: '1.5rem', background: '#09090b', overflowY: 'auto', position: 'relative' }}>
                          {/* IN-SCREEN MODAL / DRAWER: REGISTRAR MOVIMIENTO RÁPIDO */}
                          {isQuickAddOpen && (
                            <form
                              onSubmit={handleSimQuickAdd}
                              style={{
                                background: 'linear-gradient(145deg, #18181b 0%, #121215 100%)',
                                border: '1px solid rgba(255, 255, 255, 0.22)',
                                borderRadius: '18px',
                                padding: '1.35rem',
                                marginBottom: '1.35rem',
                                boxShadow: '0 20px 45px rgba(0,0,0,0.85), inset 0 1px 1px rgba(255,255,255,0.15)',
                                animation: 'scaleIn 0.2s ease-out',
                                position: 'relative',
                                zIndex: 20
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#ffffff', color: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Plus size={15} strokeWidth={2.8} />
                                  </div>
                                  <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#ffffff' }}>Registrar Movimiento en {simPeriod}</span>
                                </div>
                                <button type="button" onClick={() => setIsQuickAddOpen(false)} style={{ color: '#86868b', cursor: 'pointer', background: 'none', border: 'none' }}>
                                  <X size={16} />
                                </button>
                              </div>

                              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr', gap: '0.75rem', marginBottom: '1rem' }}>
                                <div>
                                  <label style={{ fontSize: '0.7rem', color: '#a1a1aa', fontWeight: '600', display: 'block', marginBottom: '0.25rem' }}>Concepto o Nombre</label>
                                  <input
                                    type="text"
                                    value={quickAddConcept}
                                    onChange={(e) => setQuickAddConcept(e.target.value)}
                                    placeholder="Ej. Supermercado, Factura Luz"
                                    style={{
                                      width: '100%',
                                      padding: '0.55rem 0.75rem',
                                      borderRadius: '8px',
                                      background: 'rgba(255,255,255,0.06)',
                                      border: '1px solid rgba(255,255,255,0.14)',
                                      color: '#ffffff',
                                      fontSize: '0.8rem',
                                      outline: 'none'
                                    }}
                                  />
                                </div>

                                <div>
                                  <label style={{ fontSize: '0.7rem', color: '#a1a1aa', fontWeight: '600', display: 'block', marginBottom: '0.25rem' }}>Monto ($ USD)</label>
                                  <input
                                    type="number"
                                    value={quickAddAmount}
                                    onChange={(e) => setQuickAddAmount(e.target.value)}
                                    placeholder="0.00"
                                    style={{
                                      width: '100%',
                                      padding: '0.55rem 0.75rem',
                                      borderRadius: '8px',
                                      background: 'rgba(255,255,255,0.06)',
                                      border: '1px solid rgba(255,255,255,0.14)',
                                      color: '#ffffff',
                                      fontSize: '0.8rem',
                                      fontWeight: '700',
                                      outline: 'none'
                                    }}
                                  />
                                </div>

                                <div>
                                  <label style={{ fontSize: '0.7rem', color: '#a1a1aa', fontWeight: '600', display: 'block', marginBottom: '0.25rem' }}>Categoría</label>
                                  <select
                                    value={quickAddCat}
                                    onChange={(e) => setQuickAddCat(e.target.value)}
                                    style={{
                                      width: '100%',
                                      padding: '0.55rem 0.75rem',
                                      borderRadius: '8px',
                                      background: '#1c1c20',
                                      border: '1px solid rgba(255,255,255,0.14)',
                                      color: '#ffffff',
                                      fontSize: '0.8rem',
                                      outline: 'none'
                                    }}
                                  >
                                    <option value="Vivienda">Vivienda</option>
                                    <option value="Servicios">Servicios Básicos</option>
                                    <option value="Alimentación">Alimentación / Super</option>
                                    <option value="Transporte">Transporte / Gasolina</option>
                                    <option value="Ocio">Ocio / Variable</option>
                                  </select>
                                </div>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', gap: '0.4rem' }}>
                                  {['Arriendo', 'Super', 'Luz', 'Internet'].map((preset) => (
                                    <button
                                      key={preset}
                                      type="button"
                                      onClick={() => setQuickAddConcept(preset)}
                                      style={{
                                        fontSize: '0.68rem',
                                        padding: '0.2rem 0.55rem',
                                        borderRadius: '9999px',
                                        background: 'rgba(255,255,255,0.06)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        color: '#a1a1aa',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      +{preset}
                                    </button>
                                  ))}
                                </div>

                                <button
                                  type="submit"
                                  style={{
                                    padding: '0.6rem 1.4rem',
                                    borderRadius: '8px',
                                    background: quickAddFeedback ? '#22c55e' : '#ffffff',
                                    color: quickAddFeedback ? '#ffffff' : '#000000',
                                    fontWeight: '800',
                                    fontSize: '0.8rem',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    transition: 'all 0.2s ease',
                                    boxShadow: '0 4px 14px rgba(255,255,255,0.25)'
                                  }}
                                >
                                  {quickAddFeedback ? (
                                    <>
                                      <Check size={15} strokeWidth={3} />
                                      <span>¡Guardado con Éxito!</span>
                                    </>
                                  ) : (
                                    <>
                                      <span>Registrar en Quincena</span>
                                      <ArrowRight size={14} />
                                    </>
                                  )}
                                </button>
                              </div>
                            </form>
                          )}

                          {/* -------------------------------------------------- */}
                          {/* VISTA 1: DASHBOARD PRINCIPAL PC                   */}
                          {/* -------------------------------------------------- */}
                          {activeScreenTab === 'dashboard' && (
                            <div style={{ animation: 'fadeIn 0.2s ease-in' }}>
                              {/* Grid de 4 Métricas de Grado Ejecutivo con Recálculo Dinámico */}
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.85rem', marginBottom: '1.25rem' }}>
                                {/* 1. Saldo Libre Disponible */}
                                <div style={{
                                  background: 'linear-gradient(145deg, #18181b 0%, #121215 100%)',
                                  border: '1px solid rgba(255, 255, 255, 0.2)',
                                  borderRadius: '16px',
                                  padding: '1.1rem',
                                  boxShadow: '0 8px 24px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.15)'
                                }}>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                    <span style={{ fontSize: '0.68rem', color: '#86868b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Saldo Libre Real</span>
                                    <span style={{ fontSize: '0.65rem', color: '#22c55e', background: 'rgba(34, 197, 94, 0.15)', padding: '0.15rem 0.45rem', borderRadius: '9999px', fontWeight: '700' }}>
                                      {savingsPercent}% Ahorro
                                    </span>
                                  </div>
                                  <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#ffffff', margin: '0.2rem 0', letterSpacing: '-0.03em' }}>
                                    {formatMoney(dynamicBalance, 'USD')}
                                  </div>
                                  <span style={{ fontSize: '0.7rem', color: '#a1a1aa' }}>Disponible sin tocar compromisos</span>
                                </div>

                                {/* 2. Ingresos Fijos */}
                                <div style={{ background: '#18181b', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '1.1rem' }}>
                                  <span style={{ fontSize: '0.68rem', color: '#86868b', fontWeight: '700', textTransform: 'uppercase' }}>Ingresos Fijos</span>
                                  <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#ffffff', margin: '0.2rem 0' }}>+{formatMoney(currentSim.income, 'USD')}</div>
                                  <span style={{ fontSize: '0.7rem', color: '#22c55e' }}>● Garantizado {simPeriod}</span>
                                </div>

                                {/* 3. Egresos Totales */}
                                <div style={{ background: '#18181b', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '1.1rem' }}>
                                  <span style={{ fontSize: '0.68rem', color: '#86868b', fontWeight: '700', textTransform: 'uppercase' }}>Egresos Proyectados</span>
                                  <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#a1a1aa', margin: '0.2rem 0' }}>-{formatMoney(currentSim.expenses, 'USD')}</div>
                                  <span style={{ fontSize: '0.7rem', color: '#71717a' }}>Obligaciones + Variables</span>
                                </div>

                                {/* 4. Cumplimiento de Obligaciones */}
                                <div style={{ background: '#18181b', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '1.1rem' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                    <span style={{ fontSize: '0.68rem', color: '#86868b', fontWeight: '700', textTransform: 'uppercase' }}>Cumplimiento</span>
                                    <span style={{ fontSize: '0.68rem', fontWeight: '800', color: paidCount === totalCount ? '#22c55e' : '#f59e0b' }}>
                                      {compliancePercent}%
                                    </span>
                                  </div>
                                  <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ffffff', margin: '0.25rem 0' }}>
                                    {paidCount} de {totalCount} Pagadas
                                  </div>
                                  {/* Barra de Progreso Dinámica */}
                                  <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '9999px', overflow: 'hidden', marginTop: '0.45rem' }}>
                                    <div style={{ width: `${compliancePercent}%`, height: '100%', background: paidCount === totalCount ? '#22c55e' : '#ffffff', transition: 'width 0.3s ease' }} />
                                  </div>
                                </div>
                              </div>

                              {/* Columnas Duales: Obligaciones y Movimientos Recientes */}
                              <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: '1rem' }}>
                                {/* Columna Izquierda: Obligaciones Fijas con Checkboxes Interactivos */}
                                <div style={{ background: '#18181b', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '1.25rem' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                                    <div>
                                      <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#ffffff' }}>
                                        Gastos Indispensables ({simPeriod})
                                      </div>
                                      <span style={{ fontSize: '0.7rem', color: '#86868b' }}>Haz clic en cualquier fila para marcar como pagada</span>
                                    </div>
                                    <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.08)', padding: '0.2rem 0.55rem', borderRadius: '6px', color: '#e4e4e7', fontWeight: '700' }}>
                                      Total: {formatMoney(totalObligationsSum, 'USD')}
                                    </span>
                                  </div>

                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {filteredObligations.map((item, idx) => {
                                      const Icon = item.icon;
                                      const isPaid = paidObligations[idx] !== false;
                                      return (
                                        <div
                                          key={idx}
                                          onClick={() => toggleObligation(idx)}
                                          style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '0.75rem 0.9rem',
                                            background: isPaid ? 'rgba(255, 255, 255, 0.03)' : 'rgba(239, 68, 68, 0.08)',
                                            borderRadius: '12px',
                                            border: isPaid ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(239, 68, 68, 0.35)',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                                          }}
                                          onMouseEnter={e => {
                                            e.currentTarget.style.background = isPaid ? 'rgba(255, 255, 255, 0.07)' : 'rgba(239, 68, 68, 0.12)';
                                          }}
                                          onMouseLeave={e => {
                                            e.currentTarget.style.background = isPaid ? 'rgba(255, 255, 255, 0.03)' : 'rgba(239, 68, 68, 0.08)';
                                          }}
                                        >
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            {/* Custom Interactive Checkbox */}
                                            <div style={{
                                              width: '20px',
                                              height: '20px',
                                              borderRadius: '6px',
                                              background: isPaid ? '#ffffff' : 'transparent',
                                              border: isPaid ? '1px solid #ffffff' : '1.5px solid #71717a',
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              transition: 'all 0.15s ease'
                                            }}>
                                              {isPaid && <Check size={14} color="#000000" strokeWidth={3} />}
                                            </div>

                                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: isPaid ? 'rgba(255, 255, 255, 0.08)' : 'rgba(239, 68, 68, 0.2)', color: isPaid ? '#ffffff' : '#f87171', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                              <Icon size={15} />
                                            </div>

                                            <div>
                                              <div style={{ fontSize: '0.825rem', fontWeight: '700', color: '#ffffff', textDecoration: isPaid ? 'none' : 'none' }}>
                                                {item.name}
                                              </div>
                                              <div style={{ fontSize: '0.7rem', color: '#86868b' }}>Vencimiento: {item.due} • {item.cat}</div>
                                            </div>
                                          </div>

                                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <span style={{ fontSize: '0.875rem', fontWeight: '800', color: '#ffffff' }}>{formatMoney(item.amount, 'USD')}</span>
                                            <span style={{
                                              fontSize: '0.65rem',
                                              fontWeight: '700',
                                              background: isPaid ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.2)',
                                              color: isPaid ? '#4ade80' : '#f87171',
                                              padding: '0.15rem 0.55rem',
                                              borderRadius: '9999px'
                                            }}>
                                              {isPaid ? '✓ Pagado' : '⏳ Pendiente'}
                                            </span>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Columna Derecha: Movimientos Recientes & Filtro */}
                                <div style={{ background: '#18181b', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '1.25rem' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                                    <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#ffffff' }}>
                                      Movimientos Recientes
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.3rem' }}>
                                      <button
                                        type="button"
                                        onClick={() => setPcTxFilter('ALL')}
                                        style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem', borderRadius: '6px', background: pcTxFilter === 'ALL' ? '#ffffff' : 'rgba(255,255,255,0.06)', color: pcTxFilter === 'ALL' ? '#000000' : '#a1a1aa', fontWeight: '700' }}
                                      >
                                        Todos
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setPcTxFilter('INCOME')}
                                        style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem', borderRadius: '6px', background: pcTxFilter === 'INCOME' ? '#ffffff' : 'rgba(255,255,255,0.06)', color: pcTxFilter === 'INCOME' ? '#000000' : '#a1a1aa', fontWeight: '700' }}
                                      >
                                        Ingresos
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setPcTxFilter('EXPENSE')}
                                        style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem', borderRadius: '6px', background: pcTxFilter === 'EXPENSE' ? '#ffffff' : 'rgba(255,255,255,0.06)', color: pcTxFilter === 'EXPENSE' ? '#000000' : '#a1a1aa', fontWeight: '700' }}
                                      >
                                        Gastos
                                      </button>
                                    </div>
                                  </div>

                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {filteredTxs.map((tx, idx) => {
                                      const Icon = tx.icon;
                                      const isInc = tx.type === 'INCOME';
                                      return (
                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.7rem 0.85rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                            <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: isInc ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 255, 255, 0.08)', color: isInc ? '#4ade80' : '#a1a1aa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                              <Icon size={15} />
                                            </div>
                                            <div>
                                              <div style={{ fontSize: '0.825rem', fontWeight: '700', color: '#ffffff' }}>{tx.title}</div>
                                              <div style={{ fontSize: '0.7rem', color: '#71717a' }}>{tx.date} • {isInc ? 'Ingreso Fijo' : 'Egreso'}</div>
                                            </div>
                                          </div>
                                          <span style={{ fontSize: '0.875rem', fontWeight: '800', color: isInc ? '#4ade80' : '#ffffff' }}>
                                            {isInc ? '+' : '-'}{formatMoney(tx.amount, 'USD')}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* -------------------------------------------------- */}
                          {/* VISTA 2: OBLIGACIONES INDISPENSABLES (AUDITORÍA)  */}
                          {/* -------------------------------------------------- */}
                          {activeScreenTab === 'fixed' && (
                            <div style={{ animation: 'fadeIn 0.2s ease-in' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                                <div>
                                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em' }}>
                                    Auditoría de Gastos Indispensables
                                  </h3>
                                  <p style={{ fontSize: '0.78rem', color: '#86868b' }}>Tus compromisos prioritarios blindados para el periodo {simPeriod}.</p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                  <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.08)', padding: '0.35rem 0.85rem', borderRadius: '8px', color: '#ffffff', fontWeight: '700' }}>
                                    Abonado: {formatMoney(paidObligationsSum, 'USD')} / {formatMoney(totalObligationsSum, 'USD')}
                                  </span>
                                </div>
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                                {filteredObligations.map((item, idx) => {
                                  const Icon = item.icon;
                                  const isPaid = paidObligations[idx] !== false;
                                  return (
                                    <div
                                      key={idx}
                                      onClick={() => toggleObligation(idx)}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '0.95rem 1.25rem',
                                        background: isPaid ? 'rgba(255, 255, 255, 0.03)' : 'rgba(239, 68, 68, 0.08)',
                                        borderRadius: '14px',
                                        border: isPaid ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(239, 68, 68, 0.35)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                      }}
                                    >
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.95rem' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: isPaid ? 'rgba(255, 255, 255, 0.08)' : 'rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isPaid ? '#ffffff' : '#f87171' }}>
                                          <Icon size={18} />
                                        </div>
                                        <div>
                                          <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ffffff' }}>{item.name}</div>
                                          <div style={{ fontSize: '0.75rem', color: '#86868b' }}>Fecha de Vencimiento: {item.due} • Categoría: {item.cat}</div>
                                        </div>
                                      </div>

                                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                        <div style={{ textAlign: 'right' }}>
                                          <div style={{ fontSize: '1rem', fontWeight: '800', color: '#ffffff' }}>{formatMoney(item.amount, 'USD')}</div>
                                          <span style={{ fontSize: '0.68rem', color: '#71717a' }}>{simPeriod}</span>
                                        </div>

                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleObligation(idx);
                                          }}
                                          style={{
                                            padding: '0.4rem 0.85rem',
                                            borderRadius: '9999px',
                                            fontSize: '0.725rem',
                                            fontWeight: '700',
                                            background: isPaid ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.18)',
                                            color: isPaid ? '#4ade80' : '#f87171',
                                            border: isPaid ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(239, 68, 68, 0.4)',
                                            cursor: 'pointer'
                                          }}
                                        >
                                          {isPaid ? '✓ Pagado' : '⏳ Marcar Pagado'}
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* -------------------------------------------------- */}
                          {/* VISTA 3: MOVIMIENTOS & DETECCIÓN DE FUGAS         */}
                          {/* -------------------------------------------------- */}
                          {activeScreenTab === 'transactions' && (
                            <div style={{ animation: 'fadeIn 0.2s ease-in' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                                <div>
                                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em' }}>
                                    Libro Mayor de Transacciones
                                  </h3>
                                  <p style={{ fontSize: '0.78rem', color: '#86868b' }}>Monitoreo en tiempo real de ingresos y salidas con detección de fugas.</p>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => setIsQuickAddOpen(true)}
                                  style={{
                                    padding: '0.45rem 0.95rem',
                                    borderRadius: '8px',
                                    background: '#ffffff',
                                    color: '#000000',
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem'
                                  }}
                                >
                                  <Plus size={14} />
                                  <span>Registrar Movimiento</span>
                                </button>
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                                {filteredTxs.map((tx, idx) => {
                                  const Icon = tx.icon;
                                  const isInc = tx.type === 'INCOME';
                                  return (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.95rem 1.25rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.95rem' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: isInc ? 'rgba(34, 197, 94, 0.12)' : 'rgba(255, 255, 255, 0.08)', color: isInc ? '#4ade80' : '#a1a1aa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                          <Icon size={18} />
                                        </div>
                                        <div>
                                          <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ffffff' }}>{tx.title}</div>
                                          <div style={{ fontSize: '0.75rem', color: '#86868b' }}>Fecha: {tx.date} • Tipo: {isInc ? 'Ingreso Registrado' : 'Gasto Auditado'}</div>
                                        </div>
                                      </div>
                                      <span style={{ fontSize: '1rem', fontWeight: '800', color: isInc ? '#4ade80' : '#ffffff' }}>
                                        {isInc ? '+' : '-'}{formatMoney(tx.amount, 'USD')}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* -------------------------------------------------- */}
                          {/* VISTA 4: REPORTES EJECUTIVOS & LIVE PDF PREVIEW   */}
                          {/* -------------------------------------------------- */}
                          {activeScreenTab === 'reports' && (
                            <div style={{ animation: 'fadeIn 0.2s ease-in' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                                <div>
                                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em' }}>
                                    Estado Financiero Formal en PDF
                                  </h3>
                                  <p style={{ fontSize: '0.78rem', color: '#86868b' }}>Vista previa del reporte generado para el periodo actual.</p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.65rem' }}>
                                  <button
                                    type="button"
                                    onClick={() => onOpenAuth(false)}
                                    style={{
                                      padding: '0.5rem 1rem',
                                      borderRadius: '8px',
                                      background: '#ffffff',
                                      color: '#000000',
                                      fontWeight: '700',
                                      fontSize: '0.75rem',
                                      border: 'none',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '0.4rem'
                                    }}
                                  >
                                    <Download size={14} />
                                    <span>Descargar PDF</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => onOpenAuth(false)}
                                    style={{
                                      padding: '0.5rem 1rem',
                                      borderRadius: '8px',
                                      background: 'rgba(255,255,255,0.08)',
                                      color: '#ffffff',
                                      fontWeight: '600',
                                      fontSize: '0.75rem',
                                      border: '1px solid rgba(255,255,255,0.15)',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '0.4rem'
                                    }}
                                  >
                                    <FileSpreadsheet size={14} />
                                    <span>Exportar CSV</span>
                                  </button>
                                </div>
                              </div>

                              {/* HOJA DE DOCUMENTO PDF EJECUTIVO EN VIVO */}
                              <div style={{
                                background: '#ffffff',
                                color: '#09090b',
                                borderRadius: '12px',
                                padding: '1.75rem 2rem',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.85)',
                                maxWidth: '680px',
                                margin: '0 auto',
                                border: '1px solid rgba(255,255,255,0.2)',
                                textAlign: 'left',
                                position: 'relative'
                              }}>
                                {/* Encabezado Corporativo PDF */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #09090b', paddingBottom: '0.85rem', marginBottom: '1.25rem' }}>
                                  <div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.03em', color: '#000000' }}>
                                      getloss • ESTADO FINANCIERO
                                    </div>
                                    <div style={{ fontSize: '0.725rem', color: '#71717a', fontWeight: '600' }}>
                                      AUDITORÍA EJECUTIVA DE FLUJO DE CAJA • {simPeriod}
                                    </div>
                                  </div>
                                  <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#09090b' }}>DOC: #GL-{new Date().getFullYear()}-09</div>
                                    <div style={{ fontSize: '0.68rem', color: '#22c55e', fontWeight: '700' }}>VERIFICADO ✓</div>
                                  </div>
                                </div>

                                {/* Tabla de Resumen Ejecutivo en PDF */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', background: '#f4f4f5', padding: '0.85rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
                                  <div>
                                    <div style={{ fontSize: '0.65rem', color: '#71717a', fontWeight: '700' }}>INGRESOS</div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#000000' }}>{formatMoney(currentSim.income, 'USD')}</div>
                                  </div>
                                  <div>
                                    <div style={{ fontSize: '0.65rem', color: '#71717a', fontWeight: '700' }}>OBLIGACIONES</div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#000000' }}>{formatMoney(totalObligationsSum, 'USD')}</div>
                                  </div>
                                  <div>
                                    <div style={{ fontSize: '0.65rem', color: '#71717a', fontWeight: '700' }}>SALDO LIBRE</div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#16a34a' }}>{formatMoney(dynamicBalance, 'USD')}</div>
                                  </div>
                                  <div>
                                    <div style={{ fontSize: '0.65rem', color: '#71717a', fontWeight: '700' }}>TASA AHORRO</div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#000000' }}>{savingsPercent}%</div>
                                  </div>
                                </div>

                                {/* Desglose de Obligaciones Certificadas */}
                                <div style={{ marginBottom: '1.25rem' }}>
                                  <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#000000', marginBottom: '0.45rem', textTransform: 'uppercase' }}>
                                    Desglose de Compromisos Blindados
                                  </div>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.75rem' }}>
                                    {currentSim.obligations.map((ob, idx) => (
                                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0.5rem', borderBottom: '1px dashed #e4e4e7' }}>
                                        <span>{ob.name} ({ob.cat})</span>
                                        <span style={{ fontWeight: '700' }}>{formatMoney(ob.amount, 'USD')}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Pie de Firma del Reporte */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #e4e4e7', paddingTop: '0.75rem', fontSize: '0.68rem', color: '#71717a' }}>
                                  <span>Generado para: Jesús López • getloss Pro</span>
                                  <span>Certificado Criptográfico SHA-256</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* -------------------------------------------------------- */}
                      {/* CHIN INFERIOR MACBOOK PRO (Muesca de Apertura)           */}
                      {/* -------------------------------------------------------- */}
                      <div style={{
                        width: '100%',
                        background: '#121215',
                        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                        padding: '3px 0 4px 0',
                        position: 'relative'
                      }}>
                        <div style={{
                          width: '130px',
                          height: '5px',
                          background: '#1c1c20',
                          borderRadius: '0 0 6px 6px',
                          margin: '0 auto',
                          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.9), 0 0 1px rgba(255,255,255,0.1)'
                        }} />
                      </div>
                    </div>
                  </div>

                  {/* BASE DECK UNIBODY INFERIOR MACBOOK PRO (Aluminio CNC) */}
                  <div style={{
                    width: '102%',
                    margin: '-1px -1% 0 -1%',
                    height: '16px',
                    background: 'linear-gradient(180deg, #27272a 0%, #18181b 30%, #121215 100%)',
                    borderRadius: '0 0 18px 18px',
                    border: '1px solid rgba(255, 255, 255, 0.22)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.9), inset 0 1px 2px rgba(255,255,255,0.3)',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {/* Ranura Central de Apertura con el Pulgar */}
                    <div style={{
                      width: '150px',
                      height: '5px',
                      background: '#09090b',
                      borderRadius: '0 0 5px 5px',
                      boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.8)'
                    }} />

                    {/* Pies de Goma Antideslizantes en Base */}
                    <div style={{ position: 'absolute', left: '25px', bottom: '-2px', width: '35px', height: '3px', background: '#09090b', borderRadius: '2px' }} />
                    <div style={{ position: 'absolute', right: '25px', bottom: '-2px', width: '35px', height: '3px', background: '#09090b', borderRadius: '2px' }} />
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ============================================================= */}
          {/* MOCKUP 2: IPHONE 16 PRO TITANIUM HIPERREALISTA & INTERACTIVO  */}
          {/* ============================================================= */}
          {activeDevice === 'MOBILE' && (
            <div style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              padding: '0.5rem 0'
            }}>
              {/* CHASIS FÍSICO IPHONE 16 PRO TITANIUM CON RATIO Y MEDIDAS DE PRECISIÓN */}
              <div className="apple-hardware-wrapper" style={{
                position: 'relative',
                width: '100%',
                maxWidth: '360px',
                height: '730px',
                zIndex: 2,
                margin: '0 auto',
                animation: 'appleFadeScale 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
              }}>
                {/* Botones Físicos Izquierdos (Action Button, Vol +, Vol -) */}
                <div style={{ position: 'absolute', left: '-3px', top: '100px', width: '3.5px', height: '26px', background: 'linear-gradient(180deg, #d4d4d8, #71717a)', borderRadius: '3px 0 0 3px', boxShadow: 'inset 0 0 1px #000' }} />
                <div style={{ position: 'absolute', left: '-3px', top: '142px', width: '3.5px', height: '48px', background: 'linear-gradient(180deg, #a1a1aa, #52525b)', borderRadius: '3px 0 0 3px' }} />
                <div style={{ position: 'absolute', left: '-3px', top: '200px', width: '3.5px', height: '48px', background: 'linear-gradient(180deg, #a1a1aa, #52525b)', borderRadius: '3px 0 0 3px' }} />

                {/* Botones Físicos Derechos (Power & Camera Control) */}
                <div style={{ position: 'absolute', right: '-3px', top: '155px', width: '3.5px', height: '64px', background: 'linear-gradient(180deg, #a1a1aa, #52525b)', borderRadius: '0 3px 3px 0' }} />
                <div style={{ position: 'absolute', right: '-3px', top: '480px', width: '3px', height: '42px', background: 'linear-gradient(180deg, #3f3f46, #27272a)', borderRadius: '0 2px 2px 0' }} />

                {/* Chasis Exterior de Titanio Pulido (Concentricidad R=52px) */}
                <div style={{
                  background: 'linear-gradient(145deg, #71717a 0%, #27272a 30%, #3f3f46 60%, #18181b 100%)',
                  borderRadius: '52px',
                  padding: '9px',
                  height: '100%',
                  boxShadow: '0 40px 100px -15px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(255, 255, 255, 0.28), inset 0 1px 2px rgba(255, 255, 255, 0.45)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  {/* Bisel Negro OLED Uniforme */}
                  <div style={{
                    background: '#000000',
                    borderRadius: '44px',
                    padding: '2.5px',
                    height: '100%',
                    boxShadow: 'inset 0 0 4px rgba(0,0,0,0.9)',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    {/* Pantalla Super Retina XDR OLED (R=42px) */}
                    <div style={{
                      background: '#09090b',
                      borderRadius: '42px',
                      padding: '0.75rem 0.9rem 0.65rem 0.9rem',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative',
                      overflow: 'hidden',
                      textAlign: 'left'
                    }}>
                      {/* Reflejo de Cristal Superior (Glare Sheen) */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '180px',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.01) 50%, transparent 100%)',
                        pointerEvents: 'none',
                        zIndex: 15
                      }} />

                      {/* Altavoz Superior / Ear Speaker Mesh */}
                      <div style={{
                        width: '44px',
                        height: '3px',
                        borderRadius: '2px',
                        background: '#18181b',
                        margin: '0 auto 4px auto',
                        zIndex: 26
                      }} />

                      {/* Dynamic Island Expandible */}
                      <div style={{ position: 'relative', zIndex: 25 }}>
                        <div
                          onClick={() => setIsDynamicIslandExpanded(prev => !prev)}
                          onMouseEnter={() => setIsDynamicIslandExpanded(true)}
                          onMouseLeave={() => setIsDynamicIslandExpanded(false)}
                          style={{
                            width: isDynamicIslandExpanded ? '225px' : '116px',
                            height: isDynamicIslandExpanded ? '36px' : '27px',
                            background: '#000000',
                            borderRadius: '9999px',
                            margin: '0 auto 0.45rem auto',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: isDynamicIslandExpanded ? '0 12px' : '0 8px',
                            boxShadow: '0 4px 14px rgba(0,0,0,0.9), inset 0 0 2px rgba(255,255,255,0.1)',
                            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                            cursor: 'pointer'
                          }}
                          title="Dynamic Island Interactiva"
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#1c1c20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <div style={{ width: '3.5px', height: '3.5px', borderRadius: '50%', background: '#09090b' }} />
                            </div>
                            {isDynamicIslandExpanded && (
                              <span style={{ fontSize: '0.68rem', fontWeight: '700', color: '#ffffff' }}>getloss Live</span>
                            )}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span style={{ width: '5.5px', height: '5.5px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
                            {isDynamicIslandExpanded ? (
                              <span style={{ fontSize: '0.68rem', fontWeight: '800', color: '#4ade80' }}>+{formatMoney(currentSim.balance, 'USD')}</span>
                            ) : (
                              <span style={{ fontSize: '0.58rem', color: '#a1a1aa', fontWeight: '700' }}>{simPeriod}</span>
                            )}
                          </div>
                        </div>

                        {/* Barra de Estado Nativa iOS */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0.4rem 0.5rem 0.4rem', fontSize: '0.725rem', color: '#a1a1aa' }}>
                          <span style={{ fontWeight: '700', color: '#ffffff' }}>9:41</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span style={{ fontSize: '0.625rem', fontWeight: '700', color: '#a1a1aa' }}>5G</span>
                            <Wifi size={12} color="#ffffff" />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
                              <div style={{ width: '17px', height: '9.5px', border: '1px solid #ffffff', borderRadius: '2.5px', padding: '1px', display: 'flex', alignItems: 'center' }}>
                                <div style={{ width: '100%', height: '100%', background: '#ffffff', borderRadius: '1px' }} />
                              </div>
                              <div style={{ width: '1.2px', height: '3.5px', background: '#ffffff', borderRadius: '0 1px 1px 0' }} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* ===================================================== */}
                      {/* CONTENIDO DE PANTALLA MÓVIL SEGÚN PESTAÑA             */}
                      {/* ===================================================== */}
                      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '0.5rem' }}>
                        {/* PESTAÑA 1: DASHBOARD */}
                        {activeScreenTab === 'dashboard' && (
                          <div style={{ animation: 'fadeIn 0.2s ease-in' }}>
                            {/* Saludo y Avatar */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg, #27272a, #3f3f46)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.75rem', color: '#ffffff' }}>
                                  JL
                                </div>
                                <div>
                                  <div style={{ fontSize: '0.72rem', color: '#86868b' }}>Hola de nuevo 👋</div>
                                  <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#ffffff' }}>Jesús López</div>
                                </div>
                              </div>
                              <span style={{ fontSize: '0.65rem', fontWeight: '700', background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.55rem', borderRadius: '9999px', color: '#ffffff', border: '1px solid rgba(255,255,255,0.1)' }}>
                                {simPeriod === 'QUINCENAL' ? '🗓️ 15 Días' : '📅 Mensual'}
                              </span>
                            </div>

                            {/* Tarjeta Principal Balance Apple */}
                            <div style={{
                              background: 'linear-gradient(145deg, #18181b 0%, #121215 100%)',
                              border: '1px solid rgba(255, 255, 255, 0.18)',
                              borderRadius: '20px',
                              padding: '1.25rem',
                              marginBottom: '0.85rem',
                              boxShadow: '0 12px 28px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.15)'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '0.7rem', color: '#86868b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                  Balance Libre
                                </span>
                                <span style={{ fontSize: '0.65rem', color: '#22c55e', background: 'rgba(34, 197, 94, 0.12)', padding: '0.15rem 0.45rem', borderRadius: '9999px', fontWeight: '700' }}>
                                  {currentSim.savingsRate} Ahorro
                                </span>
                              </div>
                              <div style={{ fontSize: '2rem', fontWeight: '800', color: '#ffffff', margin: '0.35rem 0 0.15rem 0', letterSpacing: '-0.03em' }}>
                                {formatMoney(currentSim.balance, 'USD')}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '0.72rem', color: '#a1a1aa', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.6rem' }}>
                                <span>Ingresos: +{formatMoney(currentSim.income, 'USD')}</span>
                                <span>Egresos: -{formatMoney(currentSim.expenses, 'USD')}</span>
                              </div>
                            </div>

                            {/* Lista Interactiva de Obligaciones */}
                            <div style={{ marginBottom: '0.85rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                                <span style={{ fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', color: '#86868b' }}>
                                  Obligaciones ({currentSim.obligations.length})
                                </span>
                                <span style={{ fontSize: '0.65rem', color: '#71717a' }}>Toca para alternar</span>
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                {currentSim.obligations.map((item, idx) => {
                                  const Icon = item.icon;
                                  const isPaid = paidObligations[idx] !== false;
                                  return (
                                    <div
                                      key={idx}
                                      onClick={() => toggleObligation(idx)}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '0.6rem 0.75rem',
                                        background: isPaid ? 'rgba(255, 255, 255, 0.04)' : 'rgba(239, 68, 68, 0.08)',
                                        borderRadius: '12px',
                                        border: isPaid ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(239, 68, 68, 0.3)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                      }}
                                    >
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <div style={{
                                          width: '28px',
                                          height: '28px',
                                          borderRadius: '8px',
                                          background: isPaid ? 'rgba(255, 255, 255, 0.08)' : 'rgba(239, 68, 68, 0.2)',
                                          color: isPaid ? '#ffffff' : '#f87171',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center'
                                        }}>
                                          <Icon size={14} />
                                        </div>
                                        <div>
                                          <div style={{ fontSize: '0.78rem', fontWeight: '600', color: '#ffffff' }}>{item.name}</div>
                                          <div style={{ fontSize: '0.65rem', color: '#71717a' }}>{item.due}</div>
                                        </div>
                                      </div>
                                      <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#ffffff' }}>{formatMoney(item.amount, 'USD')}</div>
                                        <span style={{ fontSize: '0.6rem', fontWeight: '700', color: isPaid ? '#4ade80' : '#f87171' }}>
                                          {isPaid ? '✓ Pagado' : '⏳ Pendiente'}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* PESTAÑA 2: GASTOS FIJOS */}
                        {activeScreenTab === 'fixed' && (
                          <div style={{ animation: 'fadeIn 0.2s ease-in' }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.35rem' }}>
                              Obligaciones Indispensables
                            </div>
                            <p style={{ fontSize: '0.72rem', color: '#86868b', marginBottom: '0.75rem' }}>
                              Compromisos fijos blindados del periodo {simPeriod}.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                              {currentSim.obligations.map((item, idx) => {
                                const Icon = item.icon;
                                const isPaid = paidObligations[idx] !== false;
                                return (
                                  <div key={idx} style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Icon size={15} color="#ffffff" />
                                        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#ffffff' }}>{item.name}</span>
                                      </div>
                                      <span style={{ fontSize: '0.825rem', fontWeight: '800', color: '#ffffff' }}>{formatMoney(item.amount, 'USD')}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.68rem', color: '#a1a1aa' }}>
                                      <span>Categoría: {item.cat}</span>
                                      <span style={{ color: isPaid ? '#4ade80' : '#f87171', fontWeight: '700' }}>{isPaid ? 'Pagado' : 'Pendiente'}</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* PESTAÑA 3: MOVIMIENTOS */}
                        {activeScreenTab === 'transactions' && (
                          <div style={{ animation: 'fadeIn 0.2s ease-in' }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.35rem' }}>
                              Flujo de Movimientos
                            </div>
                            <p style={{ fontSize: '0.72rem', color: '#86868b', marginBottom: '0.75rem' }}>
                              Historial de ingresos y compras recientes.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                              {currentSim.recentTxs.map((tx, idx) => {
                                const Icon = tx.icon;
                                const isInc = tx.type === 'INCOME';
                                return (
                                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.75rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                      <Icon size={15} color={isInc ? '#ffffff' : '#86868b'} />
                                      <div>
                                        <div style={{ fontSize: '0.78rem', fontWeight: '600', color: '#ffffff' }}>{tx.title}</div>
                                        <div style={{ fontSize: '0.65rem', color: '#71717a' }}>{tx.date}</div>
                                      </div>
                                    </div>
                                    <span style={{ fontSize: '0.825rem', fontWeight: '700', color: isInc ? '#ffffff' : '#a1a1aa' }}>
                                      {isInc ? '+' : '-'}{formatMoney(tx.amount, 'USD')}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* PESTAÑA 4: REPORTES */}
                        {activeScreenTab === 'reports' && (
                          <div style={{ animation: 'fadeIn 0.2s ease-in', textAlign: 'center', padding: '1rem 0' }}>
                            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.08)', margin: '0 auto 0.75rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Download size={20} color="#ffffff" />
                            </div>
                            <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.35rem' }}>
                              Reporte Financiero PDF
                            </div>
                            <p style={{ fontSize: '0.72rem', color: '#86868b', marginBottom: '1rem' }}>
                              Listo para exportar con balance de {formatMoney(currentSim.balance, 'USD')}.
                            </p>
                            <button
                              type="button"
                              onClick={() => onOpenAuth(false)}
                              style={{
                                padding: '0.55rem 1.25rem',
                                borderRadius: '9999px',
                                background: '#ffffff',
                                color: '#000000',
                                fontWeight: '700',
                                fontSize: '0.75rem',
                                border: 'none',
                                cursor: 'pointer'
                              }}
                            >
                              Descargar Demo
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Mini Drawer Flotante de Registro Rápido al presionar (+) */}
                      {isQuickAddOpen && (
                        <div style={{
                          position: 'absolute',
                          bottom: '68px',
                          left: '12px',
                          right: '12px',
                          background: '#18181b',
                          border: '1px solid rgba(255, 255, 255, 0.25)',
                          borderRadius: '20px',
                          padding: '1rem',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.9)',
                          zIndex: 30,
                          animation: 'slideUpMobile 0.2s ease-out'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#ffffff' }}>⚡ Nuevo Movimiento</span>
                            <button type="button" onClick={() => setIsQuickAddOpen(false)} style={{ color: '#86868b' }}>
                              <X size={15} />
                            </button>
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#a1a1aa', marginBottom: '0.75rem' }}>
                            Registra gastos al instante con auto-cálculo quincenal.
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setIsQuickAddOpen(false);
                              onOpenAuth(false);
                            }}
                            style={{
                              width: '100%',
                              padding: '0.55rem',
                              borderRadius: '10px',
                              background: '#ffffff',
                              color: '#000000',
                              fontWeight: '700',
                              fontSize: '0.75rem',
                              border: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            Probar en la App Completa
                          </button>
                        </div>
                      )}

                      {/* Barra de Navegación Inferior Ergonómica con Botón Flotante Apple */}
                      <div style={{ position: 'relative', zIndex: 20 }}>
                        {/* Botón Central Flotante (+) */}
                        <button
                          type="button"
                          onClick={() => setIsQuickAddOpen(prev => !prev)}
                          style={{
                            position: 'absolute',
                            top: '-24px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '46px',
                            height: '46px',
                            borderRadius: '50%',
                            background: isQuickAddOpen ? '#27272a' : '#ffffff',
                            color: isQuickAddOpen ? '#ffffff' : '#000000',
                            border: 'none',
                            boxShadow: '0 4px 20px rgba(255, 255, 255, 0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            zIndex: 25,
                            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                          }}
                          title="Toca para registrar"
                        >
                          <Plus size={22} strokeWidth={2.8} style={{ transform: isQuickAddOpen ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s ease' }} />
                        </button>

                        <div style={{
                          background: 'rgba(24, 24, 27, 0.95)',
                          border: '1px solid rgba(255, 255, 255, 0.14)',
                          borderRadius: '18px',
                          padding: '0.55rem 0.4rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-around',
                          fontSize: '0.625rem',
                          color: '#71717a',
                          backdropFilter: 'blur(16px)'
                        }}>
                          <button
                            type="button"
                            onClick={() => setActiveScreenTab('dashboard')}
                            style={{
                              textAlign: 'center',
                              color: activeScreenTab === 'dashboard' ? '#ffffff' : '#71717a',
                              fontWeight: activeScreenTab === 'dashboard' ? '700' : '500',
                              border: 'none',
                              background: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <LayoutDashboard size={15} style={{ margin: '0 auto 2px auto' }} />
                            <span>Inicio</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setActiveScreenTab('fixed')}
                            style={{
                              textAlign: 'center',
                              color: activeScreenTab === 'fixed' ? '#ffffff' : '#71717a',
                              fontWeight: activeScreenTab === 'fixed' ? '700' : '500',
                              border: 'none',
                              background: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <ShieldCheck size={15} style={{ margin: '0 auto 2px auto' }} />
                            <span>Fijos</span>
                          </button>

                          <div style={{ width: '36px' }} />

                          <button
                            type="button"
                            onClick={() => setActiveScreenTab('transactions')}
                            style={{
                              textAlign: 'center',
                              color: activeScreenTab === 'transactions' ? '#ffffff' : '#71717a',
                              fontWeight: activeScreenTab === 'transactions' ? '700' : '500',
                              border: 'none',
                              background: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <Receipt size={15} style={{ margin: '0 auto 2px auto' }} />
                            <span>Movs</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setActiveScreenTab('reports')}
                            style={{
                              textAlign: 'center',
                              color: activeScreenTab === 'reports' ? '#ffffff' : '#71717a',
                              fontWeight: activeScreenTab === 'reports' ? '700' : '500',
                              border: 'none',
                              background: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <Download size={15} style={{ margin: '0 auto 2px auto' }} />
                            <span>PDF</span>
                          </button>
                        </div>

                        {/* iOS Home Indicator Bar */}
                        <div style={{
                          width: '124px',
                          height: '4px',
                          background: 'rgba(255, 255, 255, 0.45)',
                          borderRadius: '9999px',
                          margin: '0.65rem auto 0 auto'
                        }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 4. APPLE BENTO GRID (4 PILARES TECNOLÓGICOS)                       */}
      {/* ------------------------------------------------------------------ */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '5rem 1.5rem 3rem 1.5rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3.2rem)',
            fontWeight: '800',
            letterSpacing: '-0.035em',
            color: '#ffffff',
            marginBottom: '0.75rem'
          }}>
            Ingeniería financiera en cada detalle.
          </h2>
          <p style={{ color: '#86868b', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Construido con una arquitectura monocromática de alto rendimiento para que tomes el mando absoluto.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="apple-bento-grid">
          {/* Bento Card 1: Doble Ciclo (Span 7) */}
          <div className="apple-bento-card apple-bento-span-7">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#86868b' }}>
                Flexibilidad de Ciclo
              </span>
            </div>
            <h3 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
              Quincenal o Mensual. Tú decides la regla.
            </h3>
            <p style={{ color: '#a1a1aa', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              Cambia instantáneamente de frecuencia. Los saldos, reportes y compromisos fijos se recalculan en tiempo real sin perder coherencia histórica.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ background: 'rgba(255,255,255,0.06)', padding: '0.65rem 1.1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem', color: '#ffffff', fontWeight: '600' }}>
                🗓️ Ciclos de 15 Días
              </div>
              <div style={{ background: 'rgba(255,255,255,0.06)', padding: '0.65rem 1.1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem', color: '#ffffff', fontWeight: '600' }}>
                📅 Ciclos de 30 Días
              </div>
            </div>
          </div>

          {/* Bento Card 2: 0% Deudas Sorpresa (Span 5) */}
          <div className="apple-bento-card apple-bento-span-5">
            <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#86868b' }}>
              Blindaje de Compromisos
            </span>
            <div style={{
              fontSize: 'clamp(3.2rem, 5vw, 4.2rem)',
              fontWeight: '800',
              letterSpacing: '-0.04em',
              color: '#ffffff',
              margin: '0.5rem 0'
            }}>
              0%
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.5rem' }}>
              Cero moras o deudas sorpresa.
            </h3>
            <p style={{ color: '#a1a1aa', fontSize: '0.875rem', lineHeight: '1.5' }}>
              Tus obligaciones críticas (arriendo, luz, despensa) quedan aseguradas antes de disponer de un solo centavo para ocio.
            </p>
          </div>

          {/* Bento Card 3: Velocidad Mobile (Span 5) */}
          <div className="apple-bento-card apple-bento-span-5">
            <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#86868b' }}>
              Ergonomía Táctil
            </span>
            <div style={{
              fontSize: 'clamp(3.2rem, 5vw, 4.2rem)',
              fontWeight: '800',
              letterSpacing: '-0.04em',
              color: '#ffffff',
              margin: '0.5rem 0'
            }}>
              3s
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.5rem' }}>
              Registro en 3 segundos.
            </h3>
            <p style={{ color: '#a1a1aa', fontSize: '0.875rem', lineHeight: '1.5' }}>
              El botón flotante (+) en la barra inferior te permite asentar cualquier compra o ingreso con una sola mano en movimiento.
            </p>
          </div>

          {/* Bento Card 4: Reportes Ejecutivos PDF (Span 7) */}
          <div className="apple-bento-card apple-bento-span-7">
            <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#86868b' }}>
              Auditoría y Exportación
            </span>
            <h3 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em', margin: '0.5rem 0 0.75rem 0' }}>
              Estados financieros en PDF y CSV.
            </h3>
            <p style={{ color: '#a1a1aa', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              Genera balances con desglose de obligaciones, tasas de ahorro y comprobaciones formales listos para imprimir o auditar en Excel.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ background: 'rgba(255,255,255,0.06)', padding: '0.65rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.825rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Download size={15} />
                <span>PDF Ejecutivo</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.06)', padding: '0.65rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.825rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileSpreadsheet size={15} />
                <span>CSV para Excel</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 5. PREGUNTAS FRECUENTES (FAQ) CON ACORDEÓN FLUIDO APPLE           */}
      {/* ------------------------------------------------------------------ */}
      <section style={{
        maxWidth: '860px',
        margin: '0 auto',
        padding: '4rem 1.5rem 5rem 1.5rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
            fontWeight: '800',
            letterSpacing: '-0.03em',
            color: '#ffffff',
            marginBottom: '0.5rem'
          }}>
            Preguntas Frecuentes
          </h2>
          <p style={{ color: '#86868b', fontSize: '0.95rem' }}>
            Todo lo que necesitas saber antes de empezar.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                style={{
                  background: 'rgba(18, 18, 21, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease'
                }}
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    color: '#ffffff',
                    fontWeight: '600',
                    fontSize: '1rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ paddingRight: '1rem' }}>{faq.q}</span>
                  <ChevronRight
                    size={19}
                    style={{
                      transform: isOpen ? 'rotate(90deg)' : 'none',
                      transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                      color: isOpen ? '#ffffff' : '#71717a',
                      flexShrink: 0
                    }}
                  />
                </button>
                {isOpen && (
                  <div style={{
                    padding: '0 1.5rem 1.5rem 1.5rem',
                    color: '#86868b',
                    fontSize: '0.925rem',
                    lineHeight: '1.65',
                    animation: 'fadeIn 0.2s ease-in'
                  }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 6. BANNER FINAL CTA CINEMATOGRÁFICO                                */}
      {/* ------------------------------------------------------------------ */}
      <section style={{
        maxWidth: '1120px',
        margin: '0 auto',
        padding: '0 1.5rem 7rem 1.5rem'
      }}>
        <div style={{
          background: 'linear-gradient(180deg, #121215 0%, #000000 100%)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          borderRadius: '32px',
          padding: '4.5rem 2rem',
          textAlign: 'center',
          boxShadow: '0 0 60px rgba(255, 255, 255, 0.05), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <h2 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
            fontWeight: '800',
            letterSpacing: '-0.035em',
            color: '#ffffff',
            marginBottom: '1rem'
          }}>
            Tu dinero bajo control absoluto. Como debe ser.
          </h2>
          <p style={{ color: '#86868b', fontSize: '1.1rem', maxWidth: '580px', margin: '0 auto 2.5rem auto', lineHeight: '1.6' }}>
            Únete a getloss. Crea tu cuenta en menos de 1 minuto y experimenta la tranquilidad financiera en tu PC y tu celular.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={() => onOpenAuth(false)}
              style={{
                padding: '1rem 2.75rem',
                fontSize: '1rem',
                fontWeight: '700',
                borderRadius: '9999px',
                background: '#ffffff',
                color: '#000000',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                cursor: 'pointer',
                border: 'none',
                boxShadow: '0 0 30px rgba(255, 255, 255, 0.35)',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.04)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <span>Crear Cuenta Gratis</span>
              <ArrowRight size={17} />
            </button>

            <button
              onClick={() => onOpenAuth(true)}
              style={{
                padding: '1rem 2.25rem',
                fontSize: '1rem',
                fontWeight: '600',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              }}
            >
              <span>Iniciar Sesión</span>
            </button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 7. FOOTER MINIMALISTA APPLE                                        */}
      {/* ------------------------------------------------------------------ */}
      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '2.5rem 1.5rem',
        textAlign: 'center',
        color: '#71717a',
        fontSize: '0.825rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#ffffff' }} />
          <span style={{ fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em' }}>
            getloss Pro
          </span>
        </div>
        <p>© {new Date().getFullYear()} getloss • Suite de control financiero quincenal y mensual optimizada para PC y Celular.</p>
      </footer>
    </div>
  );
};

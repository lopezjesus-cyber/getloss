import React, { useState } from 'react';
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
  Database,
  Check,
  X,
  CreditCard,
  Layers,
  ChevronRight,
  DollarSign,
  PieChart,
  HelpCircle,
  Clock
} from 'lucide-react';

export const LandingPage = ({ onOpenAuth, onToggleTheme, theme }) => {
  // Estado para el simulador interactivo en la landing
  const [simPeriod, setSimPeriod] = useState('Q1'); // 'Q1' | 'Q2' | 'MES'
  const [activeFaq, setActiveFaq] = useState(null);

  // Datos simulados para demostración en vivo en la landing
  const simData = {
    Q1: {
      income: 1400,
      expenses: 960,
      balance: 440,
      savingsRate: '31.4%',
      obligationsPaid: '2 de 2 Pagadas',
      obligations: [
        { name: 'Arriendo Apartamento', amount: 850, due: 'Día 5', status: 'Pagado', icon: Home },
        { name: 'Factura Luz & Agua', amount: 110, due: 'Día 12', status: 'Pagado', icon: Zap }
      ]
    },
    Q2: {
      income: 1400,
      expenses: 495,
      balance: 905,
      savingsRate: '64.6%',
      obligationsPaid: '1 de 2 Pagadas',
      obligations: [
        { name: 'Mercado Quincena 2', amount: 220, due: 'Día 17', status: 'Pagado', icon: ShoppingCart },
        { name: 'Internet Fibra Óptica', amount: 45, due: 'Día 18', status: 'Pendiente', icon: Zap },
        { name: 'Combustible & Pasajes', amount: 130, due: 'Día 25', status: 'Pendiente', icon: Car }
      ]
    },
    MES: {
      income: 2800,
      expenses: 1455,
      balance: 1345,
      savingsRate: '48.0%',
      obligationsPaid: '3 de 5 Pagadas',
      obligations: [
        { name: 'Arriendo Apartamento', amount: 850, due: 'Día 5', status: 'Pagado', icon: Home },
        { name: 'Factura Luz & Agua', amount: 110, due: 'Día 12', status: 'Pagado', icon: Zap },
        { name: 'Mercado Quincenal', amount: 220, due: 'Día 17', status: 'Pagado', icon: ShoppingCart },
        { name: 'Internet Fibra Óptica', amount: 45, due: 'Día 18', status: 'Pendiente', icon: Zap },
        { name: 'Combustible & Pasajes', amount: 130, due: 'Día 25', status: 'Pendiente', icon: Car }
      ]
    }
  };

  const currentSim = simData[simPeriod];

  const faqs = [
    {
      q: '¿Cómo funciona el control quincenal en getloss?',
      a: 'getloss divide automáticamente el mes en 1ª Quincena (del día 1 al 15) y 2ª Quincena (del día 16 al fin de mes). Puedes asignar qué obligaciones fijas se pagan con el primer sueldo y cuáles con el segundo.'
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
      q: '¿Está adaptado para celular y computadora?',
      a: 'Completamente. En celular cuentas con una barra inferior ergonómica y botón flotante de registro rápido (+), y en PC dispones de un panel lateral y vista extendida.'
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
            fontSize: '1.6rem',
            fontWeight: '800',
            letterSpacing: '-0.04em',
            color: '#ffffff'
          }}>
            getloss
          </span>
          <span style={{
            fontSize: '0.68rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            padding: '0.2rem 0.55rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#a1a1aa'
          }}>
            Fintech Suite
          </span>
        </div>

        {/* Botones de Acceso */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <button
            onClick={() => onOpenAuth(true)}
            style={{
              padding: '0.6rem 1.15rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#f4f4f5',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              background: 'rgba(255, 255, 255, 0.04)',
              transition: 'var(--transition)'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'; }}
          >
            Iniciar Sesión
          </button>

          <button
            onClick={() => onOpenAuth(false)}
            style={{
              padding: '0.6rem 1.35rem',
              fontSize: '0.875rem',
              fontWeight: '700',
              color: '#09090b',
              borderRadius: 'var(--radius-md)',
              background: '#ffffff',
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.25)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'var(--transition)'
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <span>Crear Cuenta</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '5rem 1.5rem 3.5rem 1.5rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.75rem'
      }}>
        {/* Badge Pill */}
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
          <span>Gestión de Finanzas Quincenales, Gastos Indispensables y Reportes</span>
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
          <strong>getloss</strong> es la plataforma minimalista que te ayuda a separar tus <strong>obligaciones indispensables</strong> (arriendo, servicios, despensa) de tus gastos variables, proyectar tu ahorro y generar reportes ejecutivos en PDF.
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

        {/* 3. SIMULADOR EN VIVO INTERACTIVO (DEMO EN LA LANDING) */}
        <div style={{
          marginTop: '3.5rem',
          width: '100%',
          maxWidth: '1020px',
          background: 'rgba(24, 24, 27, 0.75)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.16)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          boxShadow: '0 24px 64px -12px rgba(0, 0, 0, 0.9), 0 0 32px rgba(255, 255, 255, 0.04)',
          textAlign: 'left'
        }}>
          {/* Header del Simulador */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            paddingBottom: '1.25rem',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
                <span style={{ fontSize: '0.95rem', fontWeight: '800', color: '#ffffff' }}>
                  Simulador Interactivo de Flujo de Caja
                </span>
              </div>
              <span style={{ fontSize: '0.78rem', color: '#71717a' }}>
                Haz clic en los periodos para ver cómo se proyectan tus finanzas
              </span>
            </div>

            {/* Alternador Quincenal / Mensual en Vivo */}
            <div style={{
              display: 'flex',
              background: '#09090b',
              padding: '0.3rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              gap: '0.3rem'
            }}>
              <button
                onClick={() => setSimPeriod('Q1')}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  fontWeight: simPeriod === 'Q1' ? '700' : '500',
                  background: simPeriod === 'Q1' ? '#ffffff' : 'transparent',
                  color: simPeriod === 'Q1' ? '#09090b' : '#a1a1aa',
                  transition: 'var(--transition)'
                }}
              >
                1ª Quincena (1-15)
              </button>
              <button
                onClick={() => setSimPeriod('Q2')}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  fontWeight: simPeriod === 'Q2' ? '700' : '500',
                  background: simPeriod === 'Q2' ? '#ffffff' : 'transparent',
                  color: simPeriod === 'Q2' ? '#09090b' : '#a1a1aa',
                  transition: 'var(--transition)'
                }}
              >
                2ª Quincena (16-30)
              </button>
              <button
                onClick={() => setSimPeriod('MES')}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  fontWeight: simPeriod === 'MES' ? '700' : '500',
                  background: simPeriod === 'MES' ? '#ffffff' : 'transparent',
                  color: simPeriod === 'MES' ? '#09090b' : '#a1a1aa',
                  transition: 'var(--transition)'
                }}
              >
                Mes Completo
              </button>
            </div>
          </div>

          {/* Tarjetas de Métricas Simuladas */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              background: 'rgba(9, 9, 11, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-md)',
              padding: '1.15rem'
            }}>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#71717a', fontWeight: '700' }}>
                Balance Disponible
              </span>
              <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#ffffff', margin: '0.2rem 0' }}>
                ${currentSim.balance.toLocaleString()}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>
                {currentSim.savingsRate} tasa de ahorro
              </span>
            </div>

            <div style={{
              background: 'rgba(9, 9, 11, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-md)',
              padding: '1.15rem'
            }}>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#71717a', fontWeight: '700' }}>
                Ingresos Proyectados
              </span>
              <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#ffffff', margin: '0.2rem 0' }}>
                +${currentSim.income.toLocaleString()}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>
                Entrada garantizada
              </span>
            </div>

            <div style={{
              background: 'rgba(9, 9, 11, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-md)',
              padding: '1.15rem'
            }}>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#71717a', fontWeight: '700' }}>
                Egresos Comprometidos
              </span>
              <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#a1a1aa', margin: '0.2rem 0' }}>
                -${currentSim.expenses.toLocaleString()}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#71717a' }}>
                Obligaciones + Variables
              </span>
            </div>

            <div style={{
              background: 'rgba(9, 9, 11, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-md)',
              padding: '1.15rem'
            }}>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#71717a', fontWeight: '700' }}>
                Estado de Obligaciones
              </span>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ffffff', margin: '0.4rem 0' }}>
                {currentSim.obligationsPaid}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#22c55e' }}>
                ✓ Gastos indispensables
              </span>
            </div>
          </div>

          {/* Lista de Obligaciones de Muestra en el Simulador */}
          <div style={{
            background: 'rgba(9, 9, 11, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 'var(--radius-md)',
            padding: '1.15rem'
          }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: '#a1a1aa', marginBottom: '0.75rem' }}>
              Obligaciones Indispensables de este Periodo ({simPeriod})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {currentSim.obligations.map((item, idx) => {
                const Icon = item.icon;
                const isPaid = item.status === 'Pagado';

                return (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid rgba(255, 255, 255, 0.06)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff'
                      }}>
                        <Icon size={16} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#ffffff' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#71717a' }}>
                          Vencimiento: {item.due}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff' }}>
                        ${item.amount}
                      </span>
                      <span style={{
                        padding: '0.2rem 0.55rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        background: isPaid ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                        color: isPaid ? '#4ade80' : '#a1a1aa',
                        border: isPaid ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(255, 255, 255, 0.15)'
                      }}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Comparativa: Con getloss vs Sin getloss */}
      <section style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '4rem 1.5rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
            fontWeight: '800',
            color: '#ffffff',
            letterSpacing: '-0.02em'
          }}>
            La diferencia entre perder dinero y multiplicarlo
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {/* Columna: Sin getloss */}
          <div style={{
            background: 'rgba(24, 24, 27, 0.5)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f87171', fontWeight: '700', marginBottom: '1.25rem' }}>
              <X size={20} />
              <span>Sin getloss</span>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.875rem', color: '#a1a1aa' }}>
              <li>❌ Gastas en la primera semana y no alcanza para la segunda quincena.</li>
              <li>❌ Olvidos de facturas de luz, agua o arriendo con recargos por mora.</li>
              <li>❌ Fugas de dinero invisibles en gastos pequeños.</li>
              <li>❌ Cero claridad sobre cuánto dinero realmente puedes ahorrar.</li>
            </ul>
          </div>

          {/* Columna: Con getloss */}
          <div style={{
            background: 'rgba(24, 24, 27, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            boxShadow: '0 0 30px rgba(255, 255, 255, 0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontWeight: '700', marginBottom: '1.25rem' }}>
              <Check size={20} />
              <span>Con getloss</span>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.875rem', color: '#e4e4e7' }}>
              <li>✅ Tu sueldo asignado a cada quincena con balance libre exacto.</li>
              <li>✅ Lista de obligaciones indispensables con aviso de vencimiento y check de pagado.</li>
              <li>✅ Identificación visual inmediata con vectores y categorías.</li>
              <li>✅ Reportes ejecutivos descargables en PDF para auditar tus finanzas.</li>
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
                    fontSize: '0.95rem'
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
                gap: '0.5rem'
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
                border: '1px solid rgba(255, 255, 255, 0.15)'
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
        <p>© {new Date().getFullYear()} getloss • Tu suite de control financiero quincenal y mensual.</p>
      </footer>
    </div>
  );
};

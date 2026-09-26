import React from 'react';
import { 
  ArrowRight, 
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
  Database
} from 'lucide-react';

export const LandingPage = ({ onOpenAuth, onToggleTheme, theme }) => {
  return (
    <div className="landing-container" style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* 1. Header / Barra de Navegación de la Landing */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(9, 9, 11, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '1rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1280px',
        margin: '0 auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: 'var(--text-primary)',
            boxShadow: '0 0 12px var(--text-primary)'
          }} />
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
            fontWeight: '800',
            letterSpacing: '-0.04em',
            color: 'var(--text-primary)'
          }}>
            getloss
          </span>
          <span className="badge" style={{ fontSize: '0.7rem', marginLeft: '0.4rem' }}>
            Control Financiero
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => onOpenAuth(true)}
            style={{
              padding: '0.55rem 1rem',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              background: 'transparent',
              transition: 'var(--transition)'
            }}
          >
            Iniciar Sesión
          </button>

          <button
            onClick={() => onOpenAuth(false)}
            className="btn-primary"
            style={{ padding: '0.55rem 1.15rem', fontSize: '0.85rem' }}
          >
            <span>Crear Cuenta</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </header>

      {/* 2. Hero Section Principal */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '4rem 1.5rem 3rem 1.5rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        {/* Pill de Lanzamiento */}
        <div className="badge" style={{
          padding: '0.4rem 1rem',
          fontSize: '0.8rem',
          background: 'var(--bg-card-elevated)',
          border: '1px solid var(--border-medium)',
          gap: '0.5rem'
        }}>
          <Sparkles size={14} style={{ color: 'var(--text-primary)' }} />
          <span>La forma inteligente de gestionar tu dinero quincenal y mensual</span>
        </div>

        {/* Titular Impactante */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.3rem, 5vw, 4rem)',
          fontWeight: '800',
          lineHeight: '1.1',
          letterSpacing: '-0.03em',
          maxWidth: '900px',
          color: 'var(--text-primary)'
        }}>
          Elimina tus fugas de dinero. Domina tus finanzas <span style={{ textDecoration: 'underline', textDecorationColor: 'var(--border-strong)', textUnderlineOffset: '8px' }}>quincena a quincena</span>.
        </h1>

        {/* Subtítulo */}
        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.2rem)',
          color: 'var(--text-secondary)',
          maxWidth: '720px',
          lineHeight: '1.6'
        }}>
          <strong>getloss</strong> te permite proyectar tus ingresos, asegurar tus <strong>gastos indispensables</strong> (arriendo, servicios, alimentación) y generar <strong>reportes ejecutivos en PDF</strong> adaptados a tu ciclo de cobro.
        </p>

        {/* Botones de Acción (CTA) */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          marginTop: '1rem'
        }}>
          <button
            onClick={() => onOpenAuth(false)}
            className="btn-primary"
            style={{
              padding: '0.9rem 2rem',
              fontSize: '1.05rem',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            <span>Crear Cuenta Gratis</span>
            <ArrowRight size={18} />
          </button>

          <button
            onClick={() => onOpenAuth(true)}
            className="btn-secondary"
            style={{
              padding: '0.9rem 1.75rem',
              fontSize: '1.05rem',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <span>Iniciar Sesión</span>
          </button>
        </div>

        {/* Mockup Interactivo / Preview Card Visual */}
        <div style={{
          marginTop: '3rem',
          width: '100%',
          maxWidth: '1000px',
          background: 'linear-gradient(180deg, var(--bg-card) 0%, var(--bg-surface) 100%)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          boxShadow: 'var(--shadow-lg)',
          textAlign: 'left'
        }}>
          {/* Header del Mockup */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '1.25rem',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: '700', marginLeft: '0.5rem', color: 'var(--text-secondary)' }}>
                getloss Dashboard Preview
              </span>
            </div>

            {/* Toggle de Quincena Simulado */}
            <div style={{
              display: 'flex',
              background: 'var(--bg-primary)',
              padding: '0.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              gap: '0.3rem',
              fontSize: '0.75rem'
            }}>
              <span style={{ padding: '0.3rem 0.65rem', background: 'var(--text-primary)', color: 'var(--text-inverse)', borderRadius: 'var(--radius-sm)', fontWeight: '700' }}>
                1ª Quincena (1-15)
              </span>
              <span style={{ padding: '0.3rem 0.65rem', color: 'var(--text-muted)' }}>
                2ª Quincena (16-30)
              </span>
              <span style={{ padding: '0.3rem 0.65rem', color: 'var(--text-muted)' }}>
                Mes Completo
              </span>
            </div>
          </div>

          {/* Grid de 3 Tarjetas de Muestra */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1rem'
          }}>
            {/* Tarjeta 1: Balance */}
            <div style={{
              background: 'var(--bg-card-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem'
            }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700' }}>
                Balance Quincenal Libre
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', margin: '0.35rem 0', color: 'var(--text-primary)' }}>
                $1,420.00
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <TrendingUp size={14} />
                <span>32% de ahorro proyectado</span>
              </div>
            </div>

            {/* Tarjeta 2: Obligaciones */}
            <div style={{
              background: 'var(--bg-card-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem'
            }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700' }}>
                Obligaciones Indispensables
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0.35rem 0' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)' }}>3 / 3</span>
                <span className="badge" style={{ background: 'var(--text-primary)', color: 'var(--text-inverse)' }}>
                  ✓ 100% Pagado
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Arriendo, Luz, Supermercado al día
              </div>
            </div>

            {/* Tarjeta 3: Reportes */}
            <div style={{
              background: 'var(--bg-card-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem'
            }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700' }}>
                Exportación de Reportes
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', margin: '0.35rem 0', color: 'var(--text-primary)' }}>
                PDF & CSV
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <Download size={14} />
                <span>Auditoría financiera en 1 clic</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Características Clave / Pilares de getloss */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '4rem 1.5rem',
        borderTop: '1px solid var(--border-subtle)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
            fontWeight: '800',
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)'
          }}>
            Diseñado para la realidad financiera de hoy
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '600px', margin: '0.5rem auto 0 auto' }}>
            Olvídate de las hojas de cálculo confusas. getloss te da claridad absoluta en cada periodo.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* Feature 1 */}
          <div className="card">
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-card-elevated)',
              border: '1px solid var(--border-medium)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              color: 'var(--text-primary)'
            }}>
              <Calendar size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Ciclos Quincenales y Mensuales
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.6' }}>
              Alterna fácilmente entre la 1ª Quincena (días 1 al 15), la 2ª Quincena (16 al 30) o el mes completo. Tus balances se ajustan en tiempo real.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="card">
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-card-elevated)',
              border: '1px solid var(--border-medium)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              color: 'var(--text-primary)'
            }}>
              <ShieldCheck size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Gastos Constantes e Indispensables
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.6' }}>
              Prioriza lo fundamental: vivienda, energía, agua, internet, víveres y transporte. Márcalos como pagados para evitar cortes y recargos.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="card">
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-card-elevated)',
              border: '1px solid var(--border-medium)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              color: 'var(--text-primary)'
            }}>
              <BarChart3 size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Reportes Ejecutivos en PDF & Excel
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.6' }}>
              Descarga informes profesionales estructurados listos para imprimir, adjuntar comprobantes o auditar en hojas de cálculo.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="card">
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-card-elevated)',
              border: '1px solid var(--border-medium)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              color: 'var(--text-primary)'
            }}>
              <Zap size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Iconografía Vectorial Intuitiva
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.6' }}>
              Identificación visual inmediata de cada categoría con vectores SVG nítidos y estética monocromática minimalista.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="card">
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-card-elevated)',
              border: '1px solid var(--border-medium)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              color: 'var(--text-primary)'
            }}>
              <Smartphone size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              100% Responsivo (Móvil y PC)
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.6' }}>
              Experiencia optimizada para celulares con barra inferior de acceso táctil y dashboard expandido para computadoras de escritorio.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="card">
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-card-elevated)',
              border: '1px solid var(--border-medium)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              color: 'var(--text-primary)'
            }}>
              <Database size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Bases de Datos Separadas
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.6' }}>
              Aislamiento y orden estructurado: módulo dedicado para usuarios y seguridad, y módulo independiente para transacciones financieras.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Banner Final de Conversión (Call to Action) */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '4rem 1.5rem 6rem 1.5rem',
      }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--bg-card-elevated) 0%, var(--bg-card) 100%)',
          border: '1px solid var(--border-strong)',
          borderRadius: 'var(--radius-xl)',
          padding: '3.5rem 2rem',
          textAlign: 'center',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: '800',
            letterSpacing: '-0.03em',
            marginBottom: '1rem',
            color: 'var(--text-primary)'
          }}>
            Toma el control de tu dinero hoy mismo
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
            Únete a <strong>getloss</strong>, planifica tus quincenas y elimina el estrés financiero para siempre.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={() => onOpenAuth(false)}
              className="btn-primary"
              style={{ padding: '0.9rem 2.2rem', fontSize: '1rem' }}
            >
              <span>Crear Cuenta Gratis</span>
              <ArrowRight size={17} />
            </button>
            <button
              onClick={() => onOpenAuth(true)}
              className="btn-secondary"
              style={{ padding: '0.9rem 1.8rem', fontSize: '1rem' }}
            >
              <span>Iniciar Sesión</span>
            </button>
          </div>
        </div>
      </section>

      {/* 5. Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '2rem 1.5rem',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.85rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--text-primary)' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: '700', color: 'var(--text-primary)' }}>
            getloss
          </span>
        </div>
        <p>© {new Date().getFullYear()} getloss • Tu suite de control financiero quincenal y mensual.</p>
      </footer>
    </div>
  );
};

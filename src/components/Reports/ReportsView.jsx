import React, { useState } from 'react';
import { FinancesDB, DEFAULT_CATEGORIES } from '../../services/financesDb';
import { generateFinancialPdfReport } from '../../services/pdfGenerator';
import { generateFinancialExcelReport } from '../../services/excelGenerator';
import { CategoryIcon } from '../Common/CategoryIcon';
import { formatMoney } from '../../utils/formatters';
import { 
  BarChart3, 
  PieChart, 
  Download, 
  FileSpreadsheet, 
  TrendingUp, 
  ShieldAlert, 
  Calendar, 
  Sparkles, 
  CheckCircle2,
  DollarSign,
  Check
} from 'lucide-react';

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const ReportsView = ({ user, currentPeriod }) => {
  const { year, month, mode = 'QUINCENAL' } = currentPeriod;
  const currency = user?.currency || 'USD';
  const [downloadSuccess, setDownloadSuccess] = useState(null);

  const summary = FinancesDB.calculateFinancialSummary(user.id, year, month, mode);
  const transactions = FinancesDB.getTransactions(user.id, { year, month });
  const fixedExpenses = FinancesDB.getFixedExpenses(user.id);

  const monthName = MONTH_NAMES[month - 1];
  const periodLabel = mode === 'QUINCENAL'
    ? `Reporte Quincenal (15 Días • ${monthName} ${year})`
    : `Reporte Mensual (Mes Completo • ${monthName} ${year})`;

  // Porcentajes de la regla presupuestaria 50/30/20 adaptada
  const indispensablePct = summary.totalIncome > 0 
    ? Math.min(100, Math.round((summary.indispensableExpenseTotal / summary.totalIncome) * 100))
    : 0;
  
  const variablePct = summary.totalIncome > 0
    ? Math.min(100, Math.round((summary.variableExpenseTotal / summary.totalIncome) * 100))
    : 0;

  const savingsPct = summary.totalIncome > 0
    ? Math.max(0, Math.round((summary.netBalance / summary.totalIncome) * 100))
    : 0;

  // Exportar a PDF
  const handleExportPDF = () => {
    generateFinancialPdfReport({
      user,
      summary,
      transactions,
      fixedExpenses,
      periodLabel
    });
    setDownloadSuccess('PDF');
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  // Exportar a Excel / CSV estructurado
  const handleExportCSV = () => {
    generateFinancialExcelReport({
      user,
      summary,
      transactions,
      fixedExpenses,
      periodLabel
    });
    setDownloadSuccess('EXCEL');
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Cabecera de Reportes y Botones de Exportación */}
      <div className="card" style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        background: 'linear-gradient(135deg, var(--bg-card-elevated) 0%, var(--bg-card) 100%)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 size={22} style={{ color: 'var(--text-primary)' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Centro de Reportes Financieros
            </h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Reporte financiero consolidado: <strong>{periodLabel}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={handleExportCSV}
            className="btn-secondary"
            style={{ fontSize: '0.825rem', padding: '0.6rem 1rem' }}
          >
            {downloadSuccess === 'EXCEL' ? (
              <>
                <Check size={16} style={{ color: '#22c55e' }} />
                <span style={{ color: '#22c55e', fontWeight: '700' }}>¡Excel Descargado!</span>
              </>
            ) : (
              <>
                <FileSpreadsheet size={16} />
                <span>Exportar CSV (Excel)</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleExportPDF}
            className="btn-primary"
            style={{ fontSize: '0.825rem', padding: '0.6rem 1.15rem' }}
          >
            {downloadSuccess === 'PDF' ? (
              <>
                <Check size={16} style={{ color: '#22c55e' }} />
                <span>¡PDF Descargado!</span>
              </>
            ) : (
              <>
                <Download size={16} />
                <span>Descargar Reporte PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tarjetas de Diagnóstico Financiero */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {/* Distribución del Ingreso (Regla de Oro: Indispensable vs Estilo de Vida vs Ahorro) */}
        <div className="card">
          <div className="card-title">
            <span>Estructura de Distribución de Ingresos</span>
            <PieChart size={16} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
            {/* Gastos Indispensables (Meta <= 50%) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
                  1. Gastos Indispensables (Fijos)
                </span>
                <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                  {formatMoney(summary.indispensableExpenseTotal, currency)} ({indispensablePct}%)
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ width: `${indispensablePct}%`, height: '100%', background: '#ffffff', borderRadius: 'var(--radius-full)' }} />
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Alquiler, servicios públicos, despensa básica</span>
            </div>

            {/* Gastos Variables / Estilo de Vida (Meta <= 30%) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>
                  2. Gastos Variables & Ocio
                </span>
                <span style={{ fontWeight: '700', color: 'var(--text-secondary)' }}>
                  {formatMoney(summary.variableExpenseTotal, currency)} ({variablePct}%)
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ width: `${variablePct}%`, height: '100%', background: '#71717a', borderRadius: 'var(--radius-full)' }} />
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Salidas, compras, entretenimiento</span>
            </div>

            {/* Ahorro / Superávit Neto (Meta >= 20%) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
                  3. Ahorro / Flujo Neto Remanente
                </span>
                <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                  {formatMoney(summary.netBalance, currency)} ({savingsPct}%)
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ width: `${savingsPct}%`, height: '100%', background: '#a1a1aa', borderRadius: 'var(--radius-full)' }} />
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Capital disponible para metas e inversiones</span>
            </div>
          </div>
        </div>

        {/* Desglose por Categorías de Gasto */}
        <div className="card">
          <div className="card-title">
            <span>Desglose por Categorías</span>
            <TrendingUp size={16} />
          </div>

          {summary.categoryBreakdown.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '1rem', textAlign: 'center' }}>
              No hay egresos registrados en este periodo para desglosar.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem', maxHeight: '230px', overflowY: 'auto' }}>
              {summary.categoryBreakdown.map((item, idx) => {
                const pct = summary.totalExpense > 0 
                  ? Math.round((item.amount / summary.totalExpense) * 100)
                  : 0;

                return (
                  <div key={item.category.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0.65rem',
                    background: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CategoryIcon iconName={item.category.icon} size={15} color="var(--text-primary)" />
                      <div>
                        <div style={{ fontSize: '0.825rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                          {item.category.name}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {item.count} transaccion(es) • {pct}% del total
                        </div>
                      </div>
                    </div>

                    <div style={{ fontWeight: '700', fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                      {formatMoney(item.amount, currency)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Resumen de Movimientos Detallados del Periodo */}
      <div className="card">
        <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          Detalle Completo de Transacciones Auditadas
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-medium)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.6rem 0.5rem' }}>Fecha</th>
                <th style={{ padding: '0.6rem 0.5rem' }}>Concepto</th>
                <th style={{ padding: '0.6rem 0.5rem' }}>Categoría</th>
                <th style={{ padding: '0.6rem 0.5rem' }}>Modo</th>
                <th style={{ padding: '0.6rem 0.5rem' }}>Tipo</th>
                <th style={{ padding: '0.6rem 0.5rem', textAlign: 'right' }}>Monto</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>
                    No hay transacciones registradas en este periodo.
                  </td>
                </tr>
              ) : (
                transactions.map(t => {
                  const cat = FinancesDB.getCategoryById(t.categoryId);
                  return (
                    <tr key={t.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '0.65rem 0.5rem', color: 'var(--text-muted)' }}>{t.date}</td>
                      <td style={{ padding: '0.65rem 0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>{t.title}</td>
                      <td style={{ padding: '0.65rem 0.5rem', color: 'var(--text-secondary)' }}>{cat.name}</td>
                      <td style={{ padding: '0.65rem 0.5rem', color: 'var(--text-muted)' }}>{t.periodMode === 'MENSUAL' ? 'Mensual' : 'Quincenal'}</td>
                      <td style={{ padding: '0.65rem 0.5rem' }}>
                        <span className="badge" style={{
                          background: t.type === 'INCOME' ? 'rgba(255, 255, 255, 0.12)' : 'var(--badge-bg)',
                          color: t.type === 'INCOME' ? '#ffffff' : 'var(--text-secondary)'
                        }}>
                          {t.type === 'INCOME' ? 'Ingreso' : 'Gasto'}
                        </span>
                      </td>
                      <td style={{
                        padding: '0.65rem 0.5rem',
                        textAlign: 'right',
                        fontWeight: '700',
                        color: t.type === 'INCOME' ? 'var(--text-primary)' : 'var(--text-secondary)'
                      }}>
                        {t.type === 'INCOME' ? '+' : '-'}{formatMoney(t.amount, currency)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

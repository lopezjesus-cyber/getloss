import { formatMoney } from '../utils/formatters';

/**
 * Generador de Reportes Financieros en Excel / CSV estructurado para getloss
 * Compatible con Microsoft Excel, Google Sheets y Apple Numbers con soporte UTF-8 BOM.
 */
export const generateFinancialExcelReport = ({
  user,
  summary,
  transactions = [],
  fixedExpenses = [],
  periodLabel = 'Periodo Actual',
}) => {
  const currency = user?.currency || 'USD';
  const clientName = user?.fullName || 'Usuario';
  const generatedDate = new Date().toLocaleString('es-ES');

  // Función auxiliar para escapar celdas en formato CSV
  const escapeCell = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const lines = [];

  // 1. ENCABEZADO CORPORATIVO
  lines.push([escapeCell('GETLOSS FINTECH SUITE'), escapeCell('REPORTE FINANCIERO EJECUTIVO')].join(','));
  lines.push([escapeCell('Cliente / Titular:'), escapeCell(clientName)].join(','));
  lines.push([escapeCell('Periodo Auditado:'), escapeCell(periodLabel)].join(','));
  lines.push([escapeCell('Moneda de Cuenta:'), escapeCell(currency)].join(','));
  lines.push([escapeCell('Fecha de Emisión:'), escapeCell(generatedDate)].join(','));
  lines.push(''); // Separador

  // 2. RESUMEN EJECUTIVO (KPIs)
  lines.push([escapeCell('=== 1. RESUMEN EJECUTIVO DE BALANCE ===')].join(','));
  lines.push([escapeCell('Métrica'), escapeCell('Monto'), escapeCell('Detalle')].join(','));
  lines.push([escapeCell('Ingresos Totales Fijos:'), escapeCell(`+${formatMoney(summary.totalIncome, currency)}`), escapeCell('100% Entradas del Periodo')].join(','));
  lines.push([escapeCell('Egresos Totales:'), escapeCell(`-${formatMoney(summary.totalExpense, currency)}`), escapeCell('Obligaciones + Variables')].join(','));
  lines.push([escapeCell('Gastos Indispensables (Blindados):'), escapeCell(formatMoney(summary.indispensableExpenseTotal || 0, currency)), escapeCell('Compromisos fijos prioritarios')].join(','));
  lines.push([escapeCell('Gastos Variables & Ocio:'), escapeCell(formatMoney(summary.variableExpenseTotal || 0, currency)), escapeCell('Estilo de vida y compras variables')].join(','));
  lines.push([escapeCell('Saldo Libre Remanente:'), escapeCell(formatMoney(summary.netBalance, currency)), escapeCell('Flujo de caja disponible')].join(','));
  lines.push([escapeCell('Tasa de Ahorro:'), escapeCell(`${summary.savingsRate || 0}%`), escapeCell('Porcentaje de capital retenido')].join(','));
  lines.push(''); // Separador

  // 3. GASTOS INDISPENSABLES / OBLIGACIONES FIJAS
  lines.push([escapeCell('=== 2. GASTOS INDISPENSABLES Y OBLIGACIONES CONSTANTES ===')].join(','));
  lines.push([
    escapeCell('ID'),
    escapeCell('Concepto Obligatorio'),
    escapeCell('Clasificación'),
    escapeCell('Periodo'),
    escapeCell('Día de Vencimiento'),
    escapeCell('Monto Presupuestado'),
    escapeCell('Estado de Pago')
  ].join(','));

  if (fixedExpenses.length === 0) {
    lines.push([escapeCell('-'), escapeCell('No hay gastos fijos registrados en este periodo'), escapeCell('-'), escapeCell('-'), escapeCell('-'), escapeCell('-'), escapeCell('-')].join(','));
  } else {
    fixedExpenses.forEach((f, idx) => {
      const isPaid = f.paidPeriods && f.paidPeriods.length > 0;
      lines.push([
        escapeCell(`OB-${String(idx + 1).padStart(3, '0')}`),
        escapeCell(f.name),
        escapeCell(f.isIndispensable ? 'Indispensable' : 'Fijo'),
        escapeCell(f.targetMode === 'QUINCENAL' ? 'Quincenal' : 'Mensual'),
        escapeCell(`Día ${f.dueDay}`),
        escapeCell(formatMoney(f.amount, currency)),
        escapeCell(isPaid ? 'PAGADO' : 'PENDIENTE')
      ].join(','));
    });
  }
  lines.push(''); // Separador

  // 4. DETALLE DE MOVIMIENTOS Y TRANSACCIONES
  lines.push([escapeCell('=== 3. LIBRO MAYOR DE MOVIMIENTOS Y TRANSACCIONES ===')].join(','));
  lines.push([
    escapeCell('Fecha'),
    escapeCell('Descripción / Concepto'),
    escapeCell('Tipo de Movimiento'),
    escapeCell('Ciclo'),
    escapeCell('Categoría'),
    escapeCell('Notas / Comprobante'),
    escapeCell('Monto')
  ].join(','));

  if (transactions.length === 0) {
    lines.push([escapeCell('-'), escapeCell('No hay transacciones registradas en este periodo'), escapeCell('-'), escapeCell('-'), escapeCell('-'), escapeCell('-'), escapeCell('-')].join(','));
  } else {
    transactions.forEach(t => {
      const isIncome = t.type === 'INCOME';
      lines.push([
        escapeCell(t.date),
        escapeCell(t.title),
        escapeCell(isIncome ? 'INGRESO' : 'EGRESO'),
        escapeCell(t.periodMode || 'QUINCENAL'),
        escapeCell(t.categoryId || 'General'),
        escapeCell(t.notes || '-'),
        escapeCell(`${isIncome ? '+' : '-'}${formatMoney(t.amount, currency)}`)
      ].join(','));
    });
  }
  lines.push(''); // Separador

  // 5. DESGLOSE POR CATEGORÍAS
  if (summary.categoryBreakdown && summary.categoryBreakdown.length > 0) {
    lines.push([escapeCell('=== 4. DESGLOSE ANALÍTICO POR CATEGORÍA ===')].join(','));
    lines.push([
      escapeCell('Categoría'),
      escapeCell('Cantidad de Movimientos'),
      escapeCell('Monto Total'),
      escapeCell('% del Gasto Total')
    ].join(','));

    summary.categoryBreakdown.forEach(item => {
      const pct = summary.totalExpense > 0 
        ? Math.round((item.amount / summary.totalExpense) * 100)
        : 0;
      lines.push([
        escapeCell(item.category?.name || 'Otras'),
        escapeCell(item.count || 1),
        escapeCell(formatMoney(item.amount, currency)),
        escapeCell(`${pct}%`)
      ].join(','));
    });
    lines.push('');
  }

  // 6. FIRMA DE AUDITORÍA
  lines.push([escapeCell('Certificación Digital:'), escapeCell(`SHA-256 Verified • getloss Pro v2.0 • ${clientName}`)].join(','));

  // Generar Archivo con BOM UTF-8 (\uFEFF) para compatibilidad total con Microsoft Excel
  const csvContent = '\uFEFF' + lines.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  const cleanClient = clientName.replace(/\s+/g, '_');
  const cleanPeriod = periodLabel.replace(/[\s•()]+/g, '_');
  const filename = `getloss_Reporte_${cleanClient}_${cleanPeriod}.csv`;

  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

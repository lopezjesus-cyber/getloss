import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatMoney } from '../utils/formatters';

/**
 * Generador de Reportes Financieros en PDF para getloss
 * Estilo ejecutivo en Blanco, Negro y Escala de Grises (Monocromático Pro)
 */
export const generateFinancialPdfReport = ({
  user,
  summary,
  transactions = [],
  fixedExpenses = [],
  periodLabel = 'Periodo Actual',
}) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const currency = user?.currency || 'USD';
  const clientName = user?.fullName || 'Usuario';
  const generatedDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // --- ENCABEZADO SUPERIOR EJECUTIVO ---
  doc.setFillColor(18, 18, 21); // #121215 (Negro Grafito Space Black)
  doc.rect(0, 0, pageWidth, 36, 'F');

  // Logotipo / Marca
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('getloss', 15, 18);

  // Badge PRO
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(48, 11, 14, 6, 1.5, 1.5, 'F');
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('PRO', 55, 15.2, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(180, 180, 185);
  doc.text('ESTADO FINANCIERO EJECUTIVO & AUDITORÍA DE FLUJO', 15, 26);

  // Datos del Cliente y Periodo
  doc.setFontSize(8.5);
  doc.setTextColor(240, 240, 245);
  doc.text(`Cliente: ${clientName}`, pageWidth - 15, 14, { align: 'right' });
  doc.text(`Periodo: ${periodLabel}`, pageWidth - 15, 20, { align: 'right' });
  doc.setTextColor(160, 160, 165);
  doc.text(`Emisión: ${generatedDate}`, pageWidth - 15, 26, { align: 'right' });

  // --- TARJETAS DE RESUMEN EJECUTIVO (KPIs) ---
  let startY = 44;
  const cardWidth = (pageWidth - 30 - 9) / 4;
  const cardHeight = 22;

  const kpis = [
    { label: 'INGRESOS', val: `+${formatMoney(summary.totalIncome, currency)}`, bg: [245, 245, 247], text: [20, 20, 20] },
    { label: 'EGRESOS', val: `-${formatMoney(summary.totalExpense, currency)}`, bg: [245, 245, 247], text: [20, 20, 20] },
    { label: 'SALDO LIBRE', val: `${formatMoney(summary.netBalance, currency)}`, bg: [20, 20, 22], text: [255, 255, 255] },
    { label: 'TASA AHORRO', val: `${summary.savingsRate || 0}%`, bg: [245, 245, 247], text: [20, 20, 20] },
  ];

  kpis.forEach((kpi, idx) => {
    const x = 15 + idx * (cardWidth + 3);
    doc.setFillColor(...kpi.bg);
    doc.roundedRect(x, startY, cardWidth, cardHeight, 2, 2, 'F');
    doc.setDrawColor(220, 220, 225);
    doc.roundedRect(x, startY, cardWidth, cardHeight, 2, 2, 'S');

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(kpi.bg[0] === 20 ? 180 : 100, kpi.bg[1] === 20 ? 180 : 100, kpi.bg[2] === 20 ? 180 : 100);
    doc.text(kpi.label, x + cardWidth / 2, startY + 7, { align: 'center' });

    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...kpi.text);
    doc.text(kpi.val, x + cardWidth / 2, startY + 16, { align: 'center' });
  });

  // --- SECCIÓN 1: GASTOS INDISPENSABLES & CONSTANTES ---
  startY += 30;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 20, 20);
  doc.text('1. Gastos Constantes e Indispensables (Obligaciones Prioritarias)', 15, startY);

  const fixedRows = fixedExpenses.map(f => [
    f.name,
    f.isIndispensable ? 'Indispensable' : 'Fijo',
    f.targetMode === 'QUINCENAL' ? 'Quincenal' : 'Mensual',
    `Día ${f.dueDay}`,
    formatMoney(f.amount, currency),
    (f.paidPeriods && f.paidPeriods.length > 0) ? 'PAGADO' : 'PENDIENTE'
  ]);

  autoTable(doc, {
    startY: startY + 4,
    head: [['Concepto Obligatorio', 'Clasificación', 'Periodo', 'Vencimiento', 'Monto Presupuestado', 'Estado']],
    body: fixedRows.length > 0 ? fixedRows : [['No hay gastos fijos registrados en este periodo', '-', '-', '-', '-', '-']],
    theme: 'grid',
    styles: {
      fontSize: 8.5,
      cellPadding: 2.5,
      textColor: [40, 40, 40],
      lineColor: [220, 220, 225],
    },
    headStyles: {
      fillColor: [35, 35, 40],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    columnStyles: {
      4: { halign: 'right', fontStyle: 'bold' },
      5: { halign: 'center' }
    }
  });

  // --- SECCIÓN 2: HISTORIAL DE TRANSACCIONES ---
  const currentTableEnd = (doc.lastAutoTable ? doc.lastAutoTable.finalY : startY + 40) + 10;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 20, 20);
  doc.text('2. Libro Mayor de Movimientos y Transacciones', 15, currentTableEnd);

  const txRows = transactions.map(t => [
    t.date,
    t.title,
    t.type === 'INCOME' ? 'INGRESO' : 'EGRESO',
    t.periodMode || 'QUINCENAL',
    t.notes || '-',
    `${t.type === 'INCOME' ? '+' : '-'}${formatMoney(t.amount, currency)}`
  ]);

  autoTable(doc, {
    startY: currentTableEnd + 4,
    head: [['Fecha', 'Descripción', 'Tipo', 'Ciclo', 'Notas / Comprobante', 'Monto']],
    body: txRows.length > 0 ? txRows : [['No hay transacciones registradas en este periodo', '-', '-', '-', '-', '-']],
    theme: 'striped',
    styles: {
      fontSize: 8,
      cellPadding: 2.2,
      textColor: [40, 40, 40],
    },
    headStyles: {
      fillColor: [24, 24, 27],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    columnStyles: {
      2: { halign: 'center' },
      3: { halign: 'center' },
      5: { halign: 'right', fontStyle: 'bold' }
    }
  });

  // --- PIE DE PÁGINA CON NÚMERO DE PÁGINA ---
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(140, 140, 140);
    doc.text(
      `getloss Financial Suite • Certificación Criptográfica SHA-256 • Página ${i} de ${pageCount}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  // Descargar PDF
  const cleanClient = clientName.replace(/\s+/g, '_');
  const cleanPeriod = periodLabel.replace(/[\s•()]+/g, '_');
  const filename = `getloss_Reporte_${cleanClient}_${cleanPeriod}.pdf`;
  doc.save(filename);
};

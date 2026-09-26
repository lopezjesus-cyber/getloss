import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Generador de Reportes Financieros en PDF para getloss
 * Estilo ejecutivo en Blanco, Negro y Escala de Grises
 */
export const generateFinancialPdfReport = ({
  user,
  summary,
  transactions,
  fixedExpenses,
  periodLabel,
}) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const symbol = user.currencySymbol || '$';

  // --- ENCABEZADO ---
  // Fondo oscuro para cabecera superior
  doc.setFillColor(18, 18, 20); // #121214 (Negro Grafito)
  doc.rect(0, 0, pageWidth, 35, 'F');

  // Logo / Nombre de la Marca
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('getloss', 15, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(180, 180, 185);
  doc.text('REPORTE FINANCIERO EJECUTIVO', 15, 25);

  // Datos del Usuario y Fecha (Alineado a la derecha)
  doc.setFontSize(9);
  doc.setTextColor(230, 230, 230);
  doc.text(`Cliente: ${user.fullName}`, pageWidth - 15, 14, { align: 'right' });
  doc.text(`Periodo: ${periodLabel}`, pageWidth - 15, 20, { align: 'right' });
  doc.setTextColor(160, 160, 165);
  doc.text(`Generado: ${new Date().toLocaleDateString('es-ES')}`, pageWidth - 15, 26, { align: 'right' });

  // --- TARJETAS DE RESUMEN EJECUTIVO (KPIs) ---
  let startY = 43;

  const cardWidth = (pageWidth - 30 - 9) / 4; // 4 tarjetas
  const cardHeight = 22;

  const kpis = [
    { label: 'INGRESOS', val: `${symbol}${summary.totalIncome.toLocaleString()}`, bg: [245, 245, 247], text: [20, 20, 20] },
    { label: 'EGRESOS', val: `${symbol}${summary.totalExpense.toLocaleString()}`, bg: [245, 245, 247], text: [20, 20, 20] },
    { label: 'BALANCE NETO', val: `${symbol}${summary.netBalance.toLocaleString()}`, bg: [20, 20, 22], text: [255, 255, 255] },
    { label: 'TASA DE AHORRO', val: `${summary.savingsRate}%`, bg: [245, 245, 247], text: [20, 20, 20] },
  ];

  kpis.forEach((kpi, idx) => {
    const x = 15 + idx * (cardWidth + 3);
    doc.setFillColor(...kpi.bg);
    doc.roundedRect(x, startY, cardWidth, cardHeight, 2, 2, 'F');
    
    // Borde sutil
    doc.setDrawColor(220, 220, 225);
    doc.roundedRect(x, startY, cardWidth, cardHeight, 2, 2, 'S');

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(kpi.bg[0] === 20 ? 180 : 100, kpi.bg[1] === 20 ? 180 : 100, kpi.bg[2] === 20 ? 180 : 100);
    doc.text(kpi.label, x + cardWidth / 2, startY + 7, { align: 'center' });

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...kpi.text);
    doc.text(kpi.val, x + cardWidth / 2, startY + 16, { align: 'center' });
  });

  // --- SECCIÓN 1: GASTOS INDISPENSABLES & CONSTANTES ---
  startY += 32;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 20, 20);
  doc.text('1. Gastos Constantes e Indispensables (Obligaciones)', 15, startY);

  const fixedRows = fixedExpenses.map(f => [
    f.name,
    f.isIndispensable ? 'Indispensable' : 'Fijo',
    f.targetPeriod === 'Q1' ? '1ª Quincena' : f.targetPeriod === 'Q2' ? '2ª Quincena' : 'Mensual',
    `Día ${f.dueDay}`,
    `${symbol}${Number(f.amount).toLocaleString()}`,
    (f.paidPeriods && f.paidPeriods.length > 0) ? 'PAGADO' : 'PENDIENTE'
  ]);

  doc.autoTable({
    startY: startY + 4,
    head: [['Concepto Obligatorio', 'Clasificación', 'Periodo Asignado', 'Vencimiento', 'Monto Presupuestado', 'Estado']],
    body: fixedRows.length > 0 ? fixedRows : [['No hay gastos fijos registrados', '-', '-', '-', '-', '-']],
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
  const currentTableEnd = doc.lastAutoTable.finalY + 10;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 20, 20);
  doc.text('2. Detalle de Movimientos y Transacciones', 15, currentTableEnd);

  const txRows = transactions.map(t => [
    t.date,
    t.title,
    t.type === 'INCOME' ? 'INGRESO' : 'EGRESO',
    `Q${t.periodQuincena}`,
    t.notes || '-',
    `${t.type === 'INCOME' ? '+' : '-'}${symbol}${Number(t.amount).toLocaleString()}`
  ]);

  doc.autoTable({
    startY: currentTableEnd + 4,
    head: [['Fecha', 'Descripción', 'Tipo', 'Quincena', 'Notas / Comprobante', 'Monto']],
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

  // --- PIE DE PÁGINA ---
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(140, 140, 140);
  doc.text(
    `getloss Financial Suite • Documento generado automáticamente • Página 1 de 1`,
    pageWidth / 2,
    pageHeight - 8,
    { align: 'center' }
  );

  // Descargar PDF
  const filename = `getloss_Reporte_${user.fullName.replace(/\s+/g, '_')}_${periodLabel.replace(/\s+/g, '_')}.pdf`;
  doc.save(filename);
};

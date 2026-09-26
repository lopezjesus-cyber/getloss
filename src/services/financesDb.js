/**
 * getloss - Base de Datos Financiera de Clientes (getloss_finances_db)
 * Gestiona transacciones, categorías con vectores, gastos fijos indispensables y reportes.
 */

const FINANCES_STORAGE_KEY = 'getloss_finances_db_v1';

// Categorías del sistema con vectores de identificación
export const DEFAULT_CATEGORIES = [
  // Egresos Indispensables / Fijos
  { id: 'cat-rent', name: 'Alquiler / Vivienda', type: 'EXPENSE', icon: 'Home', isIndispensable: true, color: '#3f3f46' },
  { id: 'cat-services', name: 'Servicios Básicos (Luz/Agua/Net)', type: 'EXPENSE', icon: 'Zap', isIndispensable: true, color: '#52525b' },
  { id: 'cat-food', name: 'Alimentación & Supermercado', type: 'EXPENSE', icon: 'ShoppingCart', isIndispensable: true, color: '#71717a' },
  { id: 'cat-transport', name: 'Transporte / Gasolina', type: 'EXPENSE', icon: 'Car', isIndispensable: true, color: '#a1a1aa' },
  { id: 'cat-health', name: 'Salud & Medicamentos', type: 'EXPENSE', icon: 'HeartPulse', isIndispensable: true, color: '#27272a' },
  
  // Egresos Variables / Estilo de Vida
  { id: 'cat-entertainment', name: 'Ocio & Salidas', type: 'EXPENSE', icon: 'Film', isIndispensable: false, color: '#71717a' },
  { id: 'cat-shopping', name: 'Compras & Ropa', type: 'EXPENSE', icon: 'ShoppingBag', isIndispensable: false, color: '#52525b' },
  { id: 'cat-education', name: 'Educación & Cursos', type: 'EXPENSE', icon: 'GraduationCap', isIndispensable: false, color: '#3f3f46' },
  { id: 'cat-debt', name: 'Tarjetas & Préstamos', type: 'EXPENSE', icon: 'CreditCard', isIndispensable: false, color: '#18181b' },
  { id: 'cat-other-exp', name: 'Otros Egresos', type: 'EXPENSE', icon: 'MoreHorizontal', isIndispensable: false, color: '#71717a' },

  // Ingresos
  { id: 'cat-salary', name: 'Salario / Nómina Principal', type: 'INCOME', icon: 'Briefcase', isIndispensable: false, color: '#ffffff' },
  { id: 'cat-freelance', name: 'Trabajos Extra / Freelance', type: 'INCOME', icon: 'Laptop', isIndispensable: false, color: '#e4e4e7' },
  { id: 'cat-investments', name: 'Rendimientos / Inversiones', type: 'INCOME', icon: 'TrendingUp', isIndispensable: false, color: '#d4d4d8' },
  { id: 'cat-other-inc', name: 'Otros Ingresos', type: 'INCOME', icon: 'PlusCircle', isIndispensable: false, color: '#a1a1aa' }
];

// Semilla inicial de datos financieros de prueba
const getInitialSeed = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  return {
    fixedExpenses: [
      {
        id: 'fix-01',
        userId: 'usr-demo-01',
        categoryId: 'cat-rent',
        name: 'Arriendo Apartamento',
        amount: 850,
        dueDay: 5,
        targetPeriod: 'Q1', // 'Q1' (1-15), 'Q2' (16-30), 'MENSUAL'
        isIndispensable: true,
        notes: 'Pago transferencia bancaria primer día hábil',
        paidPeriods: [`${currentYear}-${currentMonth}-Q1`]
      },
      {
        id: 'fix-02',
        userId: 'usr-demo-01',
        categoryId: 'cat-services',
        name: 'Servicio de Electricidad & Agua',
        amount: 110,
        dueDay: 12,
        targetPeriod: 'Q1',
        isIndispensable: true,
        notes: 'Factura conjunta mensual',
        paidPeriods: [`${currentYear}-${currentMonth}-Q1`]
      },
      {
        id: 'fix-03',
        userId: 'usr-demo-01',
        categoryId: 'cat-services',
        name: 'Internet Fibra Óptica 500MB',
        amount: 45,
        dueDay: 18,
        targetPeriod: 'Q2',
        isIndispensable: true,
        notes: 'Débito automático',
        paidPeriods: []
      },
      {
        id: 'fix-04',
        userId: 'usr-demo-01',
        categoryId: 'cat-food',
        name: 'Mercado Básico Quincena 1',
        amount: 220,
        dueDay: 2,
        targetPeriod: 'Q1',
        isIndispensable: true,
        notes: 'Supermercado alimentos y aseo',
        paidPeriods: [`${currentYear}-${currentMonth}-Q1`]
      },
      {
        id: 'fix-05',
        userId: 'usr-demo-01',
        categoryId: 'cat-food',
        name: 'Mercado Básico Quincena 2',
        amount: 220,
        dueDay: 17,
        targetPeriod: 'Q2',
        isIndispensable: true,
        notes: 'Supermercado despensa',
        paidPeriods: []
      },
      {
        id: 'fix-06',
        userId: 'usr-demo-01',
        categoryId: 'cat-transport',
        name: 'Combustible & Transporte Público',
        amount: 130,
        dueDay: 15,
        targetPeriod: 'MENSUAL',
        isIndispensable: true,
        notes: 'Recargas y gasolina del mes',
        paidPeriods: [`${currentYear}-${currentMonth}-Q1`]
      }
    ],
    transactions: [
      {
        id: 'tx-01',
        userId: 'usr-demo-01',
        categoryId: 'cat-salary',
        title: 'Primera Quincena de Salario',
        amount: 1400,
        type: 'INCOME',
        date: `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`,
        periodYear: currentYear,
        periodMonth: currentMonth,
        periodQuincena: 1,
        notes: 'Depósito directo empresa'
      },
      {
        id: 'tx-02',
        userId: 'usr-demo-01',
        categoryId: 'cat-freelance',
        title: 'Diseño Web Cliente Particular',
        amount: 350,
        type: 'INCOME',
        date: `${currentYear}-${String(currentMonth).padStart(2, '0')}-08`,
        periodYear: currentYear,
        periodMonth: currentMonth,
        periodQuincena: 1,
        notes: 'Pago de anticipo 50%'
      },
      {
        id: 'tx-03',
        userId: 'usr-demo-01',
        categoryId: 'cat-rent',
        title: 'Pago de Arriendo Apartamento',
        amount: 850,
        type: 'EXPENSE',
        date: `${currentYear}-${String(currentMonth).padStart(2, '0')}-03`,
        periodYear: currentYear,
        periodMonth: currentMonth,
        periodQuincena: 1,
        notes: 'Transferencia realizada con comprobante'
      },
      {
        id: 'tx-04',
        userId: 'usr-demo-01',
        categoryId: 'cat-services',
        title: 'Pago de Luz y Agua',
        amount: 110,
        type: 'EXPENSE',
        date: `${currentYear}-${String(currentMonth).padStart(2, '0')}-10`,
        periodYear: currentYear,
        periodMonth: currentMonth,
        periodQuincena: 1,
        notes: 'Pago en línea portal'
      },
      {
        id: 'tx-05',
        userId: 'usr-demo-01',
        categoryId: 'cat-food',
        title: 'Compras Supermercado Quincena 1',
        amount: 215,
        type: 'EXPENSE',
        date: `${currentYear}-${String(currentMonth).padStart(2, '0')}-04`,
        periodYear: currentYear,
        periodMonth: currentMonth,
        periodQuincena: 1,
        notes: 'Mercado de víveres'
      },
      {
        id: 'tx-06',
        userId: 'usr-demo-01',
        categoryId: 'cat-entertainment',
        title: 'Cena Restaurante y Cine',
        amount: 65,
        type: 'EXPENSE',
        date: `${currentYear}-${String(currentMonth).padStart(2, '0')}-07`,
        periodYear: currentYear,
        periodMonth: currentMonth,
        periodQuincena: 1,
        notes: 'Salida de fin de semana'
      },
      {
        id: 'tx-07',
        userId: 'usr-demo-01',
        categoryId: 'cat-salary',
        title: 'Segunda Quincena de Salario',
        amount: 1400,
        type: 'INCOME',
        date: `${currentYear}-${String(currentMonth).padStart(2, '0')}-16`,
        periodYear: currentYear,
        periodMonth: currentMonth,
        periodQuincena: 2,
        notes: 'Depósito nómina quincena 2'
      },
      {
        id: 'tx-08',
        userId: 'usr-demo-01',
        categoryId: 'cat-shopping',
        title: 'Calzado Deportivo',
        amount: 85,
        type: 'EXPENSE',
        date: `${currentYear}-${String(currentMonth).padStart(2, '0')}-18`,
        periodYear: currentYear,
        periodMonth: currentMonth,
        periodQuincena: 2,
        notes: 'Oferta calzado'
      }
    ]
  };
};

export const FinancesDB = {
  // Obtener toda la base de datos de finanzas
  getRawDatabase: () => {
    try {
      const data = localStorage.getItem(FINANCES_STORAGE_KEY);
      if (!data) {
        const seed = getInitialSeed();
        localStorage.setItem(FINANCES_STORAGE_KEY, JSON.stringify(seed));
        return seed;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error al cargar base de datos financiera:', e);
      return getInitialSeed();
    }
  },

  // Guardar estado completo
  _saveDatabase: (db) => {
    localStorage.setItem(FINANCES_STORAGE_KEY, JSON.stringify(db));
  },

  // Obtener categorías
  getCategories: () => {
    return DEFAULT_CATEGORIES;
  },

  // Obtener categoría por ID
  getCategoryById: (catId) => {
    return DEFAULT_CATEGORIES.find(c => c.id === catId) || {
      id: 'unknown',
      name: 'Sin Categoría',
      type: 'EXPENSE',
      icon: 'Tag',
      isIndispensable: false,
      color: '#71717a'
    };
  },

  // --------------------------------------------------------------------------
  // TRANSACCIONES (INGRESOS & EGRESOS)
  // --------------------------------------------------------------------------
  getTransactions: (userId, filters = {}) => {
    const db = FinancesDB.getRawDatabase();
    let txs = db.transactions.filter(t => t.userId === userId);

    if (filters.year) {
      txs = txs.filter(t => t.periodYear === Number(filters.year));
    }
    if (filters.month) {
      txs = txs.filter(t => t.periodMonth === Number(filters.month));
    }
    if (filters.quincena && filters.quincena !== 'ALL') {
      txs = txs.filter(t => t.periodQuincena === Number(filters.quincena));
    }
    if (filters.type && filters.type !== 'ALL') {
      txs = txs.filter(t => t.type === filters.type);
    }
    if (filters.categoryId && filters.categoryId !== 'ALL') {
      txs = txs.filter(t => t.categoryId === filters.categoryId);
    }

    // Ordenar de más reciente a más antigua
    return txs.sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  addTransaction: (userId, data) => {
    const db = FinancesDB.getRawDatabase();
    const dateObj = new Date(data.date || new Date());
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    const quincena = day <= 15 ? 1 : 2;

    const newTx = {
      id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId,
      categoryId: data.categoryId,
      title: data.title.trim(),
      amount: Math.abs(Number(data.amount)),
      type: data.type, // 'INCOME' | 'EXPENSE'
      date: data.date,
      periodYear: year,
      periodMonth: month,
      periodQuincena: data.periodQuincena ? Number(data.periodQuincena) : quincena,
      notes: data.notes || '',
      createdAt: new Date().toISOString()
    };

    db.transactions.unshift(newTx);
    FinancesDB._saveDatabase(db);
    return newTx;
  },

  deleteTransaction: (txId) => {
    const db = FinancesDB.getRawDatabase();
    db.transactions = db.transactions.filter(t => t.id !== txId);
    FinancesDB._saveDatabase(db);
    return true;
  },

  // --------------------------------------------------------------------------
  // GASTOS INDISPENSABLES Y FIJOS (OBLIGACIONES)
  // --------------------------------------------------------------------------
  getFixedExpenses: (userId) => {
    const db = FinancesDB.getRawDatabase();
    return db.fixedExpenses.filter(f => f.userId === userId);
  },

  addFixedExpense: (userId, data) => {
    const db = FinancesDB.getRawDatabase();
    const newFixed = {
      id: `fix-${Date.now()}`,
      userId,
      categoryId: data.categoryId,
      name: data.name.trim(),
      amount: Math.abs(Number(data.amount)),
      dueDay: Number(data.dueDay) || 15,
      targetPeriod: data.targetPeriod || 'Q1', // 'Q1' | 'Q2' | 'MENSUAL'
      isIndispensable: data.isIndispensable !== false,
      notes: data.notes || '',
      paidPeriods: []
    };

    db.fixedExpenses.push(newFixed);
    FinancesDB._saveDatabase(db);
    return newFixed;
  },

  toggleFixedExpensePaid: (fixedId, year, month, quincena) => {
    const db = FinancesDB.getRawDatabase();
    const item = db.fixedExpenses.find(f => f.id === fixedId);
    if (!item) throw new Error('Gasto fijo no encontrado');

    const periodKey = `${year}-${month}-${quincena}`;
    const isPaid = (item.paidPeriods || []).includes(periodKey);

    if (isPaid) {
      item.paidPeriods = item.paidPeriods.filter(p => p !== periodKey);
    } else {
      item.paidPeriods = [...(item.paidPeriods || []), periodKey];
    }

    FinancesDB._saveDatabase(db);
    return !isPaid;
  },

  deleteFixedExpense: (fixedId) => {
    const db = FinancesDB.getRawDatabase();
    db.fixedExpenses = db.fixedExpenses.filter(f => f.id !== fixedId);
    FinancesDB._saveDatabase(db);
    return true;
  },

  // --------------------------------------------------------------------------
  // MOTOR DE CÁLCULO DE REPORTES Y BALANCE
  // --------------------------------------------------------------------------
  calculateFinancialSummary: (userId, year, month, quincena = 'ALL') => {
    const txs = FinancesDB.getTransactions(userId, { year, month, quincena });
    const fixed = FinancesDB.getFixedExpenses(userId);

    // Calcular Totales
    const totalIncome = txs
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = txs
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    const netBalance = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? Math.max(0, ((netBalance / totalIncome) * 100)).toFixed(1) : 0;

    // Calcular Gastos Fijos vs Variables
    let indispensableExpenseTotal = 0;
    let variableExpenseTotal = 0;

    // Desglose por categoría
    const categoryTotals = {};

    txs.forEach(t => {
      const cat = FinancesDB.getCategoryById(t.categoryId);
      if (t.type === 'EXPENSE') {
        if (cat.isIndispensable) {
          indispensableExpenseTotal += t.amount;
        } else {
          variableExpenseTotal += t.amount;
        }

        if (!categoryTotals[t.categoryId]) {
          categoryTotals[t.categoryId] = {
            category: cat,
            amount: 0,
            count: 0
          };
        }
        categoryTotals[t.categoryId].amount += t.amount;
        categoryTotals[t.categoryId].count += 1;
      }
    });

    const categoryBreakdown = Object.values(categoryTotals).sort((a, b) => b.amount - a.amount);

    // Calcular estado de Gastos Fijos Indispensables para el periodo
    const periodKeyQ1 = `${year}-${month}-Q1`;
    const periodKeyQ2 = `${year}-${month}-Q2`;

    let totalFixedCommitted = 0;
    let totalFixedPaid = 0;

    fixed.forEach(f => {
      let isRelevantForPeriod = true;
      if (quincena === '1' && f.targetPeriod === 'Q2') isRelevantForPeriod = false;
      if (quincena === '2' && f.targetPeriod === 'Q1') isRelevantForPeriod = false;

      if (isRelevantForPeriod) {
        totalFixedCommitted += f.amount;
        const paidInQ1 = (f.paidPeriods || []).includes(periodKeyQ1);
        const paidInQ2 = (f.paidPeriods || []).includes(periodKeyQ2);

        if (quincena === '1' && paidInQ1) totalFixedPaid += f.amount;
        else if (quincena === '2' && paidInQ2) totalFixedPaid += f.amount;
        else if (quincena === 'ALL' && (paidInQ1 || paidInQ2)) totalFixedPaid += f.amount;
      }
    });

    return {
      period: { year, month, quincena },
      totalIncome,
      totalExpense,
      netBalance,
      savingsRate,
      indispensableExpenseTotal,
      variableExpenseTotal,
      totalFixedCommitted,
      totalFixedPaid,
      fixedPendingAmount: Math.max(0, totalFixedCommitted - totalFixedPaid),
      categoryBreakdown,
      transactionsCount: txs.length
    };
  },

  // Resetear base de datos financiera
  resetDatabase: () => {
    const seed = getInitialSeed();
    localStorage.setItem(FINANCES_STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }
};

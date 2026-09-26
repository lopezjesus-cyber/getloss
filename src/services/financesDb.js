/**
 * getloss - Base de Datos Financiera de Clientes (getloss_finances_db)
 * Gestiona transacciones, categorías con vectores, gastos fijos indispensables y reportes
 * con soporte directo para selección entre Modo Quincenal o Modo Mensual.
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

const getCleanDatabase = () => ({
  fixedExpenses: [],
  transactions: []
});

export const FinancesDB = {
  getRawDatabase: () => {
    try {
      const data = localStorage.getItem(FINANCES_STORAGE_KEY);
      if (!data) {
        const clean = getCleanDatabase();
        localStorage.setItem(FINANCES_STORAGE_KEY, JSON.stringify(clean));
        return clean;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error al cargar base de datos financiera:', e);
      return getCleanDatabase();
    }
  },

  _saveDatabase: (db) => {
    localStorage.setItem(FINANCES_STORAGE_KEY, JSON.stringify(db));
  },

  getCategories: () => DEFAULT_CATEGORIES,

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
  // TRANSACCIONES
  // --------------------------------------------------------------------------
  getTransactions: (userId, filters = {}) => {
    const db = FinancesDB.getRawDatabase();
    let txs = (db.transactions || []).filter(t => t.userId === userId);

    if (filters.year) {
      txs = txs.filter(t => t.periodYear === Number(filters.year));
    }
    if (filters.month) {
      txs = txs.filter(t => t.periodMonth === Number(filters.month));
    }
    if (filters.mode && filters.mode !== 'ALL') {
      txs = txs.filter(t => t.periodMode === filters.mode || !t.periodMode);
    }
    if (filters.type && filters.type !== 'ALL') {
      txs = txs.filter(t => t.type === filters.type);
    }
    if (filters.categoryId && filters.categoryId !== 'ALL') {
      txs = txs.filter(t => t.categoryId === filters.categoryId);
    }

    return txs.sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  addTransaction: (userId, data) => {
    const db = FinancesDB.getRawDatabase();
    if (!db.transactions) db.transactions = [];

    const dateObj = new Date(data.date || new Date());
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();

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
      periodMode: data.periodMode || 'QUINCENAL', // 'QUINCENAL' | 'MENSUAL'
      notes: data.notes || '',
      createdAt: new Date().toISOString()
    };

    db.transactions.unshift(newTx);
    FinancesDB._saveDatabase(db);
    return newTx;
  },

  deleteTransaction: (txId) => {
    const db = FinancesDB.getRawDatabase();
    db.transactions = (db.transactions || []).filter(t => t.id !== txId);
    FinancesDB._saveDatabase(db);
    return true;
  },

  // --------------------------------------------------------------------------
  // GASTOS INDISPENSABLES Y FIJOS
  // --------------------------------------------------------------------------
  getFixedExpenses: (userId) => {
    const db = FinancesDB.getRawDatabase();
    return (db.fixedExpenses || []).filter(f => f.userId === userId);
  },

  addFixedExpense: (userId, data) => {
    const db = FinancesDB.getRawDatabase();
    if (!db.fixedExpenses) db.fixedExpenses = [];

    const newFixed = {
      id: `fix-${Date.now()}`,
      userId,
      categoryId: data.categoryId,
      name: data.name.trim(),
      amount: Math.abs(Number(data.amount)),
      dueDay: Number(data.dueDay) || 15,
      targetMode: data.targetMode || 'QUINCENAL', // 'QUINCENAL' | 'MENSUAL'
      isIndispensable: data.isIndispensable !== false,
      notes: data.notes || '',
      paidPeriods: []
    };

    db.fixedExpenses.push(newFixed);
    FinancesDB._saveDatabase(db);
    return newFixed;
  },

  toggleFixedExpensePaid: (fixedId, year, month, mode = 'QUINCENAL') => {
    const db = FinancesDB.getRawDatabase();
    const item = (db.fixedExpenses || []).find(f => f.id === fixedId);
    if (!item) throw new Error('Gasto fijo no encontrado');

    const periodKey = `${year}-${month}-${mode}`;
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
    db.fixedExpenses = (db.fixedExpenses || []).filter(f => f.id !== fixedId);
    FinancesDB._saveDatabase(db);
    return true;
  },

  // --------------------------------------------------------------------------
  // MOTOR DE CÁLCULO DE REPORTES Y BALANCE
  // --------------------------------------------------------------------------
  calculateFinancialSummary: (userId, year, month, mode = 'QUINCENAL') => {
    const txs = FinancesDB.getTransactions(userId, { year, month });
    const fixed = FinancesDB.getFixedExpenses(userId);

    // Filtrar transacciones según el modo si aplica o calcular el total
    const filteredTxs = mode === 'MENSUAL'
      ? txs
      : txs.filter(t => t.periodMode === 'QUINCENAL' || !t.periodMode);

    const totalIncome = filteredTxs
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = filteredTxs
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    const netBalance = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? Math.max(0, ((netBalance / totalIncome) * 100)).toFixed(1) : 0;

    let indispensableExpenseTotal = 0;
    let variableExpenseTotal = 0;
    const categoryTotals = {};

    filteredTxs.forEach(t => {
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

    // Obligaciones fijas para este modo
    const periodKey = `${year}-${month}-${mode}`;
    let totalFixedCommitted = 0;
    let totalFixedPaid = 0;

    fixed.forEach(f => {
      let isRelevant = mode === 'MENSUAL' || f.targetMode === 'QUINCENAL' || !f.targetMode;

      if (isRelevant) {
        totalFixedCommitted += f.amount;
        const isPaid = (f.paidPeriods || []).includes(periodKey);
        if (isPaid) totalFixedPaid += f.amount;
      }
    });

    return {
      period: { year, month, mode },
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
      transactionsCount: filteredTxs.length
    };
  },

  resetDatabase: () => {
    const clean = getCleanDatabase();
    localStorage.setItem(FINANCES_STORAGE_KEY, JSON.stringify(clean));
    return clean;
  }
};

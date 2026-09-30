/**
 * getloss - Motor de Base de Datos Relacional SQL (SQLite / WebAssembly)
 * Gestiona esquemas relacionales, usuarios, contraseñas, transacciones y obligaciones financieras
 * mediante sentencias SQL estándar (SELECT, INSERT, UPDATE, DELETE, JOIN).
 */

import initSqlJs from 'sql.js';

const SQL_STORAGE_KEY = 'getloss_sqlite_database_binary_v1';

let dbInstance = null;
let sqlEngine = null;
let initPromise = null;

// Esquema DDL oficial en SQL estándar
export const SQL_SCHEMA_DDL = `
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT DEFAULT '',
    avatar TEXT DEFAULT '',
    currency TEXT DEFAULT 'USD',
    currency_symbol TEXT DEFAULT '$',
    pay_frequency TEXT DEFAULT 'QUINCENAL',
    pay_day_first INTEGER DEFAULT 15,
    pay_day_second INTEGER DEFAULT 30,
    monthly_income_goal REAL DEFAULT 2000.00,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    icon TEXT NOT NULL,
    is_indispensable INTEGER DEFAULT 0,
    color TEXT DEFAULT '#71717a'
);

CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    category_id TEXT NOT NULL,
    title TEXT NOT NULL,
    amount REAL NOT NULL,
    type TEXT NOT NULL,
    date TEXT NOT NULL,
    period_year INTEGER NOT NULL,
    period_month INTEGER NOT NULL,
    period_mode TEXT DEFAULT 'QUINCENAL',
    notes TEXT DEFAULT '',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS fixed_expenses (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    category_id TEXT NOT NULL,
    name TEXT NOT NULL,
    amount REAL NOT NULL,
    due_day INTEGER DEFAULT 15,
    target_mode TEXT DEFAULT 'QUINCENAL',
    is_indispensable INTEGER DEFAULT 1,
    notes TEXT DEFAULT '',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS fixed_expense_payments (
    id TEXT PRIMARY KEY,
    fixed_expense_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    period_key TEXT NOT NULL,
    paid_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fixed_expense_id) REFERENCES fixed_expenses(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(fixed_expense_id, period_key)
);
`;

// Categorías por defecto para poblar en SQL
const DEFAULT_SQL_CATEGORIES = [
  ['cat-rent', 'Alquiler / Vivienda', 'EXPENSE', 'Home', 1, '#3f3f46'],
  ['cat-services', 'Servicios Básicos (Luz/Agua/Net)', 'EXPENSE', 'Zap', 1, '#52525b'],
  ['cat-food', 'Alimentación & Supermercado', 'EXPENSE', 'ShoppingCart', 1, '#71717a'],
  ['cat-transport', 'Transporte / Gasolina', 'EXPENSE', 'Car', 1, '#a1a1aa'],
  ['cat-health', 'Salud & Medicamentos', 'EXPENSE', 'HeartPulse', 1, '#27272a'],
  ['cat-entertainment', 'Ocio & Salidas', 'EXPENSE', 'Film', 0, '#71717a'],
  ['cat-shopping', 'Compras & Ropa', 'EXPENSE', 'ShoppingBag', 0, '#52525b'],
  ['cat-education', 'Educación & Cursos', 'EXPENSE', 'GraduationCap', 0, '#3f3f46'],
  ['cat-debt', 'Tarjetas & Préstamos', 'EXPENSE', 'CreditCard', 0, '#18181b'],
  ['cat-other-exp', 'Otros Egresos', 'EXPENSE', 'MoreHorizontal', 0, '#71717a'],
  ['cat-salary', 'Salario / Nómina Principal', 'INCOME', 'Briefcase', 0, '#ffffff'],
  ['cat-freelance', 'Trabajos Extra / Freelance', 'INCOME', 'Laptop', 0, '#e4e4e7'],
  ['cat-investments', 'Rendimientos / Inversiones', 'INCOME', 'TrendingUp', 0, '#d4d4d8'],
  ['cat-other-inc', 'Otros Ingresos', 'INCOME', 'PlusCircle', 0, '#a1a1aa']
];

export const SqlDatabase = {
  // Inicialización del motor SQLite WebAssembly
  init: async () => {
    if (dbInstance) return dbInstance;
    if (initPromise) return initPromise;

    initPromise = (async () => {
      try {
        const isNode = typeof window === 'undefined';
        const locateFile = file => (isNode ? `./public/${file}` : `/${file}`);

        sqlEngine = await initSqlJs({
          locateFile
        });

        // Intentar restaurar base de datos binaria previa
        let savedBinaryBase64 = null;
        if (typeof localStorage !== 'undefined') {
          savedBinaryBase64 = localStorage.getItem(SQL_STORAGE_KEY);
        }

        if (savedBinaryBase64) {
          try {
            const binaryString = atob(savedBinaryBase64);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            dbInstance = new sqlEngine.Database(bytes);
          } catch {
            dbInstance = new sqlEngine.Database();
          }
        } else {
          dbInstance = new sqlEngine.Database();
        }

        // Ejecutar DDL para asegurar que las tablas existan
        dbInstance.run(SQL_SCHEMA_DDL);

        // Sembrar categorías si no existen
        for (const cat of DEFAULT_SQL_CATEGORIES) {
          dbInstance.run(
            `INSERT OR IGNORE INTO categories (id, name, type, icon, is_indispensable, color) VALUES (?, ?, ?, ?, ?, ?);`,
            cat
          );
        }

        SqlDatabase._persist();
        return dbInstance;
      } catch (err) {
        console.error('Error al inicializar motor SQL SQLite:', err);
        throw err;
      }
    })();

    return initPromise;
  },

  // Persistir estado binario de SQLite en almacenamiento local
  _persist: () => {
    if (!dbInstance || typeof localStorage === 'undefined') return;
    try {
      const binary = dbInstance.export();
      let binaryString = '';
      const chunkSize = 8192;
      for (let i = 0; i < binary.length; i += chunkSize) {
        binaryString += String.fromCharCode.apply(null, binary.subarray(i, i + chunkSize));
      }
      localStorage.setItem(SQL_STORAGE_KEY, btoa(binaryString));
    } catch (e) {
      console.warn('Aviso al persistir base de datos SQL:', e);
    }
  },

  // --------------------------------------------------------------------------
  // EJECUCIÓN DIRECTA DE CONSULTAS SQL
  // --------------------------------------------------------------------------
  executeSql: async (sqlQuery, params = []) => {
    const db = await SqlDatabase.init();
    try {
      const results = db.exec(sqlQuery, params);
      SqlDatabase._persist();

      if (!results || results.length === 0) {
        return { columns: [], rows: [], records: [] };
      }

      const { columns, values } = results[0];
      const records = values.map(row => {
        const obj = {};
        columns.forEach((col, idx) => {
          obj[col] = row[idx];
        });
        return obj;
      });

      return { columns, rows: values, records };
    } catch (error) {
      console.error('Error ejecutando consulta SQL:', sqlQuery, error);
      throw error;
    }
  },

  // --------------------------------------------------------------------------
  // OPERACIONES SQL PARA USUARIOS Y CONTRASEÑAS
  // --------------------------------------------------------------------------
  sqlInsertUser: async (user) => {
    const db = await SqlDatabase.init();
    const query = `
      INSERT OR REPLACE INTO users (
        id, email, password_hash, full_name, phone, avatar, currency, currency_symbol,
        pay_frequency, pay_day_first, pay_day_second, monthly_income_goal, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP);
    `;

    db.run(query, [
      user.id,
      user.email.toLowerCase().trim(),
      user.passwordHash || user.password || '',
      user.fullName || '',
      user.phone || '',
      user.avatar || '',
      user.currency || 'USD',
      user.currencySymbol || '$',
      user.payFrequency || 'QUINCENAL',
      user.payDayFirst || 15,
      user.payDaySecond || 30,
      Number(user.monthlyIncomeGoal) || 2000
    ]);

    SqlDatabase._persist();
    return user;
  },

  sqlFindUserByEmailAndPassword: async (email, password) => {
    const db = await SqlDatabase.init();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    const query = `
      SELECT * FROM users 
      WHERE LOWER(email) = LOWER(?) AND (password_hash = ?);
    `;

    const res = db.exec(query, [cleanEmail, cleanPass]);
    if (res && res.length > 0 && res[0].values.length > 0) {
      const cols = res[0].columns;
      const row = res[0].values[0];
      const user = {};
      cols.forEach((col, idx) => { user[col] = row[idx]; });
      return {
        id: user.id,
        email: user.email,
        passwordHash: user.password_hash,
        fullName: user.full_name,
        phone: user.phone,
        avatar: user.avatar,
        currency: user.currency,
        currencySymbol: user.currency_symbol,
        payFrequency: user.pay_frequency,
        payDayFirst: user.pay_day_first,
        payDaySecond: user.pay_day_second,
        monthlyIncomeGoal: user.monthly_income_goal,
        createdAt: user.created_at
      };
    }
    return null;
  },

  sqlGetAllUsers: async () => {
    const { records } = await SqlDatabase.executeSql('SELECT * FROM users ORDER BY created_at DESC;');
    return records.map(u => ({
      id: u.id,
      email: u.email,
      passwordHash: u.password_hash,
      fullName: u.full_name,
      phone: u.phone,
      avatar: u.avatar,
      currency: u.currency,
      currencySymbol: u.currency_symbol,
      payFrequency: u.pay_frequency,
      payDayFirst: u.pay_day_first,
      payDaySecond: u.pay_day_second,
      monthlyIncomeGoal: u.monthly_income_goal,
      createdAt: u.created_at
    }));
  },

  // --------------------------------------------------------------------------
  // OPERACIONES SQL PARA TRANSACCIONES FINANCIERAS
  // --------------------------------------------------------------------------
  sqlInsertTransaction: async (tx) => {
    const db = await SqlDatabase.init();
    const query = `
      INSERT OR REPLACE INTO transactions (
        id, user_id, category_id, title, amount, type, date,
        period_year, period_month, period_mode, notes, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    db.run(query, [
      tx.id,
      tx.userId,
      tx.categoryId,
      tx.title,
      Number(tx.amount),
      tx.type,
      tx.date,
      Number(tx.periodYear),
      Number(tx.periodMonth),
      tx.periodMode || 'QUINCENAL',
      tx.notes || '',
      tx.createdAt || new Date().toISOString()
    ]);

    SqlDatabase._persist();
    return tx;
  },

  sqlDeleteTransaction: async (txId) => {
    const db = await SqlDatabase.init();
    db.run('DELETE FROM transactions WHERE id = ?;', [txId]);
    SqlDatabase._persist();
    return true;
  },

  sqlGetUserTransactions: async (userId, filters = {}) => {
    let sql = `
      SELECT t.*, c.name as category_name, c.icon as category_icon, c.color as category_color, c.is_indispensable
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = ?
    `;
    const params = [userId];

    if (filters.year) {
      sql += ' AND t.period_year = ?';
      params.push(Number(filters.year));
    }
    if (filters.month) {
      sql += ' AND t.period_month = ?';
      params.push(Number(filters.month));
    }
    if (filters.mode && filters.mode !== 'ALL') {
      sql += ' AND (t.period_mode = ? OR t.period_mode IS NULL)';
      params.push(filters.mode);
    }

    sql += ' ORDER BY t.date DESC, t.created_at DESC;';

    const { records } = await SqlDatabase.executeSql(sql, params);
    return records.map(r => ({
      id: r.id,
      userId: r.user_id,
      categoryId: r.category_id,
      title: r.title,
      amount: r.amount,
      type: r.type,
      date: r.date,
      periodYear: r.period_year,
      periodMonth: r.period_month,
      periodMode: r.period_mode,
      notes: r.notes,
      createdAt: r.created_at,
      categoryName: r.category_name,
      categoryIcon: r.category_icon,
      categoryColor: r.category_color
    }));
  },

  // --------------------------------------------------------------------------
  // OPERACIONES SQL PARA OBLIGACIONES FIJAS
  // --------------------------------------------------------------------------
  sqlInsertFixedExpense: async (fix) => {
    const db = await SqlDatabase.init();
    const query = `
      INSERT OR REPLACE INTO fixed_expenses (
        id, user_id, category_id, name, amount, due_day,
        target_mode, is_indispensable, notes, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    db.run(query, [
      fix.id,
      fix.userId,
      fix.categoryId,
      fix.name,
      Number(fix.amount),
      Number(fix.dueDay) || 15,
      fix.targetMode || 'QUINCENAL',
      fix.isIndispensable ? 1 : 0,
      fix.notes || '',
      fix.createdAt || new Date().toISOString()
    ]);

    SqlDatabase._persist();
    return fix;
  },

  sqlUpdateFixedExpense: async (fix) => {
    const db = await SqlDatabase.init();
    db.run(
      `UPDATE fixed_expenses 
       SET category_id = ?, name = ?, amount = ?, due_day = ?, target_mode = ?, is_indispensable = ?, notes = ?
       WHERE id = ?;`,
      [
        fix.categoryId,
        fix.name,
        Number(fix.amount),
        Number(fix.dueDay) || 15,
        fix.targetMode || 'QUINCENAL',
        fix.isIndispensable ? 1 : 0,
        fix.notes || '',
        fix.id
      ]
    );
    SqlDatabase._persist();
    return fix;
  },

  sqlDeleteFixedExpense: async (fixedId) => {
    const db = await SqlDatabase.init();
    db.run('DELETE FROM fixed_expense_payments WHERE fixed_expense_id = ?;', [fixedId]);
    db.run('DELETE FROM fixed_expenses WHERE id = ?;', [fixedId]);
    SqlDatabase._persist();
    return true;
  },

  sqlToggleFixedExpensePaid: async (fixedId, userId, periodKey) => {
    const db = await SqlDatabase.init();
    const checkQuery = `
      SELECT id FROM fixed_expense_payments 
      WHERE fixed_expense_id = ? AND period_key = ?;
    `;
    const check = db.exec(checkQuery, [fixedId, periodKey]);

    if (check && check.length > 0 && check[0].values.length > 0) {
      db.run('DELETE FROM fixed_expense_payments WHERE fixed_expense_id = ? AND period_key = ?;', [fixedId, periodKey]);
      SqlDatabase._persist();
      return false;
    } else {
      const payId = `pay-${fixedId}-${periodKey}`;
      db.run(
        'INSERT INTO fixed_expense_payments (id, fixed_expense_id, user_id, period_key) VALUES (?, ?, ?, ?);',
        [payId, fixedId, userId, periodKey]
      );
      SqlDatabase._persist();
      return true;
    }
  },

  sqlGetUserFixedExpenses: async (userId) => {
    const sql = `
      SELECT f.*, c.name as category_name, c.icon as category_icon, c.color as category_color
      FROM fixed_expenses f
      LEFT JOIN categories c ON f.category_id = c.id
      WHERE f.user_id = ?
      ORDER BY f.due_day ASC;
    `;
    const { records: expenses } = await SqlDatabase.executeSql(sql, [userId]);

    const { records: payments } = await SqlDatabase.executeSql(
      'SELECT fixed_expense_id, period_key FROM fixed_expense_payments WHERE user_id = ?;',
      [userId]
    );

    const paymentsMap = {};
    payments.forEach(p => {
      if (!paymentsMap[p.fixed_expense_id]) paymentsMap[p.fixed_expense_id] = [];
      paymentsMap[p.fixed_expense_id].push(p.period_key);
    });

    return expenses.map(e => ({
      id: e.id,
      userId: e.user_id,
      categoryId: e.category_id,
      name: e.name,
      amount: e.amount,
      dueDay: e.due_day,
      targetMode: e.target_mode,
      isIndispensable: Boolean(e.is_indispensable),
      notes: e.notes,
      paidPeriods: paymentsMap[e.id] || []
    }));
  },

  // --------------------------------------------------------------------------
  // EXPORTACIÓN E IMPORTACIÓN EN SQL PURO (.SQL SCRIPT)
  // --------------------------------------------------------------------------
  exportSqlDump: async () => {
    await SqlDatabase.init();
    const timestamp = new Date().toISOString();
    let sqlDump = `-- ==============================================================================\n`;
    sqlDump += `-- getloss - SQL Database Export Dump\n`;
    sqlDump += `-- Generado: ${timestamp}\n`;
    sqlDump += `-- Compatible con SQLite 3, PostgreSQL, MySQL\n`;
    sqlDump += `-- ==============================================================================\n\n`;

    sqlDump += SQL_SCHEMA_DDL + `\n\n`;

    // Exportar Categorías
    const { records: categories } = await SqlDatabase.executeSql('SELECT * FROM categories;');
    if (categories.length > 0) {
      sqlDump += `-- Categorías Financieras\n`;
      categories.forEach(c => {
        sqlDump += `INSERT OR REPLACE INTO categories (id, name, type, icon, is_indispensable, color) VALUES ('${c.id}', '${c.name.replace(/'/g, "''")}', '${c.type}', '${c.icon}', ${c.is_indispensable}, '${c.color}');\n`;
      });
      sqlDump += `\n`;
    }

    // Exportar Usuarios
    const { records: users } = await SqlDatabase.executeSql('SELECT * FROM users;');
    if (users.length > 0) {
      sqlDump += `-- Cuentas de Usuarios y Credenciales\n`;
      users.forEach(u => {
        sqlDump += `INSERT OR REPLACE INTO users (id, email, password_hash, full_name, phone, avatar, currency, currency_symbol, pay_frequency, pay_day_first, pay_day_second, monthly_income_goal, created_at) VALUES ('${u.id}', '${u.email}', '${u.password_hash}', '${(u.full_name || '').replace(/'/g, "''")}', '${u.phone || ''}', '${u.avatar || ''}', '${u.currency}', '${u.currency_symbol}', '${u.pay_frequency}', ${u.pay_day_first}, ${u.pay_day_second}, ${u.monthly_income_goal}, '${u.created_at}');\n`;
      });
      sqlDump += `\n`;
    }

    // Exportar Transacciones
    const { records: transactions } = await SqlDatabase.executeSql('SELECT * FROM transactions;');
    if (transactions.length > 0) {
      sqlDump += `-- Transacciones Financieras\n`;
      transactions.forEach(t => {
        sqlDump += `INSERT OR REPLACE INTO transactions (id, user_id, category_id, title, amount, type, date, period_year, period_month, period_mode, notes, created_at) VALUES ('${t.id}', '${t.user_id}', '${t.category_id}', '${(t.title || '').replace(/'/g, "''")}', ${t.amount}, '${t.type}', '${t.date}', ${t.period_year}, ${t.period_month}, '${t.period_mode}', '${(t.notes || '').replace(/'/g, "''")}', '${t.created_at}');\n`;
      });
      sqlDump += `\n`;
    }

    // Exportar Gastos Fijos
    const { records: fixed } = await SqlDatabase.executeSql('SELECT * FROM fixed_expenses;');
    if (fixed.length > 0) {
      sqlDump += `-- Obligaciones Fijas e Indispensables\n`;
      fixed.forEach(f => {
        sqlDump += `INSERT OR REPLACE INTO fixed_expenses (id, user_id, category_id, name, amount, due_day, target_mode, is_indispensable, notes, created_at) VALUES ('${f.id}', '${f.user_id}', '${f.category_id}', '${(f.name || '').replace(/'/g, "''")}', ${f.amount}, ${f.due_day}, '${f.target_mode}', ${f.is_indispensable}, '${(f.notes || '').replace(/'/g, "''")}', '${f.created_at}');\n`;
      });
      sqlDump += `\n`;
    }

    // Exportar Pagos
    const { records: payments } = await SqlDatabase.executeSql('SELECT * FROM fixed_expense_payments;');
    if (payments.length > 0) {
      sqlDump += `-- Historial de Pagos de Obligaciones Fijas\n`;
      payments.forEach(p => {
        sqlDump += `INSERT OR REPLACE INTO fixed_expense_payments (id, fixed_expense_id, user_id, period_key, paid_at) VALUES ('${p.id}', '${p.fixed_expense_id}', '${p.user_id}', '${p.period_key}', '${p.paid_at}');\n`;
      });
      sqlDump += `\n`;
    }

    return sqlDump;
  },

  // Descargar archivo .SQL estándar al equipo
  downloadSqlFile: async () => {
    const dump = await SqlDatabase.exportSqlDump();
    const blob = new Blob([dump], { type: 'text/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `getloss_database_${new Date().toISOString().slice(0, 10)}.sql`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  // Importar y ejecutar script .SQL
  importSqlDump: async (sqlScript) => {
    const db = await SqlDatabase.init();
    db.run(sqlScript);
    SqlDatabase._persist();
    return true;
  }
};

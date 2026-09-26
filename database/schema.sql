-- ==============================================================================
-- getloss - Esquema de Base de Datos Relacional SQL
-- Compatible con SQLite 3, PostgreSQL 14+, y MySQL 8.0+
-- Diseñado para autenticación de usuarios, contraseñas, transacciones y finanzas
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. TABLA: users (Usuarios del Sistema y Contraseñas)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(100) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) DEFAULT '',
    avatar TEXT,
    currency VARCHAR(10) DEFAULT 'USD',
    currency_symbol VARCHAR(5) DEFAULT '$',
    pay_frequency VARCHAR(20) DEFAULT 'QUINCENAL', -- 'QUINCENAL' | 'MENSUAL'
    pay_day_first INTEGER DEFAULT 15,
    pay_day_second INTEGER DEFAULT 30,
    monthly_income_goal DECIMAL(12, 2) DEFAULT 2000.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ------------------------------------------------------------------------------
-- 2. TABLA: categories (Categorías Financieras con Vectores de Clasificación)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'INCOME' | 'EXPENSE'
    icon VARCHAR(50) NOT NULL,
    is_indispensable BOOLEAN DEFAULT FALSE,
    color VARCHAR(20) DEFAULT '#71717a'
);

-- Inserción de Categorías por Defecto
INSERT OR IGNORE INTO categories (id, name, type, icon, is_indispensable, color) VALUES
('cat-rent', 'Alquiler / Vivienda', 'EXPENSE', 'Home', TRUE, '#3f3f46'),
('cat-services', 'Servicios Básicos (Luz/Agua/Net)', 'EXPENSE', 'Zap', TRUE, '#52525b'),
('cat-food', 'Alimentación & Supermercado', 'EXPENSE', 'ShoppingCart', TRUE, '#71717a'),
('cat-transport', 'Transporte / Gasolina', 'EXPENSE', 'Car', TRUE, '#a1a1aa'),
('cat-health', 'Salud & Medicamentos', 'EXPENSE', 'HeartPulse', TRUE, '#27272a'),
('cat-entertainment', 'Ocio & Salidas', 'EXPENSE', 'Film', FALSE, '#71717a'),
('cat-shopping', 'Compras & Ropa', 'EXPENSE', 'ShoppingBag', FALSE, '#52525b'),
('cat-education', 'Educación & Cursos', 'EXPENSE', 'GraduationCap', FALSE, '#3f3f46'),
('cat-debt', 'Tarjetas & Préstamos', 'EXPENSE', 'CreditCard', FALSE, '#18181b'),
('cat-other-exp', 'Otros Egresos', 'EXPENSE', 'MoreHorizontal', FALSE, '#71717a'),
('cat-salary', 'Salario / Nómina Principal', 'INCOME', 'Briefcase', FALSE, '#ffffff'),
('cat-freelance', 'Trabajos Extra / Freelance', 'INCOME', 'Laptop', FALSE, '#e4e4e7'),
('cat-investments', 'Rendimientos / Inversiones', 'INCOME', 'TrendingUp', FALSE, '#d4d4d8'),
('cat-other-inc', 'Otros Ingresos', 'INCOME', 'PlusCircle', FALSE, '#a1a1aa');

-- ------------------------------------------------------------------------------
-- 3. TABLA: transactions (Movimientos Financieros: Ingresos y Egresos)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    category_id VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'INCOME' | 'EXPENSE'
    date DATE NOT NULL,
    period_year INTEGER NOT NULL,
    period_month INTEGER NOT NULL,
    period_mode VARCHAR(20) DEFAULT 'QUINCENAL', -- 'QUINCENAL' | 'MENSUAL'
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_period ON transactions(user_id, period_year, period_month);

-- ------------------------------------------------------------------------------
-- 4. TABLA: fixed_expenses (Obligaciones Fijas e Indispensables)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fixed_expenses (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    category_id VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    due_day INTEGER DEFAULT 15,
    target_mode VARCHAR(20) DEFAULT 'QUINCENAL', -- 'QUINCENAL' | 'MENSUAL'
    is_indispensable BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE INDEX IF NOT EXISTS idx_fixed_expenses_user ON fixed_expenses(user_id);

-- ------------------------------------------------------------------------------
-- 5. TABLA: fixed_expense_payments (Historial de Pagos de Obligaciones Fijas)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fixed_expense_payments (
    id VARCHAR(120) PRIMARY KEY,
    fixed_expense_id VARCHAR(100) NOT NULL,
    user_id VARCHAR(100) NOT NULL,
    period_key VARCHAR(50) NOT NULL, -- Ej: '2026-9-QUINCENAL'
    paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fixed_expense_id) REFERENCES fixed_expenses(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(fixed_expense_id, period_key)
);

CREATE INDEX IF NOT EXISTS idx_payments_lookup ON fixed_expense_payments(user_id, period_key);

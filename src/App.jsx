import React, { useState, useEffect } from 'react';
import { UsersDB } from './services/usersDb';
import { FinancesDB } from './services/financesDb';

// Componentes de Navegación
import { Navbar } from './components/Navigation/Navbar';
import { Sidebar } from './components/Navigation/Sidebar';
import { BottomNav } from './components/Navigation/BottomNav';

// Componentes Principales
import { PeriodSelector } from './components/Dashboard/PeriodSelector';
import { BalanceCards } from './components/Dashboard/BalanceCards';
import { FixedExpensesList } from './components/FixedExpenses/FixedExpensesList';
import { TransactionList } from './components/Transactions/TransactionList';
import { ReportsView } from './components/Reports/ReportsView';

// Modales
import { AuthModal } from './components/Auth/AuthModal';
import { AddTransactionModal } from './components/Transactions/AddTransactionModal';
import { ProfileModal } from './components/Profile/ProfileModal';
import { DatabaseModal } from './components/DatabaseInspector/DatabaseModal';

export default function App() {
  // Estado de Usuario y Sesión
  const [currentUser, setCurrentUser] = useState(() => {
    return UsersDB.getActiveSession() || null;
  });

  // Estado del Periodo Financiero Activo (Quincenal / Mensual)
  const [currentPeriod, setCurrentPeriod] = useState(() => {
    const today = new Date();
    return {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      quincena: today.getDate() <= 15 ? '1' : '2' // '1' | '2' | 'ALL'
    };
  });

  // Pestaña Activa ('dashboard' | 'fixed' | 'transactions' | 'reports')
  const [activeTab, setActiveTab] = useState('dashboard');

  // Control de Modales
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDbInspectorOpen, setIsDbInspectorOpen] = useState(false);

  // Control de Tema (Dark por defecto / Light)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('getloss_theme') || 'dark';
  });

  // Contador de actualización de datos
  const [dataVersion, setDataVersion] = useState(0);

  // Efecto para aplicar el tema en el HTML
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('getloss_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleDataChanged = () => {
    setDataVersion(prev => prev + 1);
  };

  const handleLogout = () => {
    UsersDB.logout();
    setCurrentUser(null);
    setIsAuthOpen(true);
  };

  const summary = currentUser
    ? FinancesDB.calculateFinancialSummary(
        currentUser.id,
        currentPeriod.year,
        currentPeriod.month,
        currentPeriod.quincena
      )
    : {
        totalIncome: 0,
        totalExpense: 0,
        netBalance: 0,
        savingsRate: 0,
        fixedPendingAmount: 0,
        totalFixedCommitted: 0,
        transactionsCount: 0
      };

  const fixedList = currentUser ? FinancesDB.getFixedExpenses(currentUser.id) : [];

  return (
    <div className="app-container">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Barra Superior */}
        <Navbar
          user={currentUser}
          theme={theme}
          onToggleTheme={toggleTheme}
          onOpenAuth={() => setIsAuthOpen(true)}
          onLogout={handleLogout}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenDbInspector={() => setIsDbInspectorOpen(true)}
          onOpenAddTx={() => setIsAddTxOpen(true)}
        />

        <div style={{ display: 'flex', flex: 1 }}>
          {/* Barra Lateral Desktop */}
          <Sidebar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            onOpenAddTx={() => setIsAddTxOpen(true)}
            onOpenDbInspector={() => setIsDbInspectorOpen(true)}
            fixedCount={fixedList.length}
          />

          {/* Área de Contenido Principal */}
          <main className="main-wrapper">
            <div className="content-container">
              {/* Selector de Periodo Quincenal / Mensual */}
              {currentUser && (
                <PeriodSelector
                  currentPeriod={currentPeriod}
                  onPeriodChange={setCurrentPeriod}
                />
              )}

              {/* Contenido según la pestaña activa */}
              {!currentUser ? (
                <div style={{
                  textAlign: 'center',
                  padding: '4rem 1.5rem',
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--border-medium)',
                  marginTop: '1.5rem'
                }}>
                  <span className="brand-badge" style={{ justifyContent: 'center', fontSize: '2.5rem', marginBottom: '1rem' }}>
                    <span className="brand-dot" style={{ width: '12px', height: '12px' }} />
                    getloss
                  </span>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                    Control Financiero Quincenal y Mensual
                  </h2>
                  <p style={{ maxWidth: '480px', margin: '0 auto 1.5rem auto', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Inicia sesión o crea una cuenta gratuita para gestionar tus ingresos, gastos fijos indispensables y generar reportes financieros.
                  </p>
                  <button
                    onClick={() => setIsAuthOpen(true)}
                    className="btn-primary"
                    style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}
                  >
                    Ingresar a getloss
                  </button>
                </div>
              ) : activeTab === 'dashboard' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {/* Tarjetas de Balance */}
                  <BalanceCards summary={summary} user={currentUser} />

                  {/* Grid de 2 Columnas: Gastos Indispensables + Movimientos Recientes */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
                    <div>
                      <FixedExpensesList
                        user={currentUser}
                        currentPeriod={currentPeriod}
                        onDataChanged={handleDataChanged}
                      />
                    </div>
                    <div>
                      <TransactionList
                        user={currentUser}
                        currentPeriod={currentPeriod}
                        onDataChanged={handleDataChanged}
                      />
                    </div>
                  </div>
                </div>
              ) : activeTab === 'fixed' ? (
                <div>
                  <FixedExpensesList
                    user={currentUser}
                    currentPeriod={currentPeriod}
                    onDataChanged={handleDataChanged}
                  />
                </div>
              ) : activeTab === 'transactions' ? (
                <div>
                  <TransactionList
                    user={currentUser}
                    currentPeriod={currentPeriod}
                    onDataChanged={handleDataChanged}
                  />
                </div>
              ) : (
                <div>
                  <ReportsView
                    user={currentUser}
                    currentPeriod={currentPeriod}
                  />
                </div>
              )}
            </div>
          </main>
        </div>

        {/* Barra de Navegación Inferior para Móviles */}
        {currentUser && (
          <BottomNav
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            onOpenAddTx={() => setIsAddTxOpen(true)}
          />
        )}
      </div>

      {/* Modales Globales */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          handleDataChanged();
        }}
      />

      {currentUser && (
        <>
          <AddTransactionModal
            isOpen={isAddTxOpen}
            onClose={() => setIsAddTxOpen(false)}
            user={currentUser}
            currentPeriod={currentPeriod}
            onTransactionAdded={handleDataChanged}
          />

          <ProfileModal
            isOpen={isProfileOpen}
            onClose={() => setIsProfileOpen(false)}
            user={currentUser}
            onProfileUpdated={(updated) => {
              setCurrentUser(updated);
              handleDataChanged();
            }}
          />
        </>
      )}

      <DatabaseModal
        isOpen={isDbInspectorOpen}
        onClose={() => setIsDbInspectorOpen(false)}
        onDataReset={handleDataChanged}
      />
    </div>
  );
}

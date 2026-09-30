import React, { useState, useEffect } from 'react';
import { UsersDB } from './services/usersDb';
import { FinancesDB } from './services/financesDb';
import { CloudSync } from './services/cloudSync';
import { useDeviceDetect } from './hooks/useDeviceDetect';
import { usePWAInstall } from './hooks/usePWAInstall';

// Componente de Página de Inicio (Landing Page para usuarios no autenticados)
import { LandingPage } from './components/Landing/LandingPage';

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
import { InstallAppModal } from './components/Common/InstallAppModal';
import { FirebaseConfigModal } from './components/Firebase/FirebaseConfigModal';
import { SqlDatabaseModal } from './components/DatabaseInspector/SqlDatabaseModal';

export default function App() {
  // Detección precisa de dispositivo (PC vs Celular)
  const { isMobile, isDesktop, deviceType, hasTouch } = useDeviceDetect();
  const pwaInstall = usePWAInstall();

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
      mode: 'QUINCENAL' // 'QUINCENAL' | 'MENSUAL'
    };
  });

  // Pestaña Activa ('dashboard' | 'fixed' | 'transactions' | 'reports')
  const [activeTab, setActiveTab] = useState('dashboard');

  // Control de Modales
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialIsLogin, setAuthInitialIsLogin] = useState(true);
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isFirebaseOpen, setIsFirebaseOpen] = useState(false);
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);

  // Control de Tema (Dark por defecto / Light)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('getloss_theme') || 'dark';
  });

  // Contador de actualización de datos
  const [dataVersion, setDataVersion] = useState(0);

  // Efecto para aplicar el tema en el HTML
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-device', deviceType.toLowerCase());
    localStorage.setItem('getloss_theme', theme);
  }, [theme, deviceType]);

  // Sincronización automática de cuentas globales y base de datos SQL al iniciar en cualquier dispositivo
  useEffect(() => {
    const initSync = async () => {
      try {
        // 1. Descargar cuentas registradas desde la nube e indexarlas en SQLite
        await UsersDB.fetchCloudUsers();

        // 2. Si hay un usuario activo, sincronizar sus finanzas más recientes desde la nube
        const active = UsersDB.getActiveSession();
        if (active && active.id) {
          try {
            const liveFinances = await CloudSync.pullFinancesFromCloud(active.id);
            if (liveFinances && FinancesDB && FinancesDB.injectCloudData) {
              FinancesDB.injectCloudData(active.id, liveFinances);
              setDataVersion(v => v + 1);
            }
          } catch {}
        }

        // 3. Reconciliar finanzas locales hacia la nube
        const localUsers = UsersDB.getAllUsers();
        const rawFinances = FinancesDB.getRawDatabase();

        const financesMap = {};
        if (rawFinances && rawFinances.transactions) {
          rawFinances.transactions.forEach(t => {
            if (!financesMap[t.userId]) financesMap[t.userId] = { transactions: [], fixedExpenses: [] };
            financesMap[t.userId].transactions.push(t);
          });
        }
        if (rawFinances && rawFinances.fixedExpenses) {
          rawFinances.fixedExpenses.forEach(f => {
            if (!financesMap[f.userId]) financesMap[f.userId] = { transactions: [], fixedExpenses: [] };
            financesMap[f.userId].fixedExpenses.push(f);
          });
        }

        CloudSync.syncAllLocalUsersToCloud(localUsers, financesMap);
      } catch (e) {
        console.warn('Auto-sync notice:', e.message);
      }
    };

    initSync();
  }, []);

  // Sincronización en Tiempo Real Multi-Dispositivo con Firebase
  useEffect(() => {
    if (!currentUser) return;
    const unsubscribe = FinancesDB.subscribeLiveUpdates(currentUser.id, () => {
      handleDataChanged();
    });
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [currentUser]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleDataChanged = () => {
    setDataVersion(prev => prev + 1);
  };

  const handleOpenAuth = (isLogin = true) => {
    setAuthInitialIsLogin(isLogin);
    setIsAuthOpen(true);
  };

  const handleLogout = () => {
    UsersDB.logout();
    setCurrentUser(null);
  };

  const summary = currentUser
    ? FinancesDB.calculateFinancialSummary(
        currentUser.id,
        currentPeriod.year,
        currentPeriod.month,
        currentPeriod.mode
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

  // Si no hay usuario autenticado, mostramos la Landing Page como primera página
  if (!currentUser) {
    return (
      <div data-device={deviceType.toLowerCase()} data-touch={hasTouch ? 'true' : 'false'}>
        <LandingPage
          onOpenAuth={handleOpenAuth}
          onToggleTheme={toggleTheme}
          theme={theme}
          detectedDevice={deviceType}
          onOpenInstall={() => setIsInstallModalOpen(true)}
          pwaInstall={pwaInstall}
        />

        <AuthModal
          isOpen={isAuthOpen}
          initialIsLogin={authInitialIsLogin}
          onClose={() => setIsAuthOpen(false)}
          onAuthSuccess={(user) => {
            setCurrentUser(user);
            handleDataChanged();
          }}
        />

        <InstallAppModal
          isOpen={isInstallModalOpen}
          onClose={() => setIsInstallModalOpen(false)}
          pwaInstall={pwaInstall}
        />
      </div>
    );
  }

  // Si el usuario ha iniciado sesión, mostramos la Aplicación Financiera Completa
  return (
    <div className="app-container" data-device={deviceType.toLowerCase()} data-touch={hasTouch ? 'true' : 'false'}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Barra Superior */}
        <Navbar
          user={currentUser}
          theme={theme}
          onToggleTheme={toggleTheme}
          onOpenAuth={() => handleOpenAuth(true)}
          onLogout={handleLogout}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenAddTx={() => setIsAddTxOpen(true)}
          onOpenDatabase={() => setIsFirebaseOpen(true)}
          onOpenSql={() => setIsSqlModalOpen(true)}
          isMobile={isMobile}
        />

        <div style={{ display: 'flex', flex: 1 }}>
          {/* Barra Lateral Desktop (mostrada automáticamente en PC) */}
          <Sidebar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            onOpenAddTx={() => setIsAddTxOpen(true)}
            fixedCount={fixedList.length}
          />

          {/* Área de Contenido Principal */}
          <main className="main-wrapper" style={{
            paddingBottom: isMobile ? 'calc(5.5rem + env(safe-area-inset-bottom, 0px))' : '2rem'
          }}>

            <div className="content-container">
              {/* Botón de Atrás si no está en Dashboard */}
              {activeTab !== 'dashboard' && (
                <div style={{ marginBottom: '1rem' }}>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="btn-secondary"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.45rem 0.9rem',
                      fontSize: '0.825rem',
                      borderRadius: 'var(--radius-md)'
                    }}
                  >
                    <span>← Atrás / Volver al Panel</span>
                  </button>
                </div>
              )}

              {/* Selector de Periodo Quincenal / Mensual */}
              <PeriodSelector
                currentPeriod={currentPeriod}
                onPeriodChange={setCurrentPeriod}
              />

              {/* Contenido según la pestaña activa */}
              {activeTab === 'dashboard' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {/* Tarjetas de Balance */}
                  <BalanceCards summary={summary} user={currentUser} onSelectTab={setActiveTab} />

                  {/* Grid de 2 Columnas Responsivo: Gastos Indispensables + Movimientos Recientes */}
                  <div className="dashboard-main-grid">
                    <div style={{ minWidth: 0, width: '100%' }}>
                      <FixedExpensesList
                        user={currentUser}
                        currentPeriod={currentPeriod}
                        onDataChanged={handleDataChanged}
                      />
                    </div>
                    <div style={{ minWidth: 0, width: '100%' }}>
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
        <BottomNav
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onOpenAddTx={() => setIsAddTxOpen(true)}
        />
      </div>

      {/* Modales Globales */}
      <AuthModal
        isOpen={isAuthOpen}
        initialIsLogin={authInitialIsLogin}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          handleDataChanged();
        }}
      />

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
        onOpenFirebase={() => setIsFirebaseOpen(true)}
        onOpenSql={() => setIsSqlModalOpen(true)}
        onProfileUpdated={(updated) => {
          setCurrentUser(updated);
          handleDataChanged();
        }}
        onDeleteAccount={() => {
          setCurrentUser(null);
          setIsProfileOpen(false);
          handleDataChanged();
        }}
      />

      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        pwaInstall={pwaInstall}
      />

      <FirebaseConfigModal
        isOpen={isFirebaseOpen}
        onClose={() => setIsFirebaseOpen(false)}
      />

      <SqlDatabaseModal
        isOpen={isSqlModalOpen}
        onClose={() => setIsSqlModalOpen(false)}
        currentUser={currentUser}
      />
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { SqlDatabase, SQL_SCHEMA_DDL } from '../../services/sqlDatabase';
import {
  Database,
  Terminal,
  Table as TableIcon,
  Download,
  Play,
  Copy,
  Check,
  X,
  FileCode,
  Sparkles,
  RefreshCw,
  Search,
  Code
} from 'lucide-react';

export const SqlDatabaseModal = ({ isOpen, onClose, currentUser }) => {
  const [activeTab, setActiveTab] = useState('tables'); // 'tables' | 'console' | 'export'
  const [selectedTable, setSelectedTable] = useState('users');
  const [tableData, setTableData] = useState({ columns: [], records: [] });
  const [tableCounts, setTableCounts] = useState({});

  // Consola SQL
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM users;');
  const [queryResult, setQueryResult] = useState(null);
  const [queryError, setQueryError] = useState('');
  const [executing, setExecuting] = useState(false);
  const [executionTime, setExecutionTime] = useState(0);

  // Exportación
  const [sqlDump, setSqlDump] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadTableData(selectedTable);
      refreshCounts();
      loadSqlDump();
    }
  }, [isOpen, selectedTable]);

  if (!isOpen) return null;

  const refreshCounts = async () => {
    try {
      const tables = ['users', 'transactions', 'fixed_expenses', 'categories', 'fixed_expense_payments'];
      const counts = {};
      for (const t of tables) {
        try {
          const res = await SqlDatabase.executeSql(`SELECT COUNT(*) as count FROM ${t};`);
          counts[t] = res.records[0]?.count || 0;
        } catch {
          counts[t] = 0;
        }
      }
      setTableCounts(counts);
    } catch {}
  };

  const loadTableData = async (tableName) => {
    try {
      const res = await SqlDatabase.executeSql(`SELECT * FROM ${tableName} LIMIT 100;`);
      setTableData(res);
    } catch (e) {
      console.warn('Error al cargar tabla SQL:', e);
    }
  };

  const handleExecuteQuery = async (customQuery = null) => {
    const queryToRun = customQuery || sqlQuery;
    setExecuting(true);
    setQueryError('');
    setQueryResult(null);
    const start = performance.now();
    try {
      const result = await SqlDatabase.executeSql(queryToRun);
      setExecutionTime(Math.round((performance.now() - start) * 10) / 10);
      setQueryResult(result);
      refreshCounts();
    } catch (err) {
      setQueryError(err.message || 'Error al ejecutar sentencia SQL.');
    } finally {
      setExecuting(false);
    }
  };

  const loadSqlDump = async () => {
    try {
      const dump = await SqlDatabase.exportSqlDump();
      setSqlDump(dump);
    } catch {}
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlDump);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSql = () => {
    SqlDatabase.downloadSqlFile();
  };

  const querySnippets = [
    { label: 'Ver Usuarios y Contraseñas', query: 'SELECT id, email, password_hash, full_name, currency, created_at FROM users;' },
    { label: 'Balance por Tipo de Movimiento', query: 'SELECT type, COUNT(*) as cantidad, SUM(amount) as total FROM transactions GROUP BY type;' },
    { label: 'Transacciones con Categoría (JOIN)', query: 'SELECT t.title, t.amount, t.type, c.name as categoria, t.date FROM transactions t LEFT JOIN categories c ON t.category_id = c.id ORDER BY t.date DESC LIMIT 20;' },
    { label: 'Gastos Fijos y Pagos', query: 'SELECT f.name, f.amount, f.due_day, p.period_key, p.paid_at FROM fixed_expenses f LEFT JOIN fixed_expense_payments p ON f.id = p.fixed_expense_id;' }
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(16px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.25s ease-out'
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '920px',
          height: '85vh',
          maxHeight: '800px',
          background: 'linear-gradient(145deg, #18181b 0%, #09090b 100%)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.95), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
          position: 'relative',
          color: '#ffffff',
          overflow: 'hidden'
        }}
      >
        {/* Barra Superior */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ffffff 0%, #71717a 100%)',
              color: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '900'
            }}>
              <Database size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0 }}>Base de Datos Relacional SQL</h3>
                <span style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem', borderRadius: '9999px', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#22c55e', fontWeight: '700' }}>
                  SQLite 3 WASM Activo
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#86868b', margin: 0 }}>
                Tablas relacionales: users, categories, transactions, fixed_expenses
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* Pestañas de Navegación */}
            <div style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.06)',
              padding: '0.25rem',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <button
                type="button"
                onClick={() => setActiveTab('tables')}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '7px',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: activeTab === 'tables' ? '#ffffff' : 'transparent',
                  color: activeTab === 'tables' ? '#000000' : 'var(--text-muted)'
                }}
              >
                <TableIcon size={13} />
                <span>Tablas</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('console')}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '7px',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: activeTab === 'console' ? '#ffffff' : 'transparent',
                  color: activeTab === 'console' ? '#000000' : 'var(--text-muted)'
                }}
              >
                <Terminal size={13} />
                <span>Consola SQL</span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('export'); loadSqlDump(); }}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '7px',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: activeTab === 'export' ? '#ffffff' : 'transparent',
                  color: activeTab === 'export' ? '#000000' : 'var(--text-muted)'
                }}
              >
                <FileCode size={13} />
                <span>Script .SQL</span>
              </button>
            </div>

            <button
              onClick={onClose}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#a1a1aa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Contenido Principal */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.75rem', display: 'flex', flexDirection: 'column' }}>

          {/* ------------------------------------------------------------- */}
          {/* PESTAÑA 1: EXPLORADOR DE TABLAS SQL                           */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'tables' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
              {/* Selector de Tablas */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {[
                  { id: 'users', label: 'users (Usuarios)' },
                  { id: 'transactions', label: 'transactions (Movimientos)' },
                  { id: 'fixed_expenses', label: 'fixed_expenses (Obligaciones)' },
                  { id: 'categories', label: 'categories (Categorías)' },
                  { id: 'fixed_expense_payments', label: 'fixed_expense_payments (Pagos)' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTable(t.id)}
                    style={{
                      padding: '0.45rem 0.85rem',
                      borderRadius: '10px',
                      border: '1px solid',
                      borderColor: selectedTable === t.id ? '#ffffff' : 'rgba(255, 255, 255, 0.1)',
                      background: selectedTable === t.id ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                      color: selectedTable === t.id ? '#ffffff' : 'var(--text-muted)',
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>{t.label}</span>
                    <span style={{
                      fontSize: '0.68rem',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '9999px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#ffffff'
                    }}>
                      {tableCounts[t.id] ?? 0}
                    </span>
                  </button>
                ))}

                <button
                  onClick={() => { refreshCounts(); loadTableData(selectedTable); }}
                  title="Refrescar datos de la tabla"
                  style={{
                    padding: '0.45rem 0.65rem',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    color: '#a1a1aa',
                    cursor: 'pointer'
                  }}
                >
                  <RefreshCw size={14} />
                </button>
              </div>

              {/* Vista de Registros de la Tabla */}
              <div style={{
                flex: 1,
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                overflow: 'auto',
                minHeight: '260px'
              }}>
                {tableData.records.length === 0 ? (
                  <div style={{ padding: '3rem', textAlign: 'center', color: '#71717a' }}>
                    <TableIcon size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                    <p style={{ margin: 0, fontSize: '0.85rem' }}>No hay registros en la tabla <code>{selectedTable}</code>.</p>
                  </div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255, 255, 255, 0.06)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        {tableData.columns.map(col => (
                          <th key={col} style={{ padding: '0.6rem 0.8rem', textAlign: 'left', fontWeight: '700', color: '#e4e4e7', whiteSpace: 'nowrap' }}>
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.records.map((row, idx) => (
                        <tr
                          key={idx}
                          style={{
                            borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                            background: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.015)'
                          }}
                        >
                          {tableData.columns.map(col => (
                            <td
                              key={col}
                              style={{
                                padding: '0.55rem 0.8rem',
                                color: col === 'id' || col === 'user_id' ? '#a1a1aa' : (col === 'password_hash' ? '#22c55e' : '#ffffff'),
                                maxWidth: '240px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                              title={String(row[col])}
                            >
                              {String(row[col] ?? 'NULL')}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* PESTAÑA 2: CONSOLA SQL INTERACTIVA                           */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'console' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
              {/* Snippets rápidos */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {querySnippets.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSqlQuery(s.query);
                      handleExecuteQuery(s.query);
                    }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#e4e4e7',
                      borderRadius: '8px',
                      padding: '0.35rem 0.65rem',
                      fontSize: '0.72rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <Code size={11} color="#a1a1aa" />
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>

              {/* Editor de consulta */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <textarea
                  value={sqlQuery}
                  onChange={e => setSqlQuery(e.target.value)}
                  placeholder="Escribe tu consulta SQL aquí (ej: SELECT * FROM users;)"
                  rows={4}
                  style={{
                    width: '100%',
                    background: 'rgba(0, 0, 0, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    padding: '0.75rem',
                    color: '#22c55e',
                    fontFamily: 'monospace',
                    fontSize: '0.825rem',
                    lineHeight: '1.4',
                    resize: 'vertical'
                  }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: '#71717a' }}>
                    Soporta sentencias estándar SQLite: SELECT, INSERT, UPDATE, DELETE, JOIN, GROUP BY
                  </span>

                  <button
                    type="button"
                    onClick={() => handleExecuteQuery()}
                    disabled={executing}
                    style={{
                      background: '#ffffff',
                      color: '#000000',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '0.5rem 1.25rem',
                      fontSize: '0.8rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <Play size={13} fill="#000000" />
                    <span>{executing ? 'Ejecutando...' : 'Ejecutar SQL'}</span>
                  </button>
                </div>
              </div>

              {/* Mensaje de Error */}
              {queryError && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '10px',
                  padding: '0.65rem 0.85rem',
                  fontSize: '0.75rem',
                  color: '#f87171',
                  fontFamily: 'monospace'
                }}>
                  Error: {queryError}
                </div>
              )}

              {/* Resultados */}
              {queryResult && (
                <div style={{
                  flex: 1,
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  overflow: 'auto',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{
                    padding: '0.5rem 0.85rem',
                    background: 'rgba(255, 255, 255, 0.04)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    fontSize: '0.72rem',
                    color: '#a1a1aa',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span>Filas devueltas: <strong>{queryResult.records.length}</strong></span>
                    <span>Tiempo de ejecución: <strong>{executionTime} ms</strong></span>
                  </div>

                  <div style={{ flex: 1, overflow: 'auto' }}>
                    {queryResult.records.length === 0 ? (
                      <div style={{ padding: '2rem', textAlign: 'center', color: '#71717a', fontSize: '0.8rem' }}>
                        Consulta ejecutada correctamente. Cero registros devueltos.
                      </div>
                    ) : (
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                        <thead>
                          <tr style={{ background: 'rgba(255, 255, 255, 0.04)' }}>
                            {queryResult.columns.map(col => (
                              <th key={col} style={{ padding: '0.5rem 0.75rem', textAlign: 'left', fontWeight: '700', color: '#e4e4e7', whiteSpace: 'nowrap' }}>
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {queryResult.records.map((row, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                              {queryResult.columns.map(col => (
                                <td key={col} style={{ padding: '0.45rem 0.75rem', color: '#ffffff', whiteSpace: 'nowrap' }}>
                                  {String(row[col] ?? 'NULL')}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* PESTAÑA 3: EXPORTACIÓN Y SCRIPT SQL                           */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'export' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '800' }}>Script de Base de Datos Completo (.SQL)</h4>
                  <p style={{ margin: 0, fontSize: '0.72rem', color: '#86868b' }}>
                    Contiene el esquema DDL y todos los INSERT INTO de usuarios, contraseñas, categorías y finanzas.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={handleCopySql}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      borderRadius: '10px',
                      padding: '0.5rem 0.9rem',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    {copied ? <Check size={14} color="#22c55e" /> : <Copy size={14} />}
                    <span>{copied ? '¡Copiado!' : 'Copiar SQL'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadSql}
                    style={{
                      background: '#ffffff',
                      border: 'none',
                      color: '#000000',
                      borderRadius: '10px',
                      padding: '0.5rem 1rem',
                      fontSize: '0.75rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <Download size={14} />
                    <span>Descargar .SQL</span>
                  </button>
                </div>
              </div>

              <textarea
                readOnly
                value={sqlDump}
                style={{
                  flex: 1,
                  background: 'rgba(0, 0, 0, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '1rem',
                  color: '#e4e4e7',
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  lineHeight: '1.4',
                  resize: 'none'
                }}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

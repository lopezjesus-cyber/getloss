/**
 * getloss - Base de Datos de Usuarios y Autenticación (getloss_users_db)
 * Administra la seguridad, registros, contraseñas, sesiones y preferencias de usuario reales.
 */

const USERS_STORAGE_KEY = 'getloss_users_db_v1';
const SESSION_STORAGE_KEY = 'getloss_active_session_v1';

export const UsersDB = {
  // Obtener todos los usuarios registrados
  getAllUsers: () => {
    try {
      const data = localStorage.getItem(USERS_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([]));
        return [];
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error al leer Base de Datos de Usuarios:', e);
      return [];
    }
  },

  // Guardar lista de usuarios
  _saveUsers: (users) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  },

  // Registrar nuevo usuario
  register: (userData) => {
    const users = UsersDB.getAllUsers();
    const existing = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    
    if (existing) {
      throw new Error('Ya existe una cuenta registrada con este correo electrónico.');
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      email: userData.email.trim(),
      fullName: userData.fullName.trim(),
      passwordHash: userData.password,
      phone: userData.phone || '',
      avatar: userData.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userData.fullName)}`,
      currency: userData.currency || 'USD',
      currencySymbol: (userData.currency === 'EUR' ? '€' : userData.currency === 'GBP' ? '£' : userData.currency === 'PEN' ? 'S/' : userData.currency === 'CAD' ? 'C$' : '$'),
      payFrequency: userData.payFrequency || 'QUINCENAL',
      payDayFirst: 15,
      payDaySecond: 30,
      monthlyIncomeGoal: Number(userData.monthlyIncomeGoal) || 2000,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    UsersDB._saveUsers(users);
    
    // Iniciar sesión automáticamente tras registro
    UsersDB.setActiveSession(newUser);
    return newUser;
  },

  // Iniciar sesión
  login: (email, password) => {
    const users = UsersDB.getAllUsers();
    const user = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === password
    );

    if (!user) {
      throw new Error('Credenciales inválidas. Verifica tu correo y contraseña.');
    }

    UsersDB.setActiveSession(user);
    return user;
  },

  // Obtener sesión activa
  getActiveSession: () => {
    try {
      const session = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!session) return null;
      const user = JSON.parse(session);
      const users = UsersDB.getAllUsers();
      return users.find(u => u.id === user.id) || null;
    } catch {
      return null;
    }
  },

  // Establecer sesión activa
  setActiveSession: (user) => {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
  },

  // Cerrar sesión
  logout: () => {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  },

  // Actualizar perfil de usuario
  updateProfile: (userId, updates) => {
    const users = UsersDB.getAllUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) throw new Error('Usuario no encontrado');

    users[index] = { ...users[index], ...updates };
    UsersDB._saveUsers(users);

    const active = UsersDB.getActiveSession();
    if (active && active.id === userId) {
      UsersDB.setActiveSession(users[index]);
    }
    return users[index];
  },

  // Eliminar Cuenta de Usuario
  deleteUser: (userId) => {
    const users = UsersDB.getAllUsers();
    const filtered = users.filter(u => u.id !== userId);
    UsersDB._saveUsers(filtered);

    const active = UsersDB.getActiveSession();
    if (active && active.id === userId) {
      UsersDB.logout();
    }
    return true;
  },

  // Limpiar Base de Datos de Usuarios
  resetDatabase: () => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([]));
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return [];
  }
};

import { CloudStore } from './lib/cloudStore.js';

export default async function handler(req, res) {
  // Configuración de Cabeceras CORS para permitir peticiones desde PC, Celular y PWA
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { action } = req.query;

  try {
    // 1. REGISTRO DE USUARIO EN LA NUBE
    if (req.method === 'POST' && action === 'register') {
      const userData = req.body || {};
      const { email, password, fullName, phone, currency, payFrequency, monthlyIncomeGoal } = userData;

      if (!email || !password || !fullName) {
        return res.status(400).json({ success: false, error: 'Faltan campos obligatorios para el registro.' });
      }

      const users = await CloudStore.getUsers();
      const existing = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

      if (existing) {
        return res.status(409).json({ success: false, error: 'Ya existe una cuenta registrada con este correo electrónico.' });
      }

      const newUser = {
        id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        email: email.trim().toLowerCase(),
        fullName: fullName.trim(),
        passwordHash: password,
        phone: phone || '',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName.trim())}`,
        currency: currency || 'USD',
        currencySymbol: (currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'PEN' ? 'S/' : currency === 'CAD' ? 'C$' : '$'),
        payFrequency: payFrequency || 'QUINCENAL',
        payDayFirst: 15,
        payDaySecond: 30,
        monthlyIncomeGoal: Number(monthlyIncomeGoal) || 2000,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      await CloudStore.saveUsers(users);

      return res.status(201).json({ success: true, user: newUser });
    }

    // 2. INICIO DE SESIÓN EN LA NUBE (DESDE PC O CELULAR)
    if (req.method === 'POST' && action === 'login') {
      const { email, password } = req.body || {};

      if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Ingresa tu correo y contraseña.' });
      }

      const users = await CloudStore.getUsers();
      const user = users.find(
        u => u.email.toLowerCase() === email.trim().toLowerCase() && u.passwordHash === password
      );

      if (!user) {
        return res.status(401).json({ success: false, error: 'Credenciales inválidas. Verifica tu correo y contraseña.' });
      }

      // También traer finanzas del usuario sincronizadas
      const finances = await CloudStore.getUserFinances(user.id);

      return res.status(200).json({ success: true, user, finances });
    }

    // 3. ACTUALIZACIÓN DE PERFIL EN LA NUBE
    if (req.method === 'POST' && action === 'update-profile') {
      const { userId, updates } = req.body || {};

      if (!userId) {
        return res.status(400).json({ success: false, error: 'Falta userId' });
      }

      const users = await CloudStore.getUsers();
      const index = users.findIndex(u => u.id === userId);

      if (index === -1) {
        return res.status(404).json({ success: false, error: 'Usuario no encontrado en la nube.' });
      }

      users[index] = { ...users[index], ...updates };
      await CloudStore.saveUsers(users);

      return res.status(200).json({ success: true, user: users[index] });
    }

    // 4. ELIMINACIÓN DE CUENTA
    if (req.method === 'POST' && action === 'delete-account') {
      const { userId } = req.body || {};
      const users = await CloudStore.getUsers();
      const filtered = users.filter(u => u.id !== userId);
      await CloudStore.saveUsers(filtered);
      return res.status(200).json({ success: true, message: 'Cuenta eliminada exitosamente' });
    }

    // 5. CONSULTA DE USUARIOS (SYNC)
    if (req.method === 'GET') {
      const users = await CloudStore.getUsers();
      return res.status(200).json({ success: true, usersCount: users.length });
    }

    return res.status(404).json({ error: 'Ruta no encontrada' });
  } catch (error) {
    console.error('Error en /api/auth:', error);
    return res.status(500).json({ success: false, error: error.message || 'Error interno del servidor en la nube.' });
  }
}

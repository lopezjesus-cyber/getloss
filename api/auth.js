import { CloudStore } from './_lib/cloudStore.js';

export default async function handler(req, res) {
  // Configuración de Cabeceras CORS universal para PC, Móvil, localhost y Vercel
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  if (origin !== '*') {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
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

  let bodyData = {};
  try {
    bodyData = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  } catch {
    bodyData = req.body || {};
  }

  try {
    // 1. REGISTRO DE USUARIO EN LA NUBE
    if (req.method === 'POST' && action === 'register') {
      const { email, password, fullName, phone, currency, payFrequency, monthlyIncomeGoal } = bodyData;

      if (!email || !password || !fullName) {
        return res.status(400).json({ success: false, error: 'Faltan campos obligatorios para el registro.' });
      }

      const cleanEmail = email.trim().toLowerCase();
      const users = await CloudStore.getUsers();
      const existingIndex = users.findIndex(u => (u.email || '').toLowerCase() === cleanEmail);

      if (existingIndex >= 0) {
        const existing = users[existingIndex];
        // Si la contraseña coincide, actualizar datos y devolver usuario existente
        if (existing.passwordHash === password || existing.password === password) {
          const updatedUser = {
            ...existing,
            fullName: fullName ? fullName.trim() : existing.fullName,
            phone: phone !== undefined ? phone : existing.phone,
            currency: currency || existing.currency || 'USD',
            currencySymbol: (currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'PEN' ? 'S/' : currency === 'CAD' ? 'C$' : (existing.currencySymbol || '$')),
            payFrequency: payFrequency || existing.payFrequency || 'QUINCENAL',
            monthlyIncomeGoal: Number(monthlyIncomeGoal) || existing.monthlyIncomeGoal || 2000,
            updatedAt: new Date().toISOString()
          };
          users[existingIndex] = updatedUser;
          await CloudStore.saveUsers(users);
          const finances = await CloudStore.getUserFinances(updatedUser.id);
          return res.status(200).json({ success: true, user: updatedUser, finances });
        }

        return res.status(409).json({
          success: false,
          error: 'Ya existe una cuenta registrada con este correo electrónico. Inicia sesión con tu contraseña.'
        });
      }

      const cleanId = `usr_${cleanEmail.replace(/[^a-z0-9]/g, '_')}`;

      const newUser = {
        id: cleanId,
        email: cleanEmail,
        fullName: fullName.trim(),
        passwordHash: password,
        password: password,
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

      // Inicializar finanzas vacías en la nube
      await CloudStore.saveUserFinances(newUser.id, {
        transactions: [],
        fixedExpenses: [],
        lastSync: new Date().toISOString()
      });

      return res.status(201).json({ success: true, user: newUser });
    }

    // 2. INICIO DE SESIÓN EN LA NUBE (DESDE PC O CELULAR)
    if (req.method === 'POST' && action === 'login') {
      const { email, password } = bodyData;

      if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Ingresa tu correo y contraseña.' });
      }

      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();

      const users = await CloudStore.getUsers();
      const user = users.find(
        u => u.email.toLowerCase() === cleanEmail && (u.passwordHash === cleanPassword || u.password === cleanPassword)
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
      const { userId, updates } = bodyData;

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
      const { userId } = bodyData;
      const users = await CloudStore.getUsers();
      const filtered = users.filter(u => u.id !== userId);
      await CloudStore.saveUsers(filtered);
      return res.status(200).json({ success: true, message: 'Cuenta eliminada exitosamente' });
    }

    // 5. CONSULTA DE USUARIOS (SYNC)
    if (req.method === 'GET') {
      const users = await CloudStore.getUsers();
      return res.status(200).json({ success: true, usersCount: users.length, users });
    }

    return res.status(404).json({ error: 'Ruta no encontrada' });
  } catch (error) {
    console.error('Error en /api/auth:', error);
    return res.status(500).json({ success: false, error: error.message || 'Error interno del servidor en la nube.' });
  }
}

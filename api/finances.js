import { CloudStore } from './lib/cloudStore.js';

export default async function handler(req, res) {
  // CORS Headers
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

  const { action, userId } = req.query;

  try {
    // 1. OBTENER FINANZAS DEL USUARIO (PULL SYNC)
    if (req.method === 'GET') {
      if (!userId) {
        return res.status(400).json({ success: false, error: 'Falta parámetro userId' });
      }

      const finances = await CloudStore.getUserFinances(userId);
      return res.status(200).json({ success: true, finances });
    }

    // 2. SINCRONIZAR TODA LA BASE DE DATOS DEL USUARIO (PUSH SYNC)
    if (req.method === 'POST' && action === 'sync') {
      let bodyData = {};
      try {
        bodyData = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      } catch {
        bodyData = req.body || {};
      }

      const { userId: bodyUserId, fixedExpenses, transactions } = bodyData;
      const targetUserId = userId || bodyUserId;

      if (!targetUserId) {
        return res.status(400).json({ success: false, error: 'Falta parámetro userId' });
      }

      const syncData = {
        fixedExpenses: Array.isArray(fixedExpenses) ? fixedExpenses : [],
        transactions: Array.isArray(transactions) ? transactions : [],
        lastSync: new Date().toISOString()
      };

      await CloudStore.saveUserFinances(targetUserId, syncData);
      return res.status(200).json({ success: true, finances: syncData });
    }

    return res.status(404).json({ error: 'Acción no encontrada' });
  } catch (error) {
    console.error('Error en /api/finances:', error);
    return res.status(500).json({ success: false, error: error.message || 'Error al procesar finanzas en la nube.' });
  }
}

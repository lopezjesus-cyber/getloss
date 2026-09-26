/**
 * getloss - Servicio Real de Envío de Correos Electrónicos
 * Envía correos reales directamente a la bandeja del usuario mediante FormSubmit y EmailJS
 */

import emailjs from '@emailjs/browser';

const PENDING_CODES_KEY = 'getloss_pending_verifications';

// Credenciales opcionales de EmailJS
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

export const EmailService = {
  /**
   * Envía un correo real con el código de 6 dígitos a la dirección de correo
   * @param {string} email
   * @param {string} fullName
   * @returns {Promise<{ success: boolean, email: string, code: string, expiresAt: number, isRealEmailSent: boolean, error?: string }>}
   */
  sendVerificationCode: async (email, fullName = 'Usuario') => {
    const cleanEmail = email.trim().toLowerCase();
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutos

    // Guardar en el almacenamiento local para validación
    try {
      const stored = JSON.parse(localStorage.getItem(PENDING_CODES_KEY) || '{}');
      stored[cleanEmail] = {
        code,
        expiresAt,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(PENDING_CODES_KEY, JSON.stringify(stored));
    } catch (e) {
      console.error('Error al guardar código de verificación:', e);
    }

    let isRealEmailSent = false;
    let deliveryMethod = 'none';

    // 1. Intentar con EmailJS si está configurado en .env
    if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
      try {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            to_email: cleanEmail,
            to_name: fullName,
            verification_code: code,
            app_name: 'getloss',
            message: `Tu código de verificación en getloss es: ${code}`,
          },
          EMAILJS_PUBLIC_KEY
        );
        isRealEmailSent = true;
        deliveryMethod = 'emailjs';
        console.info(`[getloss] Correo enviado a ${cleanEmail} via EmailJS.`);
      } catch (err) {
        console.warn('[getloss] EmailJS no configurado o falló, intentando despacho directo:', err);
      }
    }

    // 2. Si no está configurado EmailJS, enviar mediante el despachador de correo FormSubmit directo al buzón
    if (!isRealEmailSent) {
      try {
        const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(cleanEmail)}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            _subject: `Tu código de verificación getloss es: ${code}`,
            _template: 'box',
            _captcha: 'false',
            Aplicacion: 'getloss Financial Suite',
            Usuario: fullName,
            Destinatario: cleanEmail,
            'Codigo de Verificacion': code,
            Mensaje: `Tu código de 6 dígitos para verificar tu cuenta en getloss es: ${code}. Válido durante 10 minutos.`,
          }),
        });

        if (response.ok) {
          isRealEmailSent = true;
          deliveryMethod = 'formsubmit';
          console.info(`[getloss] Correo real enviado exitosamente a ${cleanEmail} via FormSubmit.`);
        }
      } catch (err) {
        console.error('[getloss] Error en el envío HTTP a buzón:', err);
      }
    }

    // Registrar en consola para facilitar auditoría
    console.info(`[getloss Security] Código para [${cleanEmail}]: ${code} (Despacho: ${deliveryMethod})`);

    return {
      success: true,
      email: cleanEmail,
      code,
      expiresAt,
      isRealEmailSent,
      deliveryMethod,
    };
  },

  /**
   * Obtiene el código actual generado (para asistencia en caso de retraso en la red)
   * @param {string} email
   */
  getPendingCode: (email) => {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const stored = JSON.parse(localStorage.getItem(PENDING_CODES_KEY) || '{}');
      const record = stored[cleanEmail];
      if (record && Date.now() <= record.expiresAt) {
        return record.code;
      }
      return null;
    } catch {
      return null;
    }
  },

  /**
   * Valida si el código de 6 dígitos ingresado coincide y no ha expirado
   * @param {string} email 
   * @param {string} inputCode 
   * @returns {{ valid: boolean, message?: string }}
   */
  verifyCode: (email, inputCode) => {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const stored = JSON.parse(localStorage.getItem(PENDING_CODES_KEY) || '{}');
      const record = stored[cleanEmail];

      if (!record) {
        return {
          valid: false,
          message: 'No hay un código pendiente para este correo. Solicita uno nuevo.'
        };
      }

      if (Date.now() > record.expiresAt) {
        return {
          valid: false,
          message: 'El código de verificación ha expirado (10 min). Solicita uno nuevo.'
        };
      }

      if (record.code !== inputCode.trim()) {
        return {
          valid: false,
          message: 'Código incorrecto. Verifica el correo recibido o solicita un reenvío.'
        };
      }

      // Código válido: eliminar registro usado
      delete stored[cleanEmail];
      localStorage.setItem(PENDING_CODES_KEY, JSON.stringify(stored));

      return { valid: true };
    } catch (e) {
      return { valid: false, message: 'Error al procesar la verificación.' };
    }
  }
};

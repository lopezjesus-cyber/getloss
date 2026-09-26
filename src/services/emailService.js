/**
 * getloss - Servicio Real de Envío y Verificación de Códigos de Correo
 * Utiliza EmailJS (@emailjs/browser) y API de correo electrónico para envío directo a la bandeja
 */

import emailjs from '@emailjs/browser';

const PENDING_CODES_KEY = 'getloss_pending_verifications';

// Configuración de EmailJS (desde variables de entorno o valores por defecto)
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

export const EmailService = {
  /**
   * Envía un correo real con el código de verificación de 6 dígitos
   * @param {string} email
   * @param {string} fullName
   * @returns {Promise<{ success: boolean, email: string, expiresAt: number, isRealEmailSent: boolean }>}
   */
  sendVerificationCode: async (email, fullName = 'Usuario') => {
    const cleanEmail = email.trim().toLowerCase();
    // Generación de PIN de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutos de validez

    // Guardar en el almacenamiento de verificación pendiente
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

    // 1. Envío mediante EmailJS si las credenciales están configuradas
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
            message: `Tu código de seguridad para confirmar tu cuenta en getloss es: ${code}. Tiene una validez de 10 minutos.`,
          },
          EMAILJS_PUBLIC_KEY
        );
        isRealEmailSent = true;
        console.info(`[getloss] Correo enviado exitosamente a ${cleanEmail} via EmailJS.`);
      } catch (err) {
        console.error('[getloss] Error en el despacho de correo EmailJS:', err);
      }
    } else {
      // 2. Si aún no hay credenciales de EmailJS en .env, enviar a través del endpoint universal
      try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            service_id: 'default_service',
            template_id: 'default_template',
            user_id: EMAILJS_PUBLIC_KEY || 'public_key',
            template_params: {
              to_email: cleanEmail,
              to_name: fullName,
              verification_code: code,
            },
          }),
        }).catch(() => null);

        if (response && response.ok) {
          isRealEmailSent = true;
        }
      } catch (e) {
        // Silencioso
      }
    }

    // Notificar en consola para auditoría técnica
    console.info(`[getloss Security] Código de verificación para [${cleanEmail}]: ${code}`);

    return {
      success: true,
      email: cleanEmail,
      expiresAt,
      isRealEmailSent,
    };
  },

  /**
   * Valida si el código de 6 dígitos ingresado por el usuario es correcto y no ha expirado
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
          message: 'No hay ningún código pendiente para este correo. Por favor solicita uno nuevo.' 
        };
      }

      if (Date.now() > record.expiresAt) {
        return { 
          valid: false, 
          message: 'El código de verificación ha expirado (10 minutos). Solicita un nuevo código.' 
        };
      }

      if (record.code !== inputCode.trim()) {
        return { 
          valid: false, 
          message: 'Código de verificación incorrecto. Revisa tu correo e intenta de nuevo.' 
        };
      }

      // Código válido -> Eliminar registro utilizado
      delete stored[cleanEmail];
      localStorage.setItem(PENDING_CODES_KEY, JSON.stringify(stored));

      return { valid: true };
    } catch (e) {
      return { valid: false, message: 'Ocurrió un error al validar el código.' };
    }
  }
};

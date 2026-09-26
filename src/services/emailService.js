/**
 * getloss - Servicio de Envío y Verificación de Códigos al Correo
 * Gestiona generación de tokens de 6 dígitos con expiración y validación
 */

const PENDING_CODES_KEY = 'getloss_pending_verifications';

export const EmailService = {
  /**
   * Genera y simula el envío del código de verificación al correo
   * @param {string} email
   * @returns {{ success: boolean, email: string, code: string, expiresAt: number }}
   */
  sendVerificationCode: (email) => {
    const cleanEmail = email.trim().toLowerCase();
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutos

    try {
      const stored = JSON.parse(localStorage.getItem(PENDING_CODES_KEY) || '{}');
      stored[cleanEmail] = {
        code,
        expiresAt,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem(PENDING_CODES_KEY, JSON.stringify(stored));
    } catch (e) {
      console.error('Error al guardar código de verificación:', e);
    }

    console.info(`[getloss Email Service] Código de seguridad enviado a ${cleanEmail}: ${code}`);

    return {
      success: true,
      email: cleanEmail,
      code,
      expiresAt
    };
  },

  /**
   * Valida si el código ingresado coincide y no ha expirado
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
          message: 'No se encontró un código pendiente para este correo. Por favor solicita un nuevo código.' 
        };
      }

      if (Date.now() > record.expiresAt) {
        return { 
          valid: false, 
          message: 'El código de verificación ha expirado (10 minutos). Solicita uno nuevo.' 
        };
      }

      if (record.code !== inputCode.trim()) {
        return { 
          valid: false, 
          message: 'Código de verificación incorrecto. Revisa el correo o presiona "Reenviar Código".' 
        };
      }

      // Código válido: eliminar token usado
      delete stored[cleanEmail];
      localStorage.setItem(PENDING_CODES_KEY, JSON.stringify(stored));

      return { valid: true };
    } catch (e) {
      return { valid: false, message: 'Error al procesar la verificación.' };
    }
  }
};

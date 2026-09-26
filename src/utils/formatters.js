/**
 * getloss - Utilidades de Formato Monetario y Decimales
 * Formatea montos monetarios respetando decimales según la divisa seleccionada (USD, EUR, COP, MXN, etc.)
 */

export const formatMoney = (amount, currency = 'USD') => {
  const num = Number(amount) || 0;
  const curr = (currency || 'USD').toUpperCase();

  try {
    switch (curr) {
      case 'EUR':
        return new Intl.NumberFormat('es-ES', {
          style: 'currency',
          currency: 'EUR',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(num);

      case 'GBP':
        return new Intl.NumberFormat('en-GB', {
          style: 'currency',
          currency: 'GBP',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(num);

      case 'COP':
        return `$${new Intl.NumberFormat('es-CO', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(num)} COP`;

      case 'MXN':
        return `$${new Intl.NumberFormat('es-MX', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(num)} MXN`;

      case 'PEN':
        return `S/ ${new Intl.NumberFormat('es-PE', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(num)}`;

      case 'ARS':
        return `$${new Intl.NumberFormat('es-AR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(num)} ARS`;

      case 'CLP':
        return `$${new Intl.NumberFormat('es-CL', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(num)} CLP`;

      case 'CAD':
        return `C$${new Intl.NumberFormat('en-CA', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(num)}`;

      case 'USD':
      default:
        if (/^[A-Z]{3}$/.test(curr)) {
          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: curr,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(num);
        }
        return `$${new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(num)}`;
    }
  } catch {
    return `${curr} ${num.toFixed(2)}`;
  }
};

export const getCurrencySymbol = (currency = 'USD') => {
  switch ((currency || '').toUpperCase()) {
    case 'EUR': return '€';
    case 'GBP': return '£';
    case 'PEN': return 'S/';
    case 'CAD': return 'C$';
    case 'COP':
    case 'MXN':
    case 'ARS':
    case 'CLP':
    case 'USD':
    default: return '$';
  }
};


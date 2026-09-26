# 📊 getloss - Tu Control Financiero Inteligente

<div align="center">
  <img src="https://img.shields.io/badge/getloss-Fintech-000000?style=for-the-badge&logo=cashapp&logoColor=white" alt="getloss Badge" />
  <img src="https://img.shields.io/badge/React-18-09090b?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Badge" />
  <img src="https://img.shields.io/badge/Vite-Fast-09090b?style=for-the-badge&logo=vite&logoColor=white" alt="Vite Badge" />
  <img src="https://img.shields.io/badge/Design-Monochrome_Luxury-18181b?style=for-the-badge" alt="Design Badge" />
</div>

<br/>

**getloss** es una aplicación moderna e intuitiva de gestión financiera personal diseñada para eliminar pérdidas de dinero, organizar flujos de caja y mantener un control riguroso de ingresos y gastos bajo ciclos **quincenales** o **mensuales**.

---

## 🌟 Características Principales

- **Gestión de Ciclos Quincenales y Mensuales**: Alterna con un solo clic entre la **1ª Quincena (1-15)**, **2ª Quincena (16-Fin de mes)** y la **Vista Mensual Completa**.
- **Módulo de Gastos Indispensables y Fijos**: Control prioritario de obligaciones críticas como alquiler/arriendo, servicios públicos (energía, agua, internet, gas), alimentación/supermercado y transporte. Incluye seguimiento de estado de pago (*Pagado* / *Pendiente*).
- **Control de Ingresos y Egresos**: Registro ágil con iconografía vectorial descriptiva para cada categoría financiera.
- **Centro de Reportes y Estadísticas**: Diagnóstico financiero, métricas de ahorro y desglose porcentual por categorías.
- **Exportación de Reportes**: Descarga de reportes ejecutivos en formato **PDF** de alta calidad y exportación a **CSV (Excel)**.
- **Arquitectura de Bases de Datos Separadas**: 
  - `getloss_users_db`: Gestión de usuarios, seguridad, preferencias de cobro y metas.
  - `getloss_finances_db`: Transacciones, categorías y gastos indispensables de clientes.
  - *Inspector en vivo* para auditar las tablas y estructuras JSON.
- **Diseño Ultra Responsivo**: Experiencia adaptada tanto para **dispositivos móviles** (barra de navegación inferior fija y botón flotante) como para **computadoras de escritorio** (panel lateral y dashboard multicomponente).
- **Estética Monocromática Prémium**: Paleta cuidada en Blanco, Negro y Escala de Grises con soporte para **Modo Oscuro** y **Modo Claro**.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React, JavaScript (ESNext), Vite
- **Estilos**: Vanilla CSS moderno con Design System de tokens, tipografía *Plus Jakarta Sans* y *Space Grotesk*, y micro-animaciones.
- **Iconografía**: Lucide Icons (vectores SVG nítidos y ligeros).
- **Reportes**: jsPDF + jspdf-autotable para generación nativa de documentos PDF.
- **Persistencia**: Módulos locales de almacenamiento relacional aislado por usuario.

---

## 🚀 Instalación y Ejecución Local

### Prerrequisitos
- Node.js (v18 o superior)
- npm o yarn

### Pasos

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/TU_USUARIO/getloss.git
   cd getloss
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**:
   Visita `http://localhost:5173`

---

## 👤 Cuentas Demo de Prueba Rápida

La aplicación incluye dos cuentas preconfiguradas con datos de demostración:

| Usuario | Correo Electrónico | Contraseña | Moneda | Frecuencia |
| :--- | :--- | :--- | :--- | :--- |
| **Alejandro Morales** | `demo@getloss.com` | `getloss123` | USD ($) | Quincenal |
| **Valentina Restrepo** | `admin@getloss.com` | `admin123` | COP ($) | Quincenal |

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

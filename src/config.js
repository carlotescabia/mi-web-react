// src/config.js
export const GOOGLE_SHEETS_CONFIG = {
  // En desarrollo, reemplaza estos valores directamente:
  // API_KEY: 'tu-api-key-aquí',
  // SPREADSHEET_ID: 'tu-spreadsheet-id-aquí',
  
  // En producción, usa variables de entorno:
  API_KEY: process.env.REACT_APP_GOOGLE_API_KEY || 'API_KEY_AQUÍ_TEMPORAL',
  SPREADSHEET_ID: process.env.REACT_APP_SPREADSHEET_ID || 'SPREADSHEET_ID_AQUÍ_TEMPORAL',
  RANGE: 'Hoja 1!A:D'
};

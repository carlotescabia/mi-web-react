// Google Sheets Integration
// Para usar esto necesitarías:
// 1. Crear un proyecto en Google Cloud Console
// 2. Habilitar Google Sheets API
// 3. Crear credenciales (API Key o OAuth)
// 4. Crear una hoja de Google Sheets

const SPREADSHEET_ID = 'TU_SPREADSHEET_ID_AQUÍ';
const API_KEY = 'TU_API_KEY_AQUÍ';
const RANGE = 'Tareas!A:D'; // Columnas: ID, Texto, Estado, Fecha

// Función para leer tareas desde Google Sheets
export const readTasksFromSheets = async () => {
  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`
    );
    const data = await response.json();
    
    if (data.values && data.values.length > 1) {
      return data.values.slice(1).map(row => ({
        id: parseInt(row[0]) || Date.now(),
        text: row[1] || '',
        status: row[2] || 'todo',
        date: row[3] || new Date().toISOString()
      }));
    }
    return [];
  } catch (error) {
    console.error('Error reading from Google Sheets:', error);
    return [];
  }
};

// Función para escribir tareas a Google Sheets
export const writeTasksToSheets = async (tasks) => {
  try {
    const values = [
      ['ID', 'Texto', 'Estado', 'Fecha'], // Headers
      ...tasks.map(task => [
        task.id,
        task.text,
        task.status,
        task.date || new Date().toISOString()
      ])
    ];

    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?valueInputOption=RAW&key=${API_KEY}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ values })
      }
    );

    return response.ok;
  } catch (error) {
    console.error('Error writing to Google Sheets:', error);
    return false;
  }
};

// Función para sincronizar tareas (híbrido local + Google Sheets)
export const syncTasks = async (localTasks) => {
  try {
    // Primero intentar leer de Google Sheets
    const sheetsTasks = await readTasksFromSheets();
    
    // Si hay tareas en Sheets, usar esas
    if (sheetsTasks.length > 0) {
      return sheetsTasks;
    }
    
    // Si no, usar las locales y subirlas a Sheets
    if (localTasks.length > 0) {
      await writeTasksToSheets(localTasks);
    }
    
    return localTasks;
  } catch (error) {
    console.error('Error syncing tasks:', error);
    return localTasks; // Fallback a tareas locales
  }
};

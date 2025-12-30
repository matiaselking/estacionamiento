
/**
 * SGE Master - Backend Logic
 */

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('SGE Master - Gestión de Estacionamientos')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function getTargetSpreadsheet() {
  const props = PropertiesService.getScriptProperties();
  const linkedId = props.getProperty('LINKED_SHEET_ID');
  
  if (linkedId) {
    try {
      return SpreadsheetApp.openById(linkedId);
    } catch (e) {
      console.error("No se pudo abrir la hoja con ID: " + linkedId);
    }
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * Vincula una hoja por ID y verifica que tenga la pestaña 'Contratos'
 */
function setLinkedSheetId(id) {
  try {
    const ss = SpreadsheetApp.openById(id);
    let sheet = ss.getSheetByName('Contratos');
    
    // Si no existe, intentamos crearla o avisar
    if (!sheet) {
      sheet = ss.insertSheet('Contratos');
      sheet.appendRow(['indice', 'contrato', 'empresa', 'nombreMostrar', 'rut', 'precio', 'estadoPago', 'statusServicio', 'autos']);
    }

    PropertiesService.getScriptProperties().setProperty('LINKED_SHEET_ID', id);
    
    return { 
      success: true, 
      name: ss.getName(),
      rowCount: sheet.getLastRow() - 1,
      url: ss.getUrl()
    };
  } catch (e) {
    throw new Error("No se pudo acceder a la hoja. Asegúrate de que el ID sea correcto y tengas permisos de edición.");
  }
}

/**
 * Obtiene información básica de la hoja vinculada actualmente
 */
function getSheetMetadata() {
  try {
    const ss = getTargetSpreadsheet();
    const sheet = ss.getSheetByName('Contratos');
    return {
      name: ss.getName(),
      id: ss.getId(),
      rowCount: sheet ? Math.max(0, sheet.getLastRow() - 1) : 0,
      lastUpdated: new Date().toLocaleString()
    };
  } catch (e) {
    return null;
  }
}

function getContractsFromSheet() {
  try {
    const ss = getTargetSpreadsheet();
    let sheet = ss.getSheetByName('Contratos');
    
    if (!sheet) return [];
    
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return [];
    
    const headers = data[0];
    const rows = data.slice(1);
    
    return rows.map((row, rowIndex) => {
      const obj = {};
      headers.forEach((header, i) => {
        let value = row[i];
        if (header === 'autos' && typeof value === 'string') {
          value = value.split(',').map(v => v.trim()).filter(v => v);
        }
        obj[header] = value;
      });
      obj.rowNumber = rowIndex + 2; 
      return obj;
    });
  } catch (e) {
    throw new Error('Error al leer la hoja: ' + e.message);
  }
}

function saveContractToSheet(contract) {
  const ss = getTargetSpreadsheet();
  const sheet = ss.getSheetByName('Contratos');
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  const rowData = headers.map(header => {
    let val = contract[header];
    if (header === 'autos' && Array.isArray(val)) return val.join(', ');
    return val !== undefined ? val : '';
  });

  if (contract.rowNumber) {
    sheet.getRange(contract.rowNumber, 1, 1, rowData.length).setValues([rowData]);
  } else {
    sheet.appendRow(rowData);
  }
  return { success: true };
}

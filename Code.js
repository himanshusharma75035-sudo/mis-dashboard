// ─── EKO BHARAT MIS DASHBOARD — Google Apps Script Server ────────────────────
// Deploy as: Web App → Execute as: Me → Access: Anyone within Eko organization
// Sheet stays PRIVATE — only the script owner needs access to the sheet.
// ─────────────────────────────────────────────────────────────────────────────

var SHEET_ID = 'YOUR_SHEET_ID_HERE';

var SHEET_MAP = {
  consolidated: 'Consolidated Eko',
  eps:          'Eko Platform Services',
  eloka:        'ELOKA',
  kiosk:        'Kiosk Banking Solutions',
  enterprise:   'Enterprise'
};

// Serve the dashboard HTML
function doGet() {
  return HtmlService
    .createHtmlOutputFromFile('Dashboard')
    .setTitle('Eko Bharat MIS Dashboard')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
}

// Called from the client — returns display values for one sheet tab
function getSheetData(tabName) {
  try {
    var ss    = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName(tabName);
    if (!sheet) throw new Error('Sheet tab "' + tabName + '" not found. Check the tab name in the spreadsheet.');
    var vals  = sheet.getDataRange().getDisplayValues();
    return { ok: true, rows: vals };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// Called from the client — returns all sheet tabs in one round-trip
function getAllSheetsData() {
  var ss     = SpreadsheetApp.openById(SHEET_ID);
  var result = {};
  for (var key in SHEET_MAP) {
    var name  = SHEET_MAP[key];
    try {
      var sheet = ss.getSheetByName(name);
      if (!sheet) {
        result[key] = { ok: false, error: 'Tab "' + name + '" not found' };
      } else {
        result[key] = { ok: true, rows: sheet.getDataRange().getDisplayValues() };
      }
    } catch (e) {
      result[key] = { ok: false, error: e.message };
    }
  }
  return result;
}
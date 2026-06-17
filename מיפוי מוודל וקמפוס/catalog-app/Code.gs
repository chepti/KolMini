/**
 * קטלוג קורסי מוודל וקמפוס – משרד החינוך
 * Apps Script מקושר לגיליון (container-bound).
 *
 * התקנה:
 *  1. צור גיליון Google Sheets חדש וייבא אליו את "קורסים_לייבוא.csv".
 *  2. בגיליון: תוספות (Extensions) → Apps Script.
 *  3. הדבק את הקוד הזה ל-Code.gs, וצור קובץ HTML בשם Index והדבק לתוכו את Index.html.
 *  4. פרוס (Deploy) → New deployment → סוג: Web app → הרשאות: רק אני / כל מי שיש לו קישור.
 *
 * הקוד מזהה את העמודות אוטומטית לפי שורת הכותרת – אין צורך לשנות מספרי עמודות.
 */

var SHEET_NAME = '';   // ריק = הגיליון הראשון. אפשר לציין שם טאב מפורש.
var COMMENT_HEADER = 'הערות';
var UPDATED_HEADER = 'עודכן';

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('קורסי מוודל וקמפוס – משרד החינוך')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = SHEET_NAME ? ss.getSheetByName(SHEET_NAME) : ss.getSheets()[0];
  if (!sheet) throw new Error('לא נמצא גיליון בשם "' + SHEET_NAME + '"');
  return sheet;
}

/** מחזיר את שורת הכותרות כמערך מחרוזות מנוקות. */
function getHeaders_(sheet) {
  var lastCol = sheet.getLastColumn();
  if (lastCol === 0) return [];
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  return headers.map(function (h) { return String(h).trim(); });
}

/** ודא שעמודות "הערות" ו"עודכן" קיימות; אם לא – הוסף בסוף. */
function ensureExtraColumns_(sheet) {
  var headers = getHeaders_(sheet);
  var added = false;
  [COMMENT_HEADER, UPDATED_HEADER].forEach(function (name) {
    if (headers.indexOf(name) === -1) {
      sheet.getRange(1, sheet.getLastColumn() + 1).setValue(name);
      added = true;
    }
  });
  return added;
}

/**
 * מחזיר את כל הקורסים + מטא-דאטה לסינון.
 */
function getCourses() {
  var sheet = getSheet_();
  ensureExtraColumns_(sheet);
  var headers = getHeaders_(sheet);
  var lastRow = sheet.getLastRow();
  var courses = [];

  if (lastRow > 1) {
    var values = sheet.getRange(2, 1, lastRow - 1, headers.length).getValues();
    for (var i = 0; i < values.length; i++) {
      var row = values[i];
      // דלג על שורות ריקות לגמרי
      var nonEmpty = row.some(function (c) { return String(c).trim() !== ''; });
      if (!nonEmpty) continue;
      var obj = { _row: i + 2 };
      for (var c = 0; c < headers.length; c++) {
        obj[headers[c]] = row[c] === null ? '' : String(row[c]);
      }
      courses.push(obj);
    }
  }

  return { headers: headers, courses: courses };
}

/**
 * מעדכן שדות בשורה נתונה.
 * @param {number} rowNumber מספר השורה בגיליון (כפי שמוחזר ב-_row)
 * @param {Object} updates מפה של כותרת-עמודה → ערך חדש
 */
function updateCourse(rowNumber, updates) {
  var sheet = getSheet_();
  var headers = getHeaders_(sheet);
  rowNumber = Number(rowNumber);
  if (!rowNumber || rowNumber < 2) throw new Error('מספר שורה לא תקין');

  Object.keys(updates).forEach(function (key) {
    var colIdx = headers.indexOf(key);
    if (colIdx === -1) return; // עמודה לא קיימת – התעלם
    sheet.getRange(rowNumber, colIdx + 1).setValue(updates[key]);
  });

  // חותמת זמן עדכון
  var updCol = headers.indexOf(UPDATED_HEADER);
  if (updCol !== -1) {
    var tz = Session.getScriptTimeZone() || 'Asia/Jerusalem';
    var stamp = Utilities.formatDate(new Date(), tz, 'dd/MM/yyyy HH:mm');
    sheet.getRange(rowNumber, updCol + 1).setValue(stamp);
  }

  SpreadsheetApp.flush();
  return { ok: true, row: rowNumber };
}

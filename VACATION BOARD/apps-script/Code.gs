/**
 * לוח החופש — Google Apps Script
 * --------------------------------
 * 1. צרו גיליון חדש ב-Google Sheets
 * 2. Extensions → Apps Script → הדביקו את הקובץ הזה
 * 3. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. העתיקו את כתובת ה-Web App והדביקו בלוח החופש (כפתור "Sheets")
 */

var SHEET_SETTINGS = 'הגדרות';
var SHEET_BRANCHES = 'ענפים';
var SHEET_PEOPLE = 'אנשים';
var SHEET_ACTIVITIES = 'פעילויות';

function doGet(e) {
  try {
    ensureSheets_();
    var state = readState_();
    return json_({ ok: true, state: state, updatedAt: getUpdatedAt_() });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    ensureSheets_();

    var raw = e && e.postData && e.postData.contents ? e.postData.contents : '{}';
    var body = JSON.parse(raw);
    if (!body || !body.state) {
      return json_({ ok: false, error: 'missing state' });
    }

    writeState_(body.state);
    var updatedAt = new Date().toISOString();
    setUpdatedAt_(updatedAt);

    return json_({ ok: true, updatedAt: updatedAt });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    try {
      lock.releaseLock();
    } catch (e2) {}
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function ss_() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

function ensureSheets_() {
  var ss = ss_();
  ensureSheet_(ss, SHEET_SETTINGS, ['מפתח', 'ערך']);
  ensureSheet_(ss, SHEET_BRANCHES, ['id', 'name']);
  ensureSheet_(ss, SHEET_PEOPLE, ['id', 'name', 'color', 'branchId', 'isChild']);
  ensureSheet_(ss, SHEET_ACTIVITIES, [
    'id',
    'title',
    'startDate',
    'endDate',
    'timeOfDay',
    'location',
    'participantMode',
    'branchIds',
    'personIds',
    'color',
  ]);
}

function ensureSheet_(ss, name, headers) {
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
  }
  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, headers.length).setValues([headers]);
    sh.setFrozenRows(1);
  }
}

function getUpdatedAt_() {
  var map = settingsMap_();
  return map.updatedAt || '';
}

function setUpdatedAt_(iso) {
  upsertSetting_('updatedAt', iso);
}

function settingsMap_() {
  var sh = ss_().getSheetByName(SHEET_SETTINGS);
  var values = sh.getDataRange().getValues();
  var map = {};
  for (var i = 1; i < values.length; i++) {
    if (values[i][0]) map[String(values[i][0])] = String(values[i][1] == null ? '' : values[i][1]);
  }
  return map;
}

function upsertSetting_(key, value) {
  var sh = ss_().getSheetByName(SHEET_SETTINGS);
  var values = sh.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if (String(values[i][0]) === key) {
      sh.getRange(i + 1, 2).setValue(value);
      return;
    }
  }
  sh.appendRow([key, value]);
}

function readState_() {
  var map = settingsMap_();
  var branches = readTable_(SHEET_BRANCHES, function (r) {
    return { id: String(r[0]), name: String(r[1] || '') };
  });
  var people = readTable_(SHEET_PEOPLE, function (r) {
    return {
      id: String(r[0]),
      name: String(r[1] || ''),
      color: String(r[2] || '#4ECDC4'),
      branchId: String(r[3] || ''),
      isChild: String(r[4]).toLowerCase() === 'true' || r[4] === true || r[4] === 1,
    };
  });
  var activities = readTable_(SHEET_ACTIVITIES, function (r) {
    return {
      id: String(r[0]),
      title: String(r[1] || ''),
      startDate: String(r[2] || ''),
      endDate: String(r[3] || ''),
      timeOfDay: String(r[4] || 'all-day'),
      location: r[5] ? String(r[5]) : '',
      participantMode: String(r[6] || 'people'),
      branchIds: parseList_(r[7]),
      personIds: parseList_(r[8]),
      color: r[9] ? String(r[9]) : '',
    };
  });

  return {
    rangeStart: map.rangeStart || '2026-07-12',
    rangeEnd: map.rangeEnd || '2026-08-15',
    hiddenBranches: parseList_(map.hiddenBranches),
    hiddenPeople: parseList_(map.hiddenPeople),
    branches: branches,
    people: people,
    activities: activities.map(function (a) {
      if (!a.location) delete a.location;
      if (!a.color) delete a.color;
      return a;
    }),
  };
}

function writeState_(state) {
  upsertSetting_('rangeStart', state.rangeStart || '');
  upsertSetting_('rangeEnd', state.rangeEnd || '');
  upsertSetting_('hiddenBranches', JSON.stringify(state.hiddenBranches || []));
  upsertSetting_('hiddenPeople', JSON.stringify(state.hiddenPeople || []));

  writeTable_(SHEET_BRANCHES, ['id', 'name'], (state.branches || []).map(function (b) {
    return [b.id, b.name];
  }));

  writeTable_(SHEET_PEOPLE, ['id', 'name', 'color', 'branchId', 'isChild'], (state.people || []).map(function (p) {
    return [p.id, p.name, p.color, p.branchId, p.isChild ? 'true' : 'false'];
  }));

  writeTable_(
    SHEET_ACTIVITIES,
    [
      'id',
      'title',
      'startDate',
      'endDate',
      'timeOfDay',
      'location',
      'participantMode',
      'branchIds',
      'personIds',
      'color',
    ],
    (state.activities || []).map(function (a) {
      return [
        a.id,
        a.title,
        a.startDate,
        a.endDate,
        a.timeOfDay,
        a.location || '',
        a.participantMode,
        JSON.stringify(a.branchIds || []),
        JSON.stringify(a.personIds || []),
        a.color || '',
      ];
    }),
  );
}

function readTable_(name, mapRow) {
  var sh = ss_().getSheetByName(name);
  var values = sh.getDataRange().getValues();
  var out = [];
  for (var i = 1; i < values.length; i++) {
    if (!values[i][0]) continue;
    out.push(mapRow(values[i]));
  }
  return out;
}

function writeTable_(name, headers, rows) {
  var sh = ss_().getSheetByName(name);
  sh.clearContents();
  sh.getRange(1, 1, 1, headers.length).setValues([headers]);
  if (rows.length) {
    sh.getRange(2, 1, rows.length + 1, headers.length).setValues(rows);
  }
  sh.setFrozenRows(1);
}

function parseList_(value) {
  if (value == null || value === '') return [];
  if (Array.isArray(value)) return value;
  try {
    var parsed = JSON.parse(String(value));
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return String(value)
      .split(',')
      .map(function (s) {
        return s.trim();
      })
      .filter(Boolean);
  }
}

/** בדיקה ידנית מהעורך */
function testRead() {
  Logger.log(JSON.stringify(readState_()));
}

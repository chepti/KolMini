/**
 * לוח החופש — Google Apps Script
 * --------------------------------
 * 1. צרו גיליון חדש ב-Google Sheets
 * 2. Extensions → Apps Script → הדביקו את הקובץ הזה
 * 3. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. העתיקו את כתובת ה-Web App והדביקו בלוח החופש (כפתור "Sheets")
 *
 * יומן גוגל (מנוי חי):
 * אותה כתובת + ?format=ics
 * לדוגמה: https://script.google.com/macros/s/…/exec?format=ics
 * בגוגל יומן → יומנים אחרים → + → מכתובת URL
 */

var SHEET_SETTINGS = 'הגדרות';
var SHEET_BRANCHES = 'ענפים';
var SHEET_PEOPLE = 'אנשים';
var SHEET_ACTIVITIES = 'פעילויות';

function doGet(e) {
  try {
    ensureSheets_();
    var format = e && e.parameter && e.parameter.format;
    if (String(format || '').toLowerCase() === 'ics') {
      return icsOutput_(readState_());
    }
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

/** הזנת יומן חיה — Google Calendar מוסיפים כיומן מנוי מה-URL עם ?format=ics */
function icsOutput_(state) {
  var ics = buildIcs_(state);
  return ContentService.createTextOutput(ics).setMimeType(ContentService.MimeType.ICAL);
}

function pad2_(n) {
  return n < 10 ? '0' + n : String(n);
}

function nextDateKey_(dateKey) {
  var parts = String(dateKey).split('-');
  var d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  d.setDate(d.getDate() + 1);
  return d.getFullYear() + '-' + pad2_(d.getMonth() + 1) + '-' + pad2_(d.getDate());
}

function toIcsDate_(dateKey) {
  return String(dateKey).replace(/-/g, '');
}

function escapeIcs_(value) {
  return String(value || '')
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

function timeLabel_(slot) {
  if (slot === 'morning') return 'בוקר';
  if (slot === 'noon') return 'צהריים';
  if (slot === 'evening') return 'ערב';
  return 'כל היום';
}

function participantsLabel_(activity, people, branches) {
  var mode = activity.participantMode || 'people';
  if (mode === 'all') return 'כולם';
  if (mode === 'branch') {
    return (activity.branchIds || [])
      .map(function (id) {
        for (var i = 0; i < branches.length; i++) {
          if (branches[i].id === id) return branches[i].name;
        }
        return id;
      })
      .join(', ');
  }
  return (activity.personIds || [])
    .map(function (id) {
      for (var i = 0; i < people.length; i++) {
        if (people[i].id === id) return people[i].name;
      }
      return id;
    })
    .join(', ');
}

function isVisible_(activity, people, hiddenBranches, hiddenPeople) {
  var mode = activity.participantMode || 'people';
  if (mode === 'all') return true;
  if (mode === 'branch') {
    return (activity.branchIds || []).some(function (id) {
      return hiddenBranches.indexOf(id) === -1;
    });
  }
  return (activity.personIds || []).some(function (id) {
    if (hiddenPeople.indexOf(id) !== -1) return false;
    for (var i = 0; i < people.length; i++) {
      if (people[i].id === id) {
        return hiddenBranches.indexOf(people[i].branchId) === -1;
      }
    }
    return false;
  });
}

function eventTimes_(activity) {
  var slot = activity.timeOfDay || 'all-day';
  if (slot === 'all-day') {
    return {
      start: 'DTSTART;VALUE=DATE:' + toIcsDate_(activity.startDate),
      end: 'DTEND;VALUE=DATE:' + toIcsDate_(nextDateKey_(activity.endDate)),
    };
  }
  var hours = {
    morning: { s: '080000', e: '120000' },
    noon: { s: '120000', e: '160000' },
    evening: { s: '160000', e: '210000' },
  };
  var h = hours[slot] || hours.morning;
  return {
    start:
      'DTSTART;TZID=Asia/Jerusalem:' + toIcsDate_(activity.startDate) + 'T' + h.s,
    end: 'DTEND;TZID=Asia/Jerusalem:' + toIcsDate_(activity.endDate) + 'T' + h.e,
  };
}

function stampUtc_() {
  return Utilities.formatDate(new Date(), 'UTC', "yyyyMMdd'T'HHmmss'Z'");
}

function buildIcs_(state) {
  var people = state.people || [];
  var branches = state.branches || [];
  var hiddenBranches = state.hiddenBranches || [];
  var hiddenPeople = state.hiddenPeople || [];
  var stamp = stampUtc_();
  var lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//KolMini//Vacation Board//HE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:' + escapeIcs_('לוח החופש'),
    'X-WR-TIMEZONE:Asia/Jerusalem',
    'BEGIN:VTIMEZONE',
    'TZID:Asia/Jerusalem',
    'BEGIN:STANDARD',
    'TZOFFSETFROM:+0200',
    'TZOFFSETTO:+0200',
    'TZNAME:IST',
    'DTSTART:19700101T000000',
    'END:STANDARD',
    'END:VTIMEZONE',
  ];

  (state.activities || []).forEach(function (activity) {
    if (!isVisible_(activity, people, hiddenBranches, hiddenPeople)) return;
    var times = eventTimes_(activity);
    var who = participantsLabel_(activity, people, branches);
    var desc = [
      activity.description || '',
      timeLabel_(activity.timeOfDay),
      who ? 'משתתפים: ' + who : '',
      'מקור: לוח החופש המשפחתי',
    ]
      .filter(Boolean)
      .join('\n');
    lines.push('BEGIN:VEVENT');
    lines.push('UID:' + activity.id + '@vacation-board.kolmini');
    lines.push('DTSTAMP:' + stamp);
    lines.push(times.start);
    lines.push(times.end);
    lines.push('SUMMARY:' + escapeIcs_(activity.title));
    lines.push('DESCRIPTION:' + escapeIcs_(desc));
    if (activity.location) lines.push('LOCATION:' + escapeIcs_(activity.location));
    lines.push('END:VEVENT');
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n') + '\r\n';
}

function ss_() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

function ensureSheets_() {
  var ss = ss_();
  ensureSheet_(ss, SHEET_SETTINGS, ['מפתח', 'ערך']);
  ensureSheet_(ss, SHEET_BRANCHES, ['id', 'name', 'color']);
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
    'description',
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
    if (values[i][0]) map[String(values[i][0])] = cellToText_(values[i][1]);
  }
  return map;
}

function cellToText_(value) {
  if (value == null || value === '') return '';
  if (Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value.getTime())) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  return String(value);
}

function upsertSetting_(key, value) {
  var sh = ss_().getSheetByName(SHEET_SETTINGS);
  var values = sh.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if (String(values[i][0]) === key) {
      // כטקסט — כדי שגוגל לא יהפוך תאריכים ל-Date
      sh.getRange(i + 1, 2).setNumberFormat('@').setValue(String(value));
      return;
    }
  }
  sh.appendRow([key, String(value)]);
  sh.getRange(sh.getLastRow(), 2).setNumberFormat('@');
}

function readState_() {
  var map = settingsMap_();
  var branches = readTable_(SHEET_BRANCHES, function (r) {
    var b = { id: String(r[0]), name: String(r[1] || ''), color: '' };
    if (r[2]) b.color = String(r[2]);
    else delete b.color;
    return b;
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
      startDate: cellToText_(r[2]),
      endDate: cellToText_(r[3]),
      timeOfDay: String(r[4] || 'all-day'),
      location: r[5] ? String(r[5]) : '',
      participantMode: String(r[6] || 'people'),
      branchIds: parseList_(r[7]),
      personIds: parseList_(r[8]),
      color: r[9] ? String(r[9]) : '',
      description: r[10] ? String(r[10]) : '',
    };
  });

  return {
    rangeStart: map.rangeStart || '2026-07-12',
    rangeEnd: map.rangeEnd || '2026-08-31',
    hiddenBranches: parseList_(map.hiddenBranches),
    hiddenPeople: parseList_(map.hiddenPeople),
    branches: branches,
    people: people,
    activities: activities.map(function (a) {
      if (!a.location) delete a.location;
      if (!a.color) delete a.color;
      if (!a.description) delete a.description;
      return a;
    }),
  };
}

function writeState_(state) {
  upsertSetting_('rangeStart', state.rangeStart || '');
  upsertSetting_('rangeEnd', state.rangeEnd || '');
  upsertSetting_('hiddenBranches', JSON.stringify(state.hiddenBranches || []));
  upsertSetting_('hiddenPeople', JSON.stringify(state.hiddenPeople || []));

  writeTable_(SHEET_BRANCHES, ['id', 'name', 'color'], (state.branches || []).map(function (b) {
    return [b.id, b.name, b.color || ''];
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
      'description',
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
        a.description || '',
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
  // getRange(row, column, numRows, numColumns)
  sh.getRange(1, 1, 1, headers.length).setValues([headers]);
  if (rows.length) {
    var range = sh.getRange(2, 1, rows.length, headers.length);
    range.setNumberFormat('@');
    range.setValues(rows);
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

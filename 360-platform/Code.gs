/**
 * מחולל מרחבי 360° — Google Apps Script Backend
 * שומר פרויקטים ב-Google Sheet ותמונות ב-Google Drive
 */

var CONFIG = {
  SHEET_NAME: 'Projects',
  DRIVE_FOLDER_NAME: '360-Environments',
  WEB_APP_URL: 'https://script.google.com/a/macros/jerschools.org.il/s/AKfycbwg3LisOKMy1MPYclGzsvbXwudELNus7xhXtloBb3hUgjZccR4MCgXadUFbBhJJLtZebg/exec',
  DRIVE_FOLDER_ID: '',
  HEADERS: ['id', 'title', 'created_at', 'updated_at', 'image1_url', 'image2_url', 'active_image', 'hotspots_json', 'edit_token', 'view_url', 'edit_url', 'copy_url']
};

function doGet(e) {
  var params = (e && e.parameter) ? e.parameter : {};
  var template = HtmlService.createTemplateFromFile('Index');
  template.loadError = 'null';
  template.scriptUrl = JSON.stringify(getScriptUrl_());
  template.pageMode = '"editor"';
  template.catalogData = '[]';

  if (params.page === 'catalog') {
    template.pageMode = '"catalog"';
    template.catalogData = JSON.stringify(listAllProjects_());
    template.initialProject = 'null';
    template.isEditMode = 'false';
  } else if (params.template) {
    try {
      var copyProject = getProjectForCopy_(params.template);
      template.initialProject = JSON.stringify(copyProject);
      template.isEditMode = 'true';
    } catch (err) {
      template.initialProject = 'null';
      template.isEditMode = 'true';
      template.loadError = JSON.stringify(err.message || String(err));
    }
  } else if (params.id) {
    try {
      var project = getProjectData_(params.id, params.edit);
      template.initialProject = JSON.stringify(project);
      template.isEditMode = project.canEdit ? 'true' : 'false';
    } catch (err) {
      template.initialProject = 'null';
      template.isEditMode = 'true';
      template.loadError = JSON.stringify(err.message || String(err));
    }
  } else {
    template.initialProject = 'null';
    template.isEditMode = 'true';
  }

  return template.evaluate()
    .setTitle('יוצר מרחבי 360°')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// ——— API ללקוח ———

function saveProject(payload) {
  payload = payload || {};
  var sheet = getProjectsSheet_();
  var folder = getOrCreateDriveFolder_();
  var now = new Date().toISOString();
  var id = payload.id || '';
  var editToken = payload.editToken || '';
  var rowIndex = -1;
  var isNew = false;

  if (id) {
    rowIndex = findRowById_(sheet, id);
    if (rowIndex > 0) {
      var storedToken = String(sheet.getRange(rowIndex, 9).getValue());
      if (!editToken || editToken !== storedToken) {
        throw new Error('אין הרשאת עריכה לפרויקט זה');
      }
    } else {
      id = '';
    }
  }

  if (!id) {
    id = generateShortId_();
    editToken = Utilities.getUuid();
    rowIndex = -1;
    isNew = true;
  }

  var image1Url = payload.image1 || '';
  var image2Url = payload.image2 || '';

  if (image1Url && image1Url.indexOf('data:') === 0) {
    image1Url = uploadBase64ToDrive_(image1Url, id + '_bg1.jpg', folder);
  }
  if (image2Url && image2Url.indexOf('data:') === 0) {
    image2Url = uploadBase64ToDrive_(image2Url, id + '_bg2.jpg', folder);
  }

  var hotspots = payload.hotspots || [];
  for (var i = 0; i < hotspots.length; i++) {
    var hs = hotspots[i];
    if (hs.type === 'image' && hs.content && hs.content.indexOf('data:') === 0) {
      hs.content = uploadBase64ToDrive_(hs.content, id + '_hs_' + hs.id + '.jpg', folder);
    }
  }

  var baseUrl = getScriptUrl_();
  var viewUrl = baseUrl + '?id=' + id;
  var editUrl = baseUrl + '?id=' + id + '&edit=' + editToken;
  var copyUrl = baseUrl + '?template=' + id;

  var rowData = [
    id,
    payload.title || 'מרחב 360 ללא שם',
    rowIndex > 0 ? sheet.getRange(rowIndex, 3).getValue() : now,
    now,
    image1Url,
    image2Url,
    payload.activeImage || 1,
    JSON.stringify(hotspots),
    editToken,
    viewUrl,
    editUrl,
    copyUrl
  ];

  if (rowIndex > 0) {
    sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
  } else {
    sheet.appendRow(rowData);
  }

  return {
    success: true,
    id: id,
    editToken: editToken,
    image1: image1Url,
    image2: image2Url,
    viewUrl: viewUrl,
    editUrl: editUrl,
    copyUrl: copyUrl,
    isNew: isNew
  };
}

function getProject(id) {
  return getProjectData_(id, null);
}

function listProjects() {
  return listAllProjects_();
}

function uploadImage(base64Data, fileName, projectId) {
  var folder = getOrCreateDriveFolder_();
  if (projectId) {
    var subFolders = folder.getFoldersByName(projectId);
    if (subFolders.hasNext()) {
      folder = subFolders.next();
    } else {
      folder = folder.createFolder(projectId);
    }
  }
  return uploadBase64ToDrive_(base64Data, fileName || ('img_' + Date.now() + '.jpg'), folder);
}

// ——— פנימי ———

function getProjectData_(id, editToken) {
  var sheet = getProjectsSheet_();
  var rowIndex = findRowById_(sheet, id);
  if (rowIndex < 0) {
    throw new Error('הפרויקט לא נמצא');
  }

  var row = sheet.getRange(rowIndex, 1, 1, CONFIG.HEADERS.length).getValues()[0];
  var storedToken = String(row[8]);
  var canEdit = !!(editToken && editToken === storedToken);
  var baseUrl = getScriptUrl_();

  var hotspots = [];
  try {
    hotspots = JSON.parse(row[7] || '[]');
  } catch (e) {
    hotspots = [];
  }

  return {
    id: String(row[0]),
    title: String(row[1]),
    createdAt: row[2],
    updatedAt: row[3],
    image1: String(row[4] || ''),
    image2: String(row[5] || ''),
    activeImage: parseInt(row[6], 10) || 1,
    hotspots: hotspots,
    canEdit: canEdit,
    editToken: canEdit ? storedToken : '',
    viewUrl: String(row[9] || baseUrl + '?id=' + row[0]),
    editUrl: canEdit ? String(row[10] || baseUrl + '?id=' + row[0] + '&edit=' + storedToken) : '',
    copyUrl: String(row[11] || baseUrl + '?template=' + row[0])
  };
}

function getProjectForCopy_(id) {
  var data = getProjectData_(id, null);
  data.id = '';
  data.editToken = '';
  data.canEdit = true;
  data.isTemplate = true;
  data.viewUrl = '';
  data.editUrl = '';
  data.copyUrl = '';
  if (data.title && data.title.indexOf('(עותק)') === -1) {
    data.title = data.title + ' (עותק)';
  }
  return data;
}

function listAllProjects_() {
  var sheet = getProjectsSheet_();
  var data = sheet.getDataRange().getValues();
  var baseUrl = getScriptUrl_();
  var list = [];

  for (var i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    list.push({
      id: String(data[i][0]),
      title: String(data[i][1] || 'ללא שם'),
      updatedAt: data[i][3] ? String(data[i][3]) : '',
      image1: String(data[i][4] || ''),
      viewUrl: String(data[i][9] || baseUrl + '?id=' + data[i][0]),
      copyUrl: String(data[i][11] || baseUrl + '?template=' + data[i][0])
    });
  }

  list.sort(function(a, b) {
    return String(b.updatedAt).localeCompare(String(a.updatedAt));
  });

  return list;
}

function getProjectsSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
    sheet.appendRow(CONFIG.HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, CONFIG.HEADERS.length).setFontWeight('bold');
  } else {
    ensureHeaders_(sheet);
  }
  return sheet;
}

function ensureHeaders_(sheet) {
  var lastCol = sheet.getLastColumn();
  var existing = sheet.getRange(1, 1, 1, Math.max(lastCol, CONFIG.HEADERS.length)).getValues()[0];
  for (var i = 0; i < CONFIG.HEADERS.length; i++) {
    if (!existing[i] || existing[i] !== CONFIG.HEADERS[i]) {
      sheet.getRange(1, 1, 1, CONFIG.HEADERS.length).setValues([CONFIG.HEADERS]);
      sheet.getRange(1, 1, 1, CONFIG.HEADERS.length).setFontWeight('bold');
      break;
    }
  }
}

function findRowById_(sheet, id) {
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) {
      return i + 1;
    }
  }
  return -1;
}

function getOrCreateDriveFolder_() {
  if (CONFIG.DRIVE_FOLDER_ID) {
    return DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
  }
  var folders = DriveApp.getFoldersByName(CONFIG.DRIVE_FOLDER_NAME);
  if (folders.hasNext()) {
    return folders.next();
  }
  return DriveApp.createFolder(CONFIG.DRIVE_FOLDER_NAME);
}

function uploadBase64ToDrive_(base64Data, fileName, folder) {
  var parts = base64Data.split(',');
  var meta = parts[0];
  var data = parts[1];
  var mimeMatch = meta.match(/data:([^;]+)/);
  var mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  var blob = Utilities.newBlob(Utilities.base64Decode(data), mimeType, fileName);
  var file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return 'https://drive.google.com/uc?export=view&id=' + file.getId();
}

function generateShortId_() {
  return Utilities.getUuid().replace(/-/g, '').substring(0, 10);
}

function getScriptUrl_() {
  if (CONFIG.WEB_APP_URL) {
    return CONFIG.WEB_APP_URL;
  }
  var url = ScriptApp.getService().getUrl();
  if (!url) {
    throw new Error('כתובת Web App לא מוגדרת — עדכן את CONFIG.WEB_APP_URL');
  }
  return url;
}

function setupSheet() {
  getProjectsSheet_();
  getOrCreateDriveFolder_();
  return 'ההגדרה הושלמה — גיליון ותיקיית Drive מוכנים';
}

function backfillUrls() {
  var sheet = getProjectsSheet_();
  var data = sheet.getDataRange().getValues();
  var baseUrl = getScriptUrl_();
  var count = 0;

  for (var i = 1; i < data.length; i++) {
    var id = String(data[i][0]);
    var token = String(data[i][8]);
    if (!id) continue;
    var rowIndex = i + 1;
    if (!data[i][9]) {
      sheet.getRange(rowIndex, 10).setValue(baseUrl + '?id=' + id);
      count++;
    }
    if (!data[i][10] && token) {
      sheet.getRange(rowIndex, 11).setValue(baseUrl + '?id=' + id + '&edit=' + token);
      count++;
    }
    if (!data[i][11]) {
      sheet.getRange(rowIndex, 12).setValue(baseUrl + '?template=' + id);
      count++;
    }
  }
  return 'עודכנו ' + count + ' קישורים';
}

/**
 * מחולל מרחבי 360° — Google Apps Script Backend
 * שומר פרויקטים ב-Google Sheet ותמונות ב-Google Drive
 */

var CONFIG = {
  SHEET_NAME: 'Projects',
  DRIVE_FOLDER_NAME: '360-Environments',
  HEADERS: ['id', 'title', 'created_at', 'updated_at', 'image1_url', 'image2_url', 'active_image', 'hotspots_json', 'edit_token']
};

function doGet(e) {
  var template = HtmlService.createTemplateFromFile('Index');
  var id = e && e.parameter ? e.parameter.id : null;
  var edit = e && e.parameter ? e.parameter.edit : null;

  if (id) {
    try {
      var project = getProjectData_(id, edit);
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
    template.loadError = 'null';
  }

  template.scriptUrl = JSON.stringify(getScriptUrl_());

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

  if (id) {
    rowIndex = findRowById_(sheet, id);
    if (rowIndex > 0) {
      var storedToken = sheet.getRange(rowIndex, 9).getValue();
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

  var rowData = [
    id,
    payload.title || 'מרחב 360 ללא שם',
    rowIndex > 0 ? sheet.getRange(rowIndex, 3).getValue() : now,
    now,
    image1Url,
    image2Url,
    payload.activeImage || 1,
    JSON.stringify(hotspots),
    editToken
  ];

  if (rowIndex > 0) {
    sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
  } else {
    sheet.appendRow(rowData);
  }

  var baseUrl = getScriptUrl_();
  return {
    success: true,
    id: id,
    editToken: editToken,
    image1: image1Url,
    image2: image2Url,
    viewUrl: baseUrl + '?id=' + id,
    editUrl: baseUrl + '?id=' + id + '&edit=' + editToken
  };
}

function getProject(id) {
  return getProjectData_(id, null);
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

  var row = sheet.getRange(rowIndex, 1, 1, 9).getValues()[0];
  var storedToken = String(row[8]);
  var canEdit = !!(editToken && editToken === storedToken);

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
    editToken: canEdit ? storedToken : ''
  };
}

function getProjectsSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
    sheet.appendRow(CONFIG.HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, CONFIG.HEADERS.length).setFontWeight('bold');
  }
  return sheet;
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
  return ScriptApp.getService().getUrl();
}

function setupSheet() {
  getProjectsSheet_();
  getOrCreateDriveFolder_();
  return 'ההגדרה הושלמה — גיליון ותיקיית Drive מוכנים';
}

/**
 * Revist 2.0 — Google Apps Script Lead Collection & Notification Backend
 *
 * Spreadsheet: "Revist — Lead Management"
 * Worksheet:   "Trial Leads"
 *
 * Required Script Properties (Project Settings -> Script Properties):
 * - SPREADSHEET_ID: Google Sheet ID (keep the spreadsheet private)
 * - SHARED_SECRET:  Strong random secret shared only with the Cloudflare Worker proxy
 * - NOTIFICATION_EMAIL: Authorised Revist inbox for internal lead alerts
 * - ENABLE_CUSTOMER_CONFIRMATION: "false" (keep disabled until approved)
 */

const SHEET_NAME = 'Trial Leads';
const DUPLICATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_PAYLOAD_BYTES = 8192;

const HEADERS = [
  'Lead ID',
  'Submission timestamp',
  'Restaurant name',
  'Contact person',
  'Phone number',
  'Email address',
  'Contact consent',
  'Consent timestamp',
  'Privacy notice version',
  'Lead source',
  'UTM source',
  'UTM medium',
  'UTM campaign',
  'Lead status',
  'Notification status',
  'Notes',
];

function doGet() {
  return jsonResponse({
    status: 'ok',
    service: 'revist-lead-backend',
  });
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ success: false, error: 'Empty request payload.' });
    }

    if (e.postData.contents.length > MAX_PAYLOAD_BYTES) {
      return jsonResponse({ success: false, error: 'Request payload exceeds size limit.' });
    }

    let body;
    try {
      body = JSON.parse(e.postData.contents);
    } catch {
      return jsonResponse({ success: false, error: 'Malformed JSON request.' });
    }

    const props = PropertiesService.getScriptProperties();
    const expectedSecret = (props.getProperty('SHARED_SECRET') || '').trim();
    if (!expectedSecret || body._proxySecret !== expectedSecret) {
      return jsonResponse({ success: false, error: 'Unauthorised request.' });
    }

    // Honeypot bot rejection
    if (body.websiteHp && String(body.websiteHp).trim().length > 0) {
      return jsonResponse({ success: false, error: 'Submission rejected.' });
    }

    const validated = validateAndNormalise(body);
    if (!validated.valid) {
      return jsonResponse({ success: false, error: validated.error });
    }

    const data = validated.data;
    const spreadsheetId = (props.getProperty('SPREADSHEET_ID') || '').trim();
    if (!spreadsheetId) {
      return jsonResponse({ success: false, error: 'Lead storage is not configured.' });
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);

    let leadId = '';
    let rowNumber = -1;
    let isDuplicateWithinWindow = false;
    let serverTimestamp = new Date().toISOString();

    try {
      const ss = SpreadsheetApp.openById(spreadsheetId);
      const sheet = getOrCreateSheet(ss);

      const recentMatch = findRecentDuplicate(sheet, data.email, data.phone, data.idempotencyKey);
      if (recentMatch) {
        isDuplicateWithinWindow = true;
        leadId = recentMatch.leadId;
      } else {
        leadId = 'REV-' + Utilities.getUuid().slice(0, 12).toUpperCase();
        const rowValues = [
          leadId,
          serverTimestamp,
          neutraliseFormula(data.restaurantName),
          neutraliseFormula(data.contactName),
          "'" + data.phone, // Force plain text so +91 is never parsed as formula
          neutraliseFormula(data.email),
          data.consent ? 'TRUE' : 'FALSE',
          neutraliseFormula(data.consentTimestamp),
          neutraliseFormula(data.privacyNoticeVersion),
          neutraliseFormula(data.leadSource),
          neutraliseFormula(data.utmSource),
          neutraliseFormula(data.utmMedium),
          neutraliseFormula(data.utmCampaign),
          'New',
          'PENDING',
          neutraliseFormula('idempotency:' + data.idempotencyKey),
        ];

        sheet.appendRow(rowValues);
        rowNumber = sheet.getLastRow();
      }
    } finally {
      lock.releaseLock();
    }

    if (isDuplicateWithinWindow) {
      return jsonResponse({
        success: true,
        leadId: leadId,
        message: 'Trial request received',
      });
    }

    // Send internal notification outside lock; never lose the saved lead if email fails
    if (rowNumber > 1) {
      const ss = SpreadsheetApp.openById(spreadsheetId);
      const sheet = ss.getSheetByName(SHEET_NAME);
      const notifResult = sendInternalNotification({
        leadId: leadId,
        restaurantName: data.restaurantName,
        contactName: data.contactName,
        phone: data.phone,
        email: data.email,
        timestamp: serverTimestamp,
      });

      if (sheet) {
        sheet.getRange(rowNumber, 15).setValue(notifResult.status);
        if (notifResult.note) {
          const prevNote = String(sheet.getRange(rowNumber, 16).getValue() || '');
          sheet
            .getRange(rowNumber, 16)
            .setValue(neutraliseFormula((prevNote ? prevNote + ' | ' : '') + notifResult.note));
        }
      }
    }

    return jsonResponse({
      success: true,
      leadId: leadId,
      message: 'Trial request received',
    });
  } catch {
    return jsonResponse({
      success: false,
      error: 'Unable to record trial request right now. Please try again shortly.',
    });
  }
}

function getOrCreateSheet(ss) {
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function validateAndNormalise(body) {
  const restaurantName = cleanText(body.restaurantName, 120);
  const contactName = cleanText(body.contactName, 100);
  const rawPhone = cleanText(body.phone, 25);
  const email = cleanText(body.email, 160).toLowerCase();
  const consent = body.consent === true;

  if (restaurantName.length < 2) {
    return { valid: false, error: 'Please provide a valid restaurant or café name.' };
  }
  if (contactName.length < 2) {
    return { valid: false, error: 'Please provide a valid contact person name.' };
  }

  const phone = normalisePhone(rawPhone);
  if (!isValidPhone(phone)) {
    return { valid: false, error: 'Please provide a valid phone number.' };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return { valid: false, error: 'Please provide a valid email address.' };
  }

  if (!consent) {
    return { valid: false, error: 'Contact consent is required.' };
  }

  return {
    valid: true,
    data: {
      restaurantName: restaurantName,
      contactName: contactName,
      phone: phone,
      email: email,
      consent: true,
      consentTimestamp: cleanText(body.consentTimestamp, 40) || new Date().toISOString(),
      privacyNoticeVersion: cleanText(body.privacyNoticeVersion, 40) || 'unversioned',
      leadSource: cleanText(body.leadSource, 60) || 'website',
      idempotencyKey: cleanText(body.idempotencyKey, 80) || Utilities.getUuid(),
      utmSource: cleanText(body.utmSource, 80),
      utmMedium: cleanText(body.utmMedium, 80),
      utmCampaign: cleanText(body.utmCampaign, 80),
    },
  };
}

function cleanText(val, maxLen) {
  if (typeof val !== 'string') return '';
  return val.replace(/[\r\n\t]+/g, ' ').trim().slice(0, maxLen);
}

function normalisePhone(raw) {
  const hasPlus = raw.startsWith('+');
  const digits = raw.replace(/\D/g, '');
  if (!hasPlus && digits.length === 10 && /^[6-9]\d{9}$/.test(digits)) {
    return '+91' + digits;
  }
  if (!hasPlus && digits.length === 11 && /^0[6-9]\d{9}$/.test(digits)) {
    return '+91' + digits.slice(1);
  }
  if (!hasPlus && digits.length === 12 && /^91[6-9]\d{9}$/.test(digits)) {
    return '+' + digits;
  }
  if (hasPlus) {
    return '+' + digits;
  }
  return digits;
}

function isValidPhone(phone) {
  if (phone.startsWith('+91')) {
    return /^\+91[6-9]\d{9}$/.test(phone);
  }
  return /^\+[1-9]\d{7,14}$/.test(phone);
}

function neutraliseFormula(value) {
  const str = String(value || '');
  if (/^[=+\-@\t\r]/.test(str)) {
    return "'" + str;
  }
  return str;
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function stripHeaderControls(value) {
  return String(value || '').replace(/[\r\n]+/g, ' ').trim();
}

function findRecentDuplicate(sheet, email, phone, idempotencyKey) {
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return null;

  const startRow = Math.max(2, lastRow - 100);
  const numRows = lastRow - startRow + 1;
  const rows = sheet.getRange(startRow, 1, numRows, HEADERS.length).getValues();
  const nowMs = Date.now();

  for (let i = rows.length - 1; i >= 0; i--) {
    const row = rows[i];
    const rowLeadId = String(row[0] || '');
    const rowTs = Date.parse(String(row[1] || ''));
    const rowPhone = String(row[4] || '').replace(/^'/, '');
    const rowEmail = String(row[5] || '').toLowerCase();
    const rowNotes = String(row[15] || '');

    if (idempotencyKey && rowNotes.indexOf('idempotency:' + idempotencyKey) !== -1) {
      return { leadId: rowLeadId };
    }

    if (!Number.isNaN(rowTs) && nowMs - rowTs <= DUPLICATE_WINDOW_MS) {
      if (rowEmail === email && rowPhone === phone) {
        return { leadId: rowLeadId };
      }
    }
  }
  return null;
}

function sendInternalNotification(lead) {
  const props = PropertiesService.getScriptProperties();
  const recipient = (props.getProperty('NOTIFICATION_EMAIL') || '').trim();
  if (!recipient) {
    return { status: 'SKIPPED_UNCONFIGURED', note: 'NOTIFICATION_EMAIL not configured' };
  }

  if (MailApp.getRemainingDailyQuota() <= 0) {
    return { status: 'FAILED_QUOTA', note: 'MailApp daily quota exhausted' };
  }

  const subject = stripHeaderControls(
    'New Revist Free Trial Request — ' + lead.restaurantName.slice(0, 80),
  );

  const plainBody = [
    'New free trial request received.',
    '',
    'Lead ID: ' + lead.leadId,
    'Restaurant: ' + lead.restaurantName,
    'Contact person: ' + lead.contactName,
    'Phone: ' + lead.phone,
    'Email: ' + lead.email,
    'Submission time: ' + lead.timestamp,
    'Lead status: New',
    '',
    'Please contact the restaurant to discuss onboarding.',
  ].join('\n');

  const htmlBody = [
    '<p>New free trial request received.</p>',
    '<ul>',
    '<li><strong>Lead ID:</strong> ' + escapeHtml(lead.leadId) + '</li>',
    '<li><strong>Restaurant:</strong> ' + escapeHtml(lead.restaurantName) + '</li>',
    '<li><strong>Contact person:</strong> ' + escapeHtml(lead.contactName) + '</li>',
    '<li><strong>Phone:</strong> ' + escapeHtml(lead.phone) + '</li>',
    '<li><strong>Email:</strong> ' + escapeHtml(lead.email) + '</li>',
    '<li><strong>Submission time:</strong> ' + escapeHtml(lead.timestamp) + '</li>',
    '<li><strong>Lead status:</strong> New</li>',
    '</ul>',
    '<p>Please contact the restaurant to discuss onboarding.</p>',
  ].join('');

  try {
    MailApp.sendEmail({
      to: recipient,
      subject: subject,
      body: plainBody,
      htmlBody: htmlBody,
    });
    return { status: 'SENT', note: '' };
  } catch (err) {
    return { status: 'FAILED', note: 'Email notification failed' };
  }
}

/**
 * Time-driven or manual helper to retry failed lead notifications without duplicating leads.
 */
function retryFailedNotifications() {
  const props = PropertiesService.getScriptProperties();
  const spreadsheetId = (props.getProperty('SPREADSHEET_ID') || '').trim();
  if (!spreadsheetId) return;

  const ss = SpreadsheetApp.openById(spreadsheetId);
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet || sheet.getLastRow() <= 1) return;

  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, HEADERS.length).getValues();
  for (let i = 0; i < rows.length; i++) {
    const status = String(rows[i][14] || '');
    if (status === 'FAILED' || status === 'FAILED_QUOTA') {
      const res = sendInternalNotification({
        leadId: String(rows[i][0]),
        timestamp: String(rows[i][1]),
        restaurantName: String(rows[i][2]),
        contactName: String(rows[i][3]),
        phone: String(rows[i][4]).replace(/^'/, ''),
        email: String(rows[i][5]),
      });
      sheet.getRange(i + 2, 15).setValue(res.status);
    }
  }
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

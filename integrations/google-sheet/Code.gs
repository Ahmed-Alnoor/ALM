/**
 * District 11 landing page -> Google Sheet.
 *
 * Every form on the page (hero, docked form, phone mini form, pop-up, final form) posts here,
 * and each lead becomes one row in the "Leads" tab of the sheet this script belongs to.
 * Setup steps are in the README ("Leads in Google Sheets").
 */

// Optional: addresses that get an email for every new lead, comma-separated. Leave '' for none.
var NOTIFY_EMAILS = '';

var SHEET_NAME = 'Leads';
var TIMEZONE = 'Asia/Dubai';

// Sheet columns: [header, field sent by the page]. Columns without a field are left for the sales team.
var COLUMNS = [
  ['Received (UAE time)', '_received'],
  ['Name', 'name'],
  ['Phone', 'phone'],
  ['Email', 'email'],
  ['Buyer type', 'buyer_type'],
  ['Status', null],
  ['Notes', null],
  ['Form', 'form'],
  ['Context', 'context'],
  ['Level viewed', 'level_viewed'],
  ['Suite', 'suite'],
  ['Language', 'language'],
  ['utm_source', 'utm_source'],
  ['utm_medium', 'utm_medium'],
  ['utm_campaign', 'utm_campaign'],
  ['utm_content', 'utm_content'],
  ['utm_term', 'utm_term'],
  ['gclid', 'gclid'],
  ['gbraid', 'gbraid'],
  ['wbraid', 'wbraid'],
  ['fbclid', 'fbclid'],
  ['ttclid', 'ttclid'],
  ['sccid', 'sccid'],
  ['msclkid', 'msclkid'],
  ['Page', 'page'],
  ['Referrer', 'referrer'],
  ['Project', 'project']
];

function doPost(e) {
  var p = (e && e.parameter) || {};
  if (p.d11_hp) return json_({ ok: true });                       // hidden trap field filled in: a bot
  var digits = String(p.phone || '').replace(/\D/g, '');
  if (!String(p.name || '').trim() || digits.length < 7) return json_({ ok: false, error: 'name and phone are required' });

  p._received = Utilities.formatDate(new Date(), TIMEZONE, 'yyyy-MM-dd HH:mm:ss');
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);                                            // one write at a time
  try {
    sheet_().appendRow(COLUMNS.map(function (c) { return c[1] ? cell_(p[c[1]]) : ''; }));
  } finally {
    lock.releaseLock();
  }
  if (NOTIFY_EMAILS) notify_(p);
  return json_({ ok: true });
}

// Opening the web app URL in a browser shows this, so you can check the deployment works.
function doGet() {
  return ContentService.createTextOutput('District 11 lead endpoint is running.');
}

// Run once from the Apps Script editor: approves permissions and adds a test row.
function testLead() {
  doPost({ parameter: {
    project: 'District 11', name: 'Test lead (delete me)', phone: '+971501234567', email: 'test@example.com',
    buyer_type: 'Investor', form: 'test', context: 'test', level_viewed: '05', language: 'en', page: 'apps-script-test'
  } });
}

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.appendRow(COLUMNS.map(function (c) { return c[0]; }));
    sh.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

// Keeps values as plain text: phones like +971... stay intact and nothing is read as a formula.
function cell_(v) {
  v = v == null ? '' : String(v).trim().slice(0, 500);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function notify_(p) {
  try {
    var lines = [
      ['Name', p.name], ['Phone', p.phone], ['Email', p.email], ['Buyer type', p.buyer_type],
      ['Form', p.context && p.context !== p.form ? p.form + ' (' + p.context + ')' : p.form],
      ['Campaign', [p.utm_source, p.utm_medium, p.utm_campaign].filter(Boolean).join(' / ')],
      ['Page', p.page]
    ];
    MailApp.sendEmail({
      to: NOTIFY_EMAILS,
      subject: 'New District 11 lead: ' + String(p.name || '').slice(0, 80),
      body: lines.filter(function (l) { return l[1]; }).map(function (l) { return l[0] + ': ' + l[1]; }).join('\n') +
        '\n\nAll leads: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl()
    });
  } catch (err) {
    console.error('Lead email failed: ' + err);                   // the lead is already saved in the sheet
  }
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

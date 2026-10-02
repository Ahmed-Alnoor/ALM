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

// Spam guards. The web app address is public (every form posts to it), so the script itself checks what it saves.
var MAX_LEADS_PER_10_MIN = 60;   // flood guard: more than this in 10 minutes is ignored (and not emailed)
var REPEAT_WINDOW_SEC = 120;     // the same phone number sent again within 2 minutes is saved once

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
  var name = String(p.name || '').trim(), digits = String(p.phone || '').replace(/\D/g, '');
  if (name.length < 2 || name.length > 100 || digits.length < 7 || digits.length > 15) return json_({ ok: false, error: 'name and phone are required' });
  if (p.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(p.email).trim())) p.email = '';

  p._received = Utilities.formatDate(new Date(), TIMEZONE, 'yyyy-MM-dd HH:mm:ss');
  var cache = CacheService.getScriptCache(), bucket = 'n-' + Math.floor(Date.now() / 600000);
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);                                            // one write at a time
  try {
    if (cache.get('p-' + digits)) return json_({ ok: true });     // same number a moment ago: already saved
    var count = Number(cache.get(bucket) || 0);
    if (count >= MAX_LEADS_PER_10_MIN) return json_({ ok: true });
    sheet_().appendRow(COLUMNS.map(function (c) { return c[1] ? cell_(p[c[1]]) : ''; }));
    cache.put('p-' + digits, '1', REPEAT_WINDOW_SEC);
    cache.put(bucket, String(count + 1), 900);
  } finally {
    lock.releaseLock();
  }
  if (NOTIFY_EMAILS && MailApp.getRemainingDailyQuota() > 2) notify_(p);
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

/**
 * RSVP receiver for the wedding card.
 * Paste this into the spreadsheet's Extensions > Apps Script, then
 * Deploy > New deployment > Web app (Execute as: Me, Who has access: Anyone).
 * Put the web app URL in config.js -> rsvpEndpoint.
 *
 * Each answer from the card becomes one row in the "ตอบรับแขก" tab.
 */
const SHEET_NAME = "ตอบรับแขก";
const HEADERS = ["เวลา", "ชื่อ - นามสกุล", "มาร่วมงาน", "จำนวนผู้ร่วมงาน", "คำอวยพร"];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000); // two guests sending at once won't overwrite each other
  try {
    const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }
    const p = e.parameter;
    const yes = p.attending === "yes";
    sheet.appendRow([
      new Date(),
      clean(p.name),
      yes ? "เข้าร่วม" : "ไม่สะดวก",
      yes ? Number(p.guests) || 1 : 0,
      clean(p.message),
    ]);
    return ContentService.createTextOutput("ok");
  } finally {
    lock.releaseLock();
  }
}

// Run this once from the editor (select "authorize" > Run) to grant the script
// permission to write to the sheet. Until it is approved, guests get "access denied".
function authorize() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('ไม่พบแท็บชื่อ "' + SHEET_NAME + '"');
  Logger.log("OK: พบแท็บ " + SHEET_NAME + " (" + sheet.getLastRow() + " แถว)");
}

// Plain text only: trims, caps length, and stops text like "=..." being read as a formula.
function clean(v) {
  const s = String(v || "").trim().slice(0, 500);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

/**
 * Creates the oprec response tabs and their header rows.
 *
 * The submit routes append by tab name, so a tab that is missing or misspelled
 * makes every submission fail its Sheets mirror silently. This script creates
 * whatever is missing and writes the headers in the exact column order the
 * routes write, so the two cannot drift.
 *
 * Safe to re-run: existing tabs are left alone and headers are overwritten
 * in place, never appended.
 *
 *   node scripts/setup-oprec-sheets.mjs
 *
 * Needs GOOGLE_SHEETS_ID and GOOGLE_SHEETS_CREDENTIALS in .env.local
 * (`npx vercel env pull .env.local` pulls both from Vercel).
 */
import { google } from "googleapis";
import fs from "fs";

for (const line of fs.readFileSync(".env.local", "utf8").split("\n")) {
  const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
}

const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
const credentialsBase64 = process.env.GOOGLE_SHEETS_CREDENTIALS;

if (!spreadsheetId || !credentialsBase64) {
  console.error(
    "Missing GOOGLE_SHEETS_ID or GOOGLE_SHEETS_CREDENTIALS.\n" +
      "Run: npx vercel env pull .env.local"
  );
  process.exit(1);
}

const credentials = JSON.parse(Buffer.from(credentialsBase64, "base64").toString("utf-8"));

// Column order must match the sheetRow arrays in the submit routes.
const TABS = [
  {
    name: process.env.GOOGLE_SHEETS_FUNCTIONAL_2627_TAB || "Functional Oprec",
    headers: [
      "Timestamp", "Name", "Email", "Phone", "Faculty", "Major", "Batch", "GPA",
      "Active Student", "180DC Alumni", "Past Position", "Past Batch",
      "First Choice", "First Choice Roles", "First Doc Link", "First CV Link",
      "First Portfolio Link", "Second Choice", "Second Choice Roles",
      "Second Doc Link", "Second CV Link", "Second Portfolio Link",
      "Twibbon Post", "Twibbon Proof", "Heard About Us", "180UNLOCKED Proof",
      "180UNLOCKED Acknowledged", "Consent", "IP Address", "User Agent",
    ],
  },
  {
    name: process.env.GOOGLE_SHEETS_CONSULTING_2627_TAB || "Consulting Cycle 1 Oprec",
    headers: [
      "Timestamp", "Name", "Email", "Batch", "Phone", "Faculty", "Major", "GPA",
      "Active Student", "180DC Alumni", "Past Position", "Past Batch",
      "First Choice Division", "First Choice Role", "First Open To Analyst",
      "First Doc Link", "First CV Link",
      "Second Choice Division", "Second Choice Role", "Second Open To Analyst",
      "Second Doc Link", "Second CV Link",
      "Twibbon Post", "Instagram Proof", "Heard About Us", "Consent",
      "IP Address", "User Agent",
    ],
  },
];

const columnLabel = (count) => {
  let label = "";
  let n = count;
  while (n > 0) {
    const remainder = (n - 1) % 26;
    label = String.fromCharCode(65 + remainder) + label;
    n = Math.floor((n - 1) / 26);
  }
  return label;
};

const auth = new google.auth.JWT({
  email: credentials.client_email,
  key: credentials.private_key,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

console.log(`Service account: ${credentials.client_email}`);
console.log(`Spreadsheet:     ${spreadsheetId}\n`);

const meta = await sheets.spreadsheets.get({ spreadsheetId });
console.log(`Opened "${meta.data.properties.title}"\n`);

const existing = meta.data.sheets.map((sheet) => sheet.properties.title);

for (const tab of TABS) {
  if (existing.includes(tab.name)) {
    console.log(`  "${tab.name}" already exists, leaving it alone`);
  } else {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests: [{ addSheet: { properties: { title: tab.name } } }] },
    });
    console.log(`  created "${tab.name}"`);
  }

  const range = `${tab.name}!A1:${columnLabel(tab.headers.length)}1`;
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: "RAW",
    requestBody: { values: [tab.headers] },
  });
  console.log(`  wrote ${tab.headers.length} headers to ${range}\n`);
}

console.log("Done.");

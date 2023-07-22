import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { downloadFile } from '../util';

const AIRLINES_DAT_URL = 'https://raw.githubusercontent.com/jpatokal/openflights/master/data/airlines.dat';
const AIRLINES_DB = path.join(process.cwd(), 'data', 'airlines.db');

export async function initAirlinesDB() {
  const buffer = await downloadFile(AIRLINES_DAT_URL);
  
  const airlines_dat = buffer.toString();
  const airlines_dat_lines = airlines_dat.split('\n');

  const db = loadAirlinesDB();

  db.prepare('DROP TABLE IF EXISTS airlines;').run();
  db.prepare(`
    CREATE TABLE airlines (
      name TEXT,
      alias TEXT,
      iata TEXT,
      icao TEXT,
      callsign TEXT,
      country TEXT,
      active INTEGER
    );
  `).run();

  const insert = db.prepare('INSERT INTO airlines VALUES (?, ?, ?, ?, ?, ?, ?);');

  db.transaction(() => {
    for (let i = 0; i < airlines_dat_lines.length; i++) {
      const data = airlines_dat_lines[i]
        .replaceAll('\\N', 'NULL') // Replace the csv files null value '\N' with a SQLite NULL
        .replace('"N"', '0') // SQLite doesn't support booleans so convert the 'N', 'Y' to 0 or 1
        .replace('"Y"', '1')
        .replaceAll('"', '')
        .split(',')
        .slice(1); // Get rid of the ID column

      // Some entries contain a ',' in a column so get split into more columns than required
      if (data.length == 7) {
        insert.run(...data);
      }
    }
  })();

  db.close();
}

export function verifyAirlinesDB(): boolean {
  return fs.existsSync(AIRLINES_DB) && fs.lstatSync(AIRLINES_DB).size > 0;
}

export function loadAirlinesDB() {
  const db = new Database(AIRLINES_DB);
  db.pragma('journal_mode = WAL');
  return db;
}

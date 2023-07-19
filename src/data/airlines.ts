import fs from 'node:fs';
import path from 'node:path';
import { Database, verbose } from 'sqlite3';
import { downloadFile } from '../util';

const AIRLINES_DAT_URL = 'https://raw.githubusercontent.com/jpatokal/openflights/master/data/airlines.dat';
const AIRLINES_DB = path.join(process.cwd(), 'data', 'airlines.db');

const sqlite3 = verbose();

export async function initAirlinesDB() {
  const buffer = await downloadFile(AIRLINES_DAT_URL);
  
  const airlines_dat = buffer.toString();
  const airlines_dat_lines = airlines_dat.split('\n');

  const db = loadAirlinesDB();
  db.serialize(() => {
    db.run('DROP TABLE IF EXISTS airlines;');
    db.run(`
      CREATE TABLE airlines (
        name TEXT,
        alias TEXT,
        iata TEXT,
        icao TEXT,
        callsign TEXT,
        country TEXT,
        active INTEGER
      );
    `);

    db.run('BEGIN TRANSACTION;');
    for (let i = 0; i < airlines_dat_lines.length; i++) {
      const data = airlines_dat_lines[i]
        .split(',')
        .slice(1) // Get rid of the ID column
        .join(',')
        .replaceAll('\\N', 'NULL') // Replace the csv files null value '\N' with a SQLite NULL
        .replace('"N"', '0') // SQLite doesn't support booleans so convert the 'N', 'Y' to 0 or 1
        .replace('"Y"', '1');

      db.run(`INSERT INTO airlines VALUES (${data});`, (_: unknown, err: unknown) => {
        if (err) {
          console.log(data);
        }
      });
    }
    db.run('COMMIT;');

    db.close();
  });
}

export function verifyAirlinesDB(): boolean {
  return fs.existsSync(AIRLINES_DB) && fs.lstatSync(AIRLINES_DB).size > 0;
}

export function loadAirlinesDB(): Database {
  return new sqlite3.Database(AIRLINES_DB);
}

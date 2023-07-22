import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { downloadFile } from '../util';

const AIRPORTS_CSV_URL = 'https://davidmegginson.github.io/ourairports-data/airports.csv';
const AIRPORTS_SQL_FILE = path.join(process.cwd(), 'data', 'airports.db');

export async function initAirportsDB() {
  const buffer = await downloadFile(AIRPORTS_CSV_URL);

  const airports_csv_data = buffer.toString();
  const airports_csv_lines = airports_csv_data.split('\n');

  const db = loadAirportsDB();

  // Create the table
  db.prepare('DROP TABLE IF EXISTS airports;').run();
  db.prepare(`
    CREATE TABLE airports (
      icao TEXT,
      type TEXT,
      name TEXT,
      lat INTEGER,
      lon INTEGER,
      elevation INTEGER,
      continent TEXT,
      iso_country TEXT,
      iso_region TEXT,
      municipality TEXT,
      scheduled_service TEXT,
      gps_code TEXT,
      iata_code TEXT,
      local_code TEXT,
      home_link TEXT,
      wikipedia_link TEXT
    );
  `).run();

  const insert = db.prepare(`INSERT INTO airports VALUES (${new Array(16).fill('?').join(',')});`);

  // Begin a trasaction and insert all rows into the database
  db.transaction(() => {
    for (let i = 1; i < airports_csv_lines.length - 1; i++) {
      // Any data missing in the csv file is turned into a NULL value
      const data = airports_csv_lines[i]
        .replaceAll('"', '')
        .split(',', 17) // The limit of 17 removes the 'keywords' column
        .map(value => value == '' ? 'NULL' : value)
        .slice(1); // Get rid of the id field

      insert.run(...data);
    }
  })();

  db.close();
}

export function verifyAirportsDB(): boolean {
  return fs.existsSync(AIRPORTS_SQL_FILE) && (fs.lstatSync(AIRPORTS_SQL_FILE).size > 0);
}

export function loadAirportsDB() {
  const db = new Database(AIRPORTS_SQL_FILE);
  db.pragma('journal_mode = WAL');
  return db;
}

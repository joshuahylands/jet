import fs from 'node:fs';
import path from 'node:path';
import { Database, verbose } from 'sqlite3';

import { DATA_DIRECTORY, downloadFile } from './mod';

const AIRPORTS_CSV_URL = 'https://davidmegginson.github.io/ourairports-data/airports.csv';
const AIRPORTS_SQL_FILE = path.join(DATA_DIRECTORY, 'airports.db');

const sqlite3 = verbose();

export async function initAirportsDB() {
  const buffer = await downloadFile(AIRPORTS_CSV_URL);

  const airports_csv_data = buffer.toString();
  const airports_csv_lines = airports_csv_data.split('\n');

  const db = new sqlite3.Database(AIRPORTS_SQL_FILE);

  db.serialize(() => {
    // Create the table
    db.run('DROP TABLE IF EXISTS airports;');
    db.run(`
      CREATE TABLE airports (
        id INTEGER,
        ident TEXT,
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
        wikipedia_link TEXT,
        keywords TEXT
      );
    `);

    // Begin a trasaction and insert all rows into the database
    db.run('BEGIN TRANSACTION;');
    for (let i = 1; i < airports_csv_lines.length - 1; i++) {
      // Any data missing in the csv file is turned into a NULL value
      const data = airports_csv_lines[i]
        .split(',')
        .map(value => value == '' ? 'NULL' : value)
        .join(',');

      db.run(`INSERT INTO airports VALUES (${data});`);
    }
    db.run('COMMIT;');

    db.close();
  });
}

export function verifyAirportsDB(): boolean {
  return fs.existsSync(AIRPORTS_SQL_FILE) && (fs.lstatSync(AIRPORTS_SQL_FILE).size > 0);
}

export function loadAirportsDB(): Database {
  return new sqlite3.Database(AIRPORTS_SQL_FILE);
}

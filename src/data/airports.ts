import fs from 'node:fs';
import https from 'node:https';
import path from 'node:path';
import { verbose } from 'sqlite3';

const DATA_DIRECTORY = path.join(process.cwd(), 'data');
const AIRPORTS_CSV_FILE = path.join(DATA_DIRECTORY, 'airports.csv');
const AIRPORTS_SQL_FILE = path.join(DATA_DIRECTORY, 'airports.db');
const AIRPORTS_CSV_URL = 'https://davidmegginson.github.io/ourairports-data/airports.csv';

const sqlite3 = verbose();

// Downloads airports.csv. Wrapped in a promise to make it easier to use with async-await
function downloadAirportsCSV(): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(AIRPORTS_CSV_FILE, { flags: 'w+' });

    https.get(AIRPORTS_CSV_URL, res => {
      res.pipe(file);

      file.on('finish', () => {
        file.close();
        resolve();
      });

      file.on('error', () => {
        file.close();
        reject();
      });

      res.on('error', () => reject());
    });
  });
}

// This function converts the data in the CSV file into an SQLite Database
function convertAicraftCSVToSQL() {
  const airports_csv_data = fs.readFileSync(AIRPORTS_CSV_FILE).toString();
  const airports_csv_lines = airports_csv_data.split('\n');

  const db = new sqlite3.Database(AIRPORTS_SQL_FILE);

  
  // Create the table
  db.serialize(() => {
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

function cleanup() {
  fs.rmSync(AIRPORTS_CSV_FILE);
}

export async function initAirportsDB() {
  console.log('Downloading airports.csv');
  await downloadAirportsCSV();
  console.log('Creating database');
  convertAicraftCSVToSQL();
  console.log('Cleaning Up');
  cleanup();
}

export function loadAirportsDB() {
  return new sqlite3.Database(AIRPORTS_SQL_FILE);
}

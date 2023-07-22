import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';

type Manufacturer = {
  id: string;
  country: string;
  name: string;
  nativeName: string;
  propertyValues: string[];
  tags: string[];
  url: string;
};

type RawAircraftType = {
  id: string;
  aircraftFamily: string;
  engineCount: number;
  engineFamily: string;
  engineModels: string[]
  iataCode: string;
  icaoCode: string;
  manufacturer: string;
  name: string;
  nativeName: string;
  propertyValues: object[];
  tags: string[];
  url: string;
};

const AIRCRAFT_TYPES_JSON_PATH = path.join(process.cwd(), 'data', 'aircraft-types.json');
const MANUFACTURERS_JSON_PATH = path.join(process.cwd(), 'data', 'manufacturers.json');
const AIRCRAFT_DB_PATH = path.join(process.cwd(), 'data', 'aircraft.db');

export function initAircraftDB() {
  if (!fs.existsSync(AIRCRAFT_TYPES_JSON_PATH) || !fs.existsSync(MANUFACTURERS_JSON_PATH)) {
    return;
  }

  const manufacturers_json: Manufacturer[] = JSON.parse(fs.readFileSync(MANUFACTURERS_JSON_PATH).toString());
  const manufacturers = new Map<string, string>(manufacturers_json.map(m => [m.id, m.name]));

  const aircraft_types: RawAircraftType[] = JSON.parse(fs.readFileSync(AIRCRAFT_TYPES_JSON_PATH).toString());

  const db = loadAircraftDB();

  db.prepare('DROP TABLE IF EXISTS aircraft;').run();
  db.prepare(`
    CREATE TABLE aircraft (
      icao TEXT,
      manufacturer TEXT,
      name TEXT
    );
  `).run();

  const insert = db.prepare('INSERT INTO aircraft VALUES (?, ?, ?);');

  db.transaction(() => {
    for (const aircraft_type of aircraft_types) {
      insert.run(
        aircraft_type.icaoCode,
        manufacturers.get(aircraft_type.manufacturer),
        aircraft_type.name
      );
    }
  })();

  db.close();
}

export function verifyAircraftDB(): boolean {
  return fs.existsSync(AIRCRAFT_DB_PATH) && fs.lstatSync(AIRCRAFT_DB_PATH).size > 0;
}

export function loadAircraftDB() {
  const db = new Database(AIRCRAFT_DB_PATH);
  db.pragma('journal_mode = WAL');
  return db;
}

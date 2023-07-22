import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import Database from 'better-sqlite3';

import { downloadFile } from '../util';

const BASESTATION_SQB_URL = 'https://data.flightairmap.com/data/basestation/BaseStation.sqb.gz';
const BASESTATION_SQB_FILE = path.join(process.cwd(), 'data', 'BaseStation.sqb');

export async function initBaseStationSQB() {
  const buffer = await downloadFile(BASESTATION_SQB_URL);
  const uncompressed = zlib.gunzipSync(buffer);
  fs.writeFileSync(BASESTATION_SQB_FILE, uncompressed);
}

export function verifyBaseStationSQB(): boolean {
  return fs.existsSync(BASESTATION_SQB_FILE) && (fs.lstatSync(BASESTATION_SQB_FILE).size > 0);
}

export function loadBaseStationSQBDatabase() {
  const db = new Database(BASESTATION_SQB_FILE);
  db.pragma('journal_mode = WAL');
  return db;
}

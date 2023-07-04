import fs from 'node:fs';
import https from 'node:https';
import path from 'node:path';
import process from 'node:process';
import zlib from 'node:zlib';
import { verbose } from 'sqlite3';

const BASESTATION_SQB_URL = 'https://data.flightairmap.com/data/basestation/BaseStation.sqb.gz';

const DATA_DIRECTORY = path.join(process.cwd(), 'data');
const BASESTATION_SQB_GZ_FILE = path.join(DATA_DIRECTORY, 'BaseStation.sqb.gz');
const BASESTATION_SQB_FILE = path.join(DATA_DIRECTORY, 'BaseStation.sqb');

const sqlite3 = verbose();

function createDataDirectory() {
  // Check if the directory exists. If not create it
  if (!fs.existsSync(DATA_DIRECTORY)) {
    fs.mkdirSync(DATA_DIRECTORY);
  }
}

// Downloads the gzip file containing BaseStation.sqb. This function wraps the https.get method in a promise to make it easier to use using async-await
function downloadBaseStationSQB(): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(BASESTATION_SQB_GZ_FILE, { flags: 'w+' });

    https.get(BASESTATION_SQB_URL, (res) => {
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

// Unzip the BaseStation.sqb.gz file
function unzipBaseStationSQB() {
  const file = fs.readFileSync(BASESTATION_SQB_GZ_FILE);

  const uncompressedFile = zlib.gunzipSync(file);

  fs.writeFileSync(BASESTATION_SQB_FILE, uncompressedFile);
}

// Get rid of the gzip file
function cleanup() {
  fs.rmSync(BASESTATION_SQB_GZ_FILE);
}

// Downloads the BaseStation.sqb file
export async function loadBaseStationSQB() {
  console.log('Creating `data` directory');
  createDataDirectory();
  console.log('Downloading BaseStation.sqb.gz');
  await downloadBaseStationSQB();
  console.log('Unzipping BaseStation.sqb.gz');
  unzipBaseStationSQB();
  console.log('Cleaning Up');
  cleanup();
}

// Loads the BaseStation.sqb file using sqlite3
export function loadBaseStationSQBDatabase() {
  return new sqlite3.Database(BASESTATION_SQB_FILE);
}

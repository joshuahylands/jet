import fs from 'node:fs';
import https from 'node:https';
import path from 'node:path';

import { initBaseStationSQB, verifyBaseStationSQB } from './baseStation';
import { initAirportsDB, verifyAirportsDB } from './airports';

export const DATA_DIRECTORY = path.join(process.cwd(), 'data');

// Utility function that wraps the https.get method provided by Node in a promise
export function downloadFile(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    https.get(url, res => {
      res.on('data', chunk => chunks.push(chunk));
      res.on('error', reject);
      res.on('close', () => resolve(Buffer.concat(chunks)));
    });
  });
}

// If the directory doesn't exist then create it
function initDataDirectory() {
  if (!fs.existsSync(DATA_DIRECTORY)) {
    fs.mkdirSync(DATA_DIRECTORY);
  }
}

// Check Data exists. If not then exit
function verifyData() {
  if (
    verifyBaseStationSQB() &&
    verifyAirportsDB()
  ) {
    console.error('Data not verified!');
    process.exit(1);
  }
}

async function initData() {
  if (!process.argv.includes('--nofetch')) {
    // Init the data directory
    initDataDirectory();

    // Fetch data
    await initBaseStationSQB();
    await initAirportsDB();
  }

  // Verify the data
  verifyData();
}

export default initData;

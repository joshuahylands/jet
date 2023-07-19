import fs from 'node:fs';
import path from 'node:path';

import { initBaseStationSQB, verifyBaseStationSQB } from './baseStation';
import { initAirportsDB, verifyAirportsDB } from './airports';
import { initAirlinesDB, verifyAirlinesDB } from './airlines';

export const DATA_DIRECTORY = path.join(process.cwd(), 'data');

// If the directory doesn't exist then create it
function initDataDirectory() {
  if (!fs.existsSync(DATA_DIRECTORY)) {
    fs.mkdirSync(DATA_DIRECTORY);
  }
}

// Check Data exists. If not then exit
function verifyData() {
  if (!(
    verifyBaseStationSQB() &&
    verifyAirportsDB() &&
    verifyAirlinesDB()
  )) {
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
    await initAirlinesDB();
  }

  // Verify the data
  verifyData();
}

export default initData;

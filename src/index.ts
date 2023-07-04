import 'dotenv/config';
import express from 'express';

import createAircraftRouter from './api/aircraft';
import { loadBaseStationSQB } from './data/baseStation';
import docsRouter from './docs/docsRouter';

async function main() {
  // Check for the --nofetch argument. If not present download data
  if (!process.argv.includes('--nofetch')) {
    await loadBaseStationSQB();
  }

  // Set up the express app and routes
  const app = express();

  app.use(docsRouter);
  app.use('/api/v1/aircraft', createAircraftRouter());

  // Start listening
  const PORT = Number(process.env.PORT) || 8000;
  const ADDR = process.env.ADDR || '127.0.0.1';

  app.listen(PORT, ADDR, () => {
    console.log(`Listening on ${ADDR}:${PORT}`);
  });
}

main();

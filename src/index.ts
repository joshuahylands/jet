import 'dotenv/config';
import express from 'express';

import createAircraftRouter from './api/aircraft';
import createAirportsRouter from './api/airports';
import initData from './data/mod';
import docsRouter from './docs/docsRouter';

async function main() {
  await initData();

  // Set up the express app and routes
  const app = express();

  app.use(docsRouter);
  app.use('/api/v1/aircraft', createAircraftRouter());
  app.use('/api/v1/airports', createAirportsRouter());

  // Start listening
  const PORT = Number(process.env.PORT) || 8000;
  const ADDR = process.env.ADDR || '127.0.0.1';

  app.listen(PORT, ADDR, () => {
    console.log(`Listening on ${ADDR}:${PORT}`);
  });
}

main();

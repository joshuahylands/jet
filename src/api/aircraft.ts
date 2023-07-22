import { Router } from 'express';

import { loadAircraftDB } from '../data/aircraft';
import { loadBaseStationSQBDatabase } from '../data/baseStation';
import AircraftType from '../model/AircraftType';
import Response from '../model/Response';

type ResponseData = {
  icao24: string;
  country: string;
  country_code: string;
  registration: string;
  type: AircraftType | string;
  owner: string;
};

type QueryData = {
  icao24: string;
};

function createAircraftRouter() {
  const router = Router();
  const baseStationDB = loadBaseStationSQBDatabase();
  const aircraftTypeDB = loadAircraftDB();

  const aircraftSelect = baseStationDB.prepare(`
    SELECT
      ModeS AS icao24,
      ModeSCountry AS country,
      Country AS country_code,
      Registration AS registration,
      ICAOTypeCode AS type,
      RegisteredOwners AS owners
    FROM
      Aircraft
    WHERE
      ModeS=?;
  `);
  const typeSelect = aircraftTypeDB.prepare('SELECT * FROM aircraft WHERE icao=?;');

  router.get<object, Response<ResponseData>, object, QueryData>('/', (req, res) => {
    const { icao24 } = req.query;
  
    const aircraft = aircraftSelect.get(icao24.toUpperCase()) as ResponseData | undefined;

    if (!aircraft) {
      return res
        .status(404)
        .send({
          success: false
        });
    }
  
    const aircraftType = typeSelect.get(aircraft.type) as AircraftType | undefined;

    if (aircraftType) {
      aircraft.type = aircraftType;
    }

    // Send a successful response
    res.send({
      success: true,
      data: aircraft
    });
  });

  return router;
}

export default createAircraftRouter;

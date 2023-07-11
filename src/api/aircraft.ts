import { Router } from 'express';

import Response from '../model/Response';
import { loadBaseStationSQBDatabase } from '../data/baseStation';

type ResponseData = {
  icao24: string;
  country: string;
  country_code: string;
  registration: string;
  manufacturer: string;
  type_code: string;
  type: string;
  owner: string;
};

type QueryData = {
  icao24: string;
};

function createAircraftRouter() {
  const router = Router();
  const db = loadBaseStationSQBDatabase();

  router.get<object, Response<ResponseData>, object, QueryData>('/', (req, res) => {
    const { icao24 } = req.query;
  
    const query = `
      SELECT
        ModeS AS icao24,
        ModeSCountry AS country,
        Country AS country_code,
        Registration AS registration,
        Manufacturer AS manufaturer,
        ICAOTypeCode AS type_code,
        Type AS type,
        RegisteredOwners AS owners
      FROM
        Aircraft
      WHERE
        ModeS='${icao24.toUpperCase()}'
    `;
  
    db.get(query, (err, row: ResponseData) => {
      // Handle errors and if the aircraft isn't in the database
      if (err) {
        return res
          .status(500)
          .send({
            success: false
          });
      } else if (row == undefined) {
        return res
          .status(404)
          .send({
            success: false
          });
      }
  
      // Send a successful response
      res.send({
        success: true,
        data: row
      });
    });
  });

  return router;
}

export default createAircraftRouter;

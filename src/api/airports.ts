import { Router } from 'express';

import { loadAirportsDB } from '../data/airports';
import Response from '../model/Response';

// Defines the data in each row in the database
type ResponseData = {
  id: number;
  ident: string;
  type: string;
  name: string;
  lat: number;
  lon: number;
  elevation: number;
  continent: string;
  iso_country: string;
  iso_region: string;
  municipality: string;
  scheduled_service: string;
  gps_code: string;
  iata_code: string;
  local_code: string;
  home_link: string;
  wikipedia_link: string;
  keywords: string;
};

type QueryData = {
  lat_min: number;
  lat_max: number;
  lon_min: number;
  lon_max: number;
};

function createAirportsRouter() {
  const router = Router();
  const db = loadAirportsDB();

  router.get<object, Response<ResponseData[]>, object, QueryData>('/', (req, res) => {
    const { lat_min, lat_max, lon_min, lon_max } = req.query;

    const query = `
      SELECT *
      FROM airports
      WHERE
        lat >= ${lat_min} AND
        lat <= ${lat_max} AND
        lon >= ${lon_min} AND
        lon <= ${lon_max}
    `;

    db.all(query, (err, rows: ResponseData[]) => {
      // Handle any error with the database
      if (err) {
        return res
          .status(500)
          .send({
            success: false
          });
      }

      // Send all the rows found
      res.send({
        success: true,
        data: rows
      });
    });
  });

  return router;
}

export default createAirportsRouter;

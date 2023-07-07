import { Router } from 'express';

import { loadAirportsDB } from '../data/airports';
import Airport from '../model/Airport';
import Response from '../model/Response';

type QueryData = {
  lat_min: number;
  lat_max: number;
  lon_min: number;
  lon_max: number;
};

function createAirportsRouter() {
  const router = Router();
  const db = loadAirportsDB();

  router.get<object, Response<Airport[]>, object, QueryData>('/', (req, res) => {
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

    db.all(query, (err, rows: Airport[]) => {
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

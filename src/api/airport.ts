import { Router } from 'express';

import { loadAirportsDB } from '../data/airports';
import Airport from '../model/Airport';
import Response from '../model/Response';

type QueryData = {
  icao?: string;
  iata?: string;
};

function createAirportRouter() {
  const router = Router();
  const db = loadAirportsDB();

  router.get<object, Response<Airport>, object, QueryData>('/', (req, res) => {
    const { icao, iata } = req.query;

    const query = `
      SELECT *
      FROM airports
      WHERE
        icao='${icao}' OR
        iata_code='${iata}'
    `;

    db.get(query, (err, row: Airport) => {
      // Handle any error with the database
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

      // Send the airport found
      res.send({
        success: true,
        data: row
      });
    });
  });

  return router;
}

export default createAirportRouter;

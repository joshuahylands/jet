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
  const select = db.prepare('SELECT * FROM airports WHERE icao=? OR iata_code=?;');

  router.get<object, Response<Airport>, object, QueryData>('/', (req, res) => {
    const { icao, iata } = req.query;

    const airport = select.get(icao, iata) as Airport | undefined;

    if (!airport) {
      return res
        .status(404)
        .send({
          success: false
        });
    }

    res.send({
      success: true,
      data: airport
    });
  });

  return router;
}

export default createAirportRouter;

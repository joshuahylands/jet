import { Router } from 'express';
import { loadAirlinesDB } from '../data/airlines';
import Response from '../model/Response';

type ResponseData = {
  name: string;
  alias: string;
  iata: string;
  icao: string;
  callsign: string;
  country: string;
  active: boolean;
};

type QueryData = {
  icao?: string;
  iata?: string;
};

function createAirlineRouter() {
  const router = Router();
  const db = loadAirlinesDB();

  router.get<object, Response<ResponseData>, object, QueryData>('/', (req, res) => {
    const query = `
      SELECT *
      FROM airlines
      WHERE
        icao = '${req.query.icao}' OR
        iata = '${req.query.iata}'
    `;

    db.get(query, (err, row: ResponseData) => {
      // Handle errors and no matching rows
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

      // SQLite doesn't support booleans instead using 1 or 0. So we convert that 1 or 0 into a boolean
      row.active = Boolean(row.active);

      // Send the row found
      res.send({
        success: true,
        data: row
      });
    });
  });

  return router;
}

export default createAirlineRouter;

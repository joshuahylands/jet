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
  const select = db.prepare('SELECT * FROM airlines WHERE icao=? OR iata=?;');

  router.get<object, Response<ResponseData>, object, QueryData>('/', (req, res) => {
    const airline = select.get(req.query.icao, req.query.iata) as ResponseData | undefined;

    if (!airline) {
      return res
        .status(404)
        .send({
          success: false
        });
    }

    // SQLite doesn't support booleans instead using 1 or 0. So we convert that 1 or 0 into a boolean
    airline.active = Boolean(airline.active);

    res.send({
      success: true,
      data: airline
    });
  });

  return router;
}

export default createAirlineRouter;

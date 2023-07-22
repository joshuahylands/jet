import { Router } from 'express';
import { loadAircraftDB } from '../data/aircraft';
import Response from '../model/Response';

type AircraftType = {
  icao: string;
  manufaturer: string;
  name: string;
};

type QueryData = {
  icao: string;
};

function createTypeRouter() {
  const router = Router();
  const db = loadAircraftDB();
  const select = db.prepare('SELECT * FROM aircraft WHERE icao=?;');

  router.get<object, Response<AircraftType>, object, QueryData>('/', (req, res) => {
    const { icao } = req.query;

    const aircraft_type = select.get(icao) as AircraftType | undefined;

    if (aircraft_type == undefined) {
      return res
        .status(404)
        .send({
          success: false
        });
    }

    res.send({
      success: true,
      data: aircraft_type
    });
  });

  return router;
}

export default createTypeRouter;

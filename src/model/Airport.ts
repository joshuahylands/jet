type Airport = {
  icao: string;
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

export default Airport;

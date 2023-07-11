# jet

## Endpoints

The base endpoint for this API is `/api/v1`

### GET `/aircraft?icao24=<ICAO24>`

Responds with data about an aircraft when given it's ICAO 24-bit Address

#### Parameters
- `icao24` - The [ICAO 24-bit Address](https://en.wikipedia.org/wiki/Aviation_transponder_interrogation_modes#ICAO_24-bit_address) assigned to the aircraft (required)

#### Example:
GET `/api/v1/aircraft?icao24=4063E7`
```json
{
  "success": true,
  "data": {
    "icao24": "4063E7",
    "country": "United Kingdom",
    "country_code": "G",
    "registration": "G-VKSS",
    "manufaturer": "AIRBUS",
    "type_code": "A333",
    "type": "A-330-300",
    "owners": "Virgin Atlantic Airways"
  }
}
```

### GET `/airport`

Returns data about the airport with either the ICAO code or IATA code provided

### Parameters
- `icao` - [ICAO Airport Code](https://en.wikipedia.org/wiki/ICAO_airport_code)
- `iata` - [IATA Airport Code](https://en.wikipedia.org/wiki/IATA_airport_code)

#### Example
GET `/api/v1/airport?icao=EGKK`

```json
{
  "success": true,
  "data": {
    "icao": "EGKK",
    "type": "large_airport",
    "name": "London Gatwick Airport",
    "lat": 51.148102,
    "lon": -0.190278,
    "elevation": 202,
    "continent": "EU",
    "iso_country": "GB",
    "iso_region": "GB-ENG",
    "municipality": "London",
    "scheduled_service": "yes",
    "gps_code": "EGKK",
    "iata_code": "LGW",
    "local_code": null,
    "home_link": "http://www.gatwickairport.com/",
    "wikipedia_link": "https://en.wikipedia.org/wiki/Gatwick_Airport",
    "keywords": "LON, Crawley, Charlwood"
  }
}
```

### GET `/airports?lat_min=<LAT_MIN>&lat_max=<LAT_MAX>&lon_min=<LON_MIN>&lon_max=<LON_MAX>`

Returns all airports within the specified latitude and longitude bounds. An additional parameter `type` will only return airports that are of the types specified

#### Parameters
- `lat_min`: number (required)
- `lat_max`: number (required)
- `lon_min`: number (required)
- `lon_max`: number (required)
- `type`: comma-separated string with possible values: `closed`, `heliport`, `small_airport`, `medium_airport`, `large_airport`

#### Example:
GET `/api/v1/airports?lat_min=51.1&lat_max=51.25&lon_min=-0.2&lon_max=-0.1`

```json
{
  "success": true,
  "data": [
    {
      "icao": "EGKK",
      "type": "large_airport",
      "name": "London Gatwick Airport",
      "lat": 51.148102,
      "lon": -0.190278,
      "elevation": 202,
      "continent": "EU",
      "iso_country": "GB",
      "iso_region": "GB-ENG",
      "municipality": "London",
      "scheduled_service": "yes",
      "gps_code": "EGKK",
      "iata_code": "LGW",
      "local_code": null,
      "home_link": "http://www.gatwickairport.com/",
      "wikipedia_link": "https://en.wikipedia.org/wiki/Gatwick_Airport",
      "keywords": "LON, Crawley, Charlwood"
    },
    {
      "icao": "EGKR",
      "type": "small_airport",
      "name": "Redhill Aerodrome",
      "lat": 51.2136,
      "lon": -0.138611,
      "elevation": 222,
      "continent": "EU",
      "iso_country": "GB",
      "iso_region": "GB-ENG",
      "municipality": "Redhill",
      "scheduled_service": "no",
      "gps_code": "EGKR",
      "iata_code": null,
      "local_code": null,
      "home_link": "http://www.redhillaerodrome.com/",
      "wikipedia_link": "https://en.wikipedia.org/wiki/Redhill_Aerodrome",
      "keywords": "RAF Redhill"
    }
  ]
}
```

## Running

Define the following environment variables:
- ADDR (Default: 127.0.0.1)
- PORT (Default: 8000)

Arguments
- --nofetch (Optional) - Disables downloading data sources. Data sources must be present in a `data` folder stored in the current working directory.

```sh
npm run start
```
or
```sh
npm run start-nofetch # Equivalent to npm run start -- --nofetch
```

## Data

This API relies on data from:

- https://data.flightairmap.com/
  - BaseStation.sqb.gz
- https://ourairports.com/data/
  - airports.csv

These files are downloaded automatically when the program is executed and converted into the required formats

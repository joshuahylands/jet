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
    "type": {
      "icao": "A333",
      "manufacturer": "Airbus",
      "name": "A330-300"
    },
    "owners": "Virgin Atlantic Airways"
  }
}
```

### GET `/airline`

Returns data about the airline with either the ICAO code or IATA code provided

#### Parameters
- `icao` - Airline ICAO Code
- `iata` - Airline IATA Code

#### Example
GET `/api/v1/airline?icao=BAW`

```json
{
  "success": true,
  "data": {
    "name": "British Airways",
    "alias": null,
    "iata": "BA",
    "icao": "BAW",
    "callsign": "SPEEDBIRD",
    "country": "United Kingdom",
    "active": true
  }
}
```

### GET `/airport`

Returns data about the airport with either the ICAO code or IATA code provided

#### Parameters
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
    "wikipedia_link": "https://en.wikipedia.org/wiki/Gatwick_Airport"
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
      "wikipedia_link": "https://en.wikipedia.org/wiki/Gatwick_Airport"
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
      "wikipedia_link": "https://en.wikipedia.org/wiki/Redhill_Aerodrome"
    }
  ]
}
```

### GET `/type`

Returns details about an aircraft type

#### Parameters
- `icao` - [ICAO Aircraft Type Designator](https://en.wikipedia.org/wiki/List_of_aircraft_type_designators)

#### Example
GET `/api/v1/type?icao=B788`

```json
{
  "success": true,
  "data": {
    "icao": "B788",
    "manufacturer": "Boeing",
    "name": "787-8 Dreamliner"
  }
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
- https://openflights.org/data.html
  - airlines.data
- https://aircraft-database.com/ - This data must be put in the `data` folder manually as it requires a login to download. See license below
  - manufacturers.json
  - aircraft-types.json

All files, except those from https://aircraft-database.com/, are downloaded automatically when the program is executed and converted into the required formats

Contains information from [Aircraft Database](https://aircraft-database.com/) which is made available under the [ODC Attribution License](https://opendatacommons.org/licenses/by/1-0/).

# jet

## Endpoints

The base endpoint for this API is `/api/v1`

### GET `/aircraft?icao24=<ICAO24>`

Responds with data about an aircraft when given it's ICAO 24-bit Address

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

## Running

Define the following environment variables:
- ADDR (Default: 127.0.0.1)
- PORT (Default: 8000)

Arguments
- --nofetch (Optional) - Disables downloading data sources. Data sources must be present in a `data` folder stored in the current working directory.

```sh
npm run start
```

## Data

This API relies on data from:

- https://data.flightairmap.com/
  - BaseStation.sqb.gz

These files are downloaded automatically when the program is executed

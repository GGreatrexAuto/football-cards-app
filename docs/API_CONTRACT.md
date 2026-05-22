# Football Cards API Contract

**Base URL**: `http://localhost:8000/api/v1`  
**Auth**: None required on the client — the Football-Data.org API key is a backend secret (`FOOTBALL_DATA_API_KEY` in `.env`)  
**CORS**: `http://localhost:3000` (React dev server)  
**Data source**: Football-Data.org v4 when `FOOTBALL_DATA_API_KEY` is set; built-in mock data otherwise  

---

## Endpoints

### `GET /api/v1/health`

Returns service liveness and external API connectivity status.

**Response `200`**
```json
{
  "status": "ok",
  "external_api": "connected"
}
```

`external_api` values:

| Value | Meaning |
|---|---|
| `connected` | Football-Data.org responded successfully at startup |
| `unreachable` | Key is set but Football-Data.org was unreachable at startup — mock data is served |
| `not_configured` | `FOOTBALL_DATA_API_KEY` is not set — mock data is served |
| `unknown` | Startup probe has not run (e.g. test clients that skip lifespan) |

---

### `GET /api/v1/clubs`

Returns a list of football clubs, aggregated from the competitions configured in `FOOTBALL_DATA_COMPETITIONS`.

**Response `200`** — `Club[]`
```json
[
  { "id": 57, "name": "Arsenal FC", "league_id": 2021 },
  { "id": 86, "name": "Real Madrid CF", "league_id": 2014 }
]
```

| Field | Type | Description |
|---|---|---|
| `id` | `int` | Football-Data.org team ID |
| `name` | `str` | Club name |
| `league_id` | `int` | ID of the competition the club belongs to |

**Response `503`** — if the service layer raises an unhandled exception (the mock fallback normally prevents this).
```json
{ "detail": "Service Unavailable" }
```

---

### `GET /api/v1/nations`

Returns a list of countries (areas with a `countryCode` in Football-Data.org).

**Response `200`** — `Nation[]`
```json
[
  { "id": 2072, "name": "England", "country_code": "ENG" },
  { "id": 2088, "name": "Germany", "country_code": "DEU" }
]
```

| Field | Type | Description |
|---|---|---|
| `id` | `int` | Football-Data.org area ID |
| `name` | `str` | Country name |
| `country_code` | `str \| null` | Football-Data.org 3-letter country code (e.g. `"ENG"`, `"FRA"`). Used by the frontend to resolve a flag image. |

**Response `503`** — same as `/clubs`.

---

### `GET /api/v1/leagues`

Returns a list of competitions/leagues available from Football-Data.org.

**Response `200`** — `League[]`
```json
[
  { "id": 2021, "name": "Premier League" },
  { "id": 2014, "name": "Primera Division" }
]
```

| Field | Type | Description |
|---|---|---|
| `id` | `int` | Football-Data.org competition ID |
| `name` | `str` | Competition name |

**Response `503`** — same as `/clubs`.

---

### `GET /api/v1/positions`

Returns the fixed set of player positions. Data is static — no external API is consulted.

**Response `200`** — `Position[]`
```json
[
  { "code": "GK", "name": "Goalkeeper" },
  { "code": "DEF", "name": "Defender" },
  { "code": "MID", "name": "Midfielder" },
  { "code": "FWD", "name": "Forward" }
]
```

| Field | Type | Description |
|---|---|---|
| `code` | `str` | Short position code used as the stored value |
| `name` | `str` | Human-readable position label |

**Response `503`** — same as `/clubs` (in practice this cannot occur as data is static).

---

## Error Format

All error responses use FastAPI's default shape:

```json
{ "detail": "<human-readable message>" }
```

Common status codes: `503 Service Unavailable` (external dependency failure).

---

## Environment Variables

| Variable | Default | Purpose |
|---|---|---|
| `FOOTBALL_DATA_API_KEY` | `""` | Football-Data.org v4 API key. Empty = mock data. |
| `FOOTBALL_DATA_API_URL` | `https://api.football-data.org/v4` | External API base URL. |
| `FOOTBALL_DATA_COMPETITIONS` | `PL,PD,BL1,SA,FL1` | Comma-separated competition codes for the `/clubs` endpoint. |

Copy `.env.example` → `.env` to configure. Free keys: <https://www.football-data.org/client/register>

# IDX Exchange Property Search

A full-stack property search application for browsing MLS/RETS-style listing data. Users can filter and sort listings, move through paginated results, view property details and photos, open a location in Google Maps, and check scheduled open houses.

## Features

- Filter listings by city, ZIP code, price, bedrooms, and bathrooms
- Sort by price, listing date, square footage, or bedrooms
- Paginated search results
- Property detail and photo views
- Google Maps integration
- Open-house lookup by listing ID
- Automated backend and frontend tests

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19.2.7, React Router 8.3.0, React Bootstrap 2.10.10 |
| Build and frontend tests | Vite 8.1.1, Vitest 4.1.10, React Testing Library 16.3.2 |
| Backend | Node.js, Express 5.2.1 |
| Backend tests | Jest 30.4.2, Supertest 7.2.2 |
| Database | MySQL 8, mysql2 3.22.5 |

## Prerequisites

- Node.js `20.19+` or `22.12+`
- npm
- MySQL 8, installed locally or running through Docker Desktop
- Authorized `rets_property` and `rets_openhouse` SQL dumps

## Local Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd IDX_summer_26_project
```

### 2. Start MySQL

The following example starts MySQL 8 on port 3306:

```bash
docker run --name idx-mysql-local -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=<your-password> \
  -e MYSQL_DATABASE=rets \
  -d mysql:8
```

In PowerShell, use:

```powershell
docker run --name idx-mysql-local -p 3306:3306 `
  -e MYSQL_ROOT_PASSWORD=<your-password> `
  -e MYSQL_DATABASE=rets `
  -d mysql:8
```

### 3. Import the data

Use SQL dumps provided through an authorized project source; they are not included in this repository.

```bash
mysql -h 127.0.0.1 -u root -p rets < path/to/rets_property.sql
mysql -h 127.0.0.1 -u root -p rets < path/to/rets_openhouse.sql
```

### 4. Configure and run the backend

macOS/Linux:

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Windows PowerShell:

```powershell
Set-Location backend
Copy-Item .env.example .env
npm install
npm run dev
```

Update `backend/.env` with your local database credentials. The API runs at `http://localhost:5000` with the example configuration.

| Variable | Purpose | Example |
|---|---|---|
| `PORT` | Express server port | `5000` |
| `HOST` | MySQL host | `127.0.0.1` |
| `DB_USER` | MySQL user | `root` |
| `DB_PASS` | MySQL password | local password |
| `DB_DATABASE` | MySQL database | `rets` |

### 5. Configure and run the frontend

Open another terminal, then run:

macOS/Linux:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Windows PowerShell:

```powershell
Set-Location frontend
Copy-Item .env.example .env
npm install
npm run dev
```

Set `VITE_GOOGLE_MAPS_API_KEY` in `frontend/.env` if you want the property map feature. Because Vite exposes this key to the browser, restrict it by API and HTTP referrer in Google Cloud.

The frontend runs at `http://localhost:3000` and proxies `/api` requests to `http://localhost:5000`.

### 6. Verify the application

- Open `http://localhost:3000` to view the listing page.
- Open `http://localhost:3000/api/health` to verify API and database connectivity.

A successful health response looks like:

```json
{
  "status": "OK",
  "database": "Connected"
}
```

## API Reference

Use `http://localhost:5000` directly or access the API through the frontend development proxy at `http://localhost:3000/api`.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Check API and database connectivity |
| `GET` | `/api/properties` | Return a filtered, sorted, paginated property list |
| `GET` | `/api/properties/:id` | Return one property by listing ID |
| `GET` | `/api/properties/:id/openhouses` | Return a property's open-house events |

### `GET /api/properties`

| Parameter | Type | Default | Description |
|---|---|---|---|
| `limit` | integer | `20` | Number of results; range 1–100 |
| `offset` | integer | `0` | Number of results to skip; must be non-negative |
| `city` | string | — | Exact, trimmed, case-insensitive city match |
| `zipcode` | string | — | Five-digit ZIP code |
| `minPrice` | integer | — | Minimum price, inclusive |
| `maxPrice` | integer | — | Maximum price, inclusive |
| `beds` | integer or `5+` | — | Exact bedroom count; `5+` means at least five |
| `baths` | number, `5+`, or `5.0+` | — | Exact bathroom count; the two `5+` forms mean at least five |
| `sortBy` | string | — | `price`, `dateListed`, `sqft`, or `beds` |
| `sortOrder` | string | `asc` | `asc` or `desc`; used when `sortBy` is supplied |

Without `sortBy`, results are ordered by `L_ListingID ASC`.

Example:

```http
GET /api/properties?city=Portland&minPrice=300000&beds=3&sortBy=price&sortOrder=asc&limit=10&offset=0
```

Success response:

```json
{
  "total": 53122,
  "limit": 10,
  "offset": 0,
  "results": [
    {
      "L_ListingID": "20231045",
      "L_Address": "123 SW Main St",
      "L_City": "Portland",
      "L_State": "OR",
      "L_Zip": "97201",
      "L_SystemPrice": 425000,
      "L_Keyword2": 3,
      "LM_Dec_3": 2,
      "LM_Int2_3": 1620
    }
  ]
}
```

Malformed parameters return HTTP 400 with an `error` message.

### `GET /api/properties/:id`

Returns the complete `rets_property` row whose `L_ListingID` matches the positive integer `id`.

- HTTP 200: property object
- HTTP 400: invalid listing ID
- HTTP 404: `{ "error": "property not found" }`

### `GET /api/properties/:id/openhouses`

Returns an array of matching `rets_openhouse` rows ordered by `OpenHouseDate` and `OH_StartTime`.

- HTTP 200: array of events, or `[]` when there are none
- HTTP 400: invalid listing ID
- HTTP 404: `{ "error": "property not found" }`

## Testing and Quality Checks

Backend:

```bash
cd backend
npm test
npm run test:coverage
```

Frontend:

```bash
cd frontend
npm test
npm run test:coverage
npm run lint
npm run build
```

Frontend coverage is intentionally targeted at `PropertyFilters`, `Pagination`, and `PropertyCard`; it is not a global application coverage threshold.

## Database Summary

`rets_property` stores the primary listing records. API routes identify properties using `L_ListingID`; filters use city, ZIP code, price, bedrooms, and bathrooms fields.

`rets_openhouse` stores open-house events and relates them to properties through `L_ListingID`. The relationship is queried by the application but is not enforced by a database foreign key.

## Known Issues and Future Improvements

- The property-card carousel includes button controls inside card-level link navigation, resulting in nested interactive HTML that should be restructured.
- Numeric filters use `parseInt` and `parseFloat`, so partially numeric strings can be accepted instead of rejected strictly.
- Backend sorting and internal-error branches need additional automated test coverage.
- The Google Maps browser key must be restricted before public deployment.
- Production deployment and continuous-delivery instructions have not yet been added.

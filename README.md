# Inventory Application (Web + Mobile-ready API)

This project provides:

- A **web-based inventory UI** served by Express.
- A **PostgreSQL-backed REST API** exposed at `/api/v1/items`.
- A setup that can also be consumed by **mobile applications** (JSON over HTTP + CORS enabled).

## Tech Stack

- Node.js + Express
- PostgreSQL (`pg` driver)
- Vanilla HTML/CSS/JS frontend

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start PostgreSQL:
   ```bash
   docker compose up -d
   ```
3. Copy env file:
   ```bash
   cp .env.example .env
   ```
4. Run the app:
   ```bash
   npm start
   ```
5. Open `http://localhost:3000`.

## API Endpoints

Base path: `/api/v1/items`

- `GET /api/v1/items` — list items
- `GET /api/v1/items/:id` — get one item
- `POST /api/v1/items` — create item
- `PUT /api/v1/items/:id` — update item
- `DELETE /api/v1/items/:id` — delete item

### Example create payload

```json
{
  "sku": "MOB-001",
  "name": "USB-C Cable",
  "description": "1 meter cable",
  "quantity": 50,
  "unit_price": 9.99
}
```

## Mobile App Consumption Notes

- API returns JSON consistently in `{ "data": ... }` or `{ "error": ... }` format.
- CORS is enabled globally for cross-platform clients.
- Endpoints are versioned under `/api/v1` for safer future iterations.

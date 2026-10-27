# Inventory Management – Backend (REST API)

Express.js API for the Inventory module of the Inventory Management Dashboard: authentication (sign up / login with JWT) and products (list, search, create, update, get by ID).

Frontend repository: https://github.com/Awantha2003/I_frontend

## Tech stack

- Node.js + Express 5
- JSON Web Tokens (`jsonwebtoken`) for authentication
- `bcryptjs` for password hashing
- In-memory data store, seeded with 12 products (data resets when the server restarts)

## Setup

Requires Node.js 18 or newer.

```bash
git clone https://github.com/Awantha2003/I_backend.git
cd I_backend
npm install
cp .env.example .env      # then set JWT_SECRET to a long random string
npm run dev               # auto-reload with nodemon
# or
npm start
```

The API runs on `http://localhost:5000` by default.

### Environment variables

| Name         | Description                         | Example           |
| ------------ | ----------------------------------- | ----------------- |
| `PORT`       | Port the server listens on          | `5000`            |
| `JWT_SECRET` | Secret used to sign the JWT tokens  | any long random string |

`.env` is git-ignored; only `.env.example` is committed.

## API

All request and response bodies are JSON. Product endpoints require the header `Authorization: Bearer <token>` (token from `/api/auth/login`).

| Method | Endpoint             | Auth | Description |
| ------ | -------------------- | ---- | ----------- |
| POST   | `/api/auth/signup`   | No   | Create an account `{ name, email, password }` |
| POST   | `/api/auth/login`    | No   | Log in `{ email, password }` → `{ token, user }` |
| GET    | `/api/products`      | Yes  | List products. Optional `?search=` filters by name (case-insensitive) |
| GET    | `/api/products/:id`  | Yes  | Get one product |
| POST   | `/api/products`      | Yes  | Create a product |
| PUT    | `/api/products/:id`  | Yes  | Update a product |

### Product model

```json
{
  "id": 1,
  "productId": "PRD-001",
  "name": "Maggi",
  "category": "Food",
  "price": 430,
  "quantity": 43,
  "unit": "Packets",
  "threshold": 12,
  "expiryDate": "2026-12-11"
}
```

`price` is the buying price, and `threshold` is the threshold value from the design. Availability (In stock, Low stock or Out of stock) is worked out from `quantity` and `threshold`.

### Validation and errors

Errors are returned as `{ "message": "..." }`.

| Status | When |
| ------ | ---- |
| 400 | Invalid input: missing name or invalid email on sign up, password shorter than 8 characters, missing product fields, negative or non-numeric price, quantity or threshold, invalid date, malformed JSON |
| 401 | Missing, invalid or expired token; wrong email or password on login |
| 404 | Unknown product ID or unknown route |
| 409 | Email already registered, or the Product ID is already in use |

Passwords are hashed with bcrypt (10 salt rounds) and are never stored or returned in plain text.

### Example

```bash
curl -X POST http://localhost:5000/api/auth/signup -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' | node -pe 'JSON.parse(require("fs").readFileSync(0)).token')

curl "http://localhost:5000/api/products?search=maggi" -H "Authorization: Bearer $TOKEN"
```

## Project structure

```
src/
  index.js            App setup, routes, error handlers
  data/store.js       In-memory users and seeded products
  middleware/auth.js  JWT check for protected routes
  routes/auth.js      /api/auth/signup, /api/auth/login
  routes/products.js  /api/products CRUD, validation and search
```

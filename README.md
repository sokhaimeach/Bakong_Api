# Bakong API (Bakong_Api)

A small Node.js + Express server to:
- create payments with Bakong KHQR
- store payment records in MongoDB
- generate QR code preview page for scanning
- check transaction status via Bakong API

## 🧩 Features
- `POST /api/v1/payments` - create a payment for an existing order (and returns QR + md5)
- `GET /api/v1/payments/:id/preview` - HTML preview with inline QR image (scan with Bakong app)
- `POST /api/v1/payments/check` (or similar) - transaction status flow (depending on implementation)
- Token caching (`tokenCache`) and auto-refresh in `src/services/bakong.service.js`

## 🚀 Requirements
- Node.js 18+ (recommended)
- MongoDB instance (local or remote)
- Bakong merchant credentials

## 📦 Install
```bash
npm install
```

## 🔧 Environment Variables
Create `.env` in project root with:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/bakong_db
BAKONG_PROD_BASE_API_URL=https://<bakong-endpoint>
BAKONG_MERCHANT_ID=<your-merchant-id>
BAKONG_SECRET=<your-secret>
BAKONG_ACCOUNT_ID=<account-id>
BAKONG_ACCESS_TOKEN= # optional initial token
```

## ▶️ Run
```bash
npm start
```

## 🧾 API Usage
### 1) Create order (example route in your app)
`POST /api/v1/orders` (depends on your order controller)

### 2) Create payment for order
`POST /api/v1/payments`

Request body:
```json
{ "orderId": "<order-id>" }
```

Response includes:
- `data.qr` (KHQR payload string)
- `data.md5`
- `data.expiration`
- `data.amount`, `currency`, etc.

### 3) Preview QR in browser
`GET /api/v1/payments/:paymentId/preview`

Displays inline QR and order details for scanning.

## 📁 Key files
- `server.js` - app entry
- `src/services/bakong.service.js` - Bakong token + QR flow
- `src/controllers/payment.controller.js` - endpoints and QR preview
- `src/routes/*` - route mapping
- `src/models/*` - Mongoose models

## 🛡️ Notes
- Secure `BAKONG_SECRET`; do not commit.
- Existing payment states: `PENDING`, `PAID`, `EXPIRED`, `FAILED`, `CANCELLED`.
- On retry, pending/failed/expired payments get QR refreshed.

## 🛠️ Optional improvements
- Add authentication (JWT/API key) for preview route
- Add ORM validations and error handling for missing fields
- Add automated tests
- Add logger / monitoring

---

Built for quick Bakong KHQR payments flow.

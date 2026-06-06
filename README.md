# Skately — Frontend

Skately is the client-facing web application for a full-stack e-commerce platform. Users can browse products, manage a shopping cart, complete Stripe-powered checkout, track orders, and receive real-time order updates. Administrators can review and refund orders from a dedicated dashboard.

This Angular SPA communicates with the [Skately API](../Backend/README.md) over HTTPS and uses cookie-based authentication.

---

## Features

### Shopping
- **Product catalog** — Paginated shop with search, brand/type filters, and sort options
- **Product details** — Individual product pages with add-to-cart
- **Shopping cart** — Persistent cart backed by Redis on the server, synced via cart ID in local storage
- **Order history** — View past orders and order details (authenticated users)

### Checkout & Payments
- **Multi-step checkout** — Material stepper flow: address → delivery → review → payment
- **Stripe Elements** — Embedded address and payment elements (Stripe.js)
- **Delivery methods** — Select from available shipping options
- **Order confirmation** — Success page with real-time status updates via SignalR

### Account
- **Registration & login** — ASP.NET Core Identity endpoints with cookie auth
- **Saved address** — Optional address persistence on the user profile
- **Route guards** — Auth, cart, admin, and order-complete guards protect sensitive routes

### Admin
- **Order management** — Paginated order table with status filtering
- **Refunds** — Issue Stripe refunds with confirmation dialog (Admin role required)

### UX & Infrastructure
- **Responsive UI** — Angular Material + Tailwind CSS
- **Global loading & error handling** — HTTP interceptors for loading spinners, auth cookies, and API errors
- **Real-time notifications** — SignalR hub for order completion events
- **Splash screen** — Branded loading screen on app initialization

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Angular 21 (standalone components) |
| UI | Angular Material 21, Tailwind CSS 3 |
| State & HTTP | RxJS, Angular HttpClient |
| Payments | `@stripe/stripe-js` |
| Real-time | `@microsoft/signalr` |
| Language | TypeScript 5.9 |
| Testing | Karma + Jasmine |
| Build | Angular CLI 21 |

---

## Prerequisites

- **Node.js** 20+ (LTS recommended)
- **npm** 10+
- **Skately API** running at `https://localhost:5001` (see [Backend README](../Backend/README.md))
- **Redis** running locally (used by the API for cart storage)
- **SSL certificates** — Both the client and API use HTTPS in development

---

## Getting Started

### 1. Install dependencies

```bash
cd Client
npm install
```

### 2. Configure SSL certificates

The dev server runs over HTTPS. Place a certificate pair in the `Client` root:

```
Client/
├── cert.pem
└── cert-key.pem
```

These are referenced in `angular.json` under the `serve` target. You can generate a local dev certificate with [mkcert](https://github.com/FiloSottile/mkcert) or export one from the ASP.NET dev certificate tooling.

### 3. Configure environment

Development settings live in `src/environments/environments.dev.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:5001/api/',
  hubUrl: 'https://localhost:5001/hub/notifications',
  StripePublicKey: '<your-stripe-publishable-key>'
};
```

Update `StripePublicKey` to match your Stripe test publishable key. The production environment file (`environments.ts`) uses a relative `/api` path for deployment behind a reverse proxy.

### 4. Start the development server

```bash
npm start
```

Navigate to **https://localhost:4200/**. The app reloads automatically on source changes.

> **Note:** Because the API uses cookie authentication with `SameSite=None` and `Secure`, both the client and API must be served over HTTPS during local development.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the dev server (`ng serve`) on HTTPS port 4200 |
| `npm run build` | Production build to `dist/client` |
| `npm run watch` | Development build with file watching |
| `npm test` | Run unit tests via Karma |

---

## Project Structure

```
src/
├── app/
│   ├── core/              # Guards, interceptors, and singleton services
│   │   ├── guard/         # auth, admin, cart, order-complete guards
│   │   ├── interceptors/  # auth, error, loading interceptors
│   │   └── services/      # API, cart, checkout, Stripe, SignalR, etc.
│   ├── features/          # Route-level feature components
│   │   ├── account/       # Login & register
│   │   ├── admin/         # Admin order dashboard
│   │   ├── cart/          # Shopping cart
│   │   ├── checkout/      # Multi-step checkout flow
│   │   ├── home/          # Landing page
│   │   ├── orders/        # Order list & detail
│   │   └── shop/          # Product catalog & details
│   ├── layout/            # Header and shell layout
│   └── shared/            # Reusable components, pipes, and models
├── environments/          # Dev and production configuration
└── styles.scss            # Global styles
```

---

## Routes

| Path | Component | Access |
|------|-----------|--------|
| `/` | Home | Public |
| `/shop` | Product catalog | Public |
| `/shop/:id` | Product details | Public |
| `/cart` | Shopping cart | Public |
| `/account/login` | Login | Public |
| `/account/register` | Register | Public |
| `/checkout` | Checkout | Authenticated + cart required |
| `/checkout/success` | Order success | Authenticated + order complete |
| `/orders` | Order list | Authenticated |
| `/orders/:id` | Order detail | Authenticated |
| `/admin` | Admin dashboard | Authenticated + Admin role |
| `/test-error` | Error testing | Public (dev) |

---

## Default Test Accounts

When the API is seeded for the first time, an admin account is created:

| Email | Password | Role |
|-------|----------|------|
| `admin@admin.com` | `Admin@123` | Admin |

Register additional users through the `/account/register` page.

---

## Production Build

```bash
npm run build
```

Output is written to `dist/client/`. Serve the static files behind a reverse proxy that forwards `/api` requests to the backend.

---

## Related

- [Backend API README](../Backend/README.md) — API setup, database, Redis, and Stripe configuration

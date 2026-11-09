# Touch of Sabrina — Luxury Women's Bags (E-commerce Website) — v2

Complete Next.js 15 e-commerce website for **Touch of Sabrina** — luxury women's bags.
Facebook: https://www.facebook.com/TouchofSabrina

> ⚠️ **SAMPLE DATA WARNING:** All 12 products, prices (BDT), testimonials and reviews in this build are **SAMPLE / placeholder** — Siam did not provide real prices or photos yet. Replace them in Admin → Products (or edit `data/products.json`) before launch. Do NOT treat sample prices as real prices.

## How to run

```bash
npm install
npm run dev        # http://localhost:3000
# Production:
npm run build
npm run start      # http://localhost:3000
```

No external database needed — data lives in JSON files under `data/` (`products.json`, `orders.json`, `coupons.json`, `categories.json`, `users.json`, `activity.json`, `reviews.json`, `newsletter.json`) and is read/written by the API routes. No secrets in code; see `.env.example`.

## What is new in v2

- **Hero slider** — 3 slides, auto-plays every 5 seconds, pauses on hover, dots + prev/next arrows, swipe on mobile.
- **Premium icons everywhere** — thin-line SVG icons (Lucide-style). No emoji/cartoon icons anywhere in the UI.
- **Luxury logo** — gold double-ring emblem + handbag line-art + serif "Touch of Sabrina" wordmark (inline SVG + `public/logo.png`, also the favicon). Used in header, footer, admin login and invoice.
- **Master Admin** (`/admin`) — sidebar: Dashboard, Orders, Products, Categories, Customers, Coupons, Sales, Settings.
- **Categories** — add/edit/delete in Admin → Categories. Just Name + Description (optional). Product Add uses a category dropdown from the same list. A category with products cannot be deleted.
- **Product Add — made simple** — step-by-step: 1) Name + Photo (paste image link, live preview), 2) Category dropdown, 3) Price: Original Price / Discount % / Right Now Price (they calculate each other live), 4) Stock + Description (optional). One big Add Product button, "Product added!" message, and the product appears on the Shop page at once. Help box with 3 steps on the Products page.
- **Order workflow** — Pending → Approved → Processing → Shipped → Delivered, plus Cancelled / Returned. Admin moves orders with one click per step; customers see the same status + timeline on Track Order and the order-success page. **Stock goes down only when an order is Approved** (not at placement), and is restored if the order is Cancelled/Returned before delivery.
- **Sales Dashboard** — revenue (Delivered orders only, labelled), total orders, pending orders, total customers, low stock, revenue by day (last 7 days, bar chart), orders by status, top 5 selling products, live shopping activity. All from real data — no invented numbers.
- **User accounts** — `/signup` and `/login` (name, email, phone, password stored as SHA-256 hash in `data/users.json`, never plain text; demo-only auth — see below). Logged-in users get **Favourites** (`/favorites`, heart on every product card) and a **Bag** that syncs to the server, so cart + favourites follow them on any device. Logged out, cart/favourites stay in the browser only.
- **Admin → Customers** — every registered user with orders, Delivered count and total spent. Click a customer to see their orders AND what they have in their **Cart now** vs **Favourites now** (live from server activity). "Give coupon" creates a personal coupon for that customer.
- **Targeted coupons** — when creating a coupon, admin chooses Target: All customers / Regular buyers only (2+ Delivered orders) / One specific customer. Checkout enforces it: a regular-only coupon is rejected for guests/new customers with "This coupon is only for regular buyers". Seeded example: `LOYAL15` (15% off, regular buyers only).

## Pages

- `/` Home — hero slider, categories, featured, best sellers, why-shop, sample testimonials, newsletter
- `/shop` Shop — search, category filter (from Categories), max-price filter, sort
- `/product/[slug]` Product detail — colours, qty, Add to Bag, Buy Now, Save to Favourites, stock, reviews + add review, related bags. Shows Current Price big, Original Price struck through and a "Save X%" badge when there is a discount.
- `/cart` Bag — qty +/-, remove, coupon, shipping estimate, total
- `/checkout` Checkout — name, BD phone validation, address, district, Inside/Outside Dhaka (৳60 / ৳120, free over ৳3,000), payment: COD, bKash, Nagad (manual — TrxID required). Logged-in users are pre-filled.
- `/order-success?orderId=...` Order confirmation + status timeline + printable invoice (with logo)
- `/orders` Track order by phone number, with status timeline
- `/login`, `/signup`, `/account` (My Account), `/favorites` (My Favourites)
- `/admin` Master Admin (login-gated)

## Logins (DEMO — change before production)

**Master Admin**
- Email: `admin@touchofsabrina.local`
- Password: `admin123`

**Demo customer** (for Siam to try login + favourites + admin Customers view)
- Email: `demo@touchofsabrina.local`
- Password: `demo123`
- Name: Demo Customer, Phone: 01700000000 — already has Bow Bag in Favourites and 1 Bow Bag in the Bag (pre-seeded), so Admin → Customers → Demo Customer shows Cart now / Favorites now immediately.

> Demo auth is browser/localStorage + SHA-256 hashed passwords in a JSON file. It is fine for a demo/preview. Before production, replace it with real server sessions and a real database.

## Coupons

- `WELCOME10` — 10% off, everyone, no minimum
- `SABRINA15` — 15% off on orders over ৳2,000, everyone
- `LOYAL15` — 15% off, **regular buyers only** (2 or more Delivered orders). A guest or a customer with fewer than 2 Delivered orders is rejected with "This coupon is only for regular buyers".

**How admin gives a coupon:** Admin → Customers → find the customer → set the % and click "Give coupon". It creates a code like `SABRINA-AYESHA-10` (10% off, editable % before saving) that only that customer can use. It also appears in Admin → Coupons with that customer's name. Or create any coupon in Admin → Coupons and choose Target: All / Regular buyers only / One specific customer.

**How eligibility is checked:** at checkout (and in the cart) the code is checked against the logged-in user via `/api/coupons/validate`. Regular = count of that customer's Delivered orders (matched by account, email or phone) is 2 or more. Personal = the logged-in user's id must match the coupon's customer.

## Payment note

bKash / Nagad are **manual** in this build: the customer sends money and enters the TrxID, and the shop confirms it. The bKash/Nagad numbers shown at checkout are **placeholders** (`[bKash number — Siam to replace]`) — Siam must replace them with his real numbers (in `app/checkout/page.jsx` and `.env.example`). For automatic verification later, an official bKash/Nagad merchant API or a payment gateway (SSLCommerz etc.) is needed.

## Still needed from Siam before launch

1. Real product photos (replace the Unsplash sample photos in Admin → Products)
2. Real product names & prices (replace the SAMPLE prices)
3. Real bKash / Nagad numbers
4. Domain + hosting choice (this delivery is NOT deployed live)
5. New admin password (demo `admin123` must be changed) + replace demo auth with real server auth

## Tech

Next.js 15 (App Router, JavaScript), Tailwind CSS, JSON-file storage via API routes. SEO: per-page title/meta/Open Graph, `sitemap.xml`, `robots.txt`, logo favicon. Design: luxury dark maroon (#5b0f1e) + black + gold (#c9a227).

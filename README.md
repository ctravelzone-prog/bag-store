# Touch of Sabrina — Luxury Women's Bags (E-commerce Website)

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

No external database needed — data lives in JSON files under `data/` (`products.json`, `orders.json`, `coupons.json`, `reviews.json`, `newsletter.json`) and is read/written by the API routes. No secrets in code; see `.env.example`.

## Pages

- `/` Home — hero, categories, featured, best sellers, why-shop, sample testimonials, newsletter
- `/shop` Shop — search, category filter, max-price filter, sort (popular / price low-high / high-low / newest)
- `/product/[slug]` Product detail — colours, qty, Add to Cart, Buy Now, stock, reviews + add review, related bags
- `/cart` Cart — qty +/-, remove, coupon, shipping estimate, total (saved in browser localStorage)
- `/checkout` Checkout — name, BD phone validation (01XXXXXXXXX), address, district, Inside/Outside Dhaka delivery (৳60 / ৳120, free over ৳3,000), payment: Cash on Delivery, bKash, Nagad (manual — TrxID required)
- `/order-success?orderId=...` Order confirmation + printable invoice
- `/orders` Track order by phone number
- `/admin` Admin panel (login-gated)

## Admin login (DEMO — change before production)

- Email: `admin@touchofsabrina.local`
- Password: `admin123`

Admin can: see revenue / orders / products / low stock; add, edit and delete products; change order status (Pending → Confirmed → Shipped → Delivered / Cancelled); add and delete coupons. All changes save to the JSON files and show on the shop immediately.

## Demo coupons

- `WELCOME10` — 10% off, no minimum
- `SABRINA15` — 15% off on orders over ৳2,000

## Payment note

bKash / Nagad are **manual** in this build: the customer sends money and enters the TrxID, and the shop confirms it. The bKash/Nagad numbers shown at checkout are **placeholders** (`[bKash number — Siam to replace]`) — Siam must replace them with his real numbers (in `app/checkout/page.jsx` and `.env.example`). For automatic verification later, an official bKash/Nagad merchant API or a payment gateway (SSLCommerz etc.) is needed.

## Still needed from Siam before launch

1. Real product photos (replace the Unsplash sample photos in Admin → Products)
2. Real product names & prices (replace the SAMPLE prices)
3. Real bKash / Nagad numbers
4. Domain + hosting choice (site is NOT deployed live in this delivery)
5. New admin password (demo `admin123` must be changed)

## Tech

Next.js 15 (App Router, JavaScript), Tailwind CSS, JSON-file storage via API routes. SEO: per-page title/meta/Open Graph, `sitemap.xml`, `robots.txt`. Design: luxury dark maroon (#5b0f1e) + black + gold (#c9a227).

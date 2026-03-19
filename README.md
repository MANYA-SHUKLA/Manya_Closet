# Manya's Closet

A full-stack e-commerce platform for fashion retail. Built with Next.js (frontend) and Express.js + MongoDB (backend) in a pnpm monorepo.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, Tailwind CSS 4, Zustand, TanStack Query |
| Backend | Express.js, TypeScript, MongoDB + Mongoose, Socket.io |
| Auth | JWT (access + refresh tokens), Google OAuth |
| Payments | Razorpay |
| Monorepo | pnpm workspaces + Turborepo |
| Deploy | Vercel (frontend) · Render (backend) |

---

## Project Structure

```
manya-closet/
├── apps/
│   ├── api/                        # Express.js backend
│   │   ├── src/
│   │   │   ├── server.ts           # Entry point
│   │   │   ├── app.ts              # Express app & middleware setup
│   │   │   ├── config/
│   │   │   │   ├── db.ts           # MongoDB connection
│   │   │   │   ├── env.ts          # Environment variable validation
│   │   │   │   └── passport.ts     # Google OAuth strategy
│   │   │   ├── controllers/        # Route handlers
│   │   │   │   ├── authController.ts
│   │   │   │   ├── productController.ts
│   │   │   │   ├── orderController.ts
│   │   │   │   ├── cartController.ts
│   │   │   │   ├── couponController.ts
│   │   │   │   ├── reviewController.ts
│   │   │   │   ├── wishlistController.ts
│   │   │   │   ├── categoryController.ts
│   │   │   │   ├── userController.ts
│   │   │   │   ├── newsletterController.ts
│   │   │   │   ├── adminController.ts
│   │   │   │   ├── superAdminController.ts
│   │   │   │   └── webhookController.ts
│   │   │   ├── middleware/
│   │   │   │   ├── auth.ts         # JWT verification & role guards
│   │   │   │   ├── error.ts        # Global error handler
│   │   │   │   └── validate.ts     # Request body validation
│   │   │   ├── models/             # Mongoose schemas
│   │   │   │   ├── User.ts
│   │   │   │   ├── Product.ts
│   │   │   │   ├── Category.ts
│   │   │   │   ├── Cart.ts
│   │   │   │   ├── Order.ts
│   │   │   │   ├── Coupon.ts
│   │   │   │   ├── Review.ts
│   │   │   │   ├── Wishlist.ts
│   │   │   │   └── Newsletter.ts
│   │   │   ├── routes/             # API route definitions
│   │   │   │   ├── index.ts        # Aggregates all routes
│   │   │   │   ├── auth.ts
│   │   │   │   ├── products.ts
│   │   │   │   ├── categories.ts
│   │   │   │   ├── cart.ts
│   │   │   │   ├── orders.ts
│   │   │   │   ├── users.ts
│   │   │   │   ├── wishlist.ts
│   │   │   │   ├── coupons.ts
│   │   │   │   ├── reviews.ts
│   │   │   │   ├── newsletter.ts
│   │   │   │   ├── admin.ts
│   │   │   │   ├── superAdmin.ts
│   │   │   │   └── webhook.ts
│   │   │   ├── sockets/
│   │   │   │   └── index.ts        # Socket.io real-time events
│   │   │   ├── utils/
│   │   │   │   ├── email.ts        # Nodemailer email helpers
│   │   │   │   └── calculateDiscount.ts
│   │   │   ├── services/           # Business logic layer
│   │   │   ├── types/
│   │   │   │   └── express.d.ts    # Express request type extensions
│   │   │   └── scripts/
│   │   │       └── seed.ts         # Database seeding script
│   │   ├── swagger.yaml            # OpenAPI documentation
│   │   ├── .env.example            # Environment variable template
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── web/                        # Next.js frontend
│       ├── app/                    # Next.js App Router
│       │   ├── layout.tsx          # Root layout
│       │   ├── page.tsx            # Home page
│       │   ├── globals.css
│       │   ├── (auth)/             # Auth route group
│       │   │   ├── layout.tsx
│       │   │   ├── login/
│       │   │   ├── signup/
│       │   │   ├── forgot-password/
│       │   │   └── reset-password/
│       │   ├── shop/               # Product listing
│       │   ├── product/[slug]/     # Product detail
│       │   ├── cart/
│       │   ├── checkout/
│       │   ├── order-success/[orderId]/
│       │   ├── wishlist/
│       │   ├── account/            # User account area
│       │   │   ├── profile/
│       │   │   ├── addresses/
│       │   │   └── orders/[orderId]/
│       │   ├── admin/              # Admin panel
│       │   │   ├── dashboard/
│       │   │   ├── products/
│       │   │   ├── orders/
│       │   │   ├── users/
│       │   │   └── coupons/
│       │   ├── about/
│       │   ├── contact/
│       │   ├── privacy/
│       │   ├── terms/
│       │   └── size-guide/
│       ├── components/
│       │   ├── ui/                 # Navbar, Footer, ProductCard, Skeletons
│       │   ├── auth/               # Login, Signup, OAuth forms
│       │   ├── landing/            # Hero, Categories, Deals, Testimonials
│       │   ├── product/            # Detail, Carousel, Variants, Reviews
│       │   ├── shop/               # Filters, Sort, ProductGrid
│       │   ├── cart/               # CartItem, CartSummary
│       │   ├── checkout/           # AddressForm, Payment, Coupon, Steps
│       │   ├── account/            # AddressModal, OrderStepper, StatusBadge
│       │   └── wishlist/           # WishlistItem
│       ├── hooks/                  # Custom React hooks
│       │   ├── useAuth.ts
│       │   ├── useCart.ts
│       │   ├── useWishlist.ts
│       │   ├── useOrders.ts
│       │   ├── useAddresses.ts
│       │   ├── useProducts.ts
│       │   ├── useInfiniteProducts.ts
│       │   ├── useAdmin.ts
│       │   └── useSocket.ts
│       ├── store/                  # Zustand global state
│       │   ├── authStore.ts
│       │   ├── cartStore.ts
│       │   ├── checkoutStore.ts
│       │   ├── wishlistStore.ts
│       │   └── recentlyViewedStore.ts
│       ├── lib/                    # Utilities & config
│       │   ├── axios.ts            # Axios instance with interceptors
│       │   ├── auth.ts
│       │   ├── socket.ts           # Socket.io client
│       │   ├── deliveryConfig.ts
│       │   ├── imageUtils.ts
│       │   └── printInvoice.ts
│       ├── providers/
│       │   ├── AuthProvider.tsx
│       │   └── QueryProvider.tsx
│       ├── middleware.ts           # Route protection (Next.js middleware)
│       ├── next.config.ts
│       ├── vercel.json             # Vercel deployment config
│       ├── .env.example
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   └── types/                      # Shared TypeScript types
│       └── src/
│           ├── index.ts
│           ├── user.ts
│           ├── product.ts
│           ├── category.ts
│           ├── order.ts
│           ├── cart.ts
│           └── api.ts
│
├── render.yaml                     # Render deployment config (backend)
├── turbo.json                      # Turborepo task pipeline
├── pnpm-workspace.yaml
├── package.json
└── tsconfig.json
```

---

## Local Development

**Prerequisites:** Node.js ≥ 20, pnpm ≥ 9, MongoDB running locally

```bash
# 1. Install dependencies (from repo root)
pnpm install

# 2. Set up environment variables
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
# Edit both files with your values

# 3. Seed the database (optional)
pnpm --filter @manya-closet/api seed

# 4. Start both apps
# Terminal 1 — API (http://localhost:8000)
pnpm --filter @manya-closet/api dev

# Terminal 2 — Web (http://localhost:3001)
pnpm --filter @manya-closet/web dev
```

---

## Environment Variables

### Backend — `apps/api/.env`

```env
NODE_ENV=development
PORT=8000

MONGODB_URI=mongodb://localhost:27017/manya_closet

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:8000/api/auth/google/callback

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=

CLIENT_URL=http://localhost:3001
ADMIN_EMAIL=
```

### Frontend — `apps/web/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:8000
NEXT_PUBLIC_RAZORPAY_KEY_ID=
```

---

## Deployment

### Backend → Render

1. Connect your GitHub repo to Render
2. **New Web Service** → select the repo
3. Leave Root Directory as `/` (repo root)
4. Render will pick up `render.yaml` automatically and configure the service
5. Go to **Environment** in the Render dashboard and fill in all `sync: false` variables (MongoDB URI, JWT secrets, etc.)

> The free plan on Render spins down after inactivity. Use a paid plan for always-on.

### Frontend → Vercel

1. Import the repo on [vercel.com](https://vercel.com)
2. Set **Root Directory** to `apps/web`
3. Vercel will auto-detect Next.js and use `vercel.json` for build/install commands
4. Add environment variables in the Vercel dashboard:

```
NEXT_PUBLIC_API_URL=https://your-render-service.onrender.com/api
NEXT_PUBLIC_SOCKET_URL=https://your-render-service.onrender.com
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key
```

---

## API Reference

Full OpenAPI spec is at [`apps/api/swagger.yaml`](apps/api/swagger.yaml).

Key base routes:

| Prefix | Description |
|---|---|
| `POST /api/auth/*` | Register, login, refresh, Google OAuth |
| `GET /api/products` | Product listing with filters & pagination |
| `GET /api/products/:slug` | Single product detail |
| `GET /api/categories` | Category tree |
| `/api/cart/*` | Cart CRUD (auth required) |
| `/api/orders/*` | Place & track orders (auth required) |
| `/api/wishlist/*` | Wishlist (auth required) |
| `/api/coupons/validate` | Validate coupon code |
| `/api/admin/*` | Admin panel routes (admin role) |
| `GET /api/health` | Health check |

---

## Features

- Product catalogue with variant support (size, colour), infinite scroll, filters & sort
- Shopping cart with persistent sync
- Checkout — address, delivery options, coupon, Razorpay / COD payment
- Order tracking with status stepper
- Wishlist
- Product reviews & ratings
- User account — profile, saved addresses, order history, invoice download
- Admin panel — dashboard stats, product CRUD, order management, user list, coupons
- Real-time order status updates via Socket.io
- Google OAuth + email/password auth with refresh token rotation
- Email notifications (order confirmation, password reset)
- Newsletter subscription

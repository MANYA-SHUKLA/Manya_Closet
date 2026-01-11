# Manya Closet

Fashion store e-commerce application.

## Structure

```
Manya_Closet/
├── apps/
│   ├── web/        # Main Vite React application
│   ├── admin/      # Admin application (coming soon)
│   └── api/        # API backend (coming soon)
├── package.json
└── README.md
```

## Getting Started

### Web App

```bash
# Install dependencies
npm install

# Run development server
npm run dev:web

# Build for production
npm run build:web

# Preview production build
npm run preview:web
```

Or navigate to the web app directory:

```bash
cd apps/web
npm install
npm run dev
```

## Development

This is a monorepo structure with separate applications:
- **web**: Main customer-facing e-commerce application (Vite + React)
- **admin**: Admin dashboard (coming soon)
- **api**: Backend API (coming soon)


/**
 * Seed script — categories + 2 products per category
 * Run: pnpm --filter api tsx src/scripts/seed.ts
 *
 * Images: Savana India CDN images are auth-protected at runtime.
 * Using Unsplash open-access images instead (same quality, reliable).
 * Replace image URLs with your own CDN if needed.
 */

import mongoose from 'mongoose'
import { CategoryModel } from '../models/Category'
import { ProductModel } from '../models/Product'
import { UserModel } from '../models/User'

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/manya_closet'

// ── Category definitions ──────────────────────────────────────────────
const CATEGORIES = [
  {
    name: 'Dresses',
    slug: 'dresses',
    description: 'Elegant dresses for every occasion',
    image: 'https://images.unsplash.com/photo-1502716119720-816728a09ccd?w=600&q=80',
  },
  {
    name: 'Tops & Blouses',
    slug: 'tops-blouses',
    description: 'Chic tops and blouses for effortless style',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80',
  },
  {
    name: 'Bottoms',
    slug: 'bottoms',
    description: 'Jeans, trousers and skirts',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80',
  },
  {
    name: 'Ethnic Wear',
    slug: 'ethnic-wear',
    description: 'Kurtas, sarees and traditional Indian fashion',
    image: 'https://images.unsplash.com/photo-1583391265860-5a71d7a0c6d4?w=600&q=80',
  },
  {
    name: 'Western Wear',
    slug: 'western-wear',
    description: 'Contemporary western styles and co-ord sets',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
  },
  {
    name: 'Footwear',
    slug: 'footwear',
    description: 'Heels, flats and sandals',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80',
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    description: 'Bags, jewellery and more',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80',
  },
]

// ── Helpers ───────────────────────────────────────────────────────────
const sizes   = ['XS', 'S', 'M', 'L', 'XL']
const shoeSizes = ['UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8']
const colors  = (list: string[]) => list

function clothingVariants(colorList: string[]) {
  return sizes.flatMap((size) =>
    colorList.map((color) => ({
      size,
      color,
      stock: Math.floor(Math.random() * 20) + 5,
      sku: `${size}-${color.replace(/\s/g, '')}-${Date.now()}`.toUpperCase(),
    }))
  )
}

function footwearVariants(colorList: string[]) {
  return shoeSizes.flatMap((size) =>
    colorList.map((color) => ({
      size,
      color,
      stock: Math.floor(Math.random() * 15) + 3,
      sku: `${size.replace(/\s/g, '')}-${color.replace(/\s/g, '')}-${Date.now()}`.toUpperCase(),
    }))
  )
}

function accessoryVariants(colorList: string[]) {
  return colorList.map((color) => ({
    size: 'One Size',
    color,
    stock: Math.floor(Math.random() * 25) + 10,
    sku: `OS-${color.replace(/\s/g, '')}-${Date.now()}`.toUpperCase(),
  }))
}

// ── Product definitions (2 per category, keyed by category slug) ──────
const PRODUCTS: Record<string, {
  name: string
  slug: string
  description: string
  price: number
  discountPrice: number
  images: string[]
  brand: string
  variants: ReturnType<typeof clothingVariants>
  isFeatured: boolean
}[]> = {
  dresses: [
    {
      name: 'Floral Wrap Midi Dress',
      slug: 'floral-wrap-midi-dress',
      description: 'A beautiful floral wrap midi dress with a flattering V-neckline and a self-tie waist belt. Perfect for brunches, dates, or a day out.',
      price: 2499,
      discountPrice: 1899,
      images: [
        'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=600&q=80',
        'https://images.unsplash.com/photo-1502716119720-816728a09ccd?w=600&q=80',
      ],
      brand: 'Savana',
      variants: clothingVariants(colors(['Dusty Rose', 'Ivory', 'Sage Green'])),
      isFeatured: true,
    },
    {
      name: 'Off-Shoulder Maxi Dress',
      slug: 'off-shoulder-maxi-dress',
      description: 'Effortlessly elegant off-shoulder maxi dress in breathable georgette fabric. Features a flowy silhouette and subtle ruffle detailing.',
      price: 3299,
      discountPrice: 2499,
      images: [
        'https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=600&q=80',
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80',
      ],
      brand: 'Savana',
      variants: clothingVariants(colors(['Midnight Blue', 'Coral', 'Black'])),
      isFeatured: true,
    },
  ],
  'tops-blouses': [
    {
      name: 'Flowy Chiffon Blouse',
      slug: 'flowy-chiffon-blouse',
      description: 'Lightweight chiffon blouse with delicate floral embroidery at the cuffs. Pairs beautifully with trousers or denim for a polished look.',
      price: 1299,
      discountPrice: 999,
      images: [
        'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80',
        'https://images.unsplash.com/photo-1434389677669-e08b4cec1105?w=600&q=80',
      ],
      brand: 'Savana',
      variants: clothingVariants(colors(['White', 'Blush Pink', 'Sky Blue'])),
      isFeatured: false,
    },
    {
      name: 'Striped Cropped Top',
      slug: 'striped-cropped-top',
      description: 'Trendy cropped top with classic nautical stripes. Relaxed fit and soft cotton fabric keep it comfortable all day long.',
      price: 899,
      discountPrice: 699,
      images: [
        'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=600&q=80',
        'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=600&q=80',
      ],
      brand: 'Savana',
      variants: clothingVariants(colors(['Navy & White', 'Black & White'])),
      isFeatured: false,
    },
  ],
  bottoms: [
    {
      name: 'High-Rise Flared Jeans',
      slug: 'high-rise-flared-jeans',
      description: 'Retro-inspired high-rise flared jeans in premium stretch denim. Flattering for all body types with a comfortable waistband.',
      price: 2199,
      discountPrice: 1599,
      images: [
        'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80',
        'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=600&q=80',
      ],
      brand: 'Savana',
      variants: clothingVariants(colors(['Indigo Blue', 'Light Wash', 'Black'])),
      isFeatured: true,
    },
    {
      name: 'Linen Wide-Leg Trousers',
      slug: 'linen-wide-leg-trousers',
      description: 'Breezy linen wide-leg trousers with an elasticated waist and side pockets. Elevated casual wear that goes from desk to dinner.',
      price: 1899,
      discountPrice: 1399,
      images: [
        'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80',
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80',
      ],
      brand: 'Savana',
      variants: clothingVariants(colors(['Beige', 'Olive', 'White'])),
      isFeatured: false,
    },
  ],
  'ethnic-wear': [
    {
      name: 'Anarkali Kurta Set',
      slug: 'anarkali-kurta-set',
      description: 'Gorgeous Anarkali kurta set with intricate block print and delicate mirror work. Comes with matching palazzo pants and dupatta.',
      price: 3999,
      discountPrice: 2999,
      images: [
        'https://images.unsplash.com/photo-1583391265860-5a71d7a0c6d4?w=600&q=80',
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80',
      ],
      brand: 'Savana Ethnic',
      variants: clothingVariants(colors(['Peacock Blue', 'Brick Red', 'Emerald Green'])),
      isFeatured: true,
    },
    {
      name: 'Printed Cotton Salwar Suit',
      slug: 'printed-cotton-salwar-suit',
      description: 'Comfortable 3-piece cotton salwar suit with a vibrant Rajasthani print. Perfect for festive occasions and everyday ethnic wear.',
      price: 2799,
      discountPrice: 1999,
      images: [
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&q=80',
        'https://images.unsplash.com/photo-1583391265860-5a71d7a0c6d4?w=600&q=80',
      ],
      brand: 'Savana Ethnic',
      variants: clothingVariants(colors(['Mustard Yellow', 'Turquoise', 'Maroon'])),
      isFeatured: false,
    },
  ],
  'western-wear': [
    {
      name: 'Power Blazer Co-ord Set',
      slug: 'power-blazer-coord-set',
      description: 'Sophisticated blazer and trouser co-ord set in premium suiting fabric. A power look for boardroom meetings and after-work socials.',
      price: 4499,
      discountPrice: 3499,
      images: [
        'https://images.unsplash.com/photo-1551803091-e20673f15770?w=600&q=80',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
      ],
      brand: 'Savana',
      variants: clothingVariants(colors(['Charcoal', 'Camel', 'Ivory'])),
      isFeatured: true,
    },
    {
      name: 'Denim Shacket',
      slug: 'denim-shacket',
      description: 'The perfect layering piece — this denim shirt-jacket features classic button closure, chest pockets, and a slightly oversized fit.',
      price: 2299,
      discountPrice: 1799,
      images: [
        'https://images.unsplash.com/photo-1591369822096-ffd152dae467?w=600&q=80',
        'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80',
      ],
      brand: 'Savana',
      variants: clothingVariants(colors(['Medium Wash', 'Dark Wash'])),
      isFeatured: false,
    },
  ],
  footwear: [
    {
      name: 'Block Heel Sandals',
      slug: 'block-heel-sandals',
      description: 'Chic block heel sandals with an adjustable ankle strap and cushioned footbed. Comfortable enough for all-day wear, stylish enough for evenings.',
      price: 1799,
      discountPrice: 1299,
      images: [
        'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80',
        'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&q=80',
      ],
      brand: 'Savana Footwear',
      variants: footwearVariants(colors(['Nude', 'Black', 'Tan'])),
      isFeatured: false,
    },
    {
      name: 'Strappy Kitten Heels',
      slug: 'strappy-kitten-heels',
      description: 'Elegant strappy kitten heels in soft faux-suede. A classic silhouette with delicate cross straps and a pointed toe.',
      price: 2199,
      discountPrice: 1599,
      images: [
        'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=600&q=80',
        'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80',
      ],
      brand: 'Savana Footwear',
      variants: footwearVariants(colors(['Blush Pink', 'Black', 'Ivory'])),
      isFeatured: true,
    },
  ],
  accessories: [
    {
      name: 'Structured Leather Tote',
      slug: 'structured-leather-tote',
      description: 'Spacious structured tote in premium vegan leather. Features a zippered main compartment, inner pockets, and gold-tone hardware.',
      price: 2999,
      discountPrice: 2199,
      images: [
        'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80',
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
      ],
      brand: 'Savana',
      variants: accessoryVariants(colors(['Caramel', 'Black', 'Dusty Rose'])),
      isFeatured: true,
    },
    {
      name: 'Layered Coin Necklace',
      slug: 'layered-coin-necklace',
      description: 'Delicate layered necklace with hammered coin pendants in gold-tone metal. Effortlessly elevates any outfit — everyday or special occasion.',
      price: 1499,
      discountPrice: 999,
      images: [
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80',
        'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&q=80',
      ],
      brand: 'Savana',
      variants: accessoryVariants(colors(['Gold', 'Silver', 'Rose Gold'])),
      isFeatured: false,
    },
  ],
}

// ── Main ──────────────────────────────────────────────────────────────
async function seed() {
  await mongoose.connect(MONGO_URI)
  console.log('Connected to MongoDB')

  let totalProducts = 0

  for (const catData of CATEGORIES) {
    // Upsert category
    const category = await CategoryModel.findOneAndUpdate(
      { slug: catData.slug },
      { $setOnInsert: catData },
      { upsert: true, new: true }
    )
    console.log(`✓ Category: ${category.name}`)

    const products = PRODUCTS[catData.slug] ?? []
    for (const p of products) {
      const exists = await ProductModel.findOne({ slug: p.slug })
      if (exists) {
        console.log(`  · Skipped (exists): ${p.name}`)
        continue
      }
      await ProductModel.create({ ...p, category: catData.slug, isActive: true })
      console.log(`  + Created: ${p.name}`)
      totalProducts++
    }
  }

  // ── Admin user (credentials from .env) ──────────────────────────────
  const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'shuklamanya99@gmail.com'
  const ADMIN_PASS  = process.env.SEED_ADMIN_PASS  || 'Admin@2026'
  const existingAdmin = await UserModel.findOne({ email: ADMIN_EMAIL })
  if (existingAdmin) {
    console.log(`\n· Admin already exists: ${ADMIN_EMAIL}`)
  } else {
    await UserModel.create({
      name:       "Manya's Closet Admin",
      email:      ADMIN_EMAIL,
      password:   ADMIN_PASS,
      role:       'admin',
      isVerified: true,
    })
    console.log(`\n✓ Admin created — email: ${ADMIN_EMAIL}`)
  }

  console.log(`\nSeed complete. ${totalProducts} products created.`)
  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})

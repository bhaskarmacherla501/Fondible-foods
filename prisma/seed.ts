import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const CERTIFICATIONS = ['Real Butter', 'No Refined Sugar', 'No Preservatives', 'No Artificial Ingredients', 'Jaggery Sweetened']
const ALLERGENS = ['Tree Nuts', 'Wheat', 'Dairy']

async function main() {
  console.log('🌱 Seeding Fondible database...')

  // Admin user
  const adminHash = await bcrypt.hash('Admin@Fondible2025', 10)
  const admin = await prisma.user.upsert({
    where:  { email: 'admin@fondible.in' },
    update: {},
    create: { name: 'Fondible Admin', email: 'admin@fondible.in', passwordHash: adminHash, role: 'ADMIN', emailVerified: new Date() },
  })
  console.log('✅ Admin created:', admin.email)

  // Category
  const category = await prisma.category.upsert({
    where:  { slug: 'millet-cookies' },
    update: {},
    create: {
      name: 'Millet Cookies', slug: 'millet-cookies',
      description: 'Whole ingredient cookies baked with real butter, whole wheat and grains like ragi and jowar',
      isActive: true, sortOrder: 1,
    },
  })

  // Products
  const products = [
    {
      name: 'Mixed Nut Supreme', slug: 'mixed-nut-supreme',
      shortDesc: 'Whole cashews, almonds, walnuts & pistachios in real butter whole wheat dough — our most loaded cookie.',
      isFeatured: true, isBestseller: true,
      price: 329, pack: '230g Pack', stock: 50, sku: 'FND-MNS-230',
      ingredients: 'Stone-ground whole wheat flour, fresh churned butter, whole cashews, whole almonds, whole walnuts, pistachios, jaggery, cold-pressed coconut oil, rock salt',
      healthBenefits: ['High in Natural Protein', 'Real Butter Richness', 'No Refined Sugar', 'Whole Nuts — Not Pastes', 'Zero Preservatives'],
      tags: ['nuts', 'bestseller', 'high-protein'],
    },
    {
      name: 'Cashew Classic', slug: 'cashew-classic',
      shortDesc: 'One whole cashew pressed into every cookie — buttery whole wheat dough, sweetened with jaggery.',
      isFeatured: true, isBestseller: false,
      price: 289, pack: '230g Pack', stock: 40, sku: 'FND-CC-230',
      ingredients: 'Stone-ground whole wheat flour, fresh churned butter, whole cashews, jaggery, cold-pressed oil, rock salt, cardamom',
      healthBenefits: ['Real Butter', 'Whole Cashews', 'Jaggery Sweetened', 'No Maida', 'No Refined Sugar'],
      tags: ['nuts', 'classic'],
    },
    {
      name: 'Ragi Almond', slug: 'ragi-almond',
      shortDesc: 'Finger millet flour with whole almonds — an ancient grain cookie baked with real butter and jaggery.',
      isFeatured: true, isBestseller: false,
      price: 269, pack: '230g Pack', stock: 45, sku: 'FND-RA-230',
      ingredients: 'Finger millet flour (ragi), stone-ground whole wheat, fresh churned butter, whole almonds, jaggery, rock salt',
      healthBenefits: ['Ancient Grain Goodness', 'Calcium from Ragi', 'Real Butter', 'Whole Almonds', 'No Refined Sugar'],
      tags: ['millet', 'ragi', 'fiber'],
    },
    {
      name: 'Walnut Cookies', slug: 'walnut-cookies',
      shortDesc: 'Roughly chopped whole walnuts in a buttery whole wheat base — omega-3 rich, jaggery sweetened.',
      isFeatured: true, isBestseller: false, isNew: true,
      price: 289, pack: '230g Pack', stock: 30, sku: 'FND-WC-230',
      ingredients: 'Stone-ground whole wheat flour, fresh churned butter, whole walnuts, jaggery, cold-pressed oil, rock salt',
      healthBenefits: ['Omega-3 from Real Walnuts', 'Real Butter', 'Brain Boosting', 'No Refined Sugar', 'Whole Ingredients Only'],
      tags: ['nuts', 'walnut', 'new'],
    },
    {
      name: 'Coconut Classic', slug: 'coconut-classic',
      shortDesc: 'Fresh shredded coconut folded into real butter whole wheat dough — tropical, clean, and naturally sweet.',
      isFeatured: true, isBestseller: false,
      price: 269, pack: '230g Pack', stock: 35, sku: 'FND-CCO-230',
      ingredients: 'Stone-ground whole wheat flour, fresh churned butter, fresh shredded coconut, jaggery, rock salt',
      healthBenefits: ['Fresh Coconut', 'Real Butter', 'High Fiber', 'No Refined Sugar', 'No Artificial Flavors'],
      tags: ['coconut', 'fiber', 'light'],
    },
    {
      name: 'Roasted Almond', slug: 'roasted-almond',
      shortDesc: 'Generous whole roasted almonds in a crisp real butter whole wheat cookie — simple, clean, satisfying.',
      isFeatured: false, isBestseller: false,
      price: 289, pack: '230g Pack', stock: 40, sku: 'FND-ROA-230',
      ingredients: 'Stone-ground whole wheat flour, fresh churned butter, whole roasted almonds, jaggery, rock salt',
      healthBenefits: ['Whole Roasted Almonds', 'Real Butter', 'Vitamin E Rich', 'No Refined Sugar', 'No Additives'],
      tags: ['nuts', 'almond', 'crunchy'],
    },
  ]

  for (const p of products) {
    const sharedFields = {
      name: p.name, slug: p.slug, shortDesc: p.shortDesc,
      categoryId: category.id,
      images: [`/images/products/${p.slug}.jpg`],
      tags:   p.tags,
      isFeatured: p.isFeatured, isBestseller: p.isBestseller, isNew: (p as { isNew?: boolean }).isNew ?? false,
      isActive: true,
      healthBenefits:  p.healthBenefits,
      allergens:       ALLERGENS,
      certifications:  CERTIFICATIONS,
      ingredients:     p.ingredients,
      storageInfo:     'Store in a cool, dry place. Best consumed within 2 weeks of opening.',
      nutritionFacts:  { servingSize: '2 cookies (46g)', calories: 210, protein: 5, carbohydrates: 28, fat: 10, fiber: 3, sugar: 8, sodium: 80 },
      seoTitle:        `${p.name} — Whole Ingredient Cookies | Fondible`,
      seoDesc:         `${p.shortDesc} No maida, no refined sugar, no artificial ingredients. Fresh-baked in Hyderabad.`,
      seoKeywords:     [...p.tags, 'whole ingredient cookie', 'jaggery cookie', 'real butter cookie', 'clean baking', 'Hyderabad'],
    }

    const product = await prisma.product.upsert({
      where:  { slug: p.slug },
      update: sharedFields,
      create: sharedFields,
    })

    await prisma.productVariant.upsert({
      where:  { sku: p.sku },
      update: {},
      create: {
        productId: product.id,
        name: p.pack, sku: p.sku,
        price: p.price, stock: p.stock,
        weight: 230, isActive: true, sortOrder: 1,
      },
    })

    console.log(`✅ Product: ${p.name}`)
  }

  // Sample coupons
  await prisma.coupon.upsert({
    where:  { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10', type: 'PERCENTAGE', value: 10,
      description: '10% off on your first order', minOrderAmount: 299,
      maxDiscount: 100, isActive: true,
    },
  })
  await prisma.coupon.upsert({
    where:  { code: 'FLAT50' },
    update: {},
    create: {
      code: 'FLAT50', type: 'FLAT', value: 50,
      description: '₹50 flat off', minOrderAmount: 499, isActive: true,
    },
  })

  // Hyderabad pincodes
  const hydPincodes = ['500001','500002','500003','500004','500008','500010','500016',
    '500018','500019','500020','500032','500033','500034','500035','500072','500081','500084']
  for (const code of hydPincodes) {
    await prisma.pincode.upsert({
      where:  { code },
      update: {},
      create: { code, city: 'Hyderabad', state: 'Telangana', isServiceable: true, shippingDays: 1, shippingCost: 0 },
    })
  }
  console.log('✅ Pincodes seeded')
  console.log('✅ Coupons seeded')

  // Brand site config
  const siteConfig = [
    { key: 'brand_tagline',    value: 'Real Ingredients. Real Cookies. Real Joy.' },
    { key: 'brand_promise',    value: 'No refined sugar. No artificial ingredients. No shortcuts.' },
    { key: 'brand_hero_claim', value: 'Every ingredient has a name.' },
    { key: 'wa_order_message', value: 'Hi Fondible! I\'d love to order your cookies 🍪 Real ingredients, real joy!' },
  ]
  for (const cfg of siteConfig) {
    await prisma.siteConfig.upsert({
      where:  { key: cfg.key },
      update: { value: cfg.value },
      create: { key: cfg.key, value: cfg.value, group: 'brand' },
    })
  }
  console.log('✅ Brand site config seeded')

  console.log('\n🎉 Fondible database seeded successfully!')
  console.log('\nAdmin credentials:')
  console.log('  Email:    admin@fondible.in')
  console.log('  Password: Admin@Fondible2025')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())

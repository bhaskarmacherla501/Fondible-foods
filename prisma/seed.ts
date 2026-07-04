import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

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

  // Category — one unified category, no millet-specific sub-category
  // One-time migration: fold the old millet-cookies category into the renamed one
  const oldCategory = await prisma.category.findUnique({ where: { slug: 'millet-cookies' } })
  if (oldCategory) {
    await prisma.category.update({
      where: { id: oldCategory.id },
      data:  {
        name: 'Clean-Baked Cookies', slug: 'clean-baked-cookies',
        description: 'Whole ingredient cookies baked with real butter, whole wheat and real grains',
      },
    })
  }

  const category = await prisma.category.upsert({
    where:  { slug: 'clean-baked-cookies' },
    update: {},
    create: {
      name: 'Clean-Baked Cookies', slug: 'clean-baked-cookies',
      description: 'Whole ingredient cookies baked with real butter, whole wheat and real grains',
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
      seoDesc:         `${p.shortDesc} No maida, no refined sugar, no artificial ingredients. Freshly baked and delivered across India.`,
      seoKeywords:     [...p.tags, 'whole ingredient cookie', 'jaggery cookie', 'real butter cookie', 'clean baking', 'India'],
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

  // Hyderabad pincodes — priority, free 1-day shipping
  const hydPincodes = ['500001','500002','500003','500004','500008','500010','500016',
    '500018','500019','500020','500032','500033','500034','500035','500072','500081','500084']
  for (const code of hydPincodes) {
    await prisma.pincode.upsert({
      where:  { code },
      update: {},
      create: { code, city: 'Hyderabad', state: 'Telangana', isServiceable: true, shippingDays: 1, shippingCost: 0 },
    })
  }

  // Metro pincodes — standard pan-India shipping
  const metroPincodes = [
    { code: '400001', city: 'Mumbai',    state: 'Maharashtra' },
    { code: '400051', city: 'Mumbai',    state: 'Maharashtra' },
    { code: '400069', city: 'Mumbai',    state: 'Maharashtra' },
    { code: '110001', city: 'Delhi',     state: 'Delhi' },
    { code: '110011', city: 'Delhi',     state: 'Delhi' },
    { code: '110020', city: 'Delhi',     state: 'Delhi' },
    { code: '560001', city: 'Bangalore', state: 'Karnataka' },
    { code: '560034', city: 'Bangalore', state: 'Karnataka' },
    { code: '560068', city: 'Bangalore', state: 'Karnataka' },
    { code: '600001', city: 'Chennai',   state: 'Tamil Nadu' },
    { code: '600010', city: 'Chennai',   state: 'Tamil Nadu' },
    { code: '600020', city: 'Chennai',   state: 'Tamil Nadu' },
    { code: '411001', city: 'Pune',      state: 'Maharashtra' },
    { code: '411014', city: 'Pune',      state: 'Maharashtra' },
    { code: '411028', city: 'Pune',      state: 'Maharashtra' },
  ]
  for (const p of metroPincodes) {
    await prisma.pincode.upsert({
      where:  { code: p.code },
      update: {},
      create: { code: p.code, city: p.city, state: p.state, isServiceable: true, shippingDays: 3, shippingCost: 60 },
    })
  }
  console.log('✅ Pincodes seeded')
  console.log('✅ Coupons seeded')

  // Brand site config
  const siteConfig = [
    { key: 'brand_tagline',    value: 'Better Food. Better Living.' },
    { key: 'brand_promise',    value: 'No refined sugar. No artificial ingredients. No shortcuts.' },
    { key: 'brand_hero_claim', value: 'Every ingredient has a name.' },
    { key: 'wa_order_message', value: 'Hi Fondible! I\'d love to order your cookies 🍪 Better Food. Better Living.' },
  ]
  for (const cfg of siteConfig) {
    await prisma.siteConfig.upsert({
      where:  { key: cfg.key },
      update: { value: cfg.value },
      create: { key: cfg.key, value: cfg.value, group: 'brand' },
    })
  }
  console.log('✅ Brand site config seeded')

  // Blog posts
  const blogPosts = [
    {
      title: 'Why We Bake With Real Butter (And Never Vanaspati)',
      excerpt: 'Vanaspati is cheaper, shelf-stable, and used in most commercial cookies. Here\'s why we refuse to use it.',
      category: 'Ingredients',
      tags: ['real-butter', 'ingredients', 'clean-baking'],
      content: `Walk into any commercial bakery and you'll find a tub of vanaspati — hydrogenated vegetable oil, solid at room temperature, cheap, and nearly shelf-stable forever. It's in most packaged cookies you've ever eaten.

We don't use it. Not a gram, not ever.

Vanaspati is made by forcing hydrogen into vegetable oil under high pressure, turning a liquid into a solid fat that behaves like butter without costing like butter. It's been linked to trans fats, and while regulations have tightened, "reduced trans fat" isn't the same as "no trans fat."

Real butter costs more. It has a shorter shelf life. It requires refrigeration and careful handling. It makes the entire baking process harder to scale. We do it anyway, because the difference shows up in the first bite — that rich, rounded flavor that vanaspati can only approximate with additives.

Every Fondible cookie is made with fresh, churned butter. No substitutes, no exceptions.`,
      authorName: 'Team Fondible',
      isPublished: true,
    },
    {
      title: 'Jaggery vs. Refined Sugar: What\'s Actually the Difference?',
      excerpt: 'They both sweeten. That\'s where the similarity ends.',
      category: 'Health',
      tags: ['jaggery', 'refined-sugar', 'health'],
      content: `Sugar is sugar, right? Not quite.

Refined white sugar is sucrose stripped of everything else that came with it in the original sugarcane — the molasses, the minerals, the trace nutrients. What's left is pure sweetness with no nutritional value beyond calories.

Jaggery is unrefined. It's made by boiling down sugarcane juice until it solidifies, keeping the molasses intact. That means it retains iron, potassium, and small amounts of other minerals that refined sugar processing removes entirely.

Jaggery also has a lower glycemic index than refined sugar, meaning it causes a slower rise in blood sugar. It's not a health food — let's be clear about that — but ingredient for ingredient, it's the more honest sweetener.

And there's the taste: jaggery carries a deep, caramel-like warmth that white sugar simply cannot replicate. Once you taste the difference side by side, it's hard to go back.

Every Fondible cookie is sweetened with jaggery. Zero refined sugar, zero exceptions.`,
      authorName: 'Team Fondible',
      isPublished: true,
    },
    {
      title: 'Whole Wheat vs. Maida: Reading Between the Lines',
      excerpt: 'Maida is refined wheat flour with almost everything that matters removed. Here\'s what gets lost.',
      category: 'Ingredients',
      tags: ['whole-wheat', 'maida', 'ingredients'],
      content: `Maida is what's left after wheat is milled, bleached, and stripped of its bran and germ — the parts that carry fiber, protein, and most of the grain's nutrients. What remains is a fine, white flour that bakes up soft and stretchy, and digests almost like sugar.

It's cheap, consistent, and used in the overwhelming majority of commercial baked goods, including most "healthy" cookies that swap out one ingredient while keeping maida in the mix.

Whole wheat flour keeps the bran and germ intact. It's higher in fiber, digests more slowly, and carries more of the grain's natural nutrition. It's also harder to work with — doughs behave differently, textures are less uniform, and consistency takes real skill to nail down.

We use stone-ground whole wheat flour in every Fondible cookie, along with grain flours like ragi and jowar in select recipes. Never maida — not even blended in for texture, which is a common shortcut we chose not to take.

If a cookie brand doesn't tell you what flour they use, that's usually the answer.`,
      authorName: 'Team Fondible',
      isPublished: true,
    },
  ]
  for (const post of blogPosts) {
    const slug = slugify(post.title)
    await prisma.blog.upsert({
      where:  { slug },
      update: {},
      create: {
        ...post, slug,
        seoTitle: `${post.title} | Fondible Blog`,
        seoDesc:  post.excerpt,
        publishedAt: post.isPublished ? new Date() : null,
      },
    })
  }
  console.log('✅ Blog posts seeded')

  console.log('\n🎉 Fondible database seeded successfully!')
  console.log('\nAdmin credentials:')
  console.log('  Email:    admin@fondible.in')
  console.log('  Password: Admin@Fondible2025')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())

import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Star, ChevronRight } from 'lucide-react'
import { ProductService } from '@/services/product.service'
import { ProductActions } from '@/components/shop/ProductActions'
import { ProductCard } from '@/components/shop/ProductCard'
import { formatDate } from '@/lib/utils'

interface NutritionFacts {
  servingSize: string
  calories: number
  protein: number
  carbohydrates: number
  fat: number
  fiber: number
  sugar: number
  sodium: number
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = await ProductService.getBySlug(slug)
  if (!product) return {}

  return {
    title:       product.seoTitle ?? product.name,
    description: product.seoDesc ?? product.shortDesc ?? undefined,
    alternates:  { canonical: `https://fondible.in/shop/${product.slug}` },
    openGraph:   {
      title: product.seoTitle ?? product.name,
      description: product.seoDesc ?? product.shortDesc ?? undefined,
      images: product.images[0] ? [{ url: product.images[0] }] : undefined,
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await ProductService.getBySlug(slug)
  if (!product) notFound()

  const related = await ProductService.getRelated(product.id, product.categoryId, 4)
  const nutrition = product.nutritionFacts as NutritionFacts | null

  return (
    <div className="page-container py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-brown/50 mb-8">
        <Link href="/shop" className="hover:text-gold">Shop</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-brown/70">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        {/* Images */}
        <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-brand-md bg-cream-dark">
          {product.images[0] && (
            <Image src={product.images[0]} alt={product.name} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" priority />
          )}
          {product.isBestseller && <span className="badge-gold absolute top-4 left-4">Bestseller</span>}
          {product.isNew && <span className="badge-brown absolute top-4 right-4">New</span>}
        </div>

        {/* Info */}
        <div>
          <h1 className="font-display text-4xl font-semibold text-brown mb-3">{product.name}</h1>
          {product.reviewCount > 0 && (
            <div className="flex items-center gap-2 mb-4 text-sm text-brown/60">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.round(product.averageRating) ? 'text-gold fill-gold' : 'text-brown/15'}`} />
                ))}
              </div>
              {product.averageRating.toFixed(1)} ({product.reviewCount} review{product.reviewCount !== 1 ? 's' : ''})
            </div>
          )}
          {product.shortDesc && <p className="text-brown/70 text-lg mb-6">{product.shortDesc}</p>}

          <ProductActions
            productId={product.id}
            productName={product.name}
            image={product.images[0] ?? ''}
            variants={product.variants}
          />

          {product.healthBenefits.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8">
              {product.healthBenefits.map(b => (
                <span key={b} className="badge-gold">{b}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {product.ingredients && (
          <div className="card-base p-6">
            <h2 className="font-display text-xl font-semibold text-brown mb-3">Ingredients</h2>
            <p className="text-sm text-brown/70 leading-relaxed">{product.ingredients}</p>
          </div>
        )}

        {nutrition && (
          <div className="card-base p-6">
            <h2 className="font-display text-xl font-semibold text-brown mb-3">Nutrition Facts</h2>
            <p className="text-xs text-brown/50 mb-3">Per serving ({nutrition.servingSize})</p>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <span className="text-brown/60">Calories</span><span className="text-right font-medium text-brown">{nutrition.calories} kcal</span>
              <span className="text-brown/60">Protein</span><span className="text-right font-medium text-brown">{nutrition.protein} g</span>
              <span className="text-brown/60">Carbohydrates</span><span className="text-right font-medium text-brown">{nutrition.carbohydrates} g</span>
              <span className="text-brown/60">Fat</span><span className="text-right font-medium text-brown">{nutrition.fat} g</span>
              <span className="text-brown/60">Fiber</span><span className="text-right font-medium text-brown">{nutrition.fiber} g</span>
              <span className="text-brown/60">Sugar</span><span className="text-right font-medium text-brown">{nutrition.sugar} g</span>
              <span className="text-brown/60">Sodium</span><span className="text-right font-medium text-brown">{nutrition.sodium} mg</span>
            </div>
          </div>
        )}

        {product.certifications.length > 0 && (
          <div className="card-base p-6">
            <h2 className="font-display text-xl font-semibold text-brown mb-3">Certifications</h2>
            <div className="flex flex-wrap gap-2">
              {product.certifications.map(c => <span key={c} className="badge-green">{c}</span>)}
            </div>
          </div>
        )}

        {product.allergens.length > 0 && (
          <div className="card-base p-6">
            <h2 className="font-display text-xl font-semibold text-brown mb-3">Allergen Information</h2>
            <div className="flex flex-wrap gap-2">
              {product.allergens.map(a => <span key={a} className="badge-red">Contains {a}</span>)}
            </div>
            {product.storageInfo && <p className="text-xs text-brown/50 mt-4">{product.storageInfo}</p>}
          </div>
        )}
      </div>

      {/* Reviews */}
      {product.reviews.length > 0 && (
        <div className="mb-16">
          <h2 className="font-display text-2xl font-semibold text-brown mb-6">Customer Reviews</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {product.reviews.map(r => (
              <div key={r.id} className="card-base p-6">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < r.rating ? 'text-gold fill-gold' : 'text-brown/15'}`} />
                  ))}
                </div>
                {r.title && <h3 className="font-semibold text-brown mb-1">{r.title}</h3>}
                {r.body && <p className="text-sm text-brown/70 mb-4">&ldquo;{r.body}&rdquo;</p>}
                <div className="flex items-center justify-between text-xs text-brown/50">
                  <span className="font-medium">{r.user?.name ?? 'Verified Buyer'}</span>
                  <span>{formatDate(r.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related products */}
      {related.length > 0 && (
        <div>
          <h2 className="font-display text-2xl font-semibold text-brown mb-6">You Might Also Like</h2>
          <div className="product-grid">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  )
}

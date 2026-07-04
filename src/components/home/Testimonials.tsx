import { Star } from 'lucide-react'

interface TestimonialReview {
  id: string
  rating: number
  title: string | null
  body: string | null
  user: { name: string | null; image: string | null } | null
  product: { name: string } | null
}

export function Testimonials({ reviews }: { reviews: TestimonialReview[] }) {
  if (reviews.length === 0) return null

  return (
    <section className="page-container py-20">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="section-label">Customer Love</span>
        <h2 className="section-title text-brown mt-2">What Our Customers Say</h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {reviews.map(r => (
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
              {r.product && <span>{r.product.name}</span>}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

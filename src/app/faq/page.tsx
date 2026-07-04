import type { Metadata } from 'next'
import { ChevronDown } from 'lucide-react'

export const metadata: Metadata = {
  title:       'FAQ — Frequently Asked Questions',
  description: 'Answers about Fondible\'s ingredients, jaggery sweetening, real butter, shelf life, and whether our cookies are suitable for diabetics.',
  alternates:  { canonical: 'https://fondible.in/faq' },
}

const FAQS = [
  {
    q: 'Are Fondible cookies healthy?',
    a: 'They\'re made with genuinely clean ingredients — whole wheat, real butter, whole nuts, jaggery. We wouldn\'t call any cookie a health food, but we will say there\'s nothing in ours that shouldn\'t be there.',
  },
  {
    q: 'What flour do you use?',
    a: 'Stone-ground whole wheat flour, primarily. For our ragi and jowar variants, we use those whole grain flours. We never use maida — not even partially.',
  },
  {
    q: 'Why jaggery and not brown sugar?',
    a: 'Brown sugar is refined white sugar with a small amount of molasses added back — it\'s essentially the same thing. Jaggery is unrefined, retains iron and minerals from the sugarcane, has a lower glycemic index, and tastes fundamentally different — deeper, more complex, more honest.',
  },
  {
    q: 'Do you use real butter or vanaspati?',
    a: 'Real butter. Always. We know it costs more and has a shorter shelf life. That\'s exactly why most commercial cookies don\'t use it. We do.',
  },
  {
    q: 'Are your cookies suitable for diabetics?',
    a: 'We use jaggery which has a lower glycemic index than refined sugar, and whole grain flours which digest more slowly. However, please consult your doctor — we\'re bakers, not nutritionists.',
  },
  {
    q: 'Do you use any preservatives?',
    a: 'None. Zero. Our cookies have a shelf life of 2 weeks from baking precisely because we don\'t use preservatives. Fresh is the point.',
  },
  {
    q: 'Why is the shelf life only 2 weeks?',
    a: 'Because real butter goes rancid without preservatives, and we use real butter. A shorter shelf life is proof that our ingredients are real.',
  },
]

export default function FaqPage() {
  return (
    <section className="page-container py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="section-label">Questions & Answers</span>
        <h1 className="section-title text-brown mt-2">Frequently Asked Questions</h1>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        {FAQS.map(faq => (
          <details key={faq.q} className="card-base group p-6 open:shadow-brand-md">
            <summary className="flex items-center justify-between gap-4 cursor-pointer font-semibold text-brown list-none">
              {faq.q}
              <ChevronDown className="w-5 h-5 text-gold flex-shrink-0 transition-transform group-open:rotate-180" />
            </summary>
            <p className="mt-4 text-sm text-brown/70 leading-relaxed">{faq.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

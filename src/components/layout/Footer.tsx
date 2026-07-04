import Link from 'next/link'
import Image from 'next/image'

const FOOTER_LINKS = {
  cookies:  [
    { label: 'Mixed Nut Supreme', href: '/shop/mixed-nut-supreme' },
    { label: 'Cashew Classic',    href: '/shop/cashew-classic' },
    { label: 'Ragi Almond',       href: '/shop/ragi-almond' },
    { label: 'Walnut Cookies',    href: '/shop/walnut-cookies' },
    { label: 'Coconut Classic',   href: '/shop/coconut-classic' },
    { label: 'Roasted Almond',    href: '/shop/roasted-almond' },
  ],
  company:  [
    { label: 'About Fondible',   href: '/about' },
    { label: 'Our Ingredients',  href: '/our-ingredients' },
    { label: 'Ingredients',      href: '/ingredients' },
    { label: 'Blog & Recipes',   href: '/blog' },
    { label: 'Careers',          href: '/careers' },
    { label: 'Franchise',        href: '/franchise' },
  ],
  support:  [
    { label: 'FAQ',              href: '/faq' },
    { label: 'Track Order',      href: '/track-order' },
    { label: 'Contact Us',       href: '/contact' },
    { label: 'Corporate Gifting',href: '/corporate-gifting' },
    { label: 'Bulk Orders',      href: '/franchise' },
  ],
  policies: [
    { label: 'Privacy Policy',   href: '/privacy-policy' },
    { label: 'Terms & Conditions',href: '/terms' },
    { label: 'Shipping Policy',  href: '/shipping-policy' },
    { label: 'Return Policy',    href: '/return-policy' },
  ],
}

const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER ?? '918019730055'

export function Footer() {
  return (
    <footer className="bg-[#1A0F08] text-cream/80 pt-16 pb-8">
      <div className="page-container">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 lg:col-span-1">
            <Image src="/images/logo-white.png" alt="Fondible" width={120} height={40} className="h-10 w-auto mb-4 object-contain" />
            <p className="text-sm text-cream/60 leading-relaxed mb-5 max-w-52">
              Better Food. Better Living.<br />
              Freshly baked cookies — genuinely good for you.
            </p>
            <a href={`https://wa.me/${WA_NUMBER}?text=Hi%20Fondible!`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2.5 rounded-full text-xs font-bold hover:bg-[#128C7E] transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.552 4.116 1.515 5.849L.057 23.9a.5.5 0 00.611.611l6.051-1.458A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.96 0-3.806-.498-5.42-1.374l-.39-.22-4.04.975.997-3.965-.24-.383A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              Order on WhatsApp
            </a>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-xs font-bold tracking-widest uppercase text-gold mb-4">
                {section === 'cookies' ? 'Our Cookies' :
                 section === 'company' ? 'Company' :
                 section === 'support' ? 'Help & Support' : 'Policies'}
              </h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-xs text-cream/60 hover:text-gold transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-cream/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-cream/40">© 2025 Fondible · Made with ❤️ in Hyderabad, India</p>
          <div className="flex items-center gap-3">
            {['Made Fresh Daily', 'Real Butter', 'Whole Wheat & Real Grains'].map(b => (
              <span key={b} className="text-2xs font-semibold tracking-wider uppercase text-cream/30 bg-cream/5 border border-cream/8 rounded-full px-2.5 py-1">
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

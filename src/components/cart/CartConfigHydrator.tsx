'use client'
import { useEffect } from 'react'
import { configureCartTotals } from '@/store/cart.store'

interface CartConfig {
  shippingFee: number
  freeShippingThreshold: number
  taxRate: number
}

export function CartConfigHydrator({ config }: { config: CartConfig }) {
  useEffect(() => {
    configureCartTotals(config)
  }, [config.shippingFee, config.freeShippingThreshold, config.taxRate])

  return null
}

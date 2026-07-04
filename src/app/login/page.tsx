'use client'
import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import { validatePhone } from '@/lib/utils'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/'

  const [mode, setMode]       = useState<'email' | 'phone'>('email')
  const [loading, setLoading] = useState(false)

  // Email/password
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')

  // Phone OTP
  const [phone, setPhone]     = useState('')
  const [otp, setOtp]         = useState('')
  const [otpSent, setOtpSent] = useState(false)

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)
    if (res?.error) { toast.error('Invalid email or password'); return }
    toast.success('Welcome back!')
    router.push(callbackUrl)
    router.refresh()
  }

  const handleSendOtp = async () => {
    if (!validatePhone(phone)) { toast.error('Enter a valid 10-digit phone number'); return }
    setLoading(true)
    try {
      const res  = await fetch('/api/otp', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })
      const data = await res.json()
      if (!data.success) { toast.error(data.error ?? 'Failed to send OTP'); return }
      setOtpSent(true)
      toast.success(data._dev_otp ? `OTP sent! (dev: ${data._dev_otp})` : 'OTP sent to your phone')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await signIn('otp', { phone, otp, redirect: false })
    setLoading(false)
    if (res?.error) { toast.error('Invalid or expired OTP'); return }
    toast.success('Welcome back!')
    router.push(callbackUrl)
    router.refresh()
  }

  return (
    <div className="page-container py-20">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <span className="section-label">Welcome Back</span>
          <h1 className="section-title text-brown mt-2">Sign In</h1>
        </div>

        <div className="card-base p-8">
          {/* Google */}
          <button onClick={() => signIn('google', { callbackUrl })}
            className="btn-secondary w-full justify-center mb-6">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="h-px bg-brown/10 flex-1" />
            <span className="text-xs text-brown/40 uppercase tracking-wider">Or</span>
            <div className="h-px bg-brown/10 flex-1" />
          </div>

          {/* Mode toggle */}
          <div className="flex gap-2 mb-6 bg-cream rounded-xl p-1">
            <button onClick={() => setMode('email')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${mode === 'email' ? 'bg-white text-brown shadow-brand-sm' : 'text-brown/50'}`}>
              Email
            </button>
            <button onClick={() => setMode('phone')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${mode === 'phone' ? 'bg-white text-brown shadow-brand-sm' : 'text-brown/50'}`}>
              Phone OTP
            </button>
          </div>

          {mode === 'email' ? (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <input type="email" required placeholder="Email address" value={email}
                onChange={e => setEmail(e.target.value)} className="input-base" />
              <input type="password" required placeholder="Password" value={password}
                onChange={e => setPassword(e.target.value)} className="input-base" />
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />} Sign In
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <input type="tel" required placeholder="10-digit phone number" value={phone}
                disabled={otpSent} onChange={e => setPhone(e.target.value)} className="input-base" />
              {!otpSent ? (
                <button type="button" onClick={handleSendOtp} disabled={loading} className="btn-primary w-full justify-center">
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />} Send OTP
                </button>
              ) : (
                <>
                  <input type="text" required placeholder="6-digit OTP" value={otp}
                    onChange={e => setOtp(e.target.value)} className="input-base" />
                  <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />} Verify & Sign In
                  </button>
                  <button type="button" onClick={() => setOtpSent(false)} className="text-xs text-brown/50 hover:text-gold w-full text-center">
                    Change phone number
                  </button>
                </>
              )}
            </form>
          )}

          <p className="text-center text-sm text-brown/60 mt-6">
            Don&apos;t have an account? <Link href="/signup" className="text-gold font-semibold hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}

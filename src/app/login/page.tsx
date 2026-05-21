'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { signIn } from '@/lib/auth-client'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextParam = searchParams.get('next')
  const fromGoogle = searchParams.get('from') === 'google'

  useEffect(() => {
    if (nextParam === 'checkout' && fromGoogle) {
      fetch('/api/stripe/checkout', { method: 'POST' }).then(res => {
        if (res.ok) res.json().then(({ url }) => { if (url) window.location.href = url })
        else router.push('/')
      })
    }
  }, [nextParam, fromGoogle, router])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function afterLogin() {
    const callbackURL = searchParams.get('callbackURL')
    if (callbackURL) {
      router.push(callbackURL)
      return
    }
    router.push('/')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    await signIn.email({
      email,
      password,
      callbackURL: '/',
      fetchOptions: {
        onError: (ctx) => {
          const msg = ctx.error.message || ''
          if (msg.toLowerCase().includes('email') && msg.toLowerCase().includes('verif')) {
            setError('请先验证邮箱，检查你的收件箱。')
          } else {
            setError(msg || '邮箱或密码不正确')
          }
        },
        onSuccess: () => afterLogin(),
      },
    })
    setLoading(false)
  }

  async function handleGoogle() {
    const callback = nextParam === 'checkout' ? '/login?next=checkout&from=google' : '/'
    await signIn.social({ provider: 'google', callbackURL: callback })
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center md:justify-end px-4 md:px-0"
      style={{
        backgroundImage: "url('/login-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'left center',
        fontFamily: 'Manrope, system-ui, sans-serif',
        paddingRight: 'clamp(1rem, 8vw, 10rem)',
      }}
    >
      <div
        className="relative w-full max-w-[420px] rounded-[2rem] overflow-hidden"
        style={{
          background: 'rgba(240, 225, 200, 0.18)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          boxShadow: '0 32px 80px rgba(20,10,0,0.4), 0 1px 0 rgba(255,255,255,0.25) inset',
          border: '1px solid rgba(255,220,170,0.25)',
        }}
      >
        {/* 植物水印 — 左上 */}
        <svg className="absolute top-0 left-0 opacity-[0.07] pointer-events-none" width="180" height="180" viewBox="0 0 180 180" fill="none">
          <path d="M10 170 Q40 100 90 80 Q60 130 10 170Z" fill="#5a3a1a" />
          <path d="M5 140 Q50 90 100 60" stroke="#5a3a1a" strokeWidth="1.5" fill="none" />
          <path d="M30 160 Q55 115 75 90 Q60 120 30 160Z" fill="#5a3a1a" />
          <circle cx="100" cy="58" r="3" fill="#5a3a1a" />
        </svg>
        {/* 植物水印 — 右下 */}
        <svg className="absolute bottom-0 right-0 opacity-[0.07] pointer-events-none" width="160" height="160" viewBox="0 0 160 160" fill="none">
          <path d="M160 10 Q120 60 80 80 Q110 40 160 10Z" fill="#5a3a1a" />
          <path d="M155 30 Q110 75 70 95" stroke="#5a3a1a" strokeWidth="1.5" fill="none" />
          <circle cx="68" cy="98" r="2.5" fill="#5a3a1a" />
        </svg>

        <div className="relative z-10 px-10 py-12">
          <div className="mb-8">
            <h1 className="text-[2rem] font-semibold leading-tight mb-2"
              style={{ color: '#f5e6d0', letterSpacing: '-0.01em', textShadow: '0 1px 8px rgba(0,0,0,0.3)' }}>
              先进来坐坐。
            </h1>
            <p className="text-sm" style={{ color: 'rgba(245,220,185,0.75)' }}>想说的时候，再开口。</p>
          </div>

          <div className="flex items-center gap-3 mb-8">
            <div className="flex-1 h-px" style={{ background: 'rgba(122,92,62,0.2)' }} />
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase" style={{ color: 'rgba(240,200,145,0.7)' }}>登录</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(122,92,62,0.2)' }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email" placeholder="邮箱" value={email}
              onChange={(e) => setEmail(e.target.value)} required
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{ background: 'rgba(255,245,230,0.15)', border: '1px solid rgba(255,220,170,0.3)', color: '#f5e6d0' }}
              onFocus={(e) => { e.target.style.borderColor = 'rgba(255,200,130,0.6)'; e.target.style.background = 'rgba(255,245,230,0.28)' }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(255,220,170,0.3)'; e.target.style.background = 'rgba(255,245,230,0.15)' }}
            />
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'} placeholder="密码" value={password}
                onChange={(e) => setPassword(e.target.value)} required
                className="w-full px-4 py-3 pr-12 rounded-xl text-sm outline-none transition-all"
                style={{ background: 'rgba(255,245,230,0.15)', border: '1px solid rgba(255,220,170,0.3)', color: '#f5e6d0' }}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(255,200,130,0.6)'; e.target.style.background = 'rgba(255,245,230,0.28)' }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255,220,170,0.3)'; e.target.style.background = 'rgba(255,245,230,0.15)' }}
              />
              <button type="button" onClick={() => setShowPw(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 opacity-50 hover:opacity-100 transition-opacity"
                style={{ color: '#f5e6d0' }}>
                {showPw
                  ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></svg>
                  : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /><circle cx="12" cy="12" r="3" strokeWidth="1.5" /></svg>
                }
              </button>
            </div>
            {error && <p className="text-xs text-center" style={{ color: '#ffb4ab' }}>{error}</p>}
            <div className="text-right">
              <Link href="/forgot-password" className="text-xs hover:opacity-70" style={{ color: 'rgba(245,220,185,0.55)' }}>
                忘记密码？
              </Link>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-60 relative overflow-hidden"
              style={{ background: 'rgba(44,26,14,0.75)', backdropFilter: 'blur(8px)', color: '#f5e6d0', letterSpacing: '0.05em', border: '1px solid rgba(255,200,130,0.2)' }}
              onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.background = 'rgba(60,36,18,0.85)' }}
              onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.background = 'rgba(44,26,14,0.75)' }}>
              {loading ? '登录中…' : '登录'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: 'rgba(122,92,62,0.2)' }} />
            <span className="text-xs" style={{ color: 'rgba(240,200,145,0.7)' }}>或</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(122,92,62,0.2)' }} />
          </div>

          <button type="button" onClick={handleGoogle}
            className="w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-3 transition-opacity hover:opacity-80"
            style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,220,170,0.25)', color: '#f5e6d0' }}>
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            使用 Google 继续
          </button>

          <p className="text-center text-sm mt-6" style={{ color: 'rgba(245,220,185,0.7)' }}>
            还没有账户？{' '}
            <Link href="/register" className="font-semibold underline underline-offset-2 hover:opacity-70" style={{ color: '#f5e6d0' }}>
              注册
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

import { Suspense } from 'react'
export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>
}

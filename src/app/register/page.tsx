'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signUp } from '@/lib/auth-client'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    await signUp.email({
      email,
      password,
      name: email,
      callbackURL: '/',
      fetchOptions: {
        onError: (ctx) => setError(ctx.error.message || '注册失败，请重试'),
        onSuccess: () => router.push('/'),
      },
    })
    setLoading(false)
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
        <div className="relative z-10 px-10 py-12">
          <div className="mb-8">
            <h1 className="text-[2rem] font-semibold leading-tight mb-2"
              style={{ color: '#f5e6d0', letterSpacing: '-0.01em', textShadow: '0 1px 8px rgba(0,0,0,0.3)' }}>
              初次见面。
            </h1>
            <p className="text-sm" style={{ color: 'rgba(245,220,185,0.75)' }}>它们一直在等你。</p>
          </div>

          <div className="flex items-center gap-3 mb-8">
            <div className="flex-1 h-px" style={{ background: 'rgba(122,92,62,0.2)' }} />
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase" style={{ color: 'rgba(240,200,145,0.7)' }}>注册</span>
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
            <input
              type="password" placeholder="密码（至少 8 位）" value={password}
              onChange={(e) => setPassword(e.target.value)} required minLength={8}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{ background: 'rgba(255,245,230,0.15)', border: '1px solid rgba(255,220,170,0.3)', color: '#f5e6d0' }}
              onFocus={(e) => { e.target.style.borderColor = 'rgba(255,200,130,0.6)'; e.target.style.background = 'rgba(255,245,230,0.28)' }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(255,220,170,0.3)'; e.target.style.background = 'rgba(255,245,230,0.15)' }}
            />
            {error && <p className="text-xs text-center" style={{ color: '#ffb4ab' }}>{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-60"
              style={{ background: 'rgba(44,26,14,0.75)', backdropFilter: 'blur(8px)', color: '#f5e6d0', letterSpacing: '0.05em', border: '1px solid rgba(255,200,130,0.2)' }}
              onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.background = 'rgba(60,36,18,0.85)' }}
              onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.background = 'rgba(44,26,14,0.75)' }}>
              {loading ? '注册中…' : '注册'}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'rgba(245,220,185,0.7)' }}>
            已有账户？{' '}
            <Link href="/login" className="font-semibold underline underline-offset-2 hover:opacity-70" style={{ color: '#f5e6d0' }}>
              登录
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError('两次密码不一致'); return }
    if (!token) { setError('无效的重置链接'); return }
    setError('')
    setLoading(true)
    const { error } = await authClient.resetPassword({ newPassword: password, token })
    if (error) setError(error.message || '重置失败，请重试')
    else setDone(true)
    setLoading(false)
  }

  if (done) {
    return (
      <div className="text-center py-4">
        <p className="text-[2rem] font-semibold mb-3" style={{ color: '#f5e6d0' }}>密码已重置</p>
        <p className="text-sm mb-6" style={{ color: 'rgba(245,220,185,0.75)' }}>
          可以用新密码登录了。
        </p>
        <Link href="/login" className="text-sm font-semibold underline underline-offset-2" style={{ color: '#f5e6d0' }}>
          去登录
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-[2rem] font-semibold leading-tight mb-2"
          style={{ color: '#f5e6d0', letterSpacing: '-0.01em', textShadow: '0 1px 8px rgba(0,0,0,0.3)' }}>
          设置新密码
        </h1>
        <p className="text-sm" style={{ color: 'rgba(245,220,185,0.75)' }}>请输入你的新密码。</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="password" placeholder="新密码（至少 8 位）" value={password}
          onChange={(e) => setPassword(e.target.value)} required minLength={8}
          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
          style={{ background: 'rgba(255,245,230,0.15)', border: '1px solid rgba(255,220,170,0.3)', color: '#f5e6d0' }}
          onFocus={(e) => { e.target.style.borderColor = 'rgba(255,200,130,0.6)'; e.target.style.background = 'rgba(255,245,230,0.28)' }}
          onBlur={(e) => { e.target.style.borderColor = 'rgba(255,220,170,0.3)'; e.target.style.background = 'rgba(255,245,230,0.15)' }}
        />
        <input
          type="password" placeholder="确认新密码" value={confirm}
          onChange={(e) => setConfirm(e.target.value)} required minLength={8}
          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
          style={{ background: 'rgba(255,245,230,0.15)', border: '1px solid rgba(255,220,170,0.3)', color: '#f5e6d0' }}
          onFocus={(e) => { e.target.style.borderColor = 'rgba(255,200,130,0.6)'; e.target.style.background = 'rgba(255,245,230,0.28)' }}
          onBlur={(e) => { e.target.style.borderColor = 'rgba(255,220,170,0.3)'; e.target.style.background = 'rgba(255,245,230,0.15)' }}
        />
        {error && <p className="text-xs text-center" style={{ color: '#ffb4ab' }}>{error}</p>}
        <button type="submit" disabled={loading}
          className="w-full py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-60"
          style={{ background: 'rgba(44,26,14,0.75)', backdropFilter: 'blur(8px)', color: '#f5e6d0', letterSpacing: '0.05em', border: '1px solid rgba(255,200,130,0.2)' }}>
          {loading ? '重置中…' : '确认重置'}
        </button>
      </form>
    </>
  )
}

export default function ResetPasswordPage() {
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
          <Suspense fallback={<p style={{ color: '#f5e6d0' }}>加载中…</p>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

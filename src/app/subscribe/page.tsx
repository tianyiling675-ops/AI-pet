'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/lib/auth-client'

export default function SubscribePage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (isPending) return
    if (!session?.user) {
      router.replace('/login?callbackURL=/subscribe')
      return
    }
    fetch('/api/stripe/checkout', { method: 'POST' })
      .then(res => res.json())
      .then(({ url }) => {
        if (url) window.location.href = url
        else router.replace('/')
      })
      .catch(() => router.replace('/'))
  }, [session, isPending, router])

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#1a0f08', color: '#f5e6d0', fontFamily: 'system-ui',
    }}>
      <p style={{ opacity: 0.6 }}>正在跳转支付页面…</p>
    </div>
  )
}

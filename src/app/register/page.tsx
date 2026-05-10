'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const json = await res.json()

    if (json.error) {
      setError(json.error)
      setLoading(false)
      return
    }

    await signIn('credentials', { email, password, redirect: false })
    router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf9f7]">
      <div className="w-full max-w-sm px-6">
        <h1 className="text-2xl font-medium text-gray-800 text-center mb-8">注册</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-sm outline-none focus:border-gray-400 transition-colors"
          />
          <input
            type="password"
            placeholder="密码（至少6位）"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-sm outline-none focus:border-gray-400 transition-colors"
          />
          {error && <p className="text-red-500 text-xs text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gray-800 text-white rounded-xl text-sm font-medium disabled:opacity-50 transition-opacity"
          >
            {loading ? '注册中…' : '注册'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-400 mt-6">
          已有账户？{' '}
          <Link href="/login" className="text-gray-700 underline underline-offset-2">
            登录
          </Link>
        </p>
      </div>
    </div>
  )
}

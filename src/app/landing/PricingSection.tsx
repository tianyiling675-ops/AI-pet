'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function PricingSection() {
  const [loading, setLoading] = useState(false)

  async function handleUpgrade() {
    setLoading(true)
    const res = await fetch('/api/stripe/checkout', { method: 'POST' })
    if (res.status === 401) {
      window.location.href = '/login?next=checkout'
      return
    }
    const { url } = await res.json()
    if (url) window.location.href = url
    else setLoading(false)
  }

  return (
    <section style={{ padding: '80px 24px', background: '#f0ebe0' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#1a0f08', marginBottom: 12 }}>
            选择你的陪伴方式
          </h2>
          <p style={{ color: '#8b6040', fontSize: 15 }}>随时可以升级，也随时可以取消</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, maxWidth: 720, margin: '0 auto' }}>

          {/* 免费版 */}
          <div style={{ borderRadius: 24, padding: '36px 32px', background: '#fff', border: '1px solid #e8d8c0', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#8b6040', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>免费版</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 40, fontWeight: 700, color: '#1a0f08' }}>¥0</span>
                <span style={{ fontSize: 14, color: '#8b6040' }}> / 月</span>
              </div>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
              {[
                '每天 10 条消息',
                '4 只宠物全解锁',
                '对话历史保存',
                '基础记忆功能',
              ].map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#3d2010' }}>
                  <span style={{ color: '#c09060', fontWeight: 700 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              style={{ display: 'block', textAlign: 'center', padding: '13px 0', borderRadius: 12, fontSize: 14, fontWeight: 600, border: '1px solid #e0d0bc', color: '#5c3d1e', textDecoration: 'none' }}>
              免费开始
            </Link>
          </div>

          {/* 高级版 */}
          <div style={{ borderRadius: 24, padding: '36px 32px', background: '#2c1a0e', border: '1px solid rgba(255,200,130,0.2)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
            {/* 推荐标签 */}
            <div style={{ position: 'absolute', top: 20, right: 20, background: '#c08040', color: '#1a0f08', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, letterSpacing: '0.05em' }}>
              推荐
            </div>
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(245,220,185,0.6)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>高级版</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 40, fontWeight: 700, color: '#f5e6d0' }}>¥18</span>
                <span style={{ fontSize: 14, color: 'rgba(245,220,185,0.6)' }}> / 月</span>
              </div>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
              {[
                '无限条消息',
                '4 只宠物全解锁',
                '对话历史保存',
                '深度记忆与日记',
                '生成专属回忆图片',
                '优先响应速度',
              ].map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'rgba(245,220,185,0.85)' }}>
                  <span style={{ color: '#c08040', fontWeight: 700 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <button
              onClick={handleUpgrade}
              disabled={loading}
              style={{ display: 'block', width: '100%', textAlign: 'center', padding: '13px 0', borderRadius: 12, fontSize: 14, fontWeight: 600, background: '#d4965a', color: '#1a0f08', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? '跳转中…' : '立即订阅'}
            </button>
          </div>

        </div>
      </div>
    </section>
  )
}

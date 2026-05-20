import Link from 'next/link'
import PricingSection from './PricingSection'

const pets = [
  {
    id: 'ping_an',
    name: '平安',
    species: '猫',
    desc: '慵懒的橘猫，话不多但总是让你感到温暖，总是在你需要时，默默陪在你身边。',
    img: '/pets/ping_an.jpg',
    bg: '#5c3d1e',
  },
  {
    id: 'mo',
    name: '默',
    species: '边牧',
    desc: '聪明的边牧，对世界充满好奇，喜欢和你一起思考生命中的大问题。',
    img: '/pets/mo.jpg',
    bg: '#2c3a4a',
  },
  {
    id: 'chi',
    name: '赤',
    species: '幼龙',
    desc: '骄傲的小龙，梦想着征服世界，目前还很小，但勇气满满，永不放弃。',
    img: '/pets/chi.jpg',
    bg: '#5c1e1e',
  },
  {
    id: 'hawk',
    name: '隼',
    species: '鹰',
    desc: '沉稳的观察者，看得很远，懂得很多，会在关键时刻给你最重要的支持。',
    img: '/pets/hawk.jpg',
    bg: '#2a2a2a',
  },
]

const steps = [
  { num: '1', icon: '🐾', title: '选择你的伙伴', desc: '从四只性格各异的宠物中，选择最能打动你的那一只' },
  { num: '2', icon: '💬', title: '开始对话', desc: '像和真实的宠物一样聊天，分享你的喜怒哀乐' },
  { num: '3', icon: '❤️', title: '建立独特的羁绊', desc: '它会记住你们的点点滴滴，成为真正懂你的伙伴' },
]

const features = [
  { icon: '🧠', title: '记忆你的故事', desc: '记住你的喜好、经历和重要时刻，让每次对话都有延续感' },
  { icon: '💙', title: '情感不评判', desc: '无论你分享什么，宠物伙伴总是真诚倾听、不评判、不说教' },
  { icon: '👥', title: '专属陪伴', desc: '四只宠物，总有一只能懂你，陪你的每个时刻' },
  { icon: '🔒', title: '隐私安全', desc: '严格保护你的隐私，所有对话和数据都安全加密' },
]

const testimonials = [
  { text: '"平安就像家里的猫一样，总是在我需要沉默时陪着我。"', name: '小雨', duration: '使用3个月' },
  { text: '"和默聊天让我重新思考了很多问题，它总能提出很有意思的观点。"', name: '阿哲', duration: '使用2个月' },
  { text: '"赤太可爱了！它的成长让我觉得很治愈，每天都期待和它聊天。"', name: '糖糖', duration: '使用4个月' },
]

export default function LandingPage() {
  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: '#faf6f1' }}>

      {/* ── 导航 ── */}
      <nav style={{ background: 'rgba(250,246,241,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e8d8c0', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 24 }}>🐾</span>
            <span style={{ fontWeight: 700, fontSize: 18, color: '#2c1a0e' }}>宠物陪伴</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32, fontSize: 14, color: '#5c3d1e' }} className="hidden md:flex">
            {['宠物介绍', '功能特色', '安全与隐私', '用户评价'].map(item => (
              <a key={item} href={`#${item}`} className="hover:opacity-60 transition-opacity" style={{ textDecoration: 'none', color: '#5c3d1e' }}>
                {item}
              </a>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/login" style={{ fontSize: 14, padding: '8px 16px', borderRadius: 10, color: '#5c3d1e', textDecoration: 'none', border: '1px solid #e0d0bc' }}>
              登录
            </Link>
            <Link href="/register" style={{ fontSize: 14, padding: '8px 18px', borderRadius: 10, fontWeight: 600, color: '#fff', background: '#c08040', textDecoration: 'none' }}>
              免费开始
            </Link>
          </div>
        </div>
      </nav>

      {/* ── 英雄区 ── */}
      <section style={{ background: '#1a0f08', minHeight: '88vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        {/* 右侧宠物拼图 */}
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '50%', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' }}>
          {pets.map(p => (
            <div key={p.id} style={{ position: 'relative', overflow: 'hidden', background: p.bg }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
            </div>
          ))}
        </div>
        {/* 渐变蒙层 */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #1a0f08 42%, rgba(26,15,8,0.85) 62%, rgba(26,15,8,0.2) 100%)' }} />

        {/* 文字内容 */}
        <div style={{ position: 'relative', maxWidth: 1100, margin: '0 auto', padding: '0 24px', width: '100%' }}>
          <div style={{ maxWidth: 520 }}>
            <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 700, lineHeight: 1.2, color: '#f5e6d0', marginBottom: 20 }}>
              四只宠物，<br />四种陪伴方式
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: 'rgba(245,220,185,0.75)', marginBottom: 32 }}>
              24小时在线的AI宠物伙伴，听你说话，<br />记住你，陪你度过每一个时刻。
            </p>
            <div style={{ display: 'flex', gap: 28, marginBottom: 36, flexWrap: 'wrap' }}>
              {[
                { icon: '⏰', title: '随时在线', sub: '24小时陪伴' },
                { icon: '💭', title: '记住你', sub: '记住你的喜好和重要时刻' },
                { icon: '🤍', title: '不评判', sub: '无条件接纳你的情绪' },
              ].map(f => (
                <div key={f.title} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 20, marginTop: 2 }}>{f.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#f5e6d0' }}>{f.title}</div>
                    <div style={{ fontSize: 11, color: 'rgba(245,220,185,0.55)' }}>{f.sub}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
              <Link href="/register" style={{ padding: '13px 28px', borderRadius: 12, fontWeight: 600, fontSize: 14, background: '#d4965a', color: '#1a0f08', textDecoration: 'none' }}>
                免费开始陪伴
              </Link>
              <a href="#功能特色" style={{ padding: '13px 24px', borderRadius: 12, fontWeight: 600, fontSize: 14, border: '1px solid rgba(245,220,185,0.3)', color: '#f5e6d0', textDecoration: 'none' }}>
                了解更多
              </a>
            </div>
            <p style={{ fontSize: 12, color: 'rgba(245,220,185,0.45)' }}>
              已有 <span style={{ color: '#d4965a' }}>12,345+</span> 用户开始陪伴之旅
            </p>
          </div>
        </div>
      </section>

      {/* ── 三步骤 ── */}
      <section style={{ padding: '80px 24px', background: '#faf6f1' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: '#1a0f08', marginBottom: 12 }}>简单三步，开始你的陪伴之旅</h2>
            <p style={{ color: '#8b6040', fontSize: 15 }}>没有复杂的设置，三分钟即可拥有专属的宠物伙伴</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 40 }}>
            {steps.map(step => (
              <div key={step.num} style={{ textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: 20, background: '#f0e8dc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 16px' }}>
                  {step.icon}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#c09060', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {step.num}
                  </span>
                  <span style={{ fontWeight: 600, color: '#1a0f08' }}>{step.title}</span>
                </div>
                <p style={{ fontSize: 13, color: '#8b6040', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 宠物卡片 ── */}
      <section id="宠物介绍" style={{ padding: '80px 24px', background: '#f0ebe0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: '#1a0f08', marginBottom: 12 }}>认识你的四位伙伴</h2>
            <p style={{ color: '#8b6040', fontSize: 15 }}>每只宠物都有独特的性格，找到最适合你的那一位</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {pets.map(pet => (
              <div key={pet.id} style={{ borderRadius: 20, overflow: 'hidden', background: '#fff', border: '1px solid #e8d8c0' }}>
                <div style={{ aspectRatio: '1/1', overflow: 'hidden' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={pet.img} alt={pet.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
                <div style={{ padding: '16px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: 18, color: '#1a0f08' }}>{pet.name}</span>
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: '#f0e8dc', color: '#8b6040' }}>
                      {pet.species}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: '#6b4c2a', lineHeight: 1.7, marginBottom: 12 }}>{pet.desc}</p>
                  <Link href="/register" style={{ fontSize: 12, fontWeight: 500, color: '#c09060', textDecoration: 'none' }}>
                    了解更多 →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 功能特色 ── */}
      <section id="功能特色" style={{ padding: '80px 24px', background: '#faf6f1' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: '#1a0f08', marginBottom: 12 }}>为什么选择宠物陪伴</h2>
            <p style={{ color: '#8b6040', fontSize: 15 }}>不仅仅是聊天，更是有温度的陪伴体验</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {features.map(f => (
              <div key={f.title} style={{ padding: '28px 24px', borderRadius: 20, textAlign: 'center', background: '#fff', border: '1px solid #e8d8c0' }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
                <h3 style={{ fontWeight: 600, color: '#1a0f08', marginBottom: 10, fontSize: 15 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: '#8b6040', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 安全与隐私 ── */}
      <section id="安全与隐私" style={{ padding: '80px 24px', background: '#f0ebe0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 60, alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: '#1a0f08', marginBottom: 20 }}>你的安全，我们最在意</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['所有数据端到端加密', '严格的隐私保护政策', '不会使用你的数据用于训练', '随时可以删除你的所有数据'].map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#3d2010' }}>
                  <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#c09060', color: '#fff', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <a href="#" style={{ fontSize: 13, fontWeight: 500, color: '#c09060', textDecoration: 'none' }}>
              了解我们的隐私政策 →
            </a>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 180, height: 180, borderRadius: '50%', background: 'rgba(192,144,96,0.08)', border: '2px solid rgba(192,144,96,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 120, height: 120, borderRadius: '50%', background: 'rgba(192,144,96,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52 }}>
                🔒
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 用户评价 ── */}
      <section id="用户评价" style={{ padding: '80px 24px', background: '#faf6f1' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: '#1a0f08', marginBottom: 12 }}>他们的陪伴故事</h2>
            <p style={{ color: '#8b6040', fontSize: 15 }}>真实用户的真实感受</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ padding: '24px', borderRadius: 20, background: '#fff', border: '1px solid #e8d8c0' }}>
                <div style={{ display: 'flex', marginBottom: 12 }}>
                  {[...Array(5)].map((_, j) => (
                    <span key={j} style={{ color: '#f59e0b', fontSize: 16 }}>★</span>
                  ))}
                </div>
                <p style={{ fontSize: 14, color: '#3d2010', lineHeight: 1.7, marginBottom: 16 }}>{t.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#c09060', color: '#fff', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1a0f08' }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: '#8b6040' }}>{t.duration}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <a href="#" style={{ fontSize: 13, fontWeight: 500, color: '#c09060', textDecoration: 'none' }}>查看更多用户故事 →</a>
          </div>
        </div>
      </section>

      {/* ── 定价 ── */}
      <PricingSection />

      {/* ── CTA ── */}
      <section style={{ padding: '80px 24px', background: '#2c1a0e' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 700, color: '#f5e6d0', marginBottom: 16 }}>
            准备好遇见你的伙伴了吗？
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(245,220,185,0.65)', marginBottom: 32, lineHeight: 1.7 }}>
            加入 12,345+ 用户的陪伴之旅，寻找属于你的温暖陪伴
          </p>
          <Link href="/register" style={{ display: 'inline-block', padding: '14px 36px', borderRadius: 14, fontWeight: 600, fontSize: 15, background: '#d4965a', color: '#1a0f08', textDecoration: 'none', marginBottom: 16 }}>
            免费开始陪伴
          </Link>
          <p style={{ fontSize: 12, color: 'rgba(245,220,185,0.35)' }}>不需要信用卡，立即开始，永久免费基础版</p>
        </div>
      </section>

      {/* ── 页脚 ── */}
      <footer style={{ padding: '48px 24px 32px', background: '#1a0f08', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 32, marginBottom: 40 }}>
            <div style={{ gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 20 }}>🐾</span>
                <span style={{ fontWeight: 700, color: '#f5e6d0' }}>宠物陪伴</span>
              </div>
              <p style={{ fontSize: 12, color: 'rgba(245,220,185,0.45)', lineHeight: 1.7 }}>
                四只宠物，四种陪伴方式，<br />寻找属于你的温暖陪伴
              </p>
            </div>
            {[
              { title: '产品', links: ['宠物介绍', '功能特色', '更新日志'] },
              { title: '关于我们', links: ['关于我们', '团队', '联系我们'] },
              { title: '支持', links: ['帮助中心', '反馈建议', '服务条款'] },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ fontSize: 12, fontWeight: 600, color: '#f5e6d0', marginBottom: 14 }}>{col.title}</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {col.links.map(link => (
                    <li key={link}>
                      <a href="#" style={{ fontSize: 12, color: 'rgba(245,220,185,0.45)', textDecoration: 'none' }}>{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20, textAlign: 'center', fontSize: 12, color: 'rgba(245,220,185,0.25)' }}>
            © 2024 宠物陪伴. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  )
}

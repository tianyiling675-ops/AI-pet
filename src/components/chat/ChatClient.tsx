'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { PetConfig, ChatMessage } from '@/types'
import { PETS, PET_IDS } from '@/lib/pets'

const PET_GREETING: Record<string, string> = {
  ping_an: '（蹭了蹭你的手）你回来了。',
  mo:      '……你来了。坐吧。',
  chi:     '哼，终于来了！本龙等了很久了。',
  hawk:    '……',
}

interface Props {
  pet: PetConfig
  initialMood: string
  initialMoodEmoji: string
  initialStatus: string
  initialMessages: ChatMessage[]
  initialMemories: string[]
  initialMoments: string[]
}

export default function ChatClient({
  pet, initialMood, initialMoodEmoji, initialStatus,
  initialMessages, initialMemories, initialMoments,
}: Props) {
  const router = useRouter()
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [mood, setMood] = useState(initialMood)
  const [moodEmoji, setMoodEmoji] = useState(initialMoodEmoji)
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const conversationRef = useRef<ChatMessage[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => { conversationRef.current = messages }, [messages])

  const saveMemory = useCallback(async () => {
    const conv = conversationRef.current
    if (conv.length < 2) return
    await fetch('/api/memory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ petId: pet.id, conversation: conv }),
    }).catch(() => {})
  }, [pet.id])

  useEffect(() => {
    const handle = () => { void saveMemory() }
    window.addEventListener('beforeunload', handle)
    return () => window.removeEventListener('beforeunload', handle)
  }, [saveMemory])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // 自动调整 textarea 高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 128)}px`
    }
  }, [input])

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return
    const userMsg: ChatMessage = { role: 'user', content: text, createdAt: new Date().toISOString() }
    setMessages((prev) => [...prev, userMsg])
    setLoading(true)
    setInput('')

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ petId: pet.id, message: text, history: messages.slice(-10) }),
      })
      const json = await res.json()
      if (json.error) {
        setMessages((prev) => [...prev, { role: 'assistant', content: '（走神了，再说一遍？）', createdAt: new Date().toISOString() }])
        return
      }
      const { reply, imageUrl, mood: newMood, mood_emoji: newEmoji } = json.data
      setMessages((prev) => [...prev, { role: 'assistant', content: reply, imageUrl, createdAt: new Date().toISOString() }])
      setMood(newMood)
      setMoodEmoji(newEmoji)
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: '（走神了，再说一遍？）', createdAt: new Date().toISOString() }])
    } finally {
      setLoading(false)
    }
  }

  function formatTime(iso?: string) {
    if (!iso) return ''
    return new Date(iso).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="relative h-screen overflow-hidden" style={{ fontFamily: 'Manrope, system-ui, sans-serif' }}>

      {/* 背景：模糊的宠物照片 */}
      <div className="absolute inset-0 -z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/pets/${pet.id}.jpg`} alt="" className="w-full h-full object-cover scale-110 blur-2xl" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(rgba(26,18,11,0.55), rgba(26,18,11,0.7))' }} />
      </div>

      {/* 主布局 */}
      <div className="flex h-full md:gap-4 md:p-4 lg:p-6 relative z-10">

        {/* ── 左侧宠物切换栏（桌面） ── */}
        <aside className="hidden md:flex flex-shrink-0 flex-col items-center py-8 rounded-2xl" style={{
          width: 80,
          background: 'rgba(70,55,45,0.25)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(242,190,140,0.2)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.37)',
        }}>
          {/* 品牌图标 */}
          <div className="mb-10" style={{ color: '#f0bd8b' }}>
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm15 0a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM12 10a3 3 0 100-6 3 3 0 000 6zm-7 9c0-3.31 2.69-6 6-6h2c3.31 0 6 2.69 6 6H5zm-1.5-3.5a2 2 0 100-4 2 2 0 000 4zm17 0a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          </div>

          {/* 宠物列表 */}
          <nav className="flex flex-col gap-8 flex-grow">
            {PET_IDS.map((petId) => {
              const isActive = petId === pet.id
              return (
                <Link key={petId} href={`/chat/${petId}`} className="relative group">
                  {isActive && (
                    <div className="absolute -left-[18px] top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full"
                      style={{ background: '#f0bd8b', boxShadow: '0 0 15px rgba(240,189,139,0.5)' }} />
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/pets/${petId}.jpg`}
                    alt={PETS[petId].name}
                    className={['object-cover rounded-xl transition-all duration-200',
                      isActive ? 'w-12 h-12 scale-110' : 'w-10 h-10 opacity-40 hover:opacity-100 hover:scale-105',
                    ].join(' ')}
                    style={isActive ? {
                      outline: '2px solid #f0bd8b',
                      outlineOffset: '2px',
                    } : { border: '1px solid rgba(242,190,140,0.15)' }}
                  />
                  {isActive && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full"
                      style={{ background: '#f0bd8b', border: '2px solid #1a120b' }} />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* 底部导航 */}
          <div className="mt-auto flex flex-col gap-5" style={{ color: '#9c8e82' }}>
            <button
              onClick={async () => { await saveMemory(); router.push('/') }}
              className="flex flex-col items-center gap-1 transition-colors hover:text-[#f0bd8b]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
              <span className="text-[9px] font-bold uppercase tracking-tight">回到选择</span>
            </button>
          </div>
        </aside>

        {/* ── 中间聊天区 ── */}
        <main className="flex-grow flex flex-col min-w-0 rounded-none md:rounded-3xl overflow-hidden md:my-2" style={{
          background: 'rgba(40,30,20,0.08)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(242,190,140,0.2)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
        }}>
          {/* 顶部栏（手机） */}
          <header className="md:hidden flex items-center gap-3 px-4 shrink-0" style={{
            height: 64,
            borderBottom: '1px solid rgba(242,190,140,0.15)',
            background: 'rgba(0,0,0,0.2)',
          }}>
            <button
              onClick={async () => { await saveMemory(); router.push('/') }}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: 'rgba(240,189,139,0.7)' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/pets/${pet.id}.jpg`} alt={pet.name}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              style={{ boxShadow: '0 0 0 2px rgba(240,189,139,0.4)' }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: '#f1dfd3' }}>{pet.name}</p>
              <p className="text-[10px] truncate" style={{ color: 'rgba(240,189,139,0.7)' }}>
                {mood} {moodEmoji}
              </p>
            </div>
          </header>

          {/* 顶部栏（桌面） */}
          <header className="hidden md:flex items-center px-10 shrink-0" style={{
            height: 96,
            borderBottom: '1px solid rgba(242,190,140,0.15)',
            background: 'rgba(0,0,0,0.1)',
          }}>
            <div>
              <h1 className="text-xl font-semibold tracking-tight" style={{ color: '#f1dfd3' }}>{pet.name}</h1>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] mt-0.5" style={{ color: '#f0bd8b' }}>
                {initialStatus} · {mood} {moodEmoji}
              </p>
            </div>
          </header>

          {/* 消息列表 */}
          <section className="flex-grow overflow-y-auto scrollbar-hide px-4 md:px-10 py-6 md:py-8 flex flex-col gap-6 md:gap-8">
            <div className="flex justify-center">
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: '#9c8e82' }}>TODAY</span>
            </div>

            {messages.length === 0 && (
              <div className="flex gap-4 max-w-[80%]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/pets/${pet.id}.jpg`} alt={pet.name}
                  className="w-9 h-9 rounded-full object-cover shrink-0 mt-1"
                  style={{ boxShadow: '0 0 0 1px rgba(240,189,139,0.2)' }}
                />
                <div className="flex flex-col gap-2">
                  <div className="p-4 rounded-2xl rounded-tl-none text-base leading-relaxed"
                    style={{
                      background: 'rgba(45,35,25,0.7)',
                      backdropFilter: 'blur(4px)',
                      border: '1px solid rgba(242,190,140,0.15)',
                      color: 'rgba(241,223,211,0.9)',
                    }}>
                    {PET_GREETING[pet.id] ?? `${pet.name}在这里。`}
                  </div>
                </div>
              </div>
            )}

            {messages.map((msg, i) =>
              msg.role === 'assistant' ? (
                <div key={i} className="flex gap-4 max-w-[80%]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/pets/${pet.id}.jpg`} alt={pet.name}
                    className="w-9 h-9 rounded-full object-cover shrink-0 mt-1"
                    style={{ boxShadow: '0 0 0 1px rgba(240,189,139,0.2)' }}
                  />
                  <div className="flex flex-col gap-2">
                    <div className="p-4 rounded-2xl rounded-tl-none text-base leading-relaxed"
                      style={{
                        background: 'rgba(45,35,25,0.7)',
                        backdropFilter: 'blur(4px)',
                        border: '1px solid rgba(242,190,140,0.15)',
                        color: 'rgba(241,223,211,0.9)',
                      }}>
                      {msg.content}
                    </div>
                    {msg.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={msg.imageUrl} alt="" className="rounded-xl max-w-xs mt-1" />
                    )}
                    <span className="text-[10px] ml-1 font-medium" style={{ color: '#9c8e82' }}>{formatTime(msg.createdAt)}</span>
                  </div>
                </div>
              ) : (
                <div key={i} className="flex flex-row-reverse gap-4 max-w-[80%] self-end">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-1"
                    style={{ background: 'rgba(242,190,140,0.1)', border: '1px solid rgba(242,190,140,0.2)' }}>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" style={{ color: '#f0bd8b' }}>
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                    </svg>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="p-4 rounded-2xl rounded-tr-none text-base leading-relaxed"
                      style={{
                        background: 'rgba(242,190,140,0.2)',
                        backdropFilter: 'blur(4px)',
                        border: '1px solid rgba(242,190,140,0.3)',
                        color: '#f1dfd3',
                      }}>
                      {msg.content}
                    </div>
                    <span className="text-[10px] mr-1 font-medium" style={{ color: '#9c8e82' }}>{formatTime(msg.createdAt)}</span>
                  </div>
                </div>
              )
            )}

            {/* 输入指示器 */}
            {loading && (
              <div className="flex gap-4 items-center opacity-60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/pets/${pet.id}.jpg`} alt={pet.name}
                  className="w-9 h-9 rounded-full object-cover shrink-0"
                  style={{ boxShadow: '0 0 0 1px rgba(240,189,139,0.1)' }}
                />
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5 px-4 py-2.5 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(242,190,140,0.2)' }}>
                    <div className="w-1 h-1 rounded-full animate-bounce [animation-delay:-0.3s]" style={{ background: 'rgba(240,189,139,0.5)' }} />
                    <div className="w-1 h-1 rounded-full animate-bounce [animation-delay:-0.15s]" style={{ background: 'rgba(240,189,139,0.5)' }} />
                    <div className="w-1 h-1 rounded-full animate-bounce" style={{ background: 'rgba(240,189,139,0.5)' }} />
                  </div>
                  <span className="text-xs font-medium" style={{ color: '#9c8e82' }}>{pet.name}正在输入...</span>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </section>

          {/* 输入框 */}
          <footer className="px-4 md:px-8 pb-4 md:pb-8 pt-3 md:pt-4 shrink-0" style={{ background: 'rgba(0,0,0,0.05)' }}>
            <div className="flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-300" style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(242,190,140,0.2)',
            }}>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void sendMessage(input) }
                }}
                placeholder={`慢慢说，${pet.name}在听。`}
                rows={1}
                disabled={loading}
                className="flex-grow bg-transparent border-none focus:ring-0 resize-none py-2.5 text-base outline-none"
                style={{ color: '#f1dfd3', caretColor: '#f0bd8b', maxHeight: 128 }}
              />
              <button
                onClick={() => void sendMessage(input)}
                disabled={!input.trim() || loading}
                className="p-2.5 rounded-xl flex items-center justify-center shrink-0 transition-all disabled:opacity-40"
                style={{ background: 'rgba(242,190,140,0.2)', border: '1px solid rgba(242,190,140,0.3)', color: '#f0bd8b' }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </footer>
        </main>

        {/* ── 右侧宠物存在感面板（桌面） ── */}
        <aside className="hidden lg:flex flex-shrink-0 flex-col overflow-hidden" style={{
          width: 380,
          borderRadius: '2.5rem',
          background: 'rgba(183,172,143,0.15)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(242,190,140,0.1)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        }}>
          <div className="flex-grow overflow-y-auto scrollbar-hide p-8 flex flex-col gap-10">

            {/* 宠物卡片 */}
            <div className="overflow-hidden group rounded-[2rem]" style={{ border: '1px solid rgba(242,190,140,0.15)' }}>
              <div className="relative aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/pets/${pet.id}.jpg`} alt={pet.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,18,11,0.6) 0%, transparent 60%)' }} />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(241,223,211,0.7)' }}>{initialStatus}</p>
                </div>
              </div>
            </div>

            {/* 它记得 */}
            {initialMemories.length > 0 && (
              <div className="flex flex-col gap-4">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: '#9c8e82' }}>它记得</h3>
                <div className="flex flex-col gap-4">
                  {initialMemories.map((mem, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: 'rgba(240,189,139,0.4)' }} />
                      <p className="text-sm leading-relaxed font-medium" style={{ color: '#9c8e82' }}>{mem}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 我们的片刻 */}
            {initialMoments.length > 0 && (
              <div className="flex flex-col gap-4">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: '#9c8e82' }}>我们的片刻</h3>
                <div className="flex gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="aspect-square flex-1 rounded-lg overflow-hidden transition-all duration-500 hover:scale-[1.03] cursor-pointer"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(242,190,140,0.15)' }}>
                      {initialMoments[i] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={initialMoments[i]} alt="" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </aside>

      </div>
    </div>
  )
}

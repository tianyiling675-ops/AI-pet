'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { PetConfig, ChatMessage } from '@/types'
import MessageBubble from './MessageBubble'
import ChatInput from './ChatInput'

interface Props {
  pet: PetConfig
  initialMood: string
  initialMoodEmoji: string
}

export default function ChatClient({ pet, initialMood, initialMoodEmoji }: Props) {
  const router = useRouter()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [mood, setMood] = useState(initialMood)
  const [moodEmoji, setMoodEmoji] = useState(initialMoodEmoji)
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const conversationRef = useRef<ChatMessage[]>([])

  useEffect(() => {
    conversationRef.current = messages
  }, [messages])

  const saveMemory = useCallback(async () => {
    const conv = conversationRef.current
    if (conv.length < 2) return
    await fetch('/api/memory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ petId: pet.id, conversation: conv }),
    }).catch(() => {})
  }, [pet.id])

  // 页面卸载时保存记忆
  useEffect(() => {
    const handle = () => { void saveMemory() }
    window.addEventListener('beforeunload', handle)
    return () => window.removeEventListener('beforeunload', handle)
  }, [saveMemory])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return

    const userMsg: ChatMessage = { role: 'user', content: text }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          petId: pet.id,
          message: text,
          history: messages.slice(-10),
        }),
      })
      const json = await res.json()

      if (json.error) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: '（走神了，再说一遍？）' },
        ])
        return
      }

      const { reply, imageUrl, mood: newMood, mood_emoji: newEmoji } = json.data
      setMessages((prev) => [...prev, { role: 'assistant', content: reply, imageUrl }])
      setMood(newMood)
      setMoodEmoji(newEmoji)
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '（走神了，再说一遍？）' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-[#f5f5f0]">
      {/* 头部 */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100">
        <button
          onClick={async () => { await saveMemory(); router.push('/') }}
          className="text-gray-400 p-1 -ml-1"
          aria-label="返回"
        >
          ←
        </button>
        <span className="text-xl">{pet.emoji}</span>
        <div className="flex-1">
          <p className="font-medium text-gray-800 text-sm">{pet.name}</p>
          <p className="text-xs text-gray-400">{pet.species}</p>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-base">{moodEmoji}</span>
          <span className="text-xs text-gray-400">{mood}</span>
        </div>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto py-4 px-4 space-y-3 scrollbar-hide">
        {messages.length === 0 && (
          <p className="text-center text-xs text-gray-300 mt-16">
            {pet.name}在这里
          </p>
        )}
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} petEmoji={pet.emoji} />
        ))}
        {loading && (
          <div className="flex items-end gap-2">
            <span className="text-xl">{pet.emoji}</span>
            <div className="bubble-pet flex gap-1 py-3">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* 输入框 */}
      <ChatInput onSend={sendMessage} disabled={loading} />
    </div>
  )
}

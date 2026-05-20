import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase'
import { classify, chat, scoreAffinity, generateImageScene } from '@/lib/deepseek'
import { generateImage } from '@/lib/seedream'
import { uploadBase64ToR2 } from '@/lib/r2'
import { buildSystemPrompt, CRISIS_RESPONSE } from '@/lib/prompts'
import type { ChatApiRequest, ChatApiResponse, Memory, PetId } from '@/types'

const MOOD_MAP: Record<string, { mood: string; mood_emoji: string }> = {
  ping_an: { mood: '慵懒', mood_emoji: '😺' },
  mo:      { mood: '若有所思', mood_emoji: '🐾' },
  chi:     { mood: '跃跃欲试', mood_emoji: '🔥' },
  hawk:    { mood: '若即若离', mood_emoji: '🦅' },
}

const MOOD_HIGH: Record<string, { mood: string; mood_emoji: string }> = {
  ping_an: { mood: '亲近', mood_emoji: '🧡' },
  mo:      { mood: '平静', mood_emoji: '🌿' },
  chi:     { mood: '得意', mood_emoji: '✨' },
  hawk:    { mood: '注视', mood_emoji: '👁️' },
}

function pickMood(petId: string, affinity: number) {
  if (affinity >= 70) return MOOD_HIGH[petId] || MOOD_MAP[petId]
  return MOOD_MAP[petId]
}

export async function POST(req: NextRequest) {
  try {
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session?.user?.id) {
    return NextResponse.json({ data: null, error: '未登录' }, { status: 401 })
  }

  const { petId, message, history } = (await req.json()) as ChatApiRequest
  const userId = session.user.id
  const supabase = createServiceClient()

  // 检查订阅状态与每日消息限制
  const today = new Date().toISOString().slice(0, 10)
  const [{ data: subData }, { data: msgData }] = await Promise.all([
    supabase.from('subscriptions').select('status').eq('user_id', userId).single(),
    supabase.from('daily_messages').select('count').eq('user_id', userId).eq('date', today).single(),
  ])
  const isPremium = subData?.status === 'active'
  const msgCount = msgData?.count ?? 0
  if (!isPremium && msgCount >= 10) {
    return NextResponse.json({ data: null, error: 'LIMIT_REACHED' }, { status: 403 })
  }
  // 消息数 +1（upsert）
  await supabase.from('daily_messages').upsert(
    { user_id: userId, date: today, count: msgCount + 1 },
    { onConflict: 'user_id,date' }
  )

  // 加载宠物状态和记忆
  const [{ data: stateRows }, { data: kvRows }, { data: diaryRows }] = await Promise.all([
    supabase
      .from('pet_states')
      .select('affinity,mood,mood_emoji')
      .eq('user_id', userId)
      .eq('pet_id', petId)
      .single(),
    supabase.from('memories_kv').select('key,value').eq('user_id', userId).eq('pet_id', petId),
    supabase
      .from('memories_diary')
      .select('content,created_at')
      .eq('user_id', userId)
      .eq('pet_id', petId)
      .order('created_at', { ascending: false })
      .limit(8),
  ])

  const affinity: number = stateRows?.affinity ?? 50
  const memory: Memory = {
    kv: kvRows || [],
    diary: diaryRows || [],
  }

  // 用户消息立刻存入 DB，不等 AI 结果（防止模型失败时丢失记录）
  void Promise.resolve(
    supabase.from('chat_messages').insert({ user_id: userId, pet_id: petId, role: 'user', content: message })
  ).catch(() => {})

  // 步骤1：分类
  const { is_crisis, should_generate_image } = await classify(message)

  // 步骤2：危机处理
  if (is_crisis) {
    const response: ChatApiResponse = {
      reply: CRISIS_RESPONSE,
      affinityDelta: 0,
      ...pickMood(petId, affinity),
    }
    return NextResponse.json({ data: response, error: null })
  }

  // 步骤3：生成回复
  const systemPrompt = buildSystemPrompt(petId as PetId, affinity, memory)
  const reply = await chat(systemPrompt, history, message)

  // 步骤4：好感度打分（并行图像生成）
  const scorePromise = scoreAffinity(reply, message)

  let imageUrl: string | undefined  // 返回给前端显示
  let imageR2Url: string | undefined  // 存入 DB（仅 R2 URL，不存 base64）
  if (should_generate_image) {
    const scene = await generateImageScene(petId, [...history, { role: 'user', content: message }])
    const base64 = await generateImage(petId as PetId, scene)
    if (base64) {
      const r2Url = await uploadBase64ToR2(base64, petId)
      imageR2Url = r2Url ?? undefined
      imageUrl = r2Url ?? base64  // R2 优先，失败则临时用 base64 展示
    }
  }

  const delta = await scorePromise
  const newAffinity = Math.max(0, Math.min(100, affinity + delta))
  const moodState = pickMood(petId, newAffinity)

  // 更新好感度
  await supabase
    .from('pet_states')
    .update({ affinity: newAffinity, ...moodState, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('pet_id', petId)

  // 保存图片到 DB（只存 R2 URL，不存 base64）
  if (imageR2Url) {
    void Promise.resolve(
      supabase.from('pet_moments').insert({ user_id: userId, pet_id: petId, image_url: imageR2Url })
    ).catch(() => {})
  }

  // AI 回复存入 DB
  void Promise.resolve(
    supabase.from('chat_messages').insert({ user_id: userId, pet_id: petId, role: 'assistant', content: reply })
  ).catch(() => {})

  const response: ChatApiResponse = {
    reply,
    imageUrl,
    affinityDelta: delta,
    ...moodState,
  }

  return NextResponse.json({ data: response, error: null })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[api/chat] 未捕获异常:', msg)
    return NextResponse.json({ data: null, error: msg }, { status: 500 })
  }
}
